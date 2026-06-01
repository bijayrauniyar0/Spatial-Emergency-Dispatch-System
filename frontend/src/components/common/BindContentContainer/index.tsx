import React from "react";

import { FlexColumn } from "@/components/ui/layouts";
import { cn } from "@/utils/cn";

interface BindContentContainerProps {
  className?: string;
  children?: React.ReactNode;
}
const BindContentContainer: React.FC<BindContentContainerProps> = ({
  className,
  children,
}) => {
  return (
    <FlexColumn
      className={cn(
        "max-w-7xl:px-6 mx-auto max-w-360 px-4 py-4 max-md:px-4",
        className,
      )}
    >
      {children}
    </FlexColumn>
  );
};

export default BindContentContainer;
