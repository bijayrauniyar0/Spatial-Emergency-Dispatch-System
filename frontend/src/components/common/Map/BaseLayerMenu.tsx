"use client";

import { X } from "lucide-react";
import Image from "next/image";

import { FlexColumn, FlexRow } from "@/components/ui/layouts";

import { BASE_LAYERS_LIST } from "./constants";

type BaseLayerMenuProps = {
  handleClose: () => void;
  activeLayer: string;
  onLayerChange: (layerId: string) => void;
};

export default function BaseLayerMenu({
  handleClose,
  activeLayer,
  onLayerChange,
}: BaseLayerMenuProps) {
  return (
    <div className="z-1000 h-fit min-w-50 cursor-pointer overflow-x-auto rounded-lg bg-white px-3 py-3 shadow-md">
      <FlexColumn className="gap-3">
        <FlexRow className="items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Base Layer</h3>
          <button
            onClick={handleClose}
            className="rounded-md p-1 transition-colors hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </FlexRow>
        <FlexRow className="gap-4">
          {BASE_LAYERS_LIST.map(({ id, name, image }) => {
            const isActive = id === activeLayer;
            return (
              <FlexColumn
                key={id}
                className="group items-center gap-2"
                onClick={() => {
                  onLayerChange(id);
                  handleClose();
                }}
              >
                <div
                  className={`relative aspect-square h-12 w-12 overflow-hidden rounded-full outline-2 outline-offset-2 transition-all ${isActive ? "outline-blue-500" : "outline-transparent hover:outline-gray-200"}`}
                >
                  <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <p
                  className={`text-center text-[10px] font-medium transition-colors ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-500 group-hover:text-gray-700"
                  }`}
                >
                  {name}
                </p>
              </FlexColumn>
            );
          })}
        </FlexRow>
      </FlexColumn>
    </div>
  );
}
