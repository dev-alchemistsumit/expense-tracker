// app/lib/db.server.ts
import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "app", "db", "expenses.json");

export async function readExpenses() {
  const data = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(data);
}

export async function writeExpenses(expenses: any[]) {
  await fs.writeFile(DB_PATH, JSON.stringify(expenses, null, 2));
}

export async function addExpense(expense: any) {
  const expenses = await readExpenses();
  expense.id = Date.now();
  expenses.push(expense);
  await writeExpenses(expenses);
}

export async function deleteExpense(id: number) {
  const expenses = await readExpenses();
  const filtered = expenses.filter(e => e.id !== id);
  await writeExpenses(filtered);
}

export async function getExpense(id: number) {
  const expenses = await readExpenses();
  return expenses.find(e => e.id === id);
}

export async function updateExpense(id: number, updated: any) {
  const expenses = await readExpenses();
  const index = expenses.findIndex(e => e.id === id);
  expenses[index] = { ...expenses[index], ...updated };
  await writeExpenses(expenses);
}
