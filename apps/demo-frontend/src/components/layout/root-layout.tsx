import { Outlet } from "react-router-dom";
import { useMe } from "../../hooks/use-auth";

export function RootLayout() {
  useMe();
  return <Outlet />;
}
