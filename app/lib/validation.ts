// app/lib/validation.ts
import { z } from "zod";

export const expenseSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().positive("Amount must be a positive number"),
  category: z.enum(["Food", "Transport", "Utilities", "Health"]),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;
