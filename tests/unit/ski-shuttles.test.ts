import { describe, expect, it } from "vitest";
import { getShuttleRegions, getSkiShuttleRoutes, searchShuttleRoutes, skiShuttleRoutes2526 } from "@/data/ski-shuttles-25-26";

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
