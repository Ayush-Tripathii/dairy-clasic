"use client";

import type { ReactNode } from "react";
import { SmoothScroll } from "./SmoothScroll";
import { IntroProvider } from "./IntroProvider";
import { TransitionProvider } from "./TransitionProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <IntroProvider>
        <TransitionProvider>{children}</TransitionProvider>
      </IntroProvider>
    </SmoothScroll>
  );
}
