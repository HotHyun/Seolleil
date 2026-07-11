import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "운영 대시보드 | Korean Ski",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminPage() {
  return (
    <main className="page-shell py-8">
      <div className="mb-8">
        <StatusBadge tone="warn">Admin</StatusBadge>
        <h1 className="mt-3 text-3xl font-black md:text-5xl">운영 대시보드</h1>
        <p className="mt-2 text-muted-foreground">
          Appwrite 전환 중에는 DB 집계 대시보드를 잠시 비활성화합니다. 정적 데이터 품질 점검은 계속 사용할 수 있습니다.
        </p>
        <div className="mt-4">
          <Link href="/admin/data-quality">
            <Button variant="secondary">데이터 품질 보기</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appwrite 운영 메모</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>트립, 체크리스트, 공유 조회 이벤트는 Appwrite Databases collections로 저장됩니다.</p>
          <p>관리자 집계는 Appwrite query 기반으로 재구현할 예정입니다.</p>
        </CardContent>
      </Card>
    </main>
  );
}
