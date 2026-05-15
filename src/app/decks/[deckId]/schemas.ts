import { z } from "zod";

export const createCardSchema = z.object({
  front: z.string().min(1, "Front is required"),
  back: z.string().min(1, "Back is required"),
});

export type CreateCardInput = z.infer<typeof createCardSchema>;

export const updateCardSchema = z.object({
  front: z.string().min(1, "Front is required"),
  back: z.string().min(1, "Back is required"),
});

export type UpdateCardInput = z.infer<typeof updateCardSchema>;

export const updateDeckSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export type UpdateDeckInput = z.infer<typeof updateDeckSchema>;
