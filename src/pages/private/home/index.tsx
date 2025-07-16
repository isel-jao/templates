import { Button } from "@/components/ui/button";
import { toast } from "sonner";
export default function HomePage() {
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
    <main className="container p-6">
      <div className="flex gap-4">
        <Button onClick={handleSuccess} className="flex items-center gap-2">
          <span>success</span>
        </Button>
        <Button onClick={handleError} className="flex items-center gap-2">
          <span>error</span>
        </Button>
        <Button onClick={handleInfo} className="flex items-center gap-2">
          <span>info</span>
        </Button>
      </div>
    </main>
  );
}
