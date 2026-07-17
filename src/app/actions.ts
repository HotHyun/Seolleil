"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { buildDefaultTasks, externalUrlForTask } from "@/lib/checklist";
import { CURRENT_SEASON } from "@/lib/constants";
import { departureLocations, getRentalShopsForResort, getResort } from "@/data/resorts";
import { getSkiShuttleRoutes } from "@/data/ski-shuttles-25-26";
import { estimateTripCost, getRentalOptionsForResort } from "@/lib/pricing";
import { buildRequiredTasks, getRecommendations } from "@/lib/recommendation";
import { createToken, hashToken } from "@/lib/tokens";
import { canEditOwnedTrip, canMutateWithSharePermission } from "@/lib/trip-access";
import { parseTripInput } from "@/lib/trip-input";
import {
  createTask,
  createTrip,
  createTripShareLink,
  deleteTask,
  deleteTrip,
  getTripByEditTokenHash,
  getTripById,
  getTripDisplayName,
  getShareLinkByTokenHash,
  revokeTripShareLink,
  recordAnalyticsEvent,
  updateDefaultTasksForTrip,
  updateTask,
  updateTrip
} from "@/lib/trip-store";
import { getSession } from "@/lib/session";
import { getSessionSecret } from "@/lib/session";
import { createTripTeam, getTripTeamPermission, inviteTripMember, removeTripMembership, updateTripMembership } from "@/lib/trip-collaboration";
import { actionFailure, actionSuccess, AppError } from "@/lib/app-error";
import type { TripInput } from "@/lib/types";
import { parseTripBudget, type TripExpenseCategory } from "@/lib/trip-budget";

const expenseCategories = new Set<TripExpenseCategory>(["meal", "fuel", "toll", "parking", "transport", "lodging", "other"]);

async function findEditableTrip(formData: FormData) {
  const editToken = String(formData.get("editToken") ?? "");
  const shareToken = String(formData.get("shareToken") ?? "");
  const tripId = String(formData.get("tripId") ?? "");

  if (editToken) {
    return getTripByEditTokenHash(hashToken(editToken));
  }

  if (shareToken) {
    const link = await getShareLinkByTokenHash(hashToken(shareToken));
    return link && canMutateWithSharePermission(link.permission) ? getTripById(link.tripId) : null;
  }

  if (tripId) {
    const session = await getSession();
    if (!session?.user?.id) return null;
    const trip = await getTripById(tripId);
    if (!trip) return null;
    if (canEditOwnedTrip(session.user.id, trip.userId)) return trip;
    const secret = await getSessionSecret();
    if (secret && trip.teamId && await getTripTeamPermission(secret, trip.teamId, session.user.id) === "edit") return trip;
    return null;
  }

  return null;
}

function revalidateTripAccess(formData: FormData) {
  const editToken = String(formData.get("editToken") ?? "");
  const tripId = String(formData.get("tripId") ?? "");
  const shareToken = String(formData.get("shareToken") ?? "");
  if (editToken) revalidatePath(`/trips/${editToken}`);
  if (tripId) revalidatePath(`/my-trips/${tripId}`);
  if (shareToken) revalidatePath(`/share/${shareToken}`);
}

function redirectToTripWithNotice(formData: FormData, notice: string) {
  const editToken = String(formData.get("editToken") ?? "");
  const tripId = String(formData.get("tripId") ?? "");
  const shareToken = String(formData.get("shareToken") ?? "");
  const path = editToken ? `/trips/${editToken}` : shareToken ? `/share/${shareToken}` : `/my-trips/${tripId}`;
  revalidateTripAccess(formData);
  redirect(`${path}?notice=${encodeURIComponent(notice)}`);
}

function finishTripMutation(formData: FormData, notice: string) {
  if (String(formData.get("background") ?? "") === "1") return { ok: true as const, message: notice };
  redirectToTripWithNotice(formData, notice);
}

export async function createTripAction(formData: FormData) {
  const session = await getSession();
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

  const trip = await createTrip({
      userId: session?.user?.id ?? null,
      teamId: null,
      tripName: `${recommendation.resort.name} 트립`,
      tripMemo: null,
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
      budgetMin: input.budgetMin ?? null,
      budgetMax: input.budgetMax ?? null,
      lodgingCostInput: input.lodgingCostInput ?? null,
      lodgingName: null,
      lodgingUrl: null,
      splitCount: input.peopleCount,
      budgetData: { overrides: input.lodgingCostInput ? { lodging: input.lodgingCostInput } : {}, extras: [] },
      liftTicketTimeSlot: input.liftTicketTimeSlot,
      selectedRentalOptionId: selectedRentalOptionId ?? null,
      selectedRentalShopId: selectedRentalOptionId
        ? getRentalShopsForResort(resortId).find((shop) =>
            recommendation.rentalShops.some((candidate) => candidate.id === shop.id)
          )?.id ?? null
        : null,
      status: "planning",
      archivedAt: null,
      expiresAt,
      tasks: buildDefaultTasks(input).map((task) => ({
          category: task.category,
          title: task.title,
          status: task.status,
          memo: null,
          isDefault: true,
          sortOrder: task.sortOrder,
          externalUrl: externalUrlForTask({
            resortId,
            selectedRentalOptionId,
            category: task.category,
            title: task.title
          }) ?? null,
          dueDate: null
        }))
  });
  await recordAnalyticsEvent({
    tripId: trip.id,
    eventName: "trip_created",
    properties: {
      resortId,
      peopleCount: input.peopleCount,
      transportType: input.transportType
    }
  });

  redirect(`/trips/${editToken}?created=${trip.id}&notice=${encodeURIComponent("비공개 트립을 만들었어요.")}`);
}

