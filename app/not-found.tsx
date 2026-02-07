import Link from "next/link";
import { Beer } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Beer className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <h2 className="mt-2 text-lg font-medium text-foreground">
        Page not found
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="mt-6">
        <Button>Go home</Button>
      </Link>
    </div>
  );
}
