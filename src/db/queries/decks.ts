import { db } from "@/db";
import { decksTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getDecksByUser(userId: string) {
  return db
    .select()
    .from(decksTable)
    .where(eq(decksTable.clerkUserId, userId));
}

export async function getDeckById(deckId: number, userId: string) {
  return db
    .select()
    .from(decksTable)
    .where(and(eq(decksTable.id, deckId), eq(decksTable.clerkUserId, userId)))
    .then((rows) => rows[0] ?? null);
}

export async function createDeck(
  userId: string,
  name: string,
  description?: string,
) {
  return db
    .insert(decksTable)
    .values({ clerkUserId: userId, name, description });
}

export async function updateDeck(
  deckId: number,
  userId: string,
  patch: { name?: string; description?: string },
) {
  return db
    .update(decksTable)
    .set(patch)
    .where(and(eq(decksTable.id, deckId), eq(decksTable.clerkUserId, userId)));
}

export async function deleteDeck(deckId: number, userId: string) {
  return db
    .delete(decksTable)
    .where(and(eq(decksTable.id, deckId), eq(decksTable.clerkUserId, userId)));
}
