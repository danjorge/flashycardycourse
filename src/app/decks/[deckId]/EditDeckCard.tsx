"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
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
import { updateDeckAction } from "./actions";

interface EditDeckCardProps {
  deckId: number;
  name: string;
  description?: string | null;
  cardCount: number;
}

export function EditDeckCard({
  deckId,
  name,
  description,
  cardCount,
}: EditDeckCardProps) {
  const [open, setOpen] = useState(false);
  const [nameValue, setNameValue] = useState(name);
  const [descriptionValue, setDescriptionValue] = useState(description ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) {
      setNameValue(name);
      setDescriptionValue(description ?? "");
      setError(null);
    }
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await updateDeckAction(deckId, {
        name: nameValue,
        description: descriptionValue || undefined,
      });
      if (result.success) {
        setOpen(false);
      } else {
        setError(
          typeof result.error === "string"
            ? result.error
            : "Please check the fields."
        );
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{name}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {cardCount} {cardCount === 1 ? "card" : "cards"}
        </p>
      </CardContent>
      <CardFooter>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger render={<Button variant="outline" size="sm" />}>
            Edit
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Deck</DialogTitle>
              <DialogDescription>
                Update the name and description for this deck.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="deck-name">Name</Label>
                <Input
                  id="deck-name"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  disabled={isPending}
                  placeholder="Deck name"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="deck-description">Description</Label>
                <Textarea
                  id="deck-description"
                  value={descriptionValue}
                  onChange={(e) => setDescriptionValue(e.target.value)}
                  disabled={isPending}
                  placeholder="Optional description"
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
      </CardFooter>
    </Card>
  );
}
