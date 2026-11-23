"use client";

import type { ReactNode } from "react";
import { TransitionLink } from "./TransitionLink";

type Variant = "primary" | "outline" | "light";

type Common = {
  label: string;
  variant?: Variant;
  size?: "md" | "sm";
  arrow?: boolean;
  icon?: ReactNode;
  className?: string;
};

type AsLink = Common & { href: string; external?: boolean; onClick?: never; type?: never };
type AsButton = Common & { href?: undefined; onClick?: () => void; type?: "button" | "submit"; external?: never };

const variantClass: Record<Variant, string> = { primary: "", outline: "btn--outline", light: "btn--light" };

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M3 9h11.5M10 4.5 14.5 9 10 13.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Pill button: label rolls up, fill rises from the bottom, arrow nudges 4px. */
export function TextRollButton(props: AsLink | AsButton) {
  const { label, variant = "primary", size = "md", arrow = true, icon, className = "" } = props;
  const cls = `btn group ${variantClass[variant]} ${size === "sm" ? "btn--sm" : ""} ${className}`;
  const inner = (
    <>
      {icon}
      <span className="roll">
        <span className="roll__inner">
          <span>{label}</span>
          <span className="roll__clone" aria-hidden>
            {label}
          </span>
        </span>
      </span>
      {arrow && <Arrow className="btn__arrow" />}
    </>
  );

  if (props.href !== undefined) {
    if (props.external) {
      return (
        <a href={props.href} className={cls} target="_blank" rel="noopener noreferrer">
          {inner}
        </a>
      );
    }
    return (
      <TransitionLink href={props.href} className={cls}>
        {inner}
      </TransitionLink>
    );
  }
  return (
    <button type={props.type ?? "button"} onClick={props.onClick} className={cls}>
      {inner}
    </button>
  );
}
