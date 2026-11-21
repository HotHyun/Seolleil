import type { ReactNode } from "react";

export function LegalPage({ title, effectiveDate, children }: { title: string; effectiveDate: string; children: ReactNode }) {
  return (
    <main id="main-content" className="page-shell max-w-3xl py-10">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">시행일: {effectiveDate}</p>
      <div className="mt-8 space-y-8 text-sm leading-7 text-foreground/90">{children}</div>
    </main>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item, index) => <li key={index}>{item}</li>)}
    </ul>
  );
}

export function LegalTable({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[36rem] border-collapse text-left text-xs leading-6">
        <thead className="bg-muted/60">
          <tr>{head.map((cell, index) => <th key={cell} className={`border-b px-3 py-2 font-semibold ${index === 0 ? "w-28 min-w-28" : ""}`}>{cell}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="align-top">
              {row.map((cell, cellIndex) => <td key={cellIndex} className={`border-t px-3 py-2 ${cellIndex === 0 ? "w-28 min-w-28 break-keep font-medium" : ""}`}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
