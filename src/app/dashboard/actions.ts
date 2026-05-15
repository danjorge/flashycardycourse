"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createDeck, deleteDeck, getDecksByUser } from "@/db/queries/decks";
import { createDeckSchema, type CreateDeckInput } from "./schemas";

const FREE_DECK_LIMIT = 3;

export async function createDeckAction(input: CreateDeckInput) {
  const { userId, has } = await auth();
  if (!userId) return { success: false, error: "Unauthenticated" } as const;

  const parsed = createDeckSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, error: parsed.error.flatten() } as const;

  const hasUnlimitedDecks = has({ feature: "unlimited_decks" });
  if (!hasUnlimitedDecks) {
    const existingDecks = await getDecksByUser(userId);
    if (existingDecks.length >= FREE_DECK_LIMIT) {
      return {
        success: false,
        error: `Free plan is limited to ${FREE_DECK_LIMIT} decks. Upgrade to Pro for unlimited decks.`,
      } as const;
    }
  }

  const [deck] = await createDeck(userId, parsed.data.name, parsed.data.description);

  revalidatePath("/dashboard");
  redirect(`/decks/${deck.id}`);
}

export async function deleteDeckAction(deckId: number) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthenticated" } as const;

  await deleteDeck(deckId, userId);

  revalidatePath("/dashboard");
  return { success: true } as const;
}
