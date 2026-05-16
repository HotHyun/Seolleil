"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="page-shell py-12">
      <Card>
        <CardContent className="flex min-h-72 flex-col items-center justify-center gap-4 text-center">
          <div>
            <p className="text-sm font-semibold text-primary">Error</p>
            <h1 className="mt-2 text-3xl font-black">화면을 불러오지 못했습니다.</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              잠시 후 다시 시도하거나 트립 조건을 다시 입력해 주세요.
            </p>
          </div>
          <Button type="button" onClick={() => reset()}>
            다시 시도
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
