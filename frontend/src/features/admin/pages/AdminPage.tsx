"use client";

import { useState } from "react";

import { Button } from "@/components/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/primitives/dialog";
import { Container, FlexColumn, FlexRow } from "@/components/ui/layouts";

import { AddStationForm } from "../components/AddStationForm";
import { StationList } from "../components/StationList";
import { useAdmin } from "../hooks/useAdmin";

export const AdminPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { stations, isLoading } = useAdmin();

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
  };

  return (
    <Container>
      <FlexColumn className="gap-8 py-8">
        <FlexRow className="items-start justify-between">
          <div className="flex-1 space-y-2">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="default">+ Add Station</Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-3xl!">
              <AddStationForm onSuccess={handleFormSuccess} />
            </DialogContent>
          </Dialog>
        </FlexRow>

        <FlexColumn className="gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Stations List</h2>
            <span className="bg-muted rounded-full px-3 py-1 text-sm font-medium">
              {stations.length} station{stations.length !== 1 ? "s" : ""}
            </span>
          </div>
          <StationList stations={stations} isLoading={isLoading} />
        </FlexColumn>
      </FlexColumn>
    </Container>
  );
};
