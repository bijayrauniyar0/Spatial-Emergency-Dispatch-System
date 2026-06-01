import React, { HTMLAttributes, ReactNode } from "react";

// Common props shared by all layout components
interface BaseLayoutProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

/**
 * Flex - A flexible box layout component
 */
export const Flex: React.FC<BaseLayoutProps> = ({
  children,
  className = "",
  ...rest
}) => {
  return (
    <div className={`flex ${className}`} {...rest}>
      {children}
    </div>
  );
};

/**
 * FlexRow - Horizontal flex layout with items aligned in a row
 */
export const FlexRow: React.FC<BaseLayoutProps> = ({
  children,
  className = "",
  ...rest
}) => {
  return (
    <div className={`flex flex-row ${className}`} {...rest}>
      {children}
    </div>
  );
};

/**
 * FlexCol - Vertical flex layout with items stacked in a column
 */
export const FlexColumn: React.FC<BaseLayoutProps> = ({
  children,
  className = "",
  ...rest
}) => {
  return (
    <div className={`flex flex-col ${className}`} {...rest}>
      {children}
    </div>
  );
};

/**
 * FlexCenter - Centers content both horizontally and vertically
 */
export const FlexCenter: React.FC<BaseLayoutProps> = ({
  children,
  className = "",
  ...rest
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`} {...rest}>
      {children}
    </div>
  );
};

/**
 * Grid - CSS Grid layout component
 */
export const Grid: React.FC<BaseLayoutProps> = ({
  children,
  className = "",
  ...rest
}) => {
  return (
    <div className={`grid ${className}`} {...rest}>
      {children}
    </div>
  );
};

/**
 * GridItem - An individual grid item
 */
export const GridItem: React.FC<BaseLayoutProps> = ({
  children,
  className = "",
  ...rest
}) => {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
};

/**
 * Container - A responsive container with max-width at various breakpoints
 */
export const Container: React.FC<BaseLayoutProps> = ({
  children,
  className = "",
  ...rest
}) => {
  return (
    <div className={`container mx-auto px-4 ${className}`} {...rest}>
      {children}
    </div>
  );
};
