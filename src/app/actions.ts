"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { buildDefaultTasks, dueDateFromVisit, externalUrlForTask } from "@/lib/checklist";
import { CURRENT_SEASON } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { getRecommendations } from "@/lib/recommendation";
import { createToken, hashToken } from "@/lib/tokens";
import { parseTripInput } from "@/lib/trip-input";
import type { TripInput } from "@/lib/types";

async function findEditableTrip(formData: FormData) {
  const editToken = String(formData.get("editToken") ?? "");
  const tripId = String(formData.get("tripId") ?? "");

  if (editToken) {
    return prisma.trip.findUnique({
      where: { editTokenHash: hashToken(editToken) },
      select: { id: true, status: true, userId: true }
    });
  }

  if (tripId) {
    const session = await auth();
    if (!session?.user?.id) return null;
    return prisma.trip.findFirst({
      where: { id: tripId, userId: session.user.id },
      select: { id: true, status: true, userId: true }
    });
  }

  return null;
}

function revalidateTripAccess(formData: FormData) {
  const editToken = String(formData.get("editToken") ?? "");
  const tripId = String(formData.get("tripId") ?? "");
  if (editToken) revalidatePath(`/trips/${editToken}`);
  if (tripId) revalidatePath(`/my-trips/${tripId}`);
}

export async function createTripAction(formData: FormData) {
  const session = await auth();
  const input = parseTripInput(formData);
  const resortId = String(formData.get("resortId") ?? "");
  const selectedRentalOptionValue = String(formData.get("selectedRentalOptionId") ?? "");
  const selectedRentalOptionId = selectedRentalOptionValue && selectedRentalOptionValue !== "skip" ? selectedRentalOptionValue : undefined;
  const recommendation = getRecommendations(input).find((item) => item.resort.id === resortId);

  if (!recommendation) {
    throw new Error("선택한 스키장 추천 결과를 찾을 수 없습니다.");
  }

  const editToken = createToken();
  const shareToken = createToken();
  const visitDate = new Date(`${input.visitDate}T00:00:00`);
  const expiresAt = new Date(visitDate);
  expiresAt.setMonth(4, 30);
  expiresAt.setFullYear(visitDate.getFullYear() + (visitDate.getMonth() >= 4 ? 1 : 0));

  const trip = await prisma.trip.create({
    data: {
      userId: session?.user?.id,
      editTokenHash: hashToken(editToken),
      shareTokenHash: hashToken(shareToken),
      resortId,
      resortNameSnapshot: recommendation.resort.name,
      selectedRecommendation: {
        score: recommendation.score,
        reasons: recommendation.reasons,
        travelMinutes: recommendation.travelMinutes,
        travelKm: recommendation.travelKm,
        cost: recommendation.cost
      },
      season: CURRENT_SEASON,
      visitDate,
      departureLocation: input.departureLocation,
      peopleCount: input.peopleCount,
      skillLevel: input.skillLevel,
      rideType: input.rideType,
      transportType: input.transportType,
      tripDuration: input.tripDuration,
      ownsEquipment: input.ownsEquipment,
      ownsClothing: input.ownsClothing,
      needRental: !input.ownsEquipment,
      needClothing: !input.ownsClothing,
      budgetMin: input.budgetMin,
      budgetMax: input.budgetMax,
      lodgingCostInput: input.lodgingCostInput,
      liftTicketTimeSlot: input.liftTicketTimeSlot,
      selectedRentalOptionId,
      expiresAt,
      tasks: {
        create: buildDefaultTasks(input).map((task) => ({
          category: task.category,
          title: task.title,
          status: task.status,
          isDefault: true,
          sortOrder: task.sortOrder,
          externalUrl: externalUrlForTask({
            resortId,
            selectedRentalOptionId,
            category: task.category,
            title: task.title
          }),
          dueDate: dueDateFromVisit(input.visitDate, task.dueOffsetDays)
        }))
      },
      events: {
        create: {
          eventName: "trip_created",
          properties: {
            resortId,
            peopleCount: input.peopleCount,
            transportType: input.transportType
          }
        }
      }
    }
  });

  redirect(`/trips/${editToken}?created=${trip.id}&share=${shareToken}`);
}

