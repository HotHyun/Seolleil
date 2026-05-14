import { departureLocations, getRentalShopsForResort, resorts } from "@/data/resorts";
import { estimateTripCost } from "@/lib/pricing";
import type { Priority, Recommendation, SkiResort, TripInput } from "@/lib/types";

const priorityWeight = [3, 2, 1];

function normalizeLowerIsBetter(value: number, min: number, max: number) {
  if (max === min) return 100;
  return Math.max(0, Math.min(100, 100 - ((value - min) / (max - min)) * 100));
}

function priorityScore(resort: SkiResort, priority: Priority, input: TripInput, costRep: number) {
  const departure = departureLocations.find((location) => location.id === input.departureLocation);
  const distance = departure?.distances[resort.id];

  switch (priority) {
    case "close":
      return distance ? normalizeLowerIsBetter(distance.minutes, 40, 320) : resort.accessScore;
    case "cheap":
      return normalizeLowerIsBetter(costRep, 90000, 420000);
    case "beginner":
      return resort.beginnerScore;
    case "night":
      return resort.nightSkiAvailable ? 95 : 0;
    case "transport":
      return resort.transportScore;
    case "facilities":
      return Math.round((resort.familyScore + resort.resortScaleScore) / 2);
    case "scale":
      return resort.resortScaleScore;
    case "rental":
      return resort.rentalConvenienceScore;
  }
}

function hardFilter(resort: SkiResort, input: TripInput) {
  if (resort.operationStatus !== "operating") return false;
  if (input.priorities.includes("night") && !resort.nightSkiAvailable) return false;
  if ((input.transportType === "shuttle" || input.transportType === "bus") && resort.transportScore < 45) {
    return false;
  }
  return true;
}

function createReasons(resort: SkiResort, input: TripInput, travelMinutes?: number) {
  const reasons: string[] = [];
  if (travelMinutes && travelMinutes <= 70) reasons.push("수도권 당일치기 접근성이 좋습니다.");
  if (resort.beginnerScore >= 85) reasons.push("초보자에게 맞는 코스와 준비 동선이 좋습니다.");
  if (resort.rentalConvenienceScore >= 84) reasons.push("렌탈샵 선택지가 많아 가격 비교에 유리합니다.");
  if (resort.nightSkiAvailable && input.priorities.includes("night")) {
    reasons.push("야간 스키 조건에 맞습니다.");
  }
  if (resort.resortScaleScore >= 88) reasons.push("리조트 규모와 코스 다양성이 좋습니다.");
  if (reasons.length < 2) reasons.push(`${resort.tags.slice(0, 2).join(", ")} 조건에 잘 맞습니다.`);
  return reasons.slice(0, 3);
}

export function getRecommendations(input: TripInput): Recommendation[] {
  const departure = departureLocations.find((location) => location.id === input.departureLocation);
  const candidates = resorts.filter((resort) => hardFilter(resort, input));

  return candidates
    .map((resort) => {
      const cost = estimateTripCost(resort, input);
      const distance = departure?.distances[resort.id];
      const weighted = input.priorities.reduce((sum, priority, index) => {
        return sum + priorityScore(resort, priority, input, cost.representative) * (priorityWeight[index] ?? 1);
      }, 0);
      const base =
        resort.accessScore * 0.12 +
        resort.beginnerScore * 0.12 +
        resort.transportScore * 0.08 +
        resort.rentalConvenienceScore * 0.1 +
        resort.resortScaleScore * 0.08;
      const penalty = cost.confidence === "unavailable" ? 12 : cost.confidence === "estimated" ? 4 : 0;
      const score = Math.round(weighted + base - penalty);

      return {
        resort,
        score,
        reasons: createReasons(resort, input, distance?.minutes),
        travelMinutes: distance?.minutes,
        travelKm: distance?.km,
        cost,
        requiredTasks: buildRequiredTasks(input),
        rentalShops: getRentalShopsForResort(resort.id)
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const first = input.priorities[0];
      const firstDelta =
        priorityScore(b.resort, first, input, b.cost.representative) -
        priorityScore(a.resort, first, input, a.cost.representative);
      if (firstDelta !== 0) return firstDelta;
      return (a.travelMinutes ?? 999) - (b.travelMinutes ?? 999);
    });
}

export function buildRequiredTasks(input: TripInput) {
  const tasks = ["리프트권 확인", "공식 운영현황 확인", "날씨 확인"];
  if (!input.ownsEquipment) tasks.push("장비 렌탈 예약");
  if (!input.ownsClothing) tasks.push("의류 렌탈 예약");
  if (input.transportType === "car") tasks.push("자차 경로/주차 확인");
  if (input.transportType !== "car") tasks.push("셔틀/버스 예약");
  if (input.tripDuration === "overnight") tasks.push("숙박 예약");
  return tasks;
}

export function getCategoryRecommendations(input: TripInput) {
  const recs = getRecommendations(input);
  const byCost = [...recs].sort((a, b) => a.cost.representative - b.cost.representative)[0];
  const byAccess = [...recs].sort((a, b) => (a.travelMinutes ?? 999) - (b.travelMinutes ?? 999))[0];
  const byBeginner = [...recs].sort((a, b) => b.resort.beginnerScore - a.resort.beginnerScore)[0];
  const byRental = [...recs].sort(
    (a, b) => b.resort.rentalConvenienceScore - a.resort.rentalConvenienceScore
  )[0];
  const byScale = [...recs].sort((a, b) => b.resort.resortScaleScore - a.resort.resortScaleScore)[0];

  return [
    { label: "가장 가까움", recommendation: byAccess },
    { label: "가장 저렴함", recommendation: byCost },
    { label: "초보자 추천", recommendation: byBeginner },
    { label: "렌탈 편함", recommendation: byRental },
    { label: "1박/리조트형", recommendation: byScale }
  ].filter((item) => item.recommendation);
}

