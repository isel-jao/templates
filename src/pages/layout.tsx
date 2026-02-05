import { Outlet } from "react-router";
import { Toaster } from "sonner";

export default function GlobalLayout() {
  return (
    <>
      <Outlet />
      <Toaster
        richColors
        toastOptions={{
          className: "!bg-card border border-current!",
          classNames: {
            success: "text-success!",
            error: "text-destructive!",
            loading: "text-primary!",
            info: "text-info!",
          },
        }}
      />
    </>
  );
}