export async function updateTripDetailsAction(formData: FormData) {
  const accessTrip = await findEditableTrip(formData);
  if (!accessTrip || accessTrip.status === "archived" || accessTrip.status === "deleted") {
    throw new Error("수정할 수 없는 트립입니다.");
  }

  const current = await prisma.trip.findUnique({ where: { id: accessTrip.id } });
  if (!current) throw new Error("트립을 찾을 수 없습니다.");

  const input: TripInput = {
    visitDate: String(formData.get("visitDate") ?? current.visitDate.toISOString().slice(0, 10)),
    departureLocation: current.departureLocation,
    peopleCount: Number(formData.get("peopleCount") ?? current.peopleCount),
    tripDuration: current.tripDuration,
    skillLevel: current.skillLevel,
    rideType: current.rideType,
    ownsEquipment: current.ownsEquipment,
    ownsClothing: current.ownsClothing,
    transportType: String(formData.get("transportType") ?? current.transportType) as TripInput["transportType"],
    budgetMin: current.budgetMin ?? undefined,
    budgetMax: current.budgetMax ?? undefined,
    priorities: ["beginner", "close", "rental"],
    liftTicketTimeSlot: String(formData.get("liftTicketTimeSlot") ?? current.liftTicketTimeSlot) as TripInput["liftTicketTimeSlot"],
    lodgingCostInput: Number(formData.get("lodgingCostInput") ?? current.lodgingCostInput ?? 0) || undefined
  };
  const selectedRentalOptionValue = String(formData.get("selectedRentalOptionId") ?? "");
  const selectedRentalOptionId =
    selectedRentalOptionValue && selectedRentalOptionValue !== "skip"
      ? selectedRentalOptionValue
      : undefined;
  const recommendation = getRecommendations(input).find((item) => item.resort.id === current.resortId);
  if (!recommendation) throw new Error("선택한 스키장의 추천/가격을 다시 계산할 수 없습니다.");
  const visitDate = new Date(`${input.visitDate}T00:00:00`);

  await prisma.trip.update({
    where: { id: current.id },
    data: {
      selectedRecommendation: {
        score: recommendation.score,
        reasons: recommendation.reasons,
        travelMinutes: recommendation.travelMinutes,
        travelKm: recommendation.travelKm,
        cost: recommendation.cost
      },
      visitDate,
      peopleCount: input.peopleCount,
      transportType: input.transportType,
      lodgingCostInput: input.lodgingCostInput,
      liftTicketTimeSlot: input.liftTicketTimeSlot,
      selectedRentalOptionId,
      events: {
        create: {
          eventName: "trip_details_updated",
          properties: {
            peopleCount: input.peopleCount,
            transportType: input.transportType,
            liftTicketTimeSlot: input.liftTicketTimeSlot
          }
        }
      }
    }
  });

  const defaultTasks = buildDefaultTasks(input);
  for (const task of defaultTasks) {
    await prisma.tripTask.updateMany({
      where: { tripId: current.id, category: task.category, title: task.title, isDefault: true },
      data: {
        externalUrl: externalUrlForTask({
          resortId: current.resortId,
          selectedRentalOptionId,
          category: task.category,
          title: task.title
        }),
        dueDate: dueDateFromVisit(input.visitDate, task.dueOffsetDays)
      }
    });
  }

  revalidateTripAccess(formData);
}

export async function updateTripStatusAction(formData: FormData) {
  const status = String(formData.get("status") ?? "");
  const trip = await findEditableTrip(formData);
  if (!trip || trip.status === "archived" || trip.status === "deleted") {
    throw new Error("수정할 수 없는 트립입니다.");
  }
  await prisma.trip.update({
    where: { id: trip.id },
    data: {
      status: status as never,
      events: { create: { eventName: "trip_status_changed", properties: { status } } }
    }
  });
  revalidateTripAccess(formData);
}

