"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createCard } from "@/db/queries/cards";
import { createCardSchema, type CreateCardInput } from "./schemas";

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
