import Link from "next/link";
import { ArrowUpRight, CalendarDays, CarFront, MapPin, ReceiptText } from "lucide-react";

const comparisons = [
  { resortId: "jisan", name: "지산 포레스트 리조트", range: "21.2만–27.2만 원" },
  { resortId: "vivaldi", name: "비발디파크", range: "23.5만–30.1만 원" }
];

export function TripResultPreviewCard() {
  return (
    <article aria-label="추천과 예상 비용 결과 예시" className="hero-preview rounded-[1.75rem] border border-border bg-card p-4 text-card-foreground shadow-[0_32px_90px_rgba(0,0,0,.2)] sm:p-5">
      <div className="flex items-start justify-between gap-3 px-1 pb-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">플래너 미리보기</p>
          <h2 className="mt-1 text-lg font-black sm:text-xl">조건에 맞는 곳을 비교해요</h2>
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-black text-primary">예시</span>
      </div>

      <div className="rounded-2xl bg-muted/60 p-3 sm:p-4">
        <div className="flex flex-wrap gap-2 text-[11px] font-bold text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1.5"><CalendarDays className="h-3.5 w-3.5 text-primary" /> 25/26 주말</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1.5"><MapPin className="h-3.5 w-3.5 text-primary" /> 강남 출발 · 2명</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1.5"><ReceiptText className="h-3.5 w-3.5 text-primary" /> 초보 · 4시간</span>
        </div>

        <div className="mt-3 rounded-2xl border bg-card p-3.5 sm:p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-black text-primary">추천 1순위</span>
              <h3 className="mt-2 text-lg font-black sm:text-xl">곤지암리조트</h3>
            </div>
            <Link href="/resorts/konjiam" aria-label="곤지암리조트 예시 상세 보기" className="inline-flex shrink-0 items-center gap-1 rounded-lg border px-2.5 py-2 text-xs font-black transition hover:bg-muted">
              상세 <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <p className="mt-2 text-xs font-semibold leading-5 text-muted-foreground">가까운 이동 · 초보 코스 · 렌탈 선택지</p>

          <div className="mt-3 rounded-xl bg-primary/5 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-muted-foreground">2명 예상 비용</span>
              <span className="text-lg font-black text-foreground">약 292,000원</span>
            </div>
            <p className="mt-1 text-right text-[11px] font-semibold text-muted-foreground">참고 범위 290,000–315,000원 · 자가용 포함</p>
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border/70 pt-3 text-[11px]">
              <div><p className="font-semibold text-muted-foreground">리프트</p><p className="mt-1 whitespace-nowrap font-black">19.2만 원</p></div>
              <div><p className="font-semibold text-muted-foreground">렌탈</p><p className="mt-1 whitespace-nowrap font-black">8–10만 원</p></div>
              <div><p className="font-semibold text-muted-foreground"><CarFront className="mr-1 inline h-3.5 w-3.5" />교통</p><p className="mt-1 whitespace-nowrap font-black">1.8–2.3만 원</p></div>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border bg-card px-3.5 py-1 sm:px-4">
          <p className="py-2 text-[11px] font-black text-muted-foreground">같은 조건으로 더 비교하기</p>
          {comparisons.map((item) => (
            <Link key={item.resortId} href={`/resorts/${item.resortId}`} className="flex items-center justify-between gap-2 border-t py-2.5 text-xs transition hover:text-primary">
              <span className="min-w-0 truncate font-bold">{item.name}</span>
              <span className="shrink-0 font-black">{item.range}</span>
            </Link>
          ))}
        </div>
      </div>

      <p className="mt-3 px-1 text-[11px] font-medium leading-5 text-muted-foreground">
        25/26 시즌 참고 가격으로 계산한 화면 예시예요. 실제 금액은 방문일과 해당 시즌 공개 요금에 따라 달라집니다.
      </p>
    </article>
  );
}
