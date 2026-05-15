"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createDeckAction } from "./actions";
import type { CreateDeckInput } from "./schemas";

export function CreateDeckDialog({ atLimit = false }: { atLimit?: boolean }) {
  if (atLimit) {
    return (
      <Button render={<Link href="/pricing" />} nativeButton={false}>Upgrade to Pro</Button>
    );
  }
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(next: boolean) {
    if (!next) {
      setName("");
      setDescription("");
      setError(null);
    }
    setOpen(next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createDeckAction({
        name,
        description: description || undefined,
      });

      if (result && !result.success) {
        const msg =
          typeof result.error === "string"
            ? result.error
            : result.error.formErrors?.[0] ??
              Object.values(result.error.fieldErrors ?? {})[0]?.[0] ??
              "Something went wrong.";
        setError(msg);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>New Deck</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a new deck</DialogTitle>
            <DialogDescription>
              Give your deck a name and an optional description.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="deck-name">Name</Label>
              <Input
                id="deck-name"
                placeholder="e.g. Spanish Vocabulary"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isPending}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="deck-description">
                Description{" "}
                <span className="text-muted-foreground text-xs font-normal">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="deck-description"
                placeholder="What is this deck about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                disabled={isPending}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !name.trim()}>
              {isPending ? "Creating…" : "Create Deck"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
