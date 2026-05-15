import { db } from "@/db";
import { cardsTable, decksTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function createCard(
  deckId: number,
  userId: string,
  front: string,
  back: string
) {
  const deck = await db
    .select()
    .from(decksTable)
    .where(and(eq(decksTable.id, deckId), eq(decksTable.clerkUserId, userId)))
    .then((rows) => rows[0] ?? null);

  if (!deck) return null;

  return db.insert(cardsTable).values({ deckId, front, back });
}

export async function getCardsByDeck(deckId: number, userId: string) {
  const deck = await db
    .select()
    .from(decksTable)
    .where(and(eq(decksTable.id, deckId), eq(decksTable.clerkUserId, userId)))
    .then((rows) => rows[0] ?? null);

  if (!deck) return null;

  const cards = await db
    .select()
    .from(cardsTable)
    .where(eq(cardsTable.deckId, deckId));

  return { deck, cards };
}
