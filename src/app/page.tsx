import { ArrowRight, CheckCircle2, MapPinned, ReceiptText } from "lucide-react";
import { AnalyticsLink } from "@/components/analytics-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resorts } from "@/data/resorts";

export default function HomePage() {
  const active = resorts.filter((resort) => resort.operationStatus === "operating");
  return (
    <main>
      <section className="border-b bg-white">
        <div className="page-shell grid gap-8 py-10 md:grid-cols-[1.2fr_0.8fr] md:py-16">
          <div className="space-y-6">
            <div className="inline-flex rounded-full bg-lime-100 px-3 py-1 text-sm font-semibold text-lime-950">
              국내 스키장 전체 기반 MVP
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
                스키장 고르고, 준비 누락 없이 출발하세요.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                날짜, 출발지, 예산, 렌탈 여부를 입력하면 추천 스키장과 예상 비용,
                예약 링크, 준비 체크리스트를 한 번에 만듭니다.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <AnalyticsLink href="/plan" eventName="home_cta_click">
                <Button className="w-full sm:w-auto">
                  스키 트립 만들기 <ArrowRight className="h-4 w-4" />
                </Button>
              </AnalyticsLink>
              <AnalyticsLink href="/resorts" eventName="resort_directory_click">
                <Button variant="secondary" className="w-full sm:w-auto">
                  국내 스키장 둘러보기
                </Button>
              </AnalyticsLink>
            </div>
          </div>
          <div className="grid gap-3">
            <Card className="bg-zinc-950 text-white">
              <CardHeader>
                <CardTitle>운영 스키장 데이터</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-black text-lime-300">{active.length}</div>
                <p className="mt-2 text-sm text-zinc-300">휴장/unknown 상태는 추천에서 제외하고 디렉토리에 표시합니다.</p>
              </CardContent>
            </Card>
            <div className="grid grid-cols-3 gap-3">
              <Metric icon={<MapPinned />} label="추천" value="Top 3" />
              <Metric icon={<ReceiptText />} label="비용" value="범위" />
              <Metric icon={<CheckCircle2 />} label="관리" value="체크" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-3 text-zinc-500 [&_svg]:h-5 [&_svg]:w-5">{icon}</div>
        <div className="text-xs font-semibold text-muted-foreground">{label}</div>
        <div className="text-lg font-black">{value}</div>
      </CardContent>
    </Card>
  );
}
