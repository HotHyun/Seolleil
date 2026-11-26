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
  },
  {
    id: "yongpyong-opening-day-26-27",
    resortId: "yongpyong",
    title: "26/27 개장 당일 특가",
    channel: "현장 매표소",
    salesFrom: "2026-11-22",
    salesTo: "2026-11-22",
    useFrom: "2026-11-22",
    useTo: "2026-11-22",
    prices: [
      { timeSlot: "4h", dayType: "weekend", adultPrice: 10000, equipmentRentalPrice: 10000, equipmentRentalDuration: "8시간" },
      { timeSlot: "6h", dayType: "weekend", adultPrice: 10000, equipmentRentalPrice: 10000, equipmentRentalDuration: "8시간" },
      { timeSlot: "full_day", dayType: "weekend", adultPrice: 10000, equipmentRentalPrice: 10000, equipmentRentalDuration: "8시간" }
    ],
    condition: "11월 22일 개장 당일 한정. 리프트는 시간·대상 구분 없이 10,000원이며 스키·보드 장비 8시간 대여는 별도 10,000원입니다.",
    sourceName: "모나용평 26/27시즌 리프트·장비 렌탈 오픈 특가",
    sourceUrl: "https://www.yongpyong.co.kr/kor/skiNboard/utilizationFee/rentCharge.do",
    lastCheckedAt: "2026-11-21"
  },
  {
    id: "phoenix-opening-week-26-27",
    resortId: "phoenix",
    title: "26/27 개장 기념 특가",
    channel: "현장 매표소",
    salesFrom: "2026-11-22",
    salesTo: "2026-11-27",
    useFrom: "2026-11-22",
    useTo: "2026-11-27",
    prices: [
      { timeSlot: "7h", dayType: "weekday", adultPrice: 30000, equipmentRentalPrice: 15000, equipmentRentalDuration: "7시간" },
      { timeSlot: "7h", dayType: "weekend", adultPrice: 30000, equipmentRentalPrice: 15000, equipmentRentalDuration: "7시간" }
    ],
    condition: "11월 22일 10:00~16:00, 11월 23~27일 09:00~16:00 운영 시간에 스키하우스 B1 통합 매표소에서 발권합니다. 일반 시즌 요금표와 구분되는 개장 행사 가격입니다.",
    sourceName: "휘닉스파크 26/27 개장 기념 리프트·장비 대여 특가",
    sourceUrl: "https://phoenixhnr.co.kr/page/pyeongchang/board/event/150000047550",
    lastCheckedAt: "2026-11-21"
  },
  {
    id: "phoenix-activity-deal-26-27",
    resortId: "phoenix",
    title: "26/27 스노우 파크 액티비티 특가",
    channel: "휘닉스 파크 공식 홈페이지",
    salesFrom: "2026-11-23",
    salesTo: "2026-12-31",
    useFrom: "2026-11-22",
    useTo: "2027-03-31",
    prices: [
      { timeSlot: "4h", dayType: "weekday", adultPrice: 63300 },
      { timeSlot: "6h", dayType: "weekday", adultPrice: 70300, withRentalPrice: 83300 },
      { timeSlot: "4h", dayType: "weekend", adultPrice: 63300 },
      { timeSlot: "6h", dayType: "weekend", adultPrice: 70300, withRentalPrice: 83300 }
    ],
    condition: "라이트 패스(4시간)·스마트 패스(6시간)이고 장비 렌탈 포함 상품은 6시간 기준(스키 또는 보드 택 1, 의류·헬멧 별도)입니다. 이용 기간은 개장일부터 폐장일까지이며 대·소인 구분 없이 같은 가격입니다. 시간은 첫 게이트 통과 시점부터 계산하고 정설 시간은 제외됩니다. 일부 상품은 부분 환불이 되지 않습니다.",
    sourceName: "휘닉스파크 26/27 스노우 파크 액티비티 특가 혜택",
    sourceUrl: "https://phoenixhnr.co.kr/page/pyeongchang/board/event/190000047576",
    lastCheckedAt: "2026-11-26"
  }
];
