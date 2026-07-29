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
        <FlexColumn className="gap-4">
          <FlexRow className="items-center justify-between">
            <h2 className="text-2xl font-semibold">Stations List</h2>
            <FlexRow className="items-center gap-2">
              <span className="bg-muted rounded-full px-3 py-1 text-sm font-medium">
                {stations.length} station{stations.length !== 1 ? "s" : ""}
              </span>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="default">+ Add Station</Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-3xl!">
                  <AddStationForm onSuccess={handleFormSuccess} />
                </DialogContent>
              </Dialog>
            </FlexRow>
          </FlexRow>
          <StationList stations={stations} isLoading={isLoading} />
        </FlexColumn>
      </FlexColumn>
    </Container>
  );
};
