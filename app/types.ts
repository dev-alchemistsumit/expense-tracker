// app/types.ts
export type Expense = {
  id: number;
  description: string;
  amount: number;
  category: "Food" | "Transport" | "Utilities" | "Health";
  date: string;
};
