"use client";

import { useTransition } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteImage } from "@/lib/actions/image.action";

import { Button } from "../ui/button";

export const DeleteConfirmation = ({ imageId }: { imageId: string }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="w-full rounded-full">
        <Button
          type="button"
          className="h-[44px] w-full md:h-[54px] bg-red-600 text-white hover:bg-red-700"
          variant="destructive"
        >
          Delete Image
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="flex flex-col gap-10 bg-gray-900 text-white rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold">
            Are you sure you want to delete this image?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            This will permanently delete this image.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="bg-gray-800">
          <AlertDialogCancel className="bg-gray-700 text-gray-300 hover:bg-gray-600">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() =>
              startTransition(async () => {
                await deleteImage(imageId);
              })
            }
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