export async function createDirectTripAction(formData: FormData) {
  const session = await getSession();
  const input = parseTripInput(formData);
  const resortId = String(formData.get("resortId") ?? "");
  const resort = getResort(resortId);

  if (!resort) {
    throw new Error("선택한 스키장을 찾을 수 없습니다.");
  }

  const departure = departureLocations.find((location) => location.id === input.departureLocation);
  const distance = departure?.distances[resort.id];
  const cost = estimateTripCost(resort, input);
  const editToken = createToken();
  const shareToken = createToken();
  const visitDate = new Date(`${input.visitDate}T00:00:00`);
  const expiresAt = new Date(visitDate);
  expiresAt.setMonth(4, 30);
  expiresAt.setFullYear(visitDate.getFullYear() + (visitDate.getMonth() >= 4 ? 1 : 0));

  const trip = await createTrip({
      userId: session?.user?.id ?? null,
      teamId: null,
      tripName: `${resort.name} 트립`,
      tripMemo: null,
      editTokenHash: hashToken(editToken),
      shareTokenHash: hashToken(shareToken),
      resortId,
      resortNameSnapshot: resort.name,
      selectedRecommendation: {
        score: 0,
        reasons: [
          "사용자가 직접 선택한 스키장입니다.",
          distance ? `${departure?.label ?? "출발지"} 기준 약 ${distance.minutes}분 이동입니다.` : "출발지 기준 이동 정보는 공식 지도에서 확인하세요.",
          `${resort.tags.slice(0, 2).join(", ")} 조건을 가진 스키장입니다.`
        ],
        travelMinutes: distance?.minutes,
        travelKm: distance?.km,
        cost
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
      budgetMin: input.budgetMin ?? null,
      budgetMax: input.budgetMax ?? null,
      lodgingCostInput: input.lodgingCostInput ?? null,
      lodgingName: null,
      lodgingUrl: null,
      splitCount: input.peopleCount,
      budgetData: { overrides: input.lodgingCostInput ? { lodging: input.lodgingCostInput } : {}, extras: [] },
      liftTicketTimeSlot: input.liftTicketTimeSlot,
      selectedRentalOptionId: null,
      selectedRentalShopId: null,
      status: "planning",
      archivedAt: null,
      expiresAt,
      tasks: buildDefaultTasks(input).map((task) => ({
          category: task.category,
          title: task.title,
          status: task.status,
          memo: null,
          isDefault: true,
          sortOrder: task.sortOrder,
          externalUrl: externalUrlForTask({
            resortId,
            category: task.category,
            title: task.title
          }) ?? null,
          dueDate: null
        }))
  });
  await recordAnalyticsEvent({
    tripId: trip.id,
    eventName: "trip_created_from_resort",
    properties: {
      resortId,
      peopleCount: input.peopleCount,
      transportType: input.transportType,
      requiredTasks: buildRequiredTasks(input),
      rentalShopCount: getRentalShopsForResort(resortId).length
    }
  });

  redirect(`/trips/${editToken}?created=${trip.id}&notice=${encodeURIComponent("비공개 트립을 만들었어요.")}`);
}

export async function updateTripDetailsAction(formData: FormData) {
  const accessTrip = await findEditableTrip(formData);
  if (!accessTrip || accessTrip.status === "archived" || accessTrip.status === "deleted") {
    throw new Error("수정할 수 없는 트립입니다.");
  }

  const current = await getTripById(accessTrip.id);
  if (!current) throw new Error("트립을 찾을 수 없습니다.");
  const tripName = String(formData.get("tripName") ?? current.tripName ?? `${current.resortNameSnapshot} 트립`).trim();
  const tripMemo = String(formData.get("tripMemo") ?? current.tripMemo ?? "").trim();
  if (!tripName || tripName.length > 80) throw new AppError("INVALID_INPUT", "트립 이름은 1~80자로 입력해 주세요.");
  if (tripMemo.length > 1000) throw new AppError("INVALID_INPUT", "트립 메모는 1,000자 이내로 입력해 주세요.");

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
  const selectedRentalOptionValue = String(formData.get("selectedRentalOptionId") ?? current.selectedRentalOptionId ?? "");
  const selectedRentalOptionId =
    selectedRentalOptionValue && selectedRentalOptionValue !== "skip"
      ? selectedRentalOptionValue
      : undefined;
  const recommendation = getRecommendations(input).find((item) => item.resort.id === current.resortId);
  if (!recommendation) throw new Error("선택한 스키장의 추천/가격을 다시 계산할 수 없습니다.");
  const visitDate = new Date(`${input.visitDate}T00:00:00`);

  await updateTrip(current.id, {
      tripName,
      tripMemo: tripMemo || null,
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
      selectedRentalOptionId: selectedRentalOptionId ?? null
  });
  await recordAnalyticsEvent({
    tripId: current.id,
    eventName: "trip_details_updated",
    properties: {
      peopleCount: input.peopleCount,
      transportType: input.transportType,
      liftTicketTimeSlot: input.liftTicketTimeSlot
    }
  });

  const defaultTasks = buildDefaultTasks(input);
  await updateDefaultTasksForTrip(
    current.id,
    defaultTasks.map((task) => ({
      category: task.category,
      title: task.title,
      externalUrl: externalUrlForTask({
        resortId: current.resortId,
        selectedRentalOptionId,
        category: task.category,
        title: task.title
      })
    }))
  );

  return finishTripMutation(formData, "트립 정보를 저장했어요.");
}

export async function updateTripDetailsSafeAction(formData: FormData) {
  try {
    formData.set("background", "1");
    const result = await updateTripDetailsAction(formData);
    return actionSuccess(result?.message ?? "트립 정보를 저장했어요.");
  } catch (error) { return actionFailure(error, { action: "updateTripDetails" }); }
}

export async function updateTripBudgetSafeAction(formData: FormData) {
  try {
    const trip = await findEditableTrip(formData);
    if (!trip || trip.status === "archived" || trip.status === "deleted") {
      throw new AppError("FORBIDDEN", "이 트립의 비용을 수정할 수 없습니다.");
    }
    const splitCount = Math.max(1, Math.min(100, Number(formData.get("splitCount") ?? trip.peopleCount) || 1));
    const lodgingName = String(formData.get("lodgingName") ?? "").trim().slice(0, 120);
    const lodgingUrlValue = String(formData.get("lodgingUrl") ?? "").trim();
    if (lodgingUrlValue && !/^https:\/\//i.test(lodgingUrlValue)) {
      throw new AppError("INVALID_INPUT", "숙소 링크는 https://로 시작하는 주소를 입력해 주세요.");
    }
    const rawExtras = JSON.parse(String(formData.get("extras") ?? "[]")) as Array<Record<string, unknown>>;
    const extras = rawExtras.slice(0, 30).map((item, index) => {
      const title = String(item.title ?? "").trim().slice(0, 60);
      const amount = Math.round(Number(item.amount));
      const category = String(item.category ?? "other") as TripExpenseCategory;
      if (!title || !Number.isFinite(amount) || amount < 0 || amount > 100_000_000 || !expenseCategories.has(category)) {
        throw new AppError("INVALID_INPUT", `${index + 1}번째 추가 비용을 확인해 주세요.`);
      }
      return { id: String(item.id || crypto.randomUUID()), title, amount, category, memo: String(item.memo ?? "").trim().slice(0, 200) };
    });
    const overrideKeys = ["lift_ticket", "rental", "transport", "lodging"] as const;
    const overrides = Object.fromEntries(overrideKeys.flatMap(key => {
      const raw = String(formData.get(`${key}Override`) ?? "").trim();
      if (!raw) return [];
      const amount = Math.round(Number(raw));
      if (!Number.isFinite(amount) || amount < 0 || amount > 100_000_000) throw new AppError("INVALID_INPUT", "확정 비용을 확인해 주세요.");
      return [[key, amount]];
    }));
    const budgetData = parseTripBudget({ overrides, extras });
    const liftTicketTimeSlot = String(formData.get("liftTicketTimeSlot") ?? trip.liftTicketTimeSlot) as TripInput["liftTicketTimeSlot"];
    const transportType = String(formData.get("transportType") ?? trip.transportType) as TripInput["transportType"];
    const rentalValue = String(formData.get("selectedRentalOptionId") ?? trip.selectedRentalOptionId ?? "skip");
    const selectedRentalOptionId = rentalValue === "skip" ? null : rentalValue;
    if (!["2h", "3h", "4h", "6h", "night", "full_day"].includes(liftTicketTimeSlot) || !["car", "shuttle", "bus"].includes(transportType)) {
      throw new AppError("INVALID_INPUT", "리프트권 또는 교통 선택을 확인해 주세요.");
    }
    const resort = getResort(trip.resortId);
    const selectedRentalShopId = selectedRentalOptionId
      ? getRentalShopsForResort(trip.resortId).find(shop => getRentalOptionsForResort(trip.resortId).find(group => group.shop.id === shop.id)?.options.some(option => option.id === selectedRentalOptionId))?.id ?? null
      : null;
    if (selectedRentalOptionId && !selectedRentalShopId) throw new AppError("INVALID_INPUT", "선택한 렌탈 상품을 찾을 수 없습니다.");
    const input: TripInput = { visitDate: trip.visitDate.toISOString().slice(0, 10), departureLocation: trip.departureLocation, peopleCount: trip.peopleCount, tripDuration: trip.tripDuration, skillLevel: trip.skillLevel, rideType: trip.rideType, ownsEquipment: trip.ownsEquipment, ownsClothing: trip.ownsClothing, transportType, priorities: ["rental"], liftTicketTimeSlot, lodgingCostInput: budgetData.overrides.lodging };
    const cost = resort ? estimateTripCost(resort, input, selectedRentalOptionId ?? undefined) : null;
    await updateTrip(trip.id, {
      lodgingName: lodgingName || null,
      lodgingUrl: lodgingUrlValue || null,
      lodgingCostInput: budgetData.overrides.lodging ?? null,
      splitCount,
      budgetData,
      liftTicketTimeSlot,
      transportType,
      selectedRentalOptionId,
      selectedRentalShopId,
      selectedRecommendation: cost && trip.selectedRecommendation && typeof trip.selectedRecommendation === "object" ? { ...trip.selectedRecommendation, cost } : trip.selectedRecommendation
    });
    const lodgingTask = trip.tasks.find(task => task.category === "lodging" && task.isDefault);
    if (lodgingTask && (lodgingName || budgetData.overrides.lodging !== undefined) && lodgingTask.status === "needs_check") {
      await updateTask(lodgingTask.id, { status: "planned" });
    }
    const decisionTasks = trip.tasks.filter(task => task.isDefault && task.status === "needs_check" && (
      (task.category === "lift_ticket" && task.title.includes("확인")) ||
      (task.category === "equipment_rental" && task.title.includes("선택") && selectedRentalOptionId) ||
      (task.category === "transport" && task.title.includes("이동 수단"))
    ));
    await Promise.all(decisionTasks.map(task => updateTask(task.id, {
      status: "planned",
      externalUrl: externalUrlForTask({ resortId: trip.resortId, selectedRentalOptionId, category: task.category, title: task.title }) ?? task.externalUrl
    })));
    await recordAnalyticsEvent({ tripId: trip.id, eventName: "trip_budget_updated", properties: { splitCount, extraCount: extras.length, hasLodging: Boolean(lodgingName) } });
    revalidateTripAccess(formData);
    return actionSuccess("비용과 정산 정보를 저장했어요.");
  } catch (error) {
    return actionFailure(error, { action: "updateTripBudget" });
  }
}

export async function updateTripDecisionSafeAction(formData: FormData) {
  try {
    const trip = await findEditableTrip(formData);
    if (!trip || trip.status === "archived" || trip.status === "deleted") throw new AppError("FORBIDDEN", "이 트립의 선택을 수정할 수 없습니다.");
    const decision = String(formData.get("decision") ?? "");
    const patch: Parameters<typeof updateTrip>[1] = {};
    let taskCategory = "";
    if (decision === "rental") {
      const optionId = String(formData.get("selectedRentalOptionId") ?? "");
      const option = optionId ? getRentalOptionsForResort(trip.resortId).flatMap(group => group.options.map(item => ({ item, shop: group.shop }))).find(entry => entry.item.id === optionId) : null;
      if (!option) throw new AppError("INVALID_INPUT", "선택한 렌탈 상품을 찾을 수 없습니다.");
      patch.selectedRentalOptionId = option.item.id;
      patch.selectedRentalShopId = option.shop.id;
      taskCategory = "equipment_rental";
    } else if (decision === "rental_shop") {
      const shopId = String(formData.get("selectedRentalShopId") ?? "");
      const shop = getRentalShopsForResort(trip.resortId).find(item => item.id === shopId);
      if (!shop) throw new AppError("INVALID_INPUT", "선택한 렌탈샵을 찾을 수 없습니다.");
      patch.selectedRentalShopId = shop.id;
      patch.selectedRentalOptionId = null;
      taskCategory = "equipment_rental";
    } else if (decision === "lift") {
      const value = String(formData.get("liftTicketTimeSlot") ?? "");
      if (!["2h", "3h", "4h", "6h", "night", "full_day"].includes(value)) throw new AppError("INVALID_INPUT", "리프트권을 다시 선택해 주세요.");
      patch.liftTicketTimeSlot = value;
      taskCategory = "lift_ticket";
    } else if (decision === "transport") {
      const value = String(formData.get("transportType") ?? "");
      if (!["car", "shuttle", "bus"].includes(value)) throw new AppError("INVALID_INPUT", "교통수단을 다시 선택해 주세요.");
      patch.transportType = value as TripInput["transportType"];
      taskCategory = "transport";
    } else if (decision === "shuttle") {
      const routeId = String(formData.get("shuttleRouteId") ?? "");
      const stopId = String(formData.get("shuttleStopId") ?? "");
      const route = getSkiShuttleRoutes(trip.resortId).find(item => item.id === routeId);
      const stop = route?.stops.find(item => item.id === stopId);
      if (!route || !stop) throw new AppError("INVALID_INPUT", "선택한 셔틀 노선과 정류장을 다시 확인해 주세요.");
      patch.transportType = "shuttle";
      patch.shuttleRouteId = route.id;
      patch.shuttleStopId = stop.id;
      taskCategory = "transport";
    } else if (decision === "lodging") {
      const lodgingName = String(formData.get("lodgingName") ?? "").trim().slice(0, 120);
      const lodgingUrl = String(formData.get("lodgingUrl") ?? "").trim();
      if (!lodgingName) throw new AppError("INVALID_INPUT", "예약하거나 검토 중인 숙소 이름을 입력해 주세요.");
      if (lodgingUrl && !/^https:\/\//i.test(lodgingUrl)) throw new AppError("INVALID_INPUT", "숙소 링크는 https://로 시작해야 합니다.");
      const lodgingCostValue = String(formData.get("lodgingCostInput") ?? "").trim();
      const lodgingCost = lodgingCostValue ? Math.round(Number(lodgingCostValue)) : null;
      if (lodgingCost !== null && (!Number.isFinite(lodgingCost) || lodgingCost < 0 || lodgingCost > 100_000_000)) throw new AppError("INVALID_INPUT", "숙박비를 다시 확인해 주세요.");
      const budget = parseTripBudget(trip.budgetData);
      const overrides = { ...budget.overrides };
      if (lodgingCost === null) delete overrides.lodging;
      else overrides.lodging = lodgingCost;
      patch.lodgingName = lodgingName;
      patch.lodgingUrl = lodgingUrl || null;
      patch.lodgingCostInput = lodgingCost;
      patch.budgetData = { ...budget, overrides };
      taskCategory = "lodging";
    } else {
      throw new AppError("INVALID_INPUT", "저장할 선택 항목을 확인해 주세요.");
    }
    if (decision !== "lodging" && decision !== "rental_shop" && decision !== "shuttle") {
      const resort = getResort(trip.resortId);
      const selectedRentalOptionId = patch.selectedRentalOptionId === undefined ? trip.selectedRentalOptionId : patch.selectedRentalOptionId;
      const input: TripInput = {
        visitDate: trip.visitDate.toISOString().slice(0, 10), departureLocation: trip.departureLocation, peopleCount: trip.peopleCount,
        tripDuration: trip.tripDuration, skillLevel: trip.skillLevel, rideType: trip.rideType, ownsEquipment: trip.ownsEquipment,
        ownsClothing: trip.ownsClothing, transportType: patch.transportType ?? trip.transportType, priorities: ["rental"],
        liftTicketTimeSlot: (patch.liftTicketTimeSlot ?? trip.liftTicketTimeSlot) as TripInput["liftTicketTimeSlot"],
        lodgingCostInput: trip.budgetData.overrides.lodging
      };
      const cost = resort ? estimateTripCost(resort, input, selectedRentalOptionId ?? undefined) : null;
      if (cost && trip.selectedRecommendation && typeof trip.selectedRecommendation === "object") patch.selectedRecommendation = { ...trip.selectedRecommendation, cost };
    }
    await updateTrip(trip.id, patch);
    const task = trip.tasks.find(item => item.isDefault && item.category === taskCategory && item.status === "needs_check");
    if (task) await updateTask(task.id, { status: "planned" });
    await recordAnalyticsEvent({ tripId: trip.id, eventName: "trip_decision_updated", properties: { decision } });
    revalidateTripAccess(formData);
    return actionSuccess("선택을 트립에 저장했어요.");
  } catch (error) { return actionFailure(error, { action: "updateTripDecision" }); }
}

export async function updateTripStatusAction(formData: FormData) {
  const status = String(formData.get("status") ?? "");
  const trip = await findEditableTrip(formData);
  if (!trip || trip.status === "archived" || trip.status === "deleted") {
    throw new Error("수정할 수 없는 트립입니다.");
  }
  await updateTrip(trip.id, { status: status as never });
  await recordAnalyticsEvent({ tripId: trip.id, eventName: "trip_status_changed", properties: { status } });
  return finishTripMutation(formData, "트립 상태를 변경했어요.");
}

export async function updateTripStatusSafeAction(formData: FormData) {
  try {
    formData.set("background", "1");
    const result = await updateTripStatusAction(formData);
    return actionSuccess(result?.message ?? "트립 상태를 변경했어요.");
  } catch (error) { return actionFailure(error, { action: "updateTripStatus" }); }
}

export async function attachTripToAccountAction(formData: FormData) {
  const session = await getSession();
  const editToken = String(formData.get("editToken") ?? "");

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/trips/${editToken}`);
  }

  const trip = await getTripByEditTokenHash(hashToken(editToken));
  if (!trip || trip.status === "archived" || trip.status === "deleted") {
    throw new Error("계정에 저장할 수 없는 트립입니다.");
  }
  if (trip.userId && trip.userId !== session.user.id) {
    throw new Error("이미 다른 계정에 저장된 트립입니다.");
  }
  if (!trip.userId) {
    await updateTrip(trip.id, { userId: session.user.id });
    await recordAnalyticsEvent({ tripId: trip.id, eventName: "trip_attached_to_account" });
  }

  revalidatePath(`/trips/${editToken}`);
  revalidatePath("/my-trips");
  redirect(`/trips/${editToken}?notice=${encodeURIComponent("내 트립에 저장했어요.")}`);
}

export async function updateTaskStatusAction(formData: FormData) {
  const editToken = String(formData.get("editToken") ?? "");
  const taskId = String(formData.get("taskId") ?? "");
  const status = String(formData.get("status") ?? "");

  const trip = await findEditableTrip(formData);

  if (!trip || trip.status === "archived" || trip.status === "deleted") {
    throw new Error("수정할 수 없는 트립입니다.");
  }

  const task = trip.tasks.find((item) => item.id === taskId);
  if (!task) throw new Error("체크리스트 항목을 찾을 수 없습니다.");
  await updateTask(taskId, { status: status as never });
  await recordAnalyticsEvent({ tripId: trip.id, eventName: "task_status_changed", properties: { taskId, status } });

  return finishTripMutation(formData, "체크 상태를 변경했어요.");
}

export async function updateTaskStatusSafeAction(formData: FormData) {
  try {
    const result = await updateTaskStatusAction(formData);
    return actionSuccess(result?.message ?? "체크 상태를 변경했어요.");
  } catch (error) { return actionFailure(error, { action: "updateTaskStatus", taskId: String(formData.get("taskId") ?? "") }); }
}

export async function updateTaskMemoAction(formData: FormData) {
  const editToken = String(formData.get("editToken") ?? "");
  const taskId = String(formData.get("taskId") ?? "");
  const memo = String(formData.get("memo") ?? "");

  const trip = await findEditableTrip(formData);
  if (!trip || trip.status === "archived" || trip.status === "deleted") {
    throw new Error("수정할 수 없는 트립입니다.");
  }
  const task = trip.tasks.find((item) => item.id === taskId);
  if (!task) throw new Error("체크리스트 항목을 찾을 수 없습니다.");
  await updateTask(taskId, { memo });
  redirectToTripWithNotice(formData, "메모를 저장했어요.");
}

export async function updateTaskDetailsAction(formData: FormData) {
  const taskId = String(formData.get("taskId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const memo = String(formData.get("memo") ?? "").trim();
  const trip = await findEditableTrip(formData);
  if (!trip || trip.status === "archived" || trip.status === "deleted") {
    throw new Error("수정할 수 없는 트립입니다.");
  }
  const task = trip.tasks.find((item) => item.id === taskId);
  if (!task) throw new Error("체크리스트 항목을 찾을 수 없습니다.");
  if (!task.isDefault && !title) throw new Error("체크 항목 이름을 입력해 주세요.");
  await updateTask(task.id, {
    title: task.isDefault ? task.title : title,
    memo
  });
  await recordAnalyticsEvent({ tripId: trip.id, eventName: "task_details_updated", properties: { custom: !task.isDefault } });
  return finishTripMutation(formData, "체크 항목을 저장했어요.");
}

export async function updateTaskDetailsSafeAction(formData: FormData) {
  try {
    const result = await updateTaskDetailsAction(formData);
    return actionSuccess(result?.message ?? "체크 항목을 저장했어요.");
  } catch (error) { return actionFailure(error, { action: "updateTaskDetails", taskId: String(formData.get("taskId") ?? "") }); }
}

export async function addTaskAction(formData: FormData) {
  const editToken = String(formData.get("editToken") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const accessTrip = await findEditableTrip(formData);
  const trip = accessTrip ? await getTripById(accessTrip.id) : null;
  if (!trip || trip.status === "archived" || trip.status === "deleted") {
    throw new Error("수정할 수 없는 트립입니다.");
  }

  const maxSortOrder = Math.max(...trip.tasks.map((task) => task.sortOrder), 999);
  await createTask({
      tripId: trip.id,
      title,
      category: "custom",
      isDefault: false,
      status: "needs_check",
      sortOrder: maxSortOrder + 10,
      dueDate: null
  });
  await recordAnalyticsEvent({ tripId: trip.id, eventName: "task_added" });
  return finishTripMutation(formData, "체크 항목을 추가했어요.");
}

export async function addTaskSafeAction(formData: FormData) {
  try {
    const title = String(formData.get("title") ?? "").trim();
    if (!title) throw new AppError("INVALID_INPUT", "추가할 체크 항목 이름을 입력해 주세요.");
    formData.set("background", "1");
    const result = await addTaskAction(formData);
    return actionSuccess(result?.message ?? "체크 항목을 추가했어요.");
  } catch (error) { return actionFailure(error, { action: "addTask" }); }
}

export async function deleteTaskAction(formData: FormData) {
  const editToken = String(formData.get("editToken") ?? "");
  const taskId = String(formData.get("taskId") ?? "");
  const trip = await findEditableTrip(formData);
  if (!trip || trip.status === "archived" || trip.status === "deleted") {
    throw new Error("수정할 수 없는 트립입니다.");
  }
  const task = trip.tasks.find((item) => item.id === taskId && !item.isDefault);
  if (task) {
    await deleteTask(task.id);
    await recordAnalyticsEvent({ tripId: trip.id, eventName: "task_deleted" });
  }
  return finishTripMutation(formData, "체크 항목을 삭제했어요.");
}

export async function deleteTaskSafeAction(formData: FormData) {
  try {
    formData.set("background", "1");
    const result = await deleteTaskAction(formData);
    return actionSuccess(result?.message ?? "체크 항목을 삭제했어요.");
  } catch (error) { return actionFailure(error, { action: "deleteTask", taskId: String(formData.get("taskId") ?? "") }); }
}

export async function duplicateTripAction(formData: FormData) {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login?callbackUrl=/my-trips");
  const source = await findEditableTrip(formData);
  if (!source) throw new Error("복제할 수 없는 트립입니다.");

  const editToken = createToken();
  const shareToken = createToken();
  const duplicate = await createTrip({
    userId: session.user.id,
    teamId: null,
    tripName: `${source.tripName?.trim() || `${source.resortNameSnapshot} 트립`} 복사본`,
    tripMemo: source.tripMemo,
    editTokenHash: hashToken(editToken),
    shareTokenHash: hashToken(shareToken),
    resortId: source.resortId,
    resortNameSnapshot: source.resortNameSnapshot,
    selectedRecommendation: source.selectedRecommendation,
    season: source.season,
    visitDate: source.visitDate,
    departureLocation: source.departureLocation,
    peopleCount: source.peopleCount,
    skillLevel: source.skillLevel,
    rideType: source.rideType,
    transportType: source.transportType,
    tripDuration: source.tripDuration,
    ownsEquipment: source.ownsEquipment,
    ownsClothing: source.ownsClothing,
    needRental: source.needRental,
    needClothing: source.needClothing,
    budgetMin: source.budgetMin,
    budgetMax: source.budgetMax,
    lodgingCostInput: source.lodgingCostInput,
    lodgingName: source.lodgingName,
    lodgingUrl: source.lodgingUrl,
    splitCount: source.splitCount,
    budgetData: source.budgetData,
    liftTicketTimeSlot: source.liftTicketTimeSlot,
    selectedRentalShopId: source.selectedRentalShopId,
    selectedRentalOptionId: source.selectedRentalOptionId,
    status: "planning",
    archivedAt: null,
    expiresAt: source.expiresAt,
    tasks: source.tasks.map((task) => ({
      category: task.category,
      title: task.title,
      status: task.status === "not_needed" ? "not_needed" : "needs_check",
      memo: task.memo,
      isDefault: task.isDefault,
      sortOrder: task.sortOrder,
      dueDate: null,
      externalUrl: task.externalUrl
    }))
  });
  await recordAnalyticsEvent({ tripId: duplicate.id, eventName: "trip_duplicated", properties: { sourceTripId: source.id } });
  redirect(`/my-trips/${duplicate.id}?notice=${encodeURIComponent("비공개 트립으로 복제했어요.")}`);
}

export async function deleteTripAction(formData: FormData) {
  const editToken = String(formData.get("editToken") ?? "");
  const trip = editToken
    ? await getTripByEditTokenHash(hashToken(editToken))
    : await findEditableTrip(formData);
  if (!trip) throw new Error("트립을 찾을 수 없습니다.");
  await recordAnalyticsEvent({ tripId: trip.id, eventName: "trip_deleted" });
  await deleteTrip(trip.id);
  redirect(`${editToken ? "/" : "/my-trips"}?notice=${encodeURIComponent("트립을 삭제했어요.")}`);
}

export async function regenerateShareLinkAction(formData: FormData) {
  const trip = await findShareManageableTrip(formData);
  if (!trip || trip.status === "archived" || trip.status === "deleted") {
    throw new Error("공유 링크를 재발급할 수 없는 트립입니다.");
  }

  const permission = String(formData.get("permission") ?? "read") === "edit" ? "edit" : "read";
  const shareToken = createToken();
  const session = await getSession();
  await createTripShareLink({ tripId: trip.id, tokenHash: hashToken(shareToken), tokenValue: shareToken, permission, createdBy: session?.user?.id ?? null });
  await recordAnalyticsEvent({ tripId: trip.id, eventName: "share_link_created", properties: { permission } });

  const tripId = String(formData.get("tripId") ?? "");
  redirect(`/my-trips/${tripId}?share=${shareToken}&sharePermission=${permission}&notice=${encodeURIComponent("공유 링크를 만들었어요. 기존 링크도 계속 유효합니다.")}`);
}

export async function createShareLinkSafeAction(formData: FormData) {
  try {
    const trip = await findShareManageableTrip(formData);
    if (!trip || trip.status === "archived" || trip.status === "deleted") throw new AppError("NOT_FOUND", "공유할 트립을 찾을 수 없습니다. 화면을 새로고침해 주세요.");
    const permission: "read" | "edit" = String(formData.get("permission") ?? "read") === "edit" ? "edit" : "read";
    const shareToken = createToken();
    const session = await getSession();
    await createTripShareLink({ tripId: trip.id, tokenHash: hashToken(shareToken), tokenValue: shareToken, permission, createdBy: session?.user?.id ?? null });
    await recordAnalyticsEvent({ tripId: trip.id, eventName: "share_link_created", properties: { permission } });
    return actionSuccess("공유 링크를 만들었어요. 기존 링크도 계속 유효합니다.", { sharePath: `/share/${shareToken}`, permission });
  } catch (error) { return actionFailure(error, { action: "createShareLink" }); }
}

export async function inviteTripMemberAction(formData: FormData) {
  const trip = await findEditableTrip(formData);
  const session = await getSession();
  const sessionSecret = await getSessionSecret();
  if (!trip || !session?.user?.id || trip.userId !== session.user.id || !sessionSecret) throw new Error("트립 소유자만 초대할 수 있습니다.");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const permission = String(formData.get("permission") ?? "read") === "edit" ? "edit" : "read";
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("올바른 이메일을 입력해 주세요.");
  let teamId = trip.teamId;
  if (!teamId) {
    const team = await createTripTeam(sessionSecret, getTripDisplayName(trip));
    teamId = team.$id;
    await updateTrip(trip.id, { teamId });
  }
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  await inviteTripMember({ sessionSecret, teamId, email, permission, acceptUrl: `${origin}/invite/accept?tripId=${encodeURIComponent(trip.id)}` });
  await recordAnalyticsEvent({ tripId: trip.id, eventName: "trip_member_invited", properties: { permission } });
  const tripId = String(formData.get("tripId") ?? trip.id);
  redirect(`/my-trips/${tripId}?notice=${encodeURIComponent("초대 메일을 보냈어요.")}`);
}

export async function inviteTripMemberSafeAction(formData: FormData) {
  try {
    const trip = await findEditableTrip(formData);
    const session = await getSession();
    const sessionSecret = await getSessionSecret();
    if (!trip || !session?.user?.id || trip.userId !== session.user.id || !sessionSecret) throw new AppError("FORBIDDEN", "트립 소유자만 사용자를 초대할 수 있습니다.");
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const permission = String(formData.get("permission") ?? "read") === "edit" ? "edit" : "read";
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new AppError("INVALID_INPUT", "올바른 이메일을 입력해 주세요.");
    let teamId = trip.teamId;
    if (!teamId) {
      const team = await createTripTeam(sessionSecret, getTripDisplayName(trip));
      teamId = team.$id;
      await updateTrip(trip.id, { teamId });
    }
    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    await inviteTripMember({ sessionSecret, teamId, email, permission, acceptUrl: `${origin}/invite/accept?tripId=${encodeURIComponent(trip.id)}` });
    await recordAnalyticsEvent({ tripId: trip.id, eventName: "trip_member_invited", properties: { permission } });
    return actionSuccess("초대 메일을 보냈어요.");
  } catch (error) { return actionFailure(error, { action: "inviteTripMember" }); }
}

async function findOwnedManagementTrip(formData: FormData) {
  const session = await getSession();
  const tripId = String(formData.get("tripId") ?? "");
  if (!session?.user?.id) throw new AppError("AUTH_REQUIRED");
  const trip = await getTripById(tripId);
  if (!trip) throw new AppError("NOT_FOUND");
  if (trip.userId !== session.user.id) throw new AppError("FORBIDDEN");
  return trip;
}

async function findShareManageableTrip(formData: FormData) {
  const session = await getSession();
  const tripId = String(formData.get("tripId") ?? "");
  if (!session?.user?.id || !tripId) throw new AppError("AUTH_REQUIRED");
  const trip = await getTripById(tripId);
  if (!trip) throw new AppError("NOT_FOUND");
  if (trip.userId === session.user.id) return trip;
  const sessionSecret = await getSessionSecret();
  if (!sessionSecret || !trip.teamId || !await getTripTeamPermission(sessionSecret, trip.teamId, session.user.id)) {
    throw new AppError("FORBIDDEN", "초대된 사용자와 트립 소유자만 공유를 관리할 수 있습니다.");
  }
  return trip;
}

export async function revokeShareLinkAction(formData: FormData) {
  try {
    const trip = await findShareManageableTrip(formData);
    if (!trip) throw new AppError("NOT_FOUND");
    const linkId = String(formData.get("linkId") ?? "");
    if (!linkId) throw new AppError("INVALID_INPUT");
    await revokeTripShareLink(linkId, trip.id);
    await recordAnalyticsEvent({ tripId: trip.id, eventName: "share_link_revoked" });
    return actionSuccess("공유 링크를 비활성화했어요.");
  } catch (error) { return actionFailure(error, { action: "revokeShareLink" }); }
}

export async function updateTripMemberAction(formData: FormData) {
  try {
    const trip = await findOwnedManagementTrip(formData);
    const sessionSecret = await getSessionSecret();
    const membershipId = String(formData.get("membershipId") ?? "");
    const permission = String(formData.get("permission") ?? "read") === "edit" ? "edit" : "read";
    if (!trip.teamId || !sessionSecret || !membershipId) throw new AppError("INVALID_INPUT");
    await updateTripMembership(sessionSecret, trip.teamId, membershipId, permission);
    return actionSuccess("사용자 권한을 변경했어요.");
  } catch (error) { return actionFailure(error, { action: "updateTripMember" }); }
}

export async function removeTripMemberAction(formData: FormData) {
  try {
    const trip = await findOwnedManagementTrip(formData);
    const sessionSecret = await getSessionSecret();
    const membershipId = String(formData.get("membershipId") ?? "");
    if (!trip.teamId || !sessionSecret || !membershipId) throw new AppError("INVALID_INPUT");
    await removeTripMembership(sessionSecret, trip.teamId, membershipId);
    return actionSuccess("공유 사용자를 내보냈어요.");
  } catch (error) { return actionFailure(error, { action: "removeTripMember" }); }
}

export async function recordExternalLinkClickAction(formData: FormData) {
  const tripId = String(formData.get("tripId") ?? "") || undefined;
  const eventName = String(formData.get("eventName") ?? "external_link_click");
  const href = String(formData.get("href") ?? "");
  const type = String(formData.get("type") ?? "");
  const resortId = String(formData.get("resortId") ?? "");
  const sourceName = String(formData.get("sourceName") ?? "");

  await recordAnalyticsEvent({
      tripId,
      eventName,
      properties: {
        href,
        type,
        resortId,
        sourceName
      }
  });
}
