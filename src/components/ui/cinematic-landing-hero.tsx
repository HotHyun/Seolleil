"use client";

import React, { useEffect, useRef } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, ClipboardCheck, MapPinned, MountainSnow, ReceiptText, Share2 } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INJECTED_STYLES = `
  .kski-reveal { visibility: hidden; }
  .kski-film-grain {
    position: absolute; inset: 0; pointer-events: none; z-index: 40; opacity: 0.055; mix-blend-mode: overlay;
    background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }
  .kski-grid {
    background-size: 64px 64px;
    background-image:
      linear-gradient(to right, hsl(var(--foreground) / 0.055) 1px, transparent 1px),
      linear-gradient(to bottom, hsl(var(--foreground) / 0.055) 1px, transparent 1px);
    mask-image: radial-gradient(ellipse at center, black 0%, transparent 72%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 72%);
  }
  .kski-hero-title {
    color: white;
    text-shadow: 0 22px 70px rgba(0,0,0,0.76), 0 3px 12px rgba(0,0,0,0.72);
  }
  .kski-silver {
    background: linear-gradient(180deg, #ffffff 0%, #cbd5e1 48%, #94a3b8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 20px 36px rgba(0,0,0,0.58));
  }
  .kski-white-hero {
    color: #ffffff;
    text-shadow: 0 22px 70px rgba(0,0,0,0.76), 0 3px 12px rgba(0,0,0,0.72);
  }
  .kski-depth-card {
    background:
      radial-gradient(circle at var(--mouse-x, 65%) var(--mouse-y, 35%), rgba(255,255,255,0.16), transparent 32rem),
      linear-gradient(145deg, rgba(30,41,59,0.96) 0%, rgba(10,16,29,0.98) 58%, rgba(6,10,20,1) 100%);
    border: 1px solid rgba(255,255,255,0.12);
    box-shadow:
      0 42px 110px -30px rgba(0,0,0,0.95),
      inset 0 1px 1px rgba(255,255,255,0.2),
      inset 0 -1px 2px rgba(0,0,0,0.72);
  }
  .kski-phone {
    background: #09090b;
    box-shadow:
      inset 0 0 0 2px #52525b,
      inset 0 0 0 8px #000,
      0 38px 80px -20px rgba(0,0,0,0.9);
  }
  .kski-widget {
    background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025));
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 14px 28px rgba(0,0,0,0.34), inset 0 1px 1px rgba(255,255,255,0.08);
  }
  .kski-floating {
    background: linear-gradient(135deg, rgba(255,255,255,0.13), rgba(255,255,255,0.035));
    border: 1px solid rgba(255,255,255,0.14);
    backdrop-filter: blur(22px);
    -webkit-backdrop-filter: blur(22px);
    box-shadow: 0 24px 54px -18px rgba(0,0,0,0.82), inset 0 1px 1px rgba(255,255,255,0.2);
  }
  .kski-progress-ring {
    transform: rotate(-90deg);
    transform-origin: center;
    stroke-dasharray: 402;
    stroke-dashoffset: 402;
    stroke-linecap: round;
  }
  .kski-cta-primary {
    background: linear-gradient(180deg, hsl(var(--primary)) 0%, color-mix(in srgb, hsl(var(--primary)) 82%, black) 100%);
    color: hsl(var(--primary-foreground));
    box-shadow: 0 18px 38px -14px hsl(var(--primary) / 0.65), inset 0 1px 1px rgba(255,255,255,0.22);
  }
  .kski-cta-secondary {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.18);
    color: white;
    backdrop-filter: blur(18px);
  }
`;

export interface CinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  activeResortCount?: number;
  primaryHref?: string;
  secondaryHref?: string;
}

