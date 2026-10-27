import type { DepartureLocation } from "@/lib/types";
import { resortCoordinates } from "@/data/resort-coordinates";

const checkedDepartureLocations: DepartureLocation[] = [
  {
    id: "seoul-gangnam",
    label: "서울 강남",
    region: "서울",
    distances: {
      konjiam: { minutes: 45, km: 42 },
      jisan: { minutes: 55, km: 55 },
      vivaldi: { minutes: 95, km: 88 },
      elysian: { minutes: 95, km: 86 },
      phoenix: { minutes: 150, km: 165 },
      yongpyong: { minutes: 165, km: 185 },
      high1: { minutes: 210, km: 240 },
      wellihilli: { minutes: 130, km: 135 },
      oakvalley: { minutes: 105, km: 105 },
      alpensia: { minutes: 165, km: 186 },
      o2: { minutes: 210, km: 238 },
      muju: { minutes: 190, km: 220 },
      edenvalley: { minutes: 300, km: 365 }
    }
  },
  {
    id: "seoul-cityhall",
    label: "서울 시청",
    region: "서울",
    distances: {
      konjiam: { minutes: 60, km: 50 },
      jisan: { minutes: 70, km: 65 },
      vivaldi: { minutes: 105, km: 95 },
      elysian: { minutes: 95, km: 82 },
      phoenix: { minutes: 160, km: 170 },
      yongpyong: { minutes: 175, km: 190 },
      high1: { minutes: 220, km: 245 },
      wellihilli: { minutes: 140, km: 142 },
      oakvalley: { minutes: 115, km: 112 },
      alpensia: { minutes: 175, km: 192 },
      o2: { minutes: 220, km: 244 },
      muju: { minutes: 200, km: 230 },
      edenvalley: { minutes: 310, km: 375 }
    }
  },
  {
    id: "suwon",
    label: "수원",
    region: "경기",
    distances: {
      konjiam: { minutes: 55, km: 48 },
      jisan: { minutes: 45, km: 44 },
      vivaldi: { minutes: 115, km: 110 },
      elysian: { minutes: 125, km: 115 },
      phoenix: { minutes: 160, km: 170 },
      yongpyong: { minutes: 175, km: 190 },
      high1: { minutes: 215, km: 245 },
      wellihilli: { minutes: 135, km: 142 },
      oakvalley: { minutes: 110, km: 110 },
      alpensia: { minutes: 175, km: 190 },
      o2: { minutes: 220, km: 250 },
      muju: { minutes: 165, km: 190 },
      edenvalley: { minutes: 280, km: 340 }
    }
  }
];

const regionalOrigins = [
  { id: "incheon", label: "인천", region: "인천", lat: 37.4563, lng: 126.7052 },
  { id: "daejeon", label: "대전", region: "충청", lat: 36.3504, lng: 127.3845 },
  { id: "daegu", label: "대구", region: "경북", lat: 35.8714, lng: 128.6014 },
  { id: "busan", label: "부산", region: "부산·경남", lat: 35.1796, lng: 129.0756 },
  { id: "gwangju", label: "광주", region: "전라", lat: 35.1595, lng: 126.8526 }
];

function estimateRegionalDistances(origin: { lat: number; lng: number }) {
  // Reference-area estimates only: no road routing or live traffic service is used.
  const roadDistanceFactor = 1.33;
  const averageSpeedKmh = 78;
  const localAccessMinutes = 12;

  return Object.fromEntries(
    Object.entries(resortCoordinates).map(([resortId, destination]) => {
      const straightLineKm = haversineDistance(origin, destination);
      const km = roundToFive(Math.max(15, straightLineKm * roadDistanceFactor));
      const minutes = roundToFive((km / averageSpeedKmh) * 60 + localAccessMinutes);
      return [resortId, { minutes: Math.max(20, minutes), km }];
    })
  );
}

function haversineDistance(origin: { lat: number; lng: number }, destination: { lat: number; lng: number }) {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const latDelta = radians(destination.lat - origin.lat);
  const lngDelta = radians(destination.lng - origin.lng);
  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(radians(origin.lat)) * Math.cos(radians(destination.lat)) * Math.sin(lngDelta / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function roundToFive(value: number) {
  return Math.round(value / 5) * 5;
}

export const departureLocations: DepartureLocation[] = [
  ...checkedDepartureLocations,
  ...regionalOrigins.map((origin) => ({
    id: origin.id,
    label: origin.label,
    region: origin.region,
    distances: estimateRegionalDistances(origin)
  }))
];
