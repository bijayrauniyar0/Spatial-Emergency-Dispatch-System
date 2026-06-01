import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Card, CardContent } from "@/components/primitives/card";
import { FlexRow } from "@/components/ui/layouts";

export const metadata = {
  title: "Authentication",
  description: "Authentication page",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-primary-50 flex h-screen w-full flex-col items-center justify-center">
      <FlexRow className="absolute top-4 mx-auto w-full max-w-[99%] items-center justify-between">
        <p className="text-primary text-base font-semibold select-none">
          Spatial Emergency Dispatch System
        </p>

        <Link
          href="/"
          className="group text-primary flex cursor-pointer items-center gap-2"
        >
          <ArrowLeft className="h-5 w-5 transition-transform duration-200 ease-in-out group-hover:-translate-x-2" />
          <p>Back To Home</p>
        </Link>
      </FlexRow>

      <Card className="w-full max-w-xl">
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
