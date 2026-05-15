"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createCardAction } from "./actions";

interface AddCardDialogProps {
  deckId: number;
}

export function AddCardDialog({ deckId }: AddCardDialogProps) {
  const [open, setOpen] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) {
      setFront("");
      setBack("");
      setError(null);
    }
  }

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const result = await createCardAction(deckId, { front, back });
      if (result.success) {
        handleOpenChange(false);
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>Add Card</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
          <DialogDescription>
            Create a new flashcard for this deck. Add content for both the front
            and back of the card.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Textarea
              id="front"
              placeholder="Enter front of card"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="back">Back</Label>
            <Textarea
              id="back"
              placeholder="Enter back of card"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              disabled={isPending}
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
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Creating..." : "Create Card"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
