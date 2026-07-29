"use client";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/primitives/alert-dialog";
import { Button } from "@/components/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/primitives/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/primitives/table";
import { FlexColumn, FlexRow } from "@/components/ui/layouts";

import { useResponderStore } from "../store/responderStore";
import { Responder } from "../types";
import { ResponderForm } from "./ResponderForm";

interface ResponderListProps {
  responders: Responder[];
  isLoading?: boolean;
}

export const ResponderList: React.FC<ResponderListProps> = ({
  responders,
  isLoading = false,
}) => {
  const [editingResponder, setEditingResponder] = useState<Responder | null>(
    null,
  );
  const [deletingResponder, setDeletingResponder] = useState<Responder | null>(
    null,
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { removeResponder } = useResponderStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "BUSY":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "OFF_DUTY":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handleDelete = async () => {
    if (deletingResponder) {
      try {
        await removeResponder(deletingResponder.id);
        setDeletingResponder(null);
      } catch (error) {
        console.error("Failed to delete responder:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <FlexColumn className="w-full items-center justify-center py-8">
        <p className="text-muted-foreground">Loading responders...</p>
      </FlexColumn>
    );
  }

  if (responders.length === 0) {
    return (
      <FlexColumn className="w-full items-center justify-center py-8">
        <p className="text-muted-foreground">No responders found</p>
      </FlexColumn>
    );
  }

  return (
    <>
      <FlexColumn className="scrollbar h-[calc(100vh-14rem)] w-full gap-4 overflow-y-auto bg-white">
        <Table containerClassName="border rounded-lg">
          <TableHeader className="sticky top-0 bg-white">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Station</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responders.map((responder) => (
              <TableRow key={responder.id}>
                <TableCell className="py-4 font-medium">
                  {responder.name}
                </TableCell>
                <TableCell className="text-sm">{responder.email}</TableCell>
                <TableCell className="text-sm">
                  {responder.number || "-"}
                </TableCell>
                <TableCell className="text-sm">
                  <span className="font-medium">{responder.station_name}</span>
                  <span className="text-muted-foreground ml-2">
                    ({responder.station_category})
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                      responder.status,
                    )}`}
                  >
                    {responder.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <FlexRow className="justify-end gap-2">
                    <Dialog
                      open={isEditDialogOpen}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingResponder(responder)}
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      {editingResponder && (
                        <DialogContent className="w-full max-w-xl">
                          <ResponderForm
                            mode="edit"
                            initialData={editingResponder}
                            onSuccess={() => {
                              setIsEditDialogOpen(false);
                              setEditingResponder(null);
                            }}
                          />
                        </DialogContent>
                      )}
                    </Dialog>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeletingResponder(responder)}
                    >
                      Delete
                    </Button>
                  </FlexRow>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </FlexColumn>

      <AlertDialog
        open={deletingResponder !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingResponder(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Delete Responder</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {deletingResponder?.name}? This
            action cannot be undone. The responder's account will be removed
            from the system.
          </AlertDialogDescription>
          <FlexRow className="justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </FlexRow>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
