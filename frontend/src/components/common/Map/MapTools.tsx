"use client";

import { Layers, Minus, Plus } from "lucide-react";
import { useState } from "react";

import { FlexColumn } from "@/components/ui/layouts";
import { cn } from "@/lib/utils";

import BaseLayerMenu from "./BaseLayerMenu";
import { MapInstanceType } from "./types";

interface IMapToolsProps {
  map?: MapInstanceType | null;
  isMapLoaded?: boolean;
  activeLayer: string;
  onLayerChange: (layerId: string) => void;
}

export default function MapTools({
  map,
  activeLayer,
  onLayerChange,
}: IMapToolsProps) {
  const [activeTab, setActiveTab] = useState("");

  function getTabContent(name: string) {
    switch (name) {
      case "base_layers":
        return (
          <BaseLayerMenu
            handleClose={() => setActiveTab("")}
            activeLayer={activeLayer}
            onLayerChange={onLayerChange}
          />
        );
      default:
        return "";
    }
  }

  const handleActiveTab = (tab: string) => {
    if (activeTab === tab) {
      setActiveTab("");
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="absolute right-3 bottom-6 flex w-fit translate-x-0 flex-row items-start gap-2 duration-200 ease-in-out">
      <FlexColumn className="z-20 items-end gap-3">
        <button
          title="Base Layers"
          className={cn(
            "w-fit rounded-full border border-gray-200 bg-white p-2 shadow-md hover:bg-gray-50",
            activeTab === "base_layers"
              ? "border-primary ring-primary ring-1"
              : "bg-white",
          )}
          onClick={() => {
            handleActiveTab("base_layers");
          }}
          type="button"
        >
          <Layers width={20} height={20} className="text-blue-500" />
        </button>

        <FlexColumn className="rounded-lg border bg-white p-0! shadow-md">
          <button
            title="Zoom In"
            className="rounded-t-lg border-b border-gray-300 p-2 hover:bg-gray-50"
            onClick={() => {
              map?.zoomIn();
            }}
            type="button"
          >
            <Plus width={20} height={20} className="text-blue-500" />
          </button>
          <button
            title="Zoom Out"
            className="rounded-b-lg p-2 hover:bg-gray-50"
            onClick={() => {
              map?.zoomOut();
            }}
            type="button"
          >
            <Minus width={20} height={20} className="text-blue-500" />
          </button>
        </FlexColumn>
      </FlexColumn>

      <div
        key={activeTab}
        className={cn(
          "w-fit overflow-clip rounded-lg bg-white shadow-2xl transition-all duration-300 ease-in-out",
          activeTab
            ? "translate-x-0 opacity-100"
            : "pointer-events-none -translate-x-4 opacity-0",
        )}
      >
        {getTabContent(activeTab)}
      </div>
    </div>
  );
}
