"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type IntroState = { done: boolean; finish: () => void };
const IntroContext = createContext<IntroState>({ done: true, finish: () => {} });

/** Lets page sections hold their entrance animation until the first-visit loader lifts. */
export function IntroProvider({ children }: { children: ReactNode }) {
  // The inline head script marks returning visitors before paint. `done` only gates
  // animation effects (never markup), so reading it on the client can't cause a hydration mismatch.
  const [done, setDone] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("intro-seen"),
  );

  const finish = useCallback(() => setDone(true), []);
  return <IntroContext.Provider value={{ done, finish }}>{children}</IntroContext.Provider>;
}

export const useIntro = () => useContext(IntroContext);

export const INTRO_KEY = "dc-intro-seen";

/** Runs in <head> before paint: hides the loader for returning visitors and flags JS. */
export const introHeadScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(localStorage.getItem('${INTRO_KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('intro-seen')}catch(e){d.classList.add('intro-seen')}})();`;
