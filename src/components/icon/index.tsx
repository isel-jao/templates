import { icons, type IconComponent, type IconName } from "./icons";
import FallbackIcon from "./fallback.svg?react";
import { Suspense } from "react";
export { type IconName } from "./icons";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
}

export function Icon({ name, ...props }: IconProps) {
  const IconComponent = icons.get(name) as unknown as IconComponent | undefined;
  if (IconComponent) {
    return (
      <Suspense fallback={<FallbackIcon {...props} />}>
        <IconComponent {...props} />
      </Suspense>
    );
  }

  return <FallbackIcon {...props} />;
}
