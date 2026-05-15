"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, BookOpen, ThumbsUp, ThumbsDown } from "lucide-react";

interface FlashCard {
  id: number;
  front: string;
  back: string;
}

interface StudySessionProps {
  deckId: number;
  deckName: string;
  cards: FlashCard[];
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function StudySession({ deckId, deckName, cards: initialCards }: StudySessionProps) {
  const [cards, setCards] = useState(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const currentCard = cards[currentIndex];

  const handleFlip = useCallback(() => {
    setIsFlipped((f) => !f);
  }, []);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    if (currentIndex === cards.length - 1) {
      setCompleted(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, cards.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleCorrect = useCallback(() => {
    setCorrectCount((c) => c + 1);
    setIsFlipped(false);
    if (currentIndex === cards.length - 1) {
      setCompleted(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, cards.length]);

  const handleIncorrect = useCallback(() => {
    setIncorrectCount((c) => c + 1);
    setIsFlipped(false);
    if (currentIndex === cards.length - 1) {
      setCompleted(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, cards.length]);

  function handleShuffle() {
    setCards(shuffleArray(initialCards));
    setCurrentIndex(0);
    setIsFlipped(false);
    setCompleted(false);
    setCorrectCount(0);
    setIncorrectCount(0);
  }

  function handleRestart() {
    setCards(initialCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setCompleted(false);
    setCorrectCount(0);
    setIncorrectCount(0);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleFlip();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleFlip, handleNext, handlePrev]);

  if (completed) {
    return (
      <div className="flex flex-col items-center gap-8 py-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <BookOpen className="size-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Session complete!</h2>
          <p className="text-muted-foreground">
            You reviewed all {cards.length} card{cards.length !== 1 ? "s" : ""} in{" "}
            <span className="font-medium text-foreground">{deckName}</span>.
          </p>
          {(correctCount > 0 || incorrectCount > 0) && (
            <div className="flex items-center gap-6 text-sm mt-1">
              <span className="flex items-center gap-1.5 text-green-500">
                <ThumbsUp className="size-3.5" />
                <span className="font-semibold">{correctCount}</span>
                <span className="text-muted-foreground">correct</span>
              </span>
              <span className="text-muted-foreground/40">|</span>
              <span className="flex items-center gap-1.5 text-red-500">
                <ThumbsDown className="size-3.5" />
                <span className="font-semibold">{incorrectCount}</span>
                <span className="text-muted-foreground">incorrect</span>
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={handleRestart} title="Restart from the beginning in the original order">
            <RotateCcw className="size-4" />
            Restart
          </Button>
          <Button variant="outline" onClick={handleShuffle} title="Shuffle the cards and restart the session">
            <Shuffle className="size-4" />
            Shuffle &amp; Restart
          </Button>
          <Button
            render={<Link href={`/decks/${deckId}`} />}
            nativeButton={false}
            title="Return to the deck page"
          >
            Back to Deck
          </Button>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-8 mx-auto">
      {/* Progress bar */}
      <div className="flex w-full items-center gap-3">
        <span className="min-w-[60px] text-sm text-muted-foreground">
          {currentIndex + 1} / {cards.length}
        </span>
        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShuffle}
          title="Shuffle cards"
          className="shrink-0 gap-1.5"
        >
          <Shuffle className="size-4" />
          Shuffle
        </Button>
      </div>

      {/* Flashcard */}
      <div
        className="w-full cursor-pointer"
        style={{ perspective: "1200px" }}
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            handleFlip();
          }
        }}
        aria-label={isFlipped ? "Card back — click to flip" : "Card front — click to flip"}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: "300px",
          }}
        >
          {/* Front face */}
          <Card
            className="absolute inset-0 flex flex-col items-center justify-center p-8 select-none border-2"
            style={{ backfaceVisibility: "hidden" }}
          >
            <CardContent className="flex flex-col items-center gap-6 p-0 text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Front
              </span>
              <p className="text-xl font-medium leading-relaxed">{currentCard.front}</p>
              <span className="text-xs text-muted-foreground">Click or press Space to reveal</span>
            </CardContent>
          </Card>

          {/* Back face */}
          <Card
            className="absolute inset-0 flex flex-col items-center justify-center p-8 select-none border-2 border-primary/40 bg-primary/5"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <CardContent className="flex flex-col items-center gap-6 p-0 text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Back
              </span>
              <p className="text-xl font-medium leading-relaxed">{currentCard.back}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          title="Previous card (←)"
          className="gap-1.5"
        >
          <ChevronLeft className="size-5" />
          Prev
        </Button>
        <Button
          variant="outline"
          onClick={handleFlip}
          className="min-w-36"
          title={isFlipped ? "Hide the answer and show the front again" : "Reveal the answer for this card"}
        >
          {isFlipped ? "Hide answer" : "Reveal answer"}
        </Button>
        <Button
          variant="outline"
          onClick={handleNext}
          title={currentIndex === cards.length - 1 ? "Finish" : "Next card (→)"}
          className="gap-1.5"
        >
          {currentIndex === cards.length - 1 ? "Finish" : "Next"}
          <ChevronRight className="size-5" />
        </Button>
      </div>

      {/* Correct / Incorrect */}
      <div className="flex flex-col items-center gap-3 w-full">
        {isFlipped && (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleCorrect}
              className="gap-1.5 border-green-500/50 text-green-500 hover:bg-green-500/10 hover:text-green-400"
            >
              <ThumbsUp className="size-4" />
              Got it
            </Button>
            <Button
              variant="outline"
              onClick={handleIncorrect}
              className="gap-1.5 border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-400"
            >
              <ThumbsDown className="size-4" />
              Missed it
            </Button>
          </div>
        )}
        <div className="flex items-center gap-6 text-sm">
          <span className="flex items-center gap-1.5 text-green-500">
            <ThumbsUp className="size-3.5" />
            <span className="font-semibold">{correctCount}</span>
            <span className="text-muted-foreground">correct</span>
          </span>
          <span className="text-muted-foreground/40">|</span>
          <span className="flex items-center gap-1.5 text-red-500">
            <ThumbsDown className="size-3.5" />
            <span className="font-semibold">{incorrectCount}</span>
            <span className="text-muted-foreground">incorrect</span>
          </span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Space to flip &middot; ← → to navigate
      </p>
    </div>
  );
}
