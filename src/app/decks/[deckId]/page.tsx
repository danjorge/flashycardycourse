import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getCardsByDeck } from "@/db/queries/cards";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddCardDialog } from "./AddCardDialog";

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
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              ← Back
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{deck.name}</h1>
          {deck.description && (
            <p className="text-muted-foreground">{deck.description}</p>
          )}
          <p className="text-sm text-muted-foreground">
            {cards.length} {cards.length === 1 ? "card" : "cards"}
          </p>
        </div>
        <AddCardDialog deckId={deckIdNum} />
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
            <Card key={card.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Front
                </CardTitle>
                <p className="text-base font-medium">{card.front}</p>
              </CardHeader>
              <CardContent className="flex flex-col gap-1 pt-0">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Back
                </p>
                <p className="text-sm text-muted-foreground">{card.back}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
