"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
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
import { BookOpen, Pencil } from "lucide-react";
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
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <CardTitle className="text-2xl">{name}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="-mt-1 -mr-2 shrink-0"
                title="Edit deck"
              />
            }
          >
            <Pencil className="size-4" />
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
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {cardCount} {cardCount === 1 ? "card" : "cards"}
        </p>
      </CardContent>
      {cardCount > 0 && (
        <CardFooter>
          <Button
            render={<Link href={`/decks/${deckId}/study`} />}
            nativeButton={false}
            className="w-full"
            title="Start a study session for this deck"
          >
            <BookOpen className="size-4" />
            Study
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