export async function attachTripToAccountAction(formData: FormData) {
  const session = await auth();
  const editToken = String(formData.get("editToken") ?? "");

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/trips/${editToken}`);
  }

  const trip = await prisma.trip.findUnique({
    where: { editTokenHash: hashToken(editToken) },
    select: { id: true, userId: true, status: true }
  });

  if (!trip || trip.status === "archived" || trip.status === "deleted") {
    throw new Error("계정에 저장할 수 없는 트립입니다.");
  }

  if (trip.userId && trip.userId !== session.user.id) {
    throw new Error("이미 다른 계정에 저장된 트립입니다.");
  }

  if (!trip.userId) {
    await prisma.trip.update({
      where: { id: trip.id },
      data: {
        userId: session.user.id,
        events: {
          create: {
            eventName: "trip_attached_to_account"
          }
        }
      }
    });
  }

  revalidatePath(`/trips/${editToken}`);
  revalidatePath("/my-trips");
}

export async function updateTaskStatusAction(formData: FormData) {
  const editToken = String(formData.get("editToken") ?? "");
  const taskId = String(formData.get("taskId") ?? "");
  const status = String(formData.get("status") ?? "");

  const trip = await findEditableTrip(formData);

  if (!trip || trip.status === "archived" || trip.status === "deleted") {
    throw new Error("수정할 수 없는 트립입니다.");
  }

  await prisma.tripTask.updateMany({
    where: { id: taskId, tripId: trip.id },
    data: { status: status as never }
  });
  await prisma.analyticsEvent.create({
    data: { tripId: trip.id, eventName: "task_status_changed", properties: { taskId, status } }
  });

  revalidateTripAccess(formData);
}

export async function updateTaskMemoAction(formData: FormData) {
  const editToken = String(formData.get("editToken") ?? "");
  const taskId = String(formData.get("taskId") ?? "");
  const memo = String(formData.get("memo") ?? "");

  const trip = await findEditableTrip(formData);
  if (!trip || trip.status === "archived" || trip.status === "deleted") {
    throw new Error("수정할 수 없는 트립입니다.");
  }
  await prisma.tripTask.updateMany({ where: { id: taskId, tripId: trip.id }, data: { memo } });
  revalidateTripAccess(formData);
}

export async function addTaskAction(formData: FormData) {
  const editToken = String(formData.get("editToken") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const accessTrip = await findEditableTrip(formData);
  const trip = accessTrip
    ? await prisma.trip.findUnique({
        where: { id: accessTrip.id },
        include: { tasks: { orderBy: { sortOrder: "desc" }, take: 1 } }
      })
    : null;
  if (!trip || trip.status === "archived" || trip.status === "deleted") {
    throw new Error("수정할 수 없는 트립입니다.");
  }

  await prisma.tripTask.create({
    data: {
      tripId: trip.id,
      title,
      category: "custom",
      isDefault: false,
      status: "needs_check",
      sortOrder: (trip.tasks[0]?.sortOrder ?? 999) + 10
    }
  });
  revalidateTripAccess(formData);
}

export async function deleteTaskAction(formData: FormData) {
  const editToken = String(formData.get("editToken") ?? "");
  const taskId = String(formData.get("taskId") ?? "");
  const trip = await findEditableTrip(formData);
  if (!trip || trip.status === "archived" || trip.status === "deleted") {
    throw new Error("수정할 수 없는 트립입니다.");
  }
  await prisma.tripTask.deleteMany({ where: { id: taskId, tripId: trip.id, isDefault: false } });
  revalidateTripAccess(formData);
}

export async function deleteTripAction(formData: FormData) {
  const editToken = String(formData.get("editToken") ?? "");
  const trip = editToken
    ? await prisma.trip.findUnique({ where: { editTokenHash: hashToken(editToken) } })
    : await findEditableTrip(formData);
  if (!trip) throw new Error("트립을 찾을 수 없습니다.");
  await prisma.analyticsEvent.create({ data: { tripId: trip.id, eventName: "trip_deleted" } });
  await prisma.trip.delete({ where: { id: trip.id } });
  redirect(editToken ? "/" : "/my-trips");
}

export async function regenerateShareLinkAction(formData: FormData) {
  const editToken = String(formData.get("editToken") ?? "");
  const trip = await findEditableTrip(formData);
  if (!trip || trip.status === "archived" || trip.status === "deleted") {
    throw new Error("공유 링크를 재발급할 수 없는 트립입니다.");
  }

  const shareToken = createToken();
  await prisma.trip.update({
    where: { id: trip.id },
    data: {
      shareTokenHash: hashToken(shareToken),
      events: {
        create: {
          eventName: "share_link_regenerated"
        }
      }
    }
  });

  const tripId = String(formData.get("tripId") ?? "");
  redirect(editToken ? `/trips/${editToken}?share=${shareToken}` : `/my-trips/${tripId}?share=${shareToken}`);
}

export async function recordExternalLinkClickAction(formData: FormData) {
  const tripId = String(formData.get("tripId") ?? "") || undefined;
  const eventName = String(formData.get("eventName") ?? "external_link_click");
  const href = String(formData.get("href") ?? "");
  const type = String(formData.get("type") ?? "");
  const resortId = String(formData.get("resortId") ?? "");
  const sourceName = String(formData.get("sourceName") ?? "");

  await prisma.analyticsEvent.create({
    data: {
      tripId,
      eventName,
      properties: {
        href,
        type,
        resortId,
        sourceName
      }
    }
  });
}