export function CinematicHero({
  activeResortCount = 0,
  primaryHref = "/plan",
  secondaryHref = "/resorts",
  className,
  ...props
}: CinematicHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(() => {
        if (!cardRef.current || !phoneRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        cardRef.current.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
        cardRef.current.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);

        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;
        gsap.to(phoneRef.current, {
          rotationY: x * 8,
          rotationX: -y * 7,
          duration: 1.1,
          ease: "power3.out"
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(".kski-reveal", { autoAlpha: 1, clearProps: "visibility" });
        gsap.set(".kski-progress-ring", { strokeDashoffset: 74 });
        gsap.set(".kski-counter", { innerHTML: activeResortCount });
        return;
      }

      gsap.set(".kski-eyebrow, .kski-title-line, .kski-copy, .kski-actions, .kski-stat", {
        autoAlpha: 0,
        y: 42,
        filter: "blur(16px)"
      });
      gsap.set(".kski-card", { y: window.innerHeight * 0.72, autoAlpha: 1, scale: 0.94 });
      gsap.set(".kski-phone-wrap, .kski-card-copy, .kski-card-brand, .kski-floating, .kski-widget", { autoAlpha: 0 });

      gsap.timeline({ delay: 0.2 })
        .to(".kski-eyebrow", { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.75, ease: "expo.out" })
        .to(".kski-title-line", { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.08, ease: "expo.out" }, "-=0.4")
        .to(".kski-copy", { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.75, ease: "expo.out" }, "-=0.45")
        .to(".kski-actions", { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.65, ease: "expo.out" }, "-=0.35")
        .to(".kski-stat", { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.55, stagger: 0.08, ease: "expo.out" }, "-=0.25");

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=3000",
          pin: true,
          scrub: 1,
          anticipatePin: 1
        }
      });

      scrollTl
        .to(".kski-hero-copy", { scale: 1.08, opacity: 0.12, filter: "blur(16px)", duration: 1.2, ease: "power2.inOut" }, 0)
        .to(".kski-card", { y: 0, scale: 1, duration: 1.45, ease: "power3.inOut" }, 0)
        .to(".kski-card", {
          width: isMobile ? "94vw" : "88vw",
          height: isMobile ? "86vh" : "82vh",
          borderRadius: isMobile ? "28px" : "40px",
          duration: 1.1,
          ease: "power3.inOut"
        })
        .fromTo(".kski-phone-wrap", { y: 160, scale: 0.74, rotationX: 28, autoAlpha: 0 }, { y: 0, scale: 1, rotationX: 0, autoAlpha: 1, duration: 1.4, ease: "expo.out" }, "-=0.45")
        .fromTo(".kski-widget", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.12, duration: 0.85, ease: "back.out(1.3)" }, "-=0.9")
        .to(".kski-progress-ring", { strokeDashoffset: 74, duration: 1.15, ease: "power3.inOut" }, "-=0.65")
        .to(".kski-counter", { innerHTML: activeResortCount, snap: { innerHTML: 1 }, duration: 1.1, ease: "expo.out" }, "-=1.05")
        .fromTo(".kski-floating", { y: 70, scale: 0.82, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, stagger: 0.16, duration: 0.85, ease: "back.out(1.4)" }, "-=0.95")
        .fromTo(".kski-card-copy", { x: -34, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" }, "-=0.55")
        .fromTo(".kski-card-brand", { x: 34, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" }, "<")
        .to({}, { duration: 0.9 })
        .to([".kski-phone-wrap", ".kski-floating", ".kski-card-copy", ".kski-card-brand"], { y: -34, scale: 0.94, autoAlpha: 0, stagger: 0.04, duration: 0.8, ease: "power3.in" })
        .to(".kski-card", { y: -window.innerHeight * 0.85, duration: 1, ease: "power3.in" });
    }, containerRef);

    return () => ctx.revert();
  }, [activeResortCount]);

  return (
    <section
      ref={containerRef}
      className={cn("relative flex h-screen w-full items-center justify-center overflow-hidden bg-zinc-950 text-white", className)}
      style={{ perspective: "1400px" }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-82"
        style={{ backgroundImage: "url('/images/ski-hero.jpg')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.62),rgba(0,0,0,0.36),rgba(0,0,0,0.18))]" aria-hidden="true" />
      <div className="kski-grid absolute inset-0 z-0 opacity-70" aria-hidden="true" />
      <div className="kski-film-grain" aria-hidden="true" />

      <div className="kski-hero-copy page-shell relative z-10">
        <div className="max-w-5xl">
          <div className="kski-eyebrow kski-reveal mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-black backdrop-blur">
            <MountainSnow className="h-4 w-4 text-primary" />
            한국 스키 여행을 예약 전까지 정리
          </div>
          <h1 className="kski-hero-title text-balance text-5xl font-black leading-[0.94] tracking-normal sm:text-6xl md:text-8xl">
            <span className="kski-title-line kski-reveal block kski-white-hero">스키장 추천부터</span>
            <span className="kski-title-line kski-reveal block kski-white-hero">비용, 준비, 공유까지.</span>
          </h1>
          <p className="kski-copy kski-reveal mt-6 max-w-2xl text-base font-semibold leading-7 text-white/80 sm:text-lg md:text-xl md:leading-8">
            Korean Ski는 검색 결과를 늘어놓지 않고, 지금 예약 전에 결정해야 할 것들을 하나의 트립으로 압축합니다.
          </p>
          <div className="kski-actions kski-reveal mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={primaryHref} className="kski-cta-primary inline-flex h-12 items-center justify-center gap-2 rounded-lg px-5 text-base font-black transition-transform hover:-translate-y-0.5">
              내게 맞는 스키장 찾기 <ArrowRight className="h-5 w-5" />
            </a>
            <a href={secondaryHref} className="kski-cta-secondary inline-flex h-12 items-center justify-center rounded-lg px-5 text-base font-black transition-transform hover:-translate-y-0.5">
              스키장 둘러보기
            </a>
          </div>
          <div className="mt-8 grid max-w-4xl gap-3 border-t border-white/15 pt-5 sm:grid-cols-3">
            <HeroStat icon={<MapPinned />} label="운영 스키장" value={`${activeResortCount}곳`} />
            <HeroStat icon={<ReceiptText />} label="예상 비용" value="날짜 기준" />
            <HeroStat icon={<ClipboardCheck />} label="준비 관리" value="공유 가능" />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
        <div
          ref={cardRef}
          className="kski-card kski-reveal kski-depth-card pointer-events-auto relative flex h-[84vh] w-[92vw] items-center justify-center overflow-hidden rounded-[32px] md:h-[78vh] md:w-[84vw] md:rounded-[40px]"
        >
          <div className="relative z-10 grid h-full w-full max-w-7xl items-center gap-6 px-5 py-7 md:grid-cols-[0.8fr_1fr_0.8fr] md:px-10 lg:px-14">
            <div className="kski-card-copy kski-reveal order-3 text-center md:order-1 md:text-left">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-black text-primary">
                <CalendarDays className="h-3.5 w-3.5" />
                Trip planner
              </div>
              <h2 className="text-2xl font-black leading-tight text-white md:text-4xl">예약 전에 빠뜨릴 일을 줄입니다.</h2>
              <p className="mt-4 hidden max-w-sm text-sm leading-6 text-blue-100/70 md:block">
                추천 이유, 날짜 기준 가격, 공식 확인 링크, 동행자 체크리스트를 같은 흐름 안에서 관리합니다.
              </p>
            </div>

            <div className="kski-phone-wrap kski-reveal order-2 flex h-[430px] items-center justify-center md:h-[620px]">
              <div ref={phoneRef} className="kski-phone relative h-[580px] w-[280px] scale-[0.72] overflow-hidden rounded-[3rem] md:scale-95 lg:scale-100">
                <div className="absolute inset-[8px] overflow-hidden rounded-[2.45rem] bg-[#050914] px-5 pb-8 pt-12 text-white">
                  <div className="absolute left-1/2 top-[6px] z-20 h-[28px] w-[100px] -translate-x-1/2 rounded-full bg-black shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]" />
                  <div className="kski-widget mb-7 flex items-center justify-between rounded-2xl p-3">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">Today</div>
                      <div className="mt-1 text-xl font-black">Ski Trip</div>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <MountainSnow className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="kski-widget relative mx-auto mb-8 flex h-44 w-44 items-center justify-center rounded-full">
                    <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
                      <circle cx="88" cy="88" r="64" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
                      <circle className="kski-progress-ring" cx="88" cy="88" r="64" fill="none" stroke="hsl(var(--primary))" strokeWidth="12" />
                    </svg>
                    <div className="relative text-center">
                      <div className="kski-counter text-4xl font-black tracking-tight">0</div>
                      <div className="text-[9px] font-black uppercase tracking-[0.16em] text-white/45">Operating resorts</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <PhoneRow icon={<MapPinned />} title="곤지암 · 비발디 · 휘닉스" subtitle="조건 기반 추천 후보" />
                    <PhoneRow icon={<ReceiptText />} title="1인 94,000원부터" subtitle="리프트권, 렌탈, 교통비" />
                    <PhoneRow icon={<CheckCircle2 />} title="예약 확인 3개 남음" subtitle="공식 링크와 체크리스트" />
                  </div>
                </div>
              </div>
            </div>

            <div className="kski-card-brand kski-reveal order-1 text-center md:order-3 md:text-right">
              <div className="kski-silver text-5xl font-black uppercase leading-none tracking-tighter md:text-7xl lg:text-8xl">
                Korean<br />Ski
              </div>
            </div>

            <FloatingBadge className="kski-floating kski-reveal left-4 top-5 md:left-[34%] md:top-12" icon={<Share2 />} title="공유 링크" text="읽기 전용 준비 상태" />
            <FloatingBadge className="kski-floating kski-reveal bottom-6 right-4 md:bottom-16 md:right-[30%]" icon={<ClipboardCheck />} title="체크리스트" text="동행자와 같이 확인" />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="kski-stat kski-reveal flex min-h-20 items-center gap-3 rounded-lg border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground [&_svg]:h-5 [&_svg]:w-5">
        {icon}
      </div>
      <div>
        <div className="text-xs font-bold text-white/60">{label}</div>
        <div className="mt-1 text-lg font-black">{value}</div>
      </div>
    </div>
  );
}

function PhoneRow({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="kski-widget flex items-center gap-3 rounded-2xl p-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary [&_svg]:h-4 [&_svg]:w-4">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-black">{title}</div>
        <div className="mt-0.5 truncate text-xs font-semibold text-white/45">{subtitle}</div>
      </div>
    </div>
  );
}

function FloatingBadge({
  className,
  icon,
  title,
  text
}: {
  className?: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className={cn("kski-floating absolute z-30 flex items-center gap-3 rounded-2xl p-3", className)}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary [&_svg]:h-4 [&_svg]:w-4">
        {icon}
      </div>
      <div>
        <div className="text-sm font-black text-white">{title}</div>
        <div className="text-xs font-semibold text-blue-100/55">{text}</div>
      </div>
    </div>
  );
}
