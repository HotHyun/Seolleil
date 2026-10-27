import { departureLocations, getRentalShopsForResort, resorts } from "@/data/resorts";
import { estimateTripCost } from "@/lib/pricing";
import type {
  Priority,
  Recommendation,
  RecommendationCategory,
  SkiResort,
  TripInput
} from "@/lib/types";
import { normalizeTransportType } from "@/lib/transport";

const priorityWeight = [3, 2, 1];

function normalizeLowerIsBetter(value: number, min: number, max: number) {
  if (max === min) return 100;
  return Math.max(0, Math.min(100, 100 - ((value - min) / (max - min)) * 100));
}

function priorityScore(resort: SkiResort, priority: Priority, costRep: number, accessScore: number) {
  switch (priority) {
    case "close":
      return accessScore;
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
  const transportType = normalizeTransportType(input.transportType);
  if (resort.operationStatus !== "operating") return false;
  if (input.priorities.includes("night") && !resort.nightSkiAvailable) return false;
  if (transportType === "public_transit" && resort.transportScore < 45) {
    return false;
  }
  return true;
}

function createReasons(resort: SkiResort, input: TripInput, travelMinutes?: number) {
  const reasons: string[] = [];
  if (input.priorities.includes("close") && travelMinutes !== undefined && travelMinutes <= 80) {
    reasons.push(`선택한 기준 지역에서 약 ${travelMinutes}분 거리입니다.`);
  }
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
  const candidateDetails = candidates.map((resort) => ({
    resort,
    cost: estimateTripCost(resort, input),
    distance: departure?.distances[resort.id]
  }));
  const knownTravelTimes = candidateDetails.flatMap(({ distance }) => distance ? [distance.minutes] : []);
  const shortestTravelTime = knownTravelTimes.length ? Math.min(...knownTravelTimes) : 40;
  const longestTravelTime = knownTravelTimes.length ? Math.max(...knownTravelTimes) : 320;

  return candidateDetails
    .map(({ resort, cost, distance }) => {
      const accessScore = distance
        ? normalizeLowerIsBetter(distance.minutes, shortestTravelTime, longestTravelTime)
        : resort.accessScore;
      const weighted = input.priorities.reduce((sum, priority, index) => {
        return sum + priorityScore(resort, priority, cost.representative, accessScore) * (priorityWeight[index] ?? 1);
      }, 0);
      const base =
        accessScore * 0.12 +
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
        rentalShops: getRentalShopsForResort(resort.id),
        accessScore
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const first = input.priorities[0];
      const firstDelta =
        priorityScore(b.resort, first, b.cost.representative, b.accessScore) -
        priorityScore(a.resort, first, a.cost.representative, a.accessScore);
      if (firstDelta !== 0) return firstDelta;
      return (a.travelMinutes ?? 999) - (b.travelMinutes ?? 999);
    })
    .map(({ accessScore: _accessScore, ...recommendation }) => recommendation);
}

export function buildRequiredTasks(input: TripInput) {
  const transportType = normalizeTransportType(input.transportType);
  const tasks = ["리프트권 확인", "공식 운영현황 확인", "날씨 확인"];
  if (!input.ownsEquipment) tasks.push("장비 렌탈 예약");
  if (!input.ownsClothing) tasks.push("의류 렌탈 예약");
  if (transportType === "car") tasks.push("자차 경로/주차 확인");
  if (transportType === "public_transit") tasks.push("대중교통편 확인/예약");
  if (input.tripDuration === "overnight") tasks.push("숙박 예약");
  return tasks;
}

function topThree(recommendations: Recommendation[]) {
  return recommendations.slice(0, 3);
}

export function getCategoryRecommendations(input: TripInput): RecommendationCategory[] {
  const recs = getRecommendations(input);
  const byCost = [...recs].sort((a, b) => a.cost.representative - b.cost.representative);
  const byAccess = [...recs].sort((a, b) => (a.travelMinutes ?? 999) - (b.travelMinutes ?? 999));
  const byBeginner = [...recs].sort((a, b) => b.resort.beginnerScore - a.resort.beginnerScore);
  const byRental = [...recs].sort(
    (a, b) => b.resort.rentalConvenienceScore - a.resort.rentalConvenienceScore
  );
  const byScale = [...recs].sort((a, b) => b.resort.resortScaleScore - a.resort.resortScaleScore);
  const byNight = recs
    .filter((recommendation) => recommendation.resort.nightSkiAvailable)
    .sort((a, b) => b.score - a.score);
  const byTransport = [...recs].sort((a, b) => b.resort.transportScore - a.resort.transportScore);

  const categories: RecommendationCategory[] = [
    {
      id: "close",
      label: "가까운 곳 TOP 3",
      description: "출발지 기준 이동 시간이 짧은 순서",
      recommendations: topThree(byAccess)
    },
    {
      id: "cheap",
      label: "저렴한 곳 TOP 3",
      description: "리프트권, 렌탈, 교통 포함 예상 총액 기준",
      recommendations: topThree(byCost)
    },
    {
      id: "beginner",
      label: "초보 친화 TOP 3",
      description: "초보 코스와 준비 동선 점수 기준",
      recommendations: topThree(byBeginner)
    },
    {
      id: "rental",
      label: "렌탈 편한 TOP 3",
      description: "렌탈 선택지와 가격 비교 편의 기준",
      recommendations: topThree(byRental)
    },
    {
      id: "scale",
      label: "1박/리조트형 TOP 3",
      description: "규모와 리조트형 이용 적합도 기준",
      recommendations: topThree(byScale)
    },
    {
      id: "night",
      label: "야간 가능 TOP 3",
      description: "야간 스키 가능 후보 중 종합 점수 기준",
      recommendations: topThree(byNight)
    },
    {
      id: "transport",
      label: "교통 편한 TOP 3",
      description: "대중교통 접근성과 이동 편의 기준",
      recommendations: topThree(byTransport)
    }
  ];

  return categories.filter((category) => category.recommendations.length > 0);
}
