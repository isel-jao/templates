import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DevPage() {
  return (
    <main className="container p-6">
      <ToastDemo />
    </main>
  );
}

import React from "react";
import { twMerge } from "tailwind-merge";

interface ToastDemoProps extends React.HTMLAttributes<HTMLElement> {
  ref?: React.RefObject<HTMLDivElement | null>;
}

export function ToastDemo({ className, children, ...props }: ToastDemoProps) {
  function handleSuccess() {
    toast.success("Button clicked!");
  }
  function handleError() {
    toast.error("An error occurred!");
  }
  function handleInfo() {
    toast.info("This is an info message!");
  }
  return (
    <div className={twMerge("flex gap-4", className)} {...props}>
      <Button onClick={handleSuccess} className="flex items-center gap-2">
        <span>success</span>
      </Button>
      <Button onClick={handleError} className="flex items-center gap-2">
        <span>error</span>
      </Button>
      <Button onClick={handleInfo} className="flex items-center gap-2">
        <span>info</span>
      </Button>
      {children}
    </div>
  );
}
