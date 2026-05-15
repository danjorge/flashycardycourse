"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createCard, updateCard, deleteCard } from "@/db/queries/cards";
import { updateDeck } from "@/db/queries/decks";
import {
  createCardSchema,
  updateCardSchema,
  updateDeckSchema,
  type CreateCardInput,
  type UpdateCardInput,
  type UpdateDeckInput,
} from "./schemas";

export async function createCardAction(deckId: number, input: CreateCardInput) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthenticated" } as const;

  const parsed = createCardSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, error: parsed.error.flatten() } as const;

  const result = await createCard(
    deckId,
    userId,
    parsed.data.front,
    parsed.data.back
  );

  if (!result) return { success: false, error: "Deck not found" } as const;

  revalidatePath(`/decks/${deckId}`);
  return { success: true } as const;
}

export async function updateCardAction(
  cardId: number,
  deckId: number,
  input: UpdateCardInput
) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthenticated" } as const;

  const parsed = updateCardSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, error: parsed.error.flatten() } as const;

  const result = await updateCard(cardId, deckId, userId, parsed.data);
  if (!result) return { success: false, error: "Card not found" } as const;

  revalidatePath(`/decks/${deckId}`);
  return { success: true } as const;
}

export async function deleteCardAction(cardId: number, deckId: number) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthenticated" } as const;

  const result = await deleteCard(cardId, deckId, userId);
  if (!result) return { success: false, error: "Card not found" } as const;

  revalidatePath(`/decks/${deckId}`);
  return { success: true } as const;
}

export async function updateDeckAction(
  deckId: number,
  input: UpdateDeckInput
) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthenticated" } as const;

  const parsed = updateDeckSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, error: parsed.error.flatten() } as const;

  await updateDeck(deckId, userId, parsed.data);

  revalidatePath(`/decks/${deckId}`);
  return { success: true } as const;
}
