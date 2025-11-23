"use client";
import { cn } from "@/lib/utils";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEditor } from "../context/editor-provider";

export default function UserComponent() {
  const { Component } = useEditor();

  if (Component === "loading") return <Spinner />;

  if (Component === "error") return <ErrorState />;
  return <Component />;
}

export type SpinnerProps = {
  className?: string;
};

export function Spinner({ className = "" }: SpinnerProps) {
  return (
    <div
      className={cn(
        "w-full h-svh flex flex-col items-center justify-center gap-3 px-4 py-10",
        "text-center bg-muted/20 rounded-md",
        className
      )}
    >
      <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />

      <div className="space-y-1">
        <h2 className="text-lg font-medium text-foreground">
          Rendering Component…
        </h2>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Your React component is being compiled
        </p>
      </div>
    </div>
  );
}

export function ErrorState({ className = "" }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full h-svh flex flex-col items-center justify-center gap-3 px-4 py-10",
        "text-center bg-red-50 rounded-md border border-red-200",
        className
      )}
    >
      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-red-100">
        <AlertCircle className="h-6 w-6 text-red-600" />
      </div>

      <div className="space-y-1">
        <h2 className="text-lg font-medium text-red-700">
          Failed to Load Component
        </h2>

        <p className="text-sm text-red-600 max-w-xs mx-auto">
          We couldn’t compile your component. Please check your JSX and try
          again.
        </p>
      </div>
    </div>
  );
}
