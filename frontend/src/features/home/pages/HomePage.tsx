"use client";

import MapComponent from "@/components/common/Map";
import { EmergencyButton } from "@/features/incident/components/EmergencyButton";

import { ChipsFilter } from "../components/ChipsFilter";
import { StationsLayer } from "../components/StationsLayer";
import { UserLocation } from "../components/UserLocation";

export const HomePage: React.FC = () => {
  return (
    <div className="relative h-full w-full">
      <ChipsFilter />
      <EmergencyButton />
      <MapComponent
        mapOptions={{
          center: [85.324, 27.7172],
          zoom: 11,
        }}
      >
        <StationsLayer />
        <UserLocation />
      </MapComponent>
    </div>
  );
};
