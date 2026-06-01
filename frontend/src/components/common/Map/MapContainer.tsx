"use client";

import React, { ReactElement } from "react";

import { cn } from "@/lib/utils";

import { IMapContainerProps } from "./types";

const { Children, cloneElement } = React;

import "maplibre-gl/dist/maplibre-gl.css";
import "./styles/map.css";

export default function MapContainer({
  children,
  map,
  isMapLoaded,
  id,
  className,
  style,
  ref,
}: IMapContainerProps) {
  const childrenCount = Children.count(children);
  const props = {
    map,
    isMapLoaded,
  };

  return (
    <div
      ref={ref}
      id={id || "maplibre-gl-map"}
      className={cn("relative", className)}
      style={style}
    >
      {childrenCount > 0
        ? Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return cloneElement(child as ReactElement<any>, { ...props });
            }
            return child;
          })
        : null}
    </div>
  );
}
