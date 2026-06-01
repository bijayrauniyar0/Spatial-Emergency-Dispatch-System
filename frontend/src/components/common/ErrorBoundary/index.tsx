"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@/components/primitives/button";
import { FlexColumn, FlexRow } from "@/components/ui/layouts";

interface ErrorFallbackProps {
  error: Error;
  reset?: () => void;
}

function DefaultErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <FlexColumn className="border-destructive/20 bg-destructive/5 min-h-[200px] items-center justify-center gap-4 rounded-lg border p-8 text-center">
      <FlexRow className="text-destructive items-center justify-center gap-2">
        <AlertTriangle size={20} />
        <p className="text-sm font-semibold">Something went wrong</p>
      </FlexRow>
      {error?.message && (
        <p className="text-muted-foreground max-w-md text-xs">
          {error.message}
        </p>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => reset?.()}
        className="gap-2"
      >
        <RefreshCw size={14} />
        Try again
      </Button>
    </FlexColumn>
  );
}

interface AppErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

export default function AppErrorBoundary({
  children,
  fallback,
}: AppErrorBoundaryProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const onRefresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  // Stable component reference — recreated only when fallback or onRefresh changes
  const ErrorComponent = useMemo(() => {
    const FallbackUI = fallback ?? DefaultErrorFallback;

    return function BoundaryFallback({ error, reset }: ErrorFallbackProps) {
      return (
        <FallbackUI
          error={error}
          reset={() => {
            reset?.(); // clears Next.js error boundary state
            onRefresh(); // remounts children via key change
          }}
        />
      );
    };
  }, [fallback, onRefresh]);

  return (
    <ErrorBoundary errorComponent={ErrorComponent}>
      {/* key remounts the subtree on refresh, giving children a clean slate */}
      <div key={refreshKey}>{children}</div>
    </ErrorBoundary>
  );
}
