// app/lib/db.server.ts
import fs from "fs/promises";
import path from "path";
import type { Expense } from "~/types";


const DB_PATH = path.join(process.cwd(), "app", "db", "expenses.json");

export async function readExpenses(): Promise<Expense[]> {
  const data = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(data);
}

export async function writeExpenses(expenses: Expense[]): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(expenses, null, 2));
}

export async function addExpense(expense: Omit<Expense, "id">): Promise<void> {
  const expenses = await readExpenses();
  const newExpense: Expense = {
    id: Date.now(),
    ...expense,
  };
  expenses.push(newExpense);
  await writeExpenses(expenses);
}

export async function deleteExpense(id: number): Promise<void> {
  const expenses = await readExpenses();
  const filtered = expenses.filter((e) => e.id !== id);
  await writeExpenses(filtered);
}

export async function getExpense(id: number): Promise<Expense | undefined> {
  const expenses = await readExpenses();
  return expenses.find((e) => e.id === id);
}

export async function getExpenseById(id: number): Promise<Expense | undefined> {
  const expenses = await readExpenses();
  return expenses.find((e) => e.id === id);
}

export async function updateExpense(id: number, updated: Partial<Expense>): Promise<void> {
  const expenses = await readExpenses();
  const index = expenses.findIndex((e) => e.id === id);
  if (index !== -1) {
    expenses[index] = { ...expenses[index], ...updated };
    await writeExpenses(expenses);
  }
}
