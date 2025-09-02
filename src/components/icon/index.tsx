import React from "react";
import BombIcon from "@/assets/icons/bomb.svg?react";
import { Suspense } from "react";

const WebHookIcon = React.lazy(
  () => import("@/assets/icons/webhook.svg?react"),
);
const CogIcon = React.lazy(() => import("@/assets/icons/cog.svg?react"));
const UserIcon = React.lazy(() => import("@/assets/icons/user.svg?react"));

const iconsMap = {
  webhook: WebHookIcon,
  cog: CogIcon,
  user: UserIcon,
} as const;

interface IconProps extends React.HTMLAttributes<SVGElement> {
  name: string;
}

export function Icon({ name, ...props }: IconProps) {
  const FallbackIcon = () => <BombIcon {...props} />;
  const IconComponent = iconsMap[name as keyof typeof iconsMap];

  if (IconComponent) {
    return (
      <Suspense fallback={<FallbackIcon />}>
        <IconComponent {...props} />
      </Suspense>
    );
  }

  return <FallbackIcon />;
}
