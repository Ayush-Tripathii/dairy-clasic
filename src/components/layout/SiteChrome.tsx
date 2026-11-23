"use client";

import { useState } from "react";
import { Header } from "./Header";
import { MenuOverlay } from "./MenuOverlay";

/** Header + full-screen menu share open state. */
export function SiteChrome() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Header menuOpen={open} onToggleMenu={() => setOpen((o) => !o)} />
      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
