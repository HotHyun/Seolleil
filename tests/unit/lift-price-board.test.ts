import { describe, expect, it } from "vitest";
import { resorts } from "@/data/resorts";
import { buildDiscountCards, buildRentalDiscountCards, buildTripExamples, discountedPrice, getLiftGuideForBoard, getLiftPriceBoard } from "@/lib/lift-price-board";

describe("lift price board", () => {
  it("shows only the 26/27 official table for Konjiam, without 25/26 prices mixed in", () => {
    const board = getLiftPriceBoard("konjiam")!;
    expect(board.isReference).toBe(false);
    expect(board.columns).toEqual(["weekday", "weekend"]);
    expect(board.rows.map((row) => [row.slot, row.cells.weekday?.price, row.cells.weekend?.price])).toEqual([
      ["2h", 69_000, 83_000],
      ["4h", 81_000, 96_000],
      ["6h", 87_000, 105_000]
    ]);
  });

  it("derives card, guest and night prices from the official rates", () => {
    const board = getLiftPriceBoard("konjiam")!;
    const cards = buildDiscountCards(board, getLiftGuideForBoard("konjiam", board)!);
    const byId = Object.fromEntries(cards.map((card) => [card.discount.id, card.rows]));
    // 공식 카드 할인가(25%)와 같아야 한다.
    expect(byId.card.map((row) => [row.weekday, row.weekend])).toEqual([[51_750, 62_250], [60_750, 72_000], [65_250, 78_750]]);
    expect(byId.guest[0]).toMatchObject({ weekday: discountedPrice(69_000, 30), weekend: discountedPrice(83_000, 30) });
    expect(byId.night.every((row) => row.weekend === undefined)).toBe(true);
  });

  it("builds a board for every resort that has lift prices", () => {
    for (const resort of resorts) {
      const board = getLiftPriceBoard(resort.id);
      if (!board) continue;
      expect(board.rows.length).toBeGreaterThan(0);
      expect(board.columns.length).toBeGreaterThan(0);
    }
  });

  it("prices Konjiam rental discounts on the full set only and totals a one-person trip", () => {
    const board = getLiftPriceBoard("konjiam")!;
    const guide = getLiftGuideForBoard("konjiam", board)!;
    const cards = Object.fromEntries(buildRentalDiscountCards(guide).map((card) => [card.discount.id, card.rows]));
    expect(cards.card).toHaveLength(1);
    expect(cards.card[0].prices.map((entry) => entry.price)).toEqual([27_000, 29_250]);
    expect(cards.lesson[0].prices.map((entry) => entry.price)).toEqual([18_000, 19_500]);
    const examples = buildTripExamples(board, guide);
    expect(examples[0].weekday).toMatchObject({ lift: 81_000, equipment: 36_000, clothing: 27_000, total: 144_000 });
    expect(examples.find((example) => example.title === "제휴카드")?.weekday?.total).toBe(60_750 + 27_000 + 27_000);
  });

  it("prices Vivaldi from the 26/27 table with 5/6/7 hour tickets and 10 won rounding", () => {
    const board = getLiftPriceBoard("vivaldi")!;
    expect(board.rows.map((row) => [row.slot, row.cells.weekday?.price, row.cells.weekend?.price])).toEqual([
      ["5h", 75_000, 91_000],
      ["6h", 79_000, 95_000],
      ["7h", 83_000, 99_000]
    ]);
    const guide = getLiftGuideForBoard("vivaldi", board)!;
    const card = buildDiscountCards(board, guide).find((item) => item.discount.id === "card")!;
    expect(card.rows[0]).toMatchObject({ weekday: 52_500, weekend: 63_700 });
    expect(discountedPrice(36_220 / 0.7, 30, 10)).toBe(36_220);
    const example = buildTripExamples(board, guide);
    expect(example[0].weekday).toMatchObject({ lift: 75_000, equipment: 34_000, total: 109_000 });
    expect(example[0].weekday?.clothing).toBeUndefined();
  });
});
