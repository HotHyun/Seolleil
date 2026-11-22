import Link from "next/link";

export type PickerResort = { id: string; name: string; region: string };

// 홈 히어로의 스키장 선택. 이미 갈 곳을 정한 사용자가 바로 해당 스키장의 준비 화면으로 가도록 한다.
export function HeroResortPicker({ resorts }: { resorts: PickerResort[] }) {
  return (
    <div className="hero-reveal hero-delay-2 mt-8">
      <p className="text-sm font-medium">어느 스키장 가세요?</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {resorts.map(resort => (
          <li key={resort.id}>
            <Link
              href={`/resorts/${resort.id}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border bg-card px-3 text-sm font-medium transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {resort.name}
              <span className="text-xs font-normal text-muted-foreground">{resort.region}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
