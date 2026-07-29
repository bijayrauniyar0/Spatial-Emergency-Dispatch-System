"use client";

import { useState } from "react";
import { AlertCircle, X } from "lucide-react";

import { Button } from "@/components/primitives/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/primitives/dialog";
import { FlexColumn, FlexRow } from "@/components/ui/layouts";

import { EmergencyRequestForm } from "./EmergencyRequestForm";
import { useActiveIncident } from "../hooks/useActiveIncident";

export const EmergencyButton: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { activeIncident, isLoading } = useActiveIncident();

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-6 right-6 z-40 bg-red-600 hover:bg-red-700 shadow-lg rounded-full h-16 w-16 flex items-center justify-center"
          >
            <AlertCircle className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-2xl">
          {!activeIncident ? (
            <EmergencyRequestForm onSuccess={handleFormSuccess} />
          ) : (
            <FlexColumn className="gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Request Submitted</h2>
                  <p className="text-muted-foreground text-sm">
                    We're finding the nearest responder for you.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDialogOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="bg-muted rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full px-3 py-1 text-sm font-medium mt-0.5">
                    {activeIncident.category}
                  </div>
                  <div>
                    <p className="font-semibold">{activeIncident.Station?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {activeIncident.Station?.category}
                    </p>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{activeIncident.status}</p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⏱️ A responder has been notified and is on the way. Stay safe and
                  keep your location handy.
                </p>
              </div>

              <Button
                onClick={() => setIsDialogOpen(false)}
                className="w-full"
              >
                Got it
              </Button>
            </FlexColumn>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
