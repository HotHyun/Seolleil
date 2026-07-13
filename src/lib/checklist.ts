import { rentalPriceRules } from "@/data/prices";
import { getRentalShopsForResort, getResort } from "@/data/resorts";
import type { TripInput } from "@/lib/types";

export type DefaultTask = {
  category:
    | "lift_ticket"
    | "equipment_rental"
    | "clothing_rental"
    | "transport"
    | "lodging"
    | "operation_status"
    | "gear"
    | "safety";
  title: string;
  status: "not_needed" | "needs_check" | "planned" | "reserved" | "paid" | "prepared";
  dueOffsetDays?: number;
  sortOrder: number;
};

export function buildDefaultTasks(input: TripInput): DefaultTask[] {
  const needsEquipment = !input.ownsEquipment;
  const needsClothing = !input.ownsClothing;
  const overnight = input.tripDuration === "overnight";
  const car = input.transportType === "car";
  const tasks: DefaultTask[] = [
    task("lift_ticket", "리프트권 확인", "needs_check", -3, 10),
    task("lift_ticket", "리프트권 구매/예매", "planned", -2, 20),
    task("equipment_rental", "렌탈샵 선택", needsEquipment ? "needs_check" : "not_needed", -3, 30),
    task("equipment_rental", "장비 렌탈 예약", needsEquipment ? "planned" : "not_needed", -2, 40),
    task("clothing_rental", "의류 렌탈 예약", needsClothing ? "planned" : "not_needed", -2, 50),
    task("lodging", "숙박비 입력", overnight ? "needs_check" : "not_needed", -7, 60),
    task("lodging", "숙박 예약", overnight ? "planned" : "not_needed", -7, 70),
    task("transport", "이동 수단 확정", "needs_check", -3, 80),
    task("transport", "자차 경로/주차 확인", car ? "needs_check" : "not_needed", -1, 90),
    task("transport", "셔틀/버스 예약", car ? "not_needed" : "planned", -3, 100),
    task("transport", "출발 시간 확인", "needs_check", -1, 110),
    task("operation_status", "공식 운영현황 확인", "needs_check", -1, 120),
    task("operation_status", "슬로프/리프트 운영 확인", "needs_check", -1, 130),
    task("operation_status", "날씨 확인", "needs_check", -1, 140),
    task("gear", "장갑", "needs_check", -1, 150),
    task("gear", "고글", "needs_check", -1, 160),
    task("gear", "헬멧", "needs_check", -1, 170),
    task("gear", "보호대", "needs_check", -1, 180),
    task("gear", "넥워머/마스크", "needs_check", -1, 190),
    task("gear", "두꺼운 양말", "needs_check", -1, 200),
    task("gear", "여벌 옷", "needs_check", -1, 210),
    task("gear", "방수팩/비닐봉투", "needs_check", -1, 220),
    task("gear", "보조배터리", "needs_check", -1, 230),
    task("safety", "보험/응급 연락처 확인", "needs_check", -1, 240),
    task("safety", "초보자 안전수칙 확인", "needs_check", -1, 250),
    task("safety", "동행자 공유 링크 전달", "planned", -1, 260)
  ];

  return tasks;
}

function task(
  category: DefaultTask["category"],
  title: string,
  status: DefaultTask["status"],
  dueOffsetDays: number,
  sortOrder: number
): DefaultTask {
  return { category, title, status, dueOffsetDays, sortOrder };
}

export function isTaskComplete(category: string, status: string) {
  if (status === "not_needed") return false;
  if (["lift_ticket", "equipment_rental", "clothing_rental", "transport", "lodging"].includes(category)) {
    return status === "reserved" || status === "paid" || status === "prepared";
  }
  return status === "prepared" || status === "paid";
}

export function externalUrlForTask({
  resortId,
  selectedRentalOptionId,
  category,
  title
}: {
  resortId: string;
  selectedRentalOptionId?: string | null;
  category: string;
  title: string;
}) {
  const resort = getResort(resortId);
  const selectedRental = selectedRentalOptionId
    ? rentalPriceRules.find((rule) => rule.id === selectedRentalOptionId)
    : undefined;
  const selectedShop = selectedRental?.rentalShopId
    ? getRentalShopsForResort(resortId).find((shop) => shop.id === selectedRental.rentalShopId)
    : undefined;

  if (category === "lift_ticket") return resort?.liftTicketUrl ?? resort?.officialUrl;
  if (category === "equipment_rental" || category === "clothing_rental") {
    return selectedRental?.bookingUrl ?? selectedShop?.url ?? resort?.rentalUrl ?? resort?.officialUrl;
  }
  if (category === "operation_status") return resort?.slopeStatusUrl ?? resort?.officialUrl;
  if (category === "transport" && title.includes("경로")) return resort?.mapLinks.naver ?? resort?.mapLinks.kakao;
  return undefined;
}
