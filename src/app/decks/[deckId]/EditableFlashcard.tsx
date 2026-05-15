"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Pencil, Trash2 } from "lucide-react";
import { updateCardAction, deleteCardAction } from "./actions";

interface EditableFlashcardProps {
  cardId: number;
  deckId: number;
  front: string;
  back: string;
}

export function EditableFlashcard({
  cardId,
  deckId,
  front,
  back,
}: EditableFlashcardProps) {
  const [open, setOpen] = useState(false);
  const [frontValue, setFrontValue] = useState(front);
  const [backValue, setBackValue] = useState(back);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) {
      setFrontValue(front);
      setBackValue(back);
      setError(null);
    }
  }

  function handleDelete() {
    startDeleteTransition(async () => {
      await deleteCardAction(cardId, deckId);
    });
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await updateCardAction(cardId, deckId, {
        front: frontValue,
        back: backValue,
      });
      if (result.success) {
        setOpen(false);
      } else {
        setError(
          typeof result.error === "string"
            ? result.error
            : "Please fill in both fields."
        );
      }
    });
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Front
        </CardTitle>
        <p className="text-base font-medium">{front}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 pt-0">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Back
        </p>
        <p className="text-sm text-muted-foreground">{back}</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger render={<Button variant="outline" size="sm" className="flex-1" />}>
            <Pencil className="size-3.5" />
            Edit
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Card</DialogTitle>
              <DialogDescription>
                Update the front and back content of this flashcard.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor={`front-${cardId}`}>Front</Label>
                <Textarea
                  id={`front-${cardId}`}
                  value={frontValue}
                  onChange={(e) => setFrontValue(e.target.value)}
                  disabled={isPending}
                  placeholder="Front of card"
                  rows={3}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor={`back-${cardId}`}>Back</Label>
                <Textarea
                  id={`back-${cardId}`}
                  value={backValue}
                  onChange={(e) => setBackValue(e.target.value)}
                  disabled={isPending}
                  placeholder="Back of card"
                  rows={3}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isPending}>
                {isPending ? "Saving..." : "Update"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                disabled={isDeleting}
                className="text-destructive hover:text-destructive"
              />
            }
          >
            <Trash2 className="size-3.5" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove this card?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The card will be permanently
                deleted from this deck.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
