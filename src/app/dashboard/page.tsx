import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { decksTable } from "@/db/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const decks = await db
    .select()
    .from(decksTable)
    .where(eq(decksTable.clerkUserId, userId));

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Decks</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {decks.length} {decks.length === 1 ? "deck" : "decks"}
          </p>
        </div>
        <Button>New Deck</Button>
      </div>

      {decks.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border py-24 text-center">
          <p className="text-lg font-medium">No decks yet</p>
          <p className="text-sm text-muted-foreground">
            Create your first deck to start studying.
          </p>
          <Button>New Deck</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <Card
              key={deck.id}
              className="cursor-pointer transition-colors hover:bg-accent"
            >
              <CardHeader>
                <CardTitle className="line-clamp-1">{deck.name}</CardTitle>
                {deck.description && (
                  <CardDescription className="line-clamp-2">
                    {deck.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Created{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(deck.createdAt))}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
