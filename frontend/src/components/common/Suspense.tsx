import React, { ReactNode, Suspense as ReactSuspense } from "react";

interface SuspenseProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const Suspense: React.FC<SuspenseProps> = ({
  children,
  fallback = <div>Loading...</div>,
}) => {
  return <ReactSuspense fallback={fallback}>{children}</ReactSuspense>;
};

export default Suspense;
