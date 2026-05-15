import { z } from "zod";

export const createCardSchema = z.object({
  front: z.string().min(1, "Front is required"),
  back: z.string().min(1, "Back is required"),
});

export type CreateCardInput = z.infer<typeof createCardSchema>;
