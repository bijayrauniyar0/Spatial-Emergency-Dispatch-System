"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/primitives/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex h-[calc(100dvh-4.25rem)] flex-1 flex-col items-center justify-center p-4 text-center">
      <div className="space-y-4">
        <h1 className="text-primary text-9xl font-extrabold tracking-widest">
          404
        </h1>
        <p className="text-xl font-semibold text-gray-900 uppercase">
          Page Not Found
        </p>
        <div className="mt-10 flex flex-col items-center space-y-6">
          <p className="text-xl font-medium text-gray-700 md:text-2xl">
            {`Oops! The page you're looking for doesn't exist.`}
          </p>
          <p className="text-gray-500">It might have been moved or deleted.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="min-w-30"
            >
              Go Back
            </Button>
            <Button onClick={() => router.push("/")} className="min-w-30">
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
