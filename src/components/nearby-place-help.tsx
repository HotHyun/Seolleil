import { ExternalLink, MailPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { legal } from "@/lib/legal";

type PlaceKind = "rental" | "lodging";

const kindText: Record<PlaceKind, { searchSuffix: string; searchLabel: string; reportLabel: string; subject: string }> = {
  rental: { searchSuffix: "스키 렌탈", searchLabel: "스키 렌탈", reportLabel: "렌탈샵", subject: "렌탈샵이" },
  lodging: { searchSuffix: "숙소", searchLabel: "숙소", reportLabel: "숙소", subject: "숙소가" }
};

export function kakaoMapSearchUrl(resortName: string, kind: PlaceKind) {
  return `https://map.kakao.com/link/search/${encodeURIComponent(`${resortName} ${kindText[kind].searchSuffix}`)}`;
}

// 서버에 따로 저장하지 않고 운영자 이메일로 보내는 제보 메일 링크를 만든다.
export function missingPlaceMailto(resortName: string, kind: PlaceKind) {
  const label = kindText[kind].reportLabel;
  const body = [
    `리조트: ${resortName}`,
    `${label} 이름:`,
    "주소 또는 지도 링크:",
    "전화번호:",
    "가격표·예약 링크(알고 있다면):",
    kind === "rental" ? "의류·헬멧 대여, 픽업 여부(알고 있다면):" : "예약 방법·1박 가격(알고 있다면):",
    "",
    `※ 보내 주신 내용은 ${label} 정보를 확인하고 추가하는 데에만 사용합니다.`
  ].join("\n");
  return `mailto:${legal.contactEmail}?subject=${encodeURIComponent(`[설레일 제보] ${resortName} ${label} 추가 요청`)}&body=${encodeURIComponent(body)}`;
}

// 목록에 없는 업체는 지도에서 직접 찾거나 알려 주도록 안내한다. 가격까지 확인된 업체부터 목록에 추가한다.
export function NearbyPlaceHelp({ resortName, kind, className = "" }: { resortName: string; kind: PlaceKind; className?: string }) {
  const text = kindText[kind];
  return (
    <div className={`rounded-xl border border-dashed bg-muted/30 p-4 ${className}`} data-testid="nearby-place-help">
      <p className="text-sm font-black">찾는 {text.subject} 목록에 없나요?</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">모든 업체를 담지는 못해요. 지도에서 더 찾아보거나, 없는 업체를 알려 주세요. 가격까지 확인된 곳부터 목록에 추가해요.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a href={kakaoMapSearchUrl(resortName, kind)} target="_blank" rel="noreferrer">
          <Button type="button" variant="secondary" className="h-11 px-4 text-xs">카카오맵에서 {resortName} 주변 {text.searchLabel} 더 찾기 <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" /></Button>
        </a>
        <a href={missingPlaceMailto(resortName, kind)}>
          <Button type="button" variant="secondary" className="h-11 px-4 text-xs"><MailPlus aria-hidden="true" className="h-3.5 w-3.5" /> 없는 {text.reportLabel} 알려주기</Button>
        </a>
      </div>
    </div>
  );
}
