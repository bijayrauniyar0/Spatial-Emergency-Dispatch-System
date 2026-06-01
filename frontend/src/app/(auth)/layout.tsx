import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Card, CardContent } from "@/components/primitives/card";
import { FlexCenter, FlexColumn } from "@/components/ui/layouts";

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
    <FlexCenter className="bg-primary-50 h-screen w-full items-center justify-center">
      <FlexColumn className="items-start gap-4">
        <Link
          href="/"
          className="group text-primary flex cursor-pointer items-center gap-2"
        >
          <ArrowLeft className="h-5 w-5 transition-transform duration-200 ease-in-out group-hover:-translate-x-2" />
          <p>Back To Home</p>
        </Link>

        <Card className="w-xl">
          <CardContent>{children}</CardContent>
        </Card>
      </FlexColumn>
    </FlexCenter>
  );
}
