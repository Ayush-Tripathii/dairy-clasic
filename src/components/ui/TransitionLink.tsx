"use client";

import type { ComponentProps, MouseEvent } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { usePageTransition } from "@/components/providers/TransitionProvider";

type Props = ComponentProps<typeof Link> & { href: string };

/** Locale-aware link that plays the curtain transition for internal page changes. */
export function TransitionLink({ href, onClick, children, ...rest }: Props) {
  const { navigate } = usePageTransition();
  const pathname = usePathname();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    const modified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
    const isHash = href.startsWith("#");
    const external = /^(https?:|mailto:|tel:)/.test(href);
    if (modified || isHash || external || rest.target === "_blank" || href === pathname) return;
    e.preventDefault();
    navigate(href);
  };

  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
