"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { buildDefaultTasks, dueDateFromVisit } from "@/lib/checklist";
import { CURRENT_SEASON } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { getRecommendations } from "@/lib/recommendation";
import { createToken, hashToken } from "@/lib/tokens";
import { parseTripInput } from "@/lib/trip-input";

export async function createTripAction(formData: FormData) {
  const input = parseTripInput(formData);
  const resortId = String(formData.get("resortId") ?? "");
  const selectedRentalOptionId = String(formData.get("selectedRentalOptionId") ?? "") || undefined;
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

export async function updateTaskStatusAction(formData: FormData) {
  const editToken = String(formData.get("editToken") ?? "");
  const taskId = String(formData.get("taskId") ?? "");
  const status = String(formData.get("status") ?? "");

  const trip = await prisma.trip.findUnique({
    where: { editTokenHash: hashToken(editToken) },
    select: { id: true, status: true }
  });

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

  revalidatePath(`/trips/${editToken}`);
}

export async function updateTaskMemoAction(formData: FormData) {
  const editToken = String(formData.get("editToken") ?? "");
  const taskId = String(formData.get("taskId") ?? "");
  const memo = String(formData.get("memo") ?? "");

  const trip = await prisma.trip.findUnique({
    where: { editTokenHash: hashToken(editToken) },
    select: { id: true, status: true }
  });
  if (!trip || trip.status === "archived" || trip.status === "deleted") {
    throw new Error("수정할 수 없는 트립입니다.");
  }
  await prisma.tripTask.updateMany({ where: { id: taskId, tripId: trip.id }, data: { memo } });
  revalidatePath(`/trips/${editToken}`);
}

export async function addTaskAction(formData: FormData) {
  const editToken = String(formData.get("editToken") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const trip = await prisma.trip.findUnique({
    where: { editTokenHash: hashToken(editToken) },
    include: { tasks: { orderBy: { sortOrder: "desc" }, take: 1 } }
  });
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
  revalidatePath(`/trips/${editToken}`);
}

export async function deleteTaskAction(formData: FormData) {
  const editToken = String(formData.get("editToken") ?? "");
  const taskId = String(formData.get("taskId") ?? "");
  const trip = await prisma.trip.findUnique({
    where: { editTokenHash: hashToken(editToken) },
    select: { id: true, status: true }
  });
  if (!trip || trip.status === "archived" || trip.status === "deleted") {
    throw new Error("수정할 수 없는 트립입니다.");
  }
  await prisma.tripTask.deleteMany({ where: { id: taskId, tripId: trip.id, isDefault: false } });
  revalidatePath(`/trips/${editToken}`);
}

export async function deleteTripAction(formData: FormData) {
  const editToken = String(formData.get("editToken") ?? "");
  const trip = await prisma.trip.findUnique({ where: { editTokenHash: hashToken(editToken) } });
  if (!trip) throw new Error("트립을 찾을 수 없습니다.");
  await prisma.analyticsEvent.create({ data: { tripId: trip.id, eventName: "trip_deleted" } });
  await prisma.trip.delete({ where: { id: trip.id } });
  redirect("/");
}

export async function regenerateShareLinkAction(formData: FormData) {
  const editToken = String(formData.get("editToken") ?? "");
  const trip = await prisma.trip.findUnique({
    where: { editTokenHash: hashToken(editToken) },
    select: { id: true, status: true }
  });
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

  redirect(`/trips/${editToken}?share=${shareToken}`);
}
