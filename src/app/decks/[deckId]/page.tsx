import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getCardsByDeck } from "@/db/queries/cards";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { AddCardDialog } from "./AddCardDialog";
import { EditDeckCard } from "./EditDeckCard";
import { EditableFlashcard } from "./EditableFlashcard";

export default async function DeckPage({
  params,
}: {
  params: Promise<{ deckId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { deckId } = await params;
  const deckIdNum = Number(deckId);
  if (isNaN(deckIdNum)) notFound();

  const result = await getCardsByDeck(deckIdNum, userId);
  if (!result) notFound();

  const { deck, cards } = result;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          ← Back
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <EditDeckCard
          deckId={deckIdNum}
          name={deck.name}
          description={deck.description}
          cardCount={cards.length}
        />
        <div className="flex items-center justify-end gap-2">
          <AddCardDialog deckId={deckIdNum} />
        </div>
      </div>

      {cards.length === 0 ? (
        <Card className="flex flex-1 flex-col items-center justify-center border-dashed py-24 text-center">
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-lg font-medium">No cards yet</p>
            <p className="text-sm text-muted-foreground">
              Add your first card to start studying.
            </p>
            <AddCardDialog deckId={deckIdNum} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <EditableFlashcard
              key={card.id}
              cardId={card.id}
              deckId={deckIdNum}
              front={card.front}
              back={card.back}
            />
          ))}
        </div>
      )}
    </main>
  );
}
