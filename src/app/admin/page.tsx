import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
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
  const firebaseConsoleUrl = process.env.FIREBASE_PROJECT_ID
    ? `https://console.firebase.google.com/project/${encodeURIComponent(process.env.FIREBASE_PROJECT_ID)}/firestore/databases/-default-/data`
    : null;
  return (
    <main className="page-shell py-8">
      <div className="mb-8">
        <StatusBadge tone="warn">Admin</StatusBadge>
        <h1 className="mt-3 text-3xl font-black md:text-5xl">운영 대시보드</h1>
        <p className="mt-2 text-muted-foreground">
          제품 지표는 Umami, 트립 단위 이벤트는 Firebase Console에서 확인합니다. 이 앱은 별도 집계 대시보드를 운영하지 않습니다.
        </p>
        <div className="mt-4">
          <Link href="/admin/data-quality">
            <Button variant="secondary">데이터 품질 보기</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>운영 도구</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>트립 생성 퍼널과 체크리스트 사용률은 Umami custom events로 확인합니다.</p>
          <p>성공한 서버 상태 변화는 Firestore analytics_events 컬렉션, 서버 오류는 Cloudflare Workers Logs에서 확인합니다.</p>
          {firebaseConsoleUrl ? <a href={firebaseConsoleUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary">Firebase Console <ExternalLink className="h-3.5 w-3.5" /></a> : null}
        </CardContent>
      </Card>
    </main>
  );
}
