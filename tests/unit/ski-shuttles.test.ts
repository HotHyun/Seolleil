import { describe, expect, it } from "vitest";
import { getShuttleRegions, getSkiShuttleCoverage, getSkiShuttleRoutes, searchShuttleRoutes, skiShuttleOperators, skiShuttleRoutes2526, skiShuttleSeasons, skiShuttleStops } from "@/data/ski-shuttles";
import { resorts } from "@/data/resorts";

describe("25/26 ski shuttle data", () => {
  it("covers the confirmed High1 operating networks", () => {
    const routes = getSkiShuttleRoutes("high1");
    const operators = new Set(routes.map(route => route.operator));
    expect(operators).toEqual(new Set(["대원관광", "오성고속관광", "부산은성관광", "대원여행사", "가람관광여행사"]));
    expect(routes.every(route => route.sourceUrl && route.bookingUrl && route.stops.length > 0)).toBe(true);
  });

  it("covers the confirmed Phoenix Seoul and Gyeonggi network", () => {
    const routes = getSkiShuttleRoutes("phoenix");
    expect(routes).toHaveLength(12);
    expect(new Set(routes.map(route => route.operator))).toEqual(new Set(["대원관광"]));
    expect(routes.every(route => route.dataStatus === "confirmed_25_26" && route.priceLabel === "휘닉스 교통시즌권 27.5만원")).toBe(true);
    expect(searchShuttleRoutes(routes, "수원").map(route => route.id)).toContain("phoenix-kd-suwon");
  });

  it("covers the confirmed Jisan paid shuttle", () => {
    const routes = getSkiShuttleRoutes("jisan");
    expect(routes.map(route => route.id)).toEqual(["jisan-cityhall", "jisan-jamsil"]);
    expect(routes.every(route => route.operator === "투어윈도우글로벌" && route.priceLabel === "편도 2만원 · 왕복 3.8만원")).toBe(true);
    expect(searchShuttleRoutes(routes, "종합운동장").map(route => route.id)).toEqual(["jisan-jamsil"]);
  });

  it("covers the confirmed Welli Hilli Seoul and weekend Gyeonggi network", () => {
    const routes = getSkiShuttleRoutes("wellihilli");
    expect(routes).toHaveLength(12);
    expect(routes.every(route => route.operator === "대원관광" && route.priceLabel === "웰리힐리 교통시즌권 25만원")).toBe(true);
    expect(routes.filter(route => route.region !== "서울").every(route => route.operationNote.includes("주말"))).toBe(true);
    expect(searchShuttleRoutes(routes, "인덕원").map(route => route.id)).toEqual(["wellihilli-kd-anyang"]);
  });

  it("covers only O2's current official Taebaek Station connection", () => {
    const routes = getSkiShuttleRoutes("o2");
    expect(routes.map(route => route.id)).toEqual(["o2-taebaek-station"]);
    expect(routes[0]).toMatchObject({ operator: "오투리조트", returnTime: "12:45 / 21:50", dataStatus: "confirmed_25_26" });
    expect(searchShuttleRoutes(routes, "태백역").map(route => route.id)).toEqual(["o2-taebaek-station"]);
  });

  it("covers Oak Valley's free weekend Wonju connection", () => {
    const routes = getSkiShuttleRoutes("oakvalley");
    expect(routes.map(route => route.id)).toEqual(["oakvalley-wonju-weekend"]);
    expect(routes[0]).toMatchObject({ operator: "오크밸리", returnTime: "10:45 / 17:35", priceLabel: "주말 무료 고객 셔틀" });
    expect(routes[0].stops).toHaveLength(3);
    expect(searchShuttleRoutes(routes, "만종역").map(route => route.id)).toEqual(["oakvalley-wonju-weekend"]);
  });

  it("keeps Elysian's confirmed station link without inventing an archived timetable", () => {
    const routes = getSkiShuttleRoutes("elysian");
    expect(routes.map(route => route.id)).toEqual(["elysian-baegyangri"]);
    expect(routes[0]).toMatchObject({ operator: "엘리시안 강촌", priceLabel: "무료 내부 순환셔틀", dataStatus: "route_only_25_26" });
    expect(routes[0].stops[0].departureTime).toBeUndefined();
    expect(searchShuttleRoutes(routes, "백양리역").map(route => route.id)).toEqual(["elysian-baegyangri"]);
  });

  it("covers Eden Valley's documented Daegu winter tour without presenting a sold-out timetable as active", () => {
    const routes = getSkiShuttleRoutes("edenvalley");
    expect(routes.map(route => route.id)).toEqual(["edenvalley-daegu-tour"]);
    expect(routes[0]).toMatchObject({ dataStatus: "route_only_25_26", returnTime: "대구 약 19:30", priceLabel: "왕복 교통만 선택 가능 · 현재 매진" });
    expect(searchShuttleRoutes(routes, "반월당").map(route => route.id)).toEqual(["edenvalley-daegu-tour"]);
  });

  it.each([["alpensia", "알펜시아 스키700"], ["yongpyong", "모나용평 드래곤프라자"]])("covers the complete KD Seoul and Gyeonggi network for %s", (resortId, arrivalName) => {
    const routes = getSkiShuttleRoutes(resortId);
    expect(routes).toHaveLength(12);
    expect(routes.every(route => route.operator === "대원관광" && route.arrivalName === arrivalName && route.priceLabel === "용평·알펜시아 교통시즌권 29만원")).toBe(true);
    expect(searchShuttleRoutes(routes, "수원역")).toHaveLength(1);
    expect(searchShuttleRoutes(routes, "인천터미널")).toHaveLength(1);
  });

  it("covers Vivaldi's two documented 25/26 Seoul routes without inventing hidden departure times", () => {
    const routes = getSkiShuttleRoutes("vivaldi");
    expect(routes.map(route => route.id)).toEqual(["vivaldi-hongdae", "vivaldi-jamsil"]);
    expect(routes.every(route => route.operator === "대명투어" && route.dataStatus === "route_only_25_26")).toBe(true);
    expect(routes.flatMap(route => route.stops).every(stop => stop.departureTime === undefined)).toBe(true);
    expect(searchShuttleRoutes(routes, "건대입구역").map(route => route.id)).toEqual(["vivaldi-hongdae"]);
  });

  it("does not invent public 25/26 affiliate routes for Muju or Konjiam", () => {
    expect(getSkiShuttleRoutes("muju")).toEqual([]);
    expect(getSkiShuttleRoutes("konjiam")).toEqual([]);
  });

  it("builds normalized season, operator, and stop catalogs from the route source", () => {
    expect(skiShuttleSeasons).toEqual(["25/26"]);
    expect(skiShuttleOperators.find(operator => operator.name === "대원관광")?.resortIds).toEqual(expect.arrayContaining(["high1", "phoenix", "wellihilli", "alpensia", "yongpyong"]));
    expect(skiShuttleStops).toHaveLength(skiShuttleRoutes2526.reduce((count, route) => count + route.stops.length, 0));
    expect(skiShuttleStops.find(stop => stop.name === "동래역 3번 출구")).toMatchObject({ resortId: "high1", season: "25/26" });
  });

  it("summarizes confirmed, recheck, and no-service coverage explicitly", () => {
    const high1Routes = getSkiShuttleRoutes("high1");
    expect(getSkiShuttleCoverage({ id: "high1", shuttleUrl: "https://example.com", lastCheckedAt: "2026-07-17" }, high1Routes)).toMatchObject({ status: "needs_recheck", confirmedRouteCount: 16, recheckRouteCount: 2 });
    expect(getSkiShuttleCoverage({ id: "jisan", shuttleUrl: "https://example.com", lastCheckedAt: "2026-07-17" }, getSkiShuttleRoutes("jisan"))).toMatchObject({ status: "confirmed_schedule", confirmedRouteCount: 2, recheckRouteCount: 0 });
    expect(getSkiShuttleCoverage({ id: "muju", shuttleUrl: "https://example.com", lastCheckedAt: "2026-07-17" }, [])).toMatchObject({ status: "no_affiliate_service", confirmedRouteCount: 0, recheckRouteCount: 0 });
  });

  it("assigns an explicit shuttle coverage state to every registered resort", () => {
    const coverage = resorts.map(resort => getSkiShuttleCoverage(resort, getSkiShuttleRoutes(resort.id)));
    expect(coverage).toHaveLength(resorts.length);
    expect(coverage.filter(item => item.status === "no_affiliate_service").map(item => item.resortId)).toEqual(["konjiam", "muju"]);
    expect(coverage.every(item => item.status === "no_affiliate_service" || item.confirmedRouteCount + item.recheckRouteCount > 0)).toBe(true);
  });

  it("finds routes by city and stop name", () => {
    expect(searchShuttleRoutes(skiShuttleRoutes2526, "동래").map(route => route.id)).toEqual(["eunsung-busan"]);
    expect(searchShuttleRoutes(skiShuttleRoutes2526, "수원").map(route => route.id)).toContain("kd-suwon");
    expect(searchShuttleRoutes(skiShuttleRoutes2526, "월드컵경기장").map(route => route.id)).toContain("daewon-honam");
  });

  it("filters by operating region without losing search", () => {
    const regions = getShuttleRegions(skiShuttleRoutes2526);
    expect(regions).toContain("부산·경남");
    expect(searchShuttleRoutes(skiShuttleRoutes2526, "대구", "대구·경북")).toHaveLength(2);
    expect(searchShuttleRoutes(skiShuttleRoutes2526, "대구", "서울")).toHaveLength(0);
  });
});
