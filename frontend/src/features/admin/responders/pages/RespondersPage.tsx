"use client";

import { useState } from "react";

import { Button } from "@/components/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/primitives/dialog";
import { Container, FlexColumn, FlexRow } from "@/components/ui/layouts";

import { ResponderForm } from "../components/ResponderForm";
import { ResponderList } from "../components/ResponderList";
import { useResponders } from "../hooks/useResponders";

export const RespondersPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { responders, isLoading } = useResponders();

  const handleFormSuccess = () => setIsDialogOpen(false);

  return (
    <Container>
      <FlexColumn className="gap-4 py-4">
        <FlexRow className="items-center justify-between">
          <h2 className="text-2xl font-semibold">Responder List</h2>
          <FlexRow className="items-center gap-2">
            <span className="bg-muted rounded-full px-3 py-1 text-sm font-medium">
              {responders.length} responder
              {responders.length !== 1 ? "s" : ""}
            </span>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="default">+ Add Responder</Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-xl">
                <ResponderForm mode="create" onSuccess={handleFormSuccess} />
              </DialogContent>
            </Dialog>
          </FlexRow>
        </FlexRow>
        <ResponderList responders={responders} isLoading={isLoading} />
      </FlexColumn>
    </Container>
  );
};
