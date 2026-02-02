import React, { type ComponentType, type SVGProps } from "react";

export type IconComponent = React.LazyExoticComponent<
  ComponentType<SVGProps<SVGSVGElement>>
>;

const WebHookIcon = React.lazy(
  () => import("@/assets/icons/webhook.svg?react"),
);
const CogIcon = React.lazy(() => import("@/assets/icons/cog.svg?react"));
const UserIcon = React.lazy(() => import("@/assets/icons/user.svg?react"));

export const data = {
  webhook: WebHookIcon,
  cog: CogIcon,
  user: UserIcon,
} as const;

export type IconName = keyof typeof data;

export const icons = new Map(Object.entries(data));
