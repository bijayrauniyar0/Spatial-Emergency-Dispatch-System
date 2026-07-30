"use client";

import { Bell } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/primitives/dialog";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/auth";

import useDashboardStore from "../store/dashboardStore";
import useUIStore from "../store/uiStore";
import { IncidentDetailView } from "./IncidentDetailView";
import { StationQueue } from "./StationQueue";

export function RequestsButton() {
  const { userProfile } = useAuthStore();
  const { queue, myTask } = useDashboardStore();
  const { isModalOpen, openModal, closeModal } = useUIStore();

  // Only show for responders
  if (userProfile?.role !== "responder") {
    return null;
  }

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => (open ? openModal() : closeModal())}
    >
      <DialogTrigger
        asChild
        className="fixed bottom-6 left-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-amber-600 shadow-lg hover:bg-amber-700"
      >
        <Button>
          <Bell className="size-6" />
          {queue.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
              {queue.length > 9 ? "9+" : queue.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-base">
            {myTask ? "Incident Detail" : "Pending Requests"}
          </DialogTitle>
        </DialogHeader>

        {myTask ? (
          <IncidentDetailView incident={myTask} />
        ) : (
          <StationQueue queue={queue} />
        )}
      </DialogContent>
    </Dialog>
  );
}
