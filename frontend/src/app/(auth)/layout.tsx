import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import singInImg from "@/assets/images/sign-in.jpg";
import Suspense from "@/components/common/Suspense";
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
    <div className="bg-primary-50 grid h-screen grid-cols-12">
      <div className="col-span-12 md:col-span-6 lg:col-span-5 xl:col-span-4">
        <Link
          href="/"
          className="group text-primary absolute top-7 left-12 flex cursor-pointer items-center gap-2"
        >
          <ArrowLeft className="h-5 w-5 transition-transform duration-200 ease-in-out group-hover:-translate-x-2" />
          <p>Back To Home</p>
        </Link>
        <Suspense>{children}</Suspense>
      </div>
      <div className="col-span-12 hidden md:col-span-6 md:block lg:col-span-7 xl:col-span-8">
        <FlexRow className="hidden h-screen w-full overflow-hidden md:block">
          <Image
            src={singInImg}
            className="h-full w-full object-cover"
            alt="sidebar-banner"
          />
        </FlexRow>
      </div>
    </div>
  );
}
