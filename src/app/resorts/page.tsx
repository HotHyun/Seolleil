import { ExternalLink } from "lucide-react";
import { AnalyticsLink } from "@/components/analytics-link";
import { AnalyticsTrack } from "@/components/analytics-track";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resorts } from "@/data/resorts";

export default function ResortsPage() {
  const sorted = [...resorts].sort((a, b) => {
    if (a.operationStatus === b.operationStatus) return a.name.localeCompare(b.name, "ko");
    if (a.operationStatus === "operating") return -1;
    return 1;
  });

  return (
    <main className="page-shell py-8">
      <AnalyticsTrack eventName="resort_detail_view" eventData={{ page: "directory" }} />
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-lime-700">Directory</p>
        <h1 className="text-3xl font-black md:text-5xl">국내 스키장 디렉토리</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          운영/휴장/unknown 상태를 구분해 보여줍니다. 실시간 운영현황은 공식 링크에서 확인하세요.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sorted.map((resort) => (
          <Card key={resort.id}>
            <CardHeader>
              <div className="mb-2 flex flex-wrap gap-2">
                <StatusBadge tone={resort.operationStatus === "operating" ? "good" : "warn"}>
                  {statusLabel(resort.operationStatus)}
                </StatusBadge>
                {resort.nightSkiAvailable ? <StatusBadge>야간</StatusBadge> : null}
              </div>
              <CardTitle>{resort.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{resort.region}</p>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap gap-2">
                {resort.tags.map((tag) => (
                  <StatusBadge key={tag}>{tag}</StatusBadge>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <Score label="초보" value={resort.beginnerScore} />
                <Score label="접근" value={resort.accessScore} />
                <Score label="렌탈" value={resort.rentalConvenienceScore} />
              </div>
              <div className="mt-4 flex gap-2">
                <AnalyticsLink
                  href={resort.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1"
                  eventName="external_link_click"
                  eventData={{ type: "official", resortId: resort.id }}
                >
                  <Button variant="secondary" className="w-full">
                    공식 <ExternalLink className="h-4 w-4" />
                  </Button>
                </AnalyticsLink>
                {resort.mapLinks.naver ? (
                  <AnalyticsLink
                    href={resort.mapLinks.naver}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1"
                    eventName="external_link_click"
                    eventData={{ type: "naver_map", resortId: resort.id }}
                  >
                    <Button variant="ghost" className="w-full">
                      지도
                    </Button>
                  </AnalyticsLink>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-muted p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-black">{value}</div>
    </div>
  );
}

function statusLabel(status: string) {
  return (
    {
      operating: "운영",
      season_pending: "오픈 예정",
      temporarily_closed: "임시 휴장",
      closed: "폐장",
      unknown: "확인 필요"
    }[status] ?? status
  );
}
