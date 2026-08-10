import type { Page } from "@playwright/test";

/**
 * Lab Core Web Vitals budgets (Playwright + CDP CPU 4×).
 * Not CrUX field p75 — use for Page Experience / ranking readiness smoke.
 */
export const CWV_BUDGETS = {
  /** INP under 4× CPU — field "good" is 200ms; lab throttle needs headroom. */
  inpMs: 500,
  /** Soft CLS ceiling (layout-shift sum without recent input). */
  cls: 0.25,
} as const;

type CwvMetrics = {
  inp: number | null;
  lcp: number | null;
  cls: number;
};

declare global {
  interface Window {
    __cwv?: CwvMetrics;
  }
}

/** CDP Emulation.setCPUThrottlingRate — 4× slower CPU. */
export async function enableCpuThrottle4x(page: Page): Promise<void> {
  const client = await page.context().newCDPSession(page);
  await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });
}

/** Install PerformanceObserver collectors before navigation. */
export async function installCwvCollectors(page: Page): Promise<void> {
  await page.addInitScript(() => {
    window.__cwv = { inp: null, lcp: null, cls: 0 };

    const eventPo = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const e = entry as PerformanceEventTiming;
        if (!e.interactionId) continue;
        const prev = window.__cwv!.inp;
        if (prev == null || e.duration > prev) {
          window.__cwv!.inp = e.duration;
        }
      }
    });
    eventPo.observe({
      type: "event",
      buffered: true,
      durationThreshold: 16,
    } as PerformanceObserverInit);

    const lcpPo = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last) window.__cwv!.lcp = last.startTime;
    });
    lcpPo.observe({ type: "largest-contentful-paint", buffered: true });

    let cls = 0;
    const clsPo = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as LayoutShift;
        if (shift.hadRecentInput) continue;
        cls += shift.value;
      }
      window.__cwv!.cls = cls;
    });
    clsPo.observe({ type: "layout-shift", buffered: true });
  });
}

export async function readCwvMetrics(page: Page): Promise<CwvMetrics> {
  return page.evaluate(() => window.__cwv!);
}
