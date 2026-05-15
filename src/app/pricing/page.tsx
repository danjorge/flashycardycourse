import { PricingTable } from "@clerk/nextjs";

export default function PricingPage() {
  return (
    <main className="flex flex-col items-center gap-8 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Choose your plan</h1>
        <p className="mt-2 text-muted-foreground">
          Unlock more decks and AI-powered flashcard generation with Pro.
        </p>
      </div>
      <div className="w-full max-w-3xl">
        <PricingTable />
      </div>
    </main>
  );
}
