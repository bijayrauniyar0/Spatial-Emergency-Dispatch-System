"use client";

import { AlertCircle, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/primitives/dialog";
import { FlexColumn } from "@/components/ui/layouts";
import useAuthStore from "@/store/auth";

import { useActiveIncident } from "../hooks/useActiveIncident";
import { useIncidentStream } from "../hooks/useIncidentStream";
import { EmergencyRequestForm } from "./EmergencyRequestForm";

export const EmergencyButton: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { activeIncident } = useActiveIncident();
  useIncidentStream();
  const { userProfile } = useAuthStore();

  // Only show button for citizens (including unauthenticated users)
  if (userProfile?.role === "admin" || userProfile?.role === "responder") {
    return null;
  }

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 left-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg hover:bg-red-700"
        >
          <AlertCircle className="size-8" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl">
        {!activeIncident ? (
          <EmergencyRequestForm onSuccess={handleFormSuccess} />
        ) : (
          <FlexColumn className="gap-6">
            <div className="flex items-center justify-between">
              <div>
                {activeIncident.Responder?.id ? (
                  <>
                    <h2 className="text-2xl font-bold">Responder Assigned</h2>
                    <p className="text-muted-foreground text-sm">
                      Your request has been accepted. Help is on the way.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold">Request Submitted</h2>
                    <p className="text-muted-foreground text-sm">
                      Waiting for a responder to accept your request.
                    </p>
                  </>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="bg-muted space-y-3 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {activeIncident.category}
                </div>
                <div>
                  <p className="font-semibold">
                    {activeIncident.Station?.name}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {activeIncident.Station?.category}
                  </p>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-muted-foreground text-xs">Status</p>
                <p className="font-medium capitalize">
                  {activeIncident.status}
                </p>
              </div>

              {/* Show responder details when claimed */}
              {(activeIncident.status === "RESPONDING" ||
                activeIncident.status === "ARRIVED") &&
                (activeIncident as any).Responder && (
                  <>
                    <div className="border-t pt-3">
                      <p className="text-muted-foreground text-xs">
                        Assigned Responder
                      </p>
                      <p className="font-semibold">
                        {(activeIncident as any).Responder?.User?.name ||
                          "Responder"}
                      </p>
                      {(activeIncident as any).Responder?.User?.number && (
                        <p className="text-sm text-gray-600">
                          {(activeIncident as any).Responder.User.number}
                        </p>
                      )}
                    </div>
                    {activeIncident.accepted_at && (
                      <div className="border-t pt-3">
                        <p className="text-muted-foreground text-xs">
                          Accepted At
                        </p>
                        <p className="text-sm">
                          {new Date(
                            activeIncident.accepted_at,
                          ).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </>
                )}
            </div>

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-950/20">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {activeIncident.status === "PENDING"
                  ? "⏱️ Waiting for a responder to claim your request."
                  : activeIncident.status === "RESPONDING"
                    ? "🚗 A responder has been notified and is on the way. Stay safe and keep your location handy."
                    : activeIncident.status === "ARRIVED"
                      ? "📍 Responder has arrived at your location."
                      : "✓ Request completed."}
              </p>
            </div>

            <Button onClick={() => setIsDialogOpen(false)} className="w-full">
              Got it
            </Button>
          </FlexColumn>
        )}
      </DialogContent>
    </Dialog>
  );
};
