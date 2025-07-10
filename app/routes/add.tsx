// app/routes/add.tsx
import { Form, redirect } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { addExpense } from "~/lib/db.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const newExpense = {
    description: form.get("description"),
    amount: Number(form.get("amount")),
    category: form.get("category"),
    date: form.get("date") || new Date().toISOString().split("T")[0],
  };
  await addExpense(newExpense);
  return redirect("/");
};

export default function Add() {
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Add Expense</h1>
      <Form method="post" className="space-y-4">
        <input name="description" required placeholder="Description" className="w-full border p-2" />
        <input name="amount" type="number" required placeholder="Amount" className="w-full border p-2" />
        <select name="category" className="w-full border p-2" required>
          <option value="">Select Category</option>
          <option>Food</option>
          <option>Transport</option>
          <option>Utilities</option>
          <option>Health</option>
        </select>
        <input name="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} className="w-full border p-2" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
      </Form>
    </div>
  );
}
