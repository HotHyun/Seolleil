// 공식 공지에 가격이 적힌 한정 할인(얼리버드 등). 정상가(prices.ts)와 따로 두며 총액에는 반영하지 않는다.
// 판매 기간(salesFrom~salesTo)이 지나면 화면에서 자동으로 사라지므로, 새 공지가 나오면 항목을 추가하고 지난 항목은 시즌 후에 정리한다.
// 공식 공지에 가격이 적힌 것만 넣는다. 쿠폰·카드사·제휴 즉시할인은 자주 바뀌므로 넣지 않는다.
import type { LiftPromotion } from "@/lib/lift-promotions";

export const liftPromotions: LiftPromotion[] = [
  {
    id: "konjiam-earlybird-26-27",
    resortId: "konjiam",
    title: "26/27 얼리버드 리프트권",
    channel: "NOL",
    salesFrom: "2026-11-04",
    salesTo: "2026-12-06",
    useFrom: "2026-11-01",
    useTo: "2027-03-31",
    prices: [
      { timeSlot: "2h", dayType: "weekday", adultPrice: 44000, withRentalPrice: 56000 },
      { timeSlot: "4h", dayType: "weekday", adultPrice: 52000, withRentalPrice: 64000 },
      { timeSlot: "6h", dayType: "weekday", adultPrice: 56000, withRentalPrice: 68000 },
      { timeSlot: "2h", dayType: "weekend", adultPrice: 54000, withRentalPrice: 67000 },
      { timeSlot: "4h", dayType: "weekend", adultPrice: 62000, withRentalPrice: 75000 },
      { timeSlot: "6h", dayType: "weekend", adultPrice: 68000, withRentalPrice: 81000 }
    ],
    condition: "NOL 단독 한정 판매. 이용은 개장일부터 폐장일까지이며, NOL 즉시할인·쿠폰은 판매 채널 정책에 따라 바뀔 수 있습니다.",
    sourceName: "곤지암리조트 26/27 얼리버드 리프트권 판매 공지(2026-10-30)",
    sourceUrl: "https://m.konjiamresort.co.kr/contact/notice.dev",
    lastCheckedAt: "2026-11-20"
  }
];
