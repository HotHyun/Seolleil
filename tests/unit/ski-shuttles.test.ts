import { describe, expect, it } from "vitest";
import { getShuttleRegions, getSkiShuttleRoutes, searchShuttleRoutes, skiShuttleRoutes2526 } from "@/data/ski-shuttles-25-26";

describe("25/26 ski shuttle data", () => {
  it("covers the confirmed High1 operating networks", () => {
    const routes = getSkiShuttleRoutes("high1");
    const operators = new Set(routes.map(route => route.operator));
    expect(operators).toEqual(new Set(["대원관광", "오성고속관광", "부산은성관광", "대원여행사", "가람관광여행사"]));
    expect(routes.every(route => route.sourceUrl && route.bookingUrl && route.stops.length > 0)).toBe(true);
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
