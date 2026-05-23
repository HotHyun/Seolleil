import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="page-shell py-12">
      <Card>
        <CardContent className="flex min-h-72 flex-col items-center justify-center gap-4 text-center">
          <div>
            <p className="text-sm font-semibold text-primary">Not Found</p>
            <h1 className="mt-2 text-3xl font-black">페이지를 찾을 수 없습니다.</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              링크가 삭제되었거나 만료되었을 수 있습니다.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/">
              <Button>홈으로</Button>
            </Link>
            <Link href="/plan">
              <Button variant="secondary">트립 추천</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
