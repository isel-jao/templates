import React, { type ComponentType, type SVGProps } from "react";

export type IconComponent = React.LazyExoticComponent<
  ComponentType<SVGProps<SVGSVGElement>>
>;

export const data = {
  webhook: React.lazy(() => import("@/assets/icons/webhook.svg?react")),
  cog: React.lazy(() => import("@/assets/icons/cog.svg?react")),
  user: React.lazy(() => import("@/assets/icons/user.svg?react")),
  sun: React.lazy(() => import("@/assets/icons/sun.svg?react")),
} as const;

export type IconName = keyof typeof data;

export const icons = new Map(Object.entries(data));
