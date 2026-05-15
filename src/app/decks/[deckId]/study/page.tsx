import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getCardsByDeck } from "@/db/queries/cards";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StudySession } from "./StudySession";

export default async function StudyPage({
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
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-10">
      <div className="flex items-center gap-3">
        <Link
          href={`/decks/${deckIdNum}`}
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          ← Back to Deck
        </Link>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{deck.name}</h1>
        <p className="text-sm text-muted-foreground">Study mode</p>
      </div>

      {cards.length === 0 ? (
        <Card className="flex flex-1 flex-col items-center justify-center border-dashed py-24 text-center">
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-lg font-medium">No cards to study</p>
            <p className="text-sm text-muted-foreground">
              Add some cards to this deck before studying.
            </p>
            <Link
              href={`/decks/${deckIdNum}`}
              className={buttonVariants({ variant: "default" })}
            >
              Go to Deck
            </Link>
          </CardContent>
        </Card>
      ) : (
        <StudySession deckId={deckIdNum} deckName={deck.name} cards={cards} />
      )}
    </main>
  );
}
