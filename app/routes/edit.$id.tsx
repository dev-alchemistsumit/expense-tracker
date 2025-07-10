// app/routes/edit.$id.tsx
import { useLoaderData, Form, redirect } from "@remix-run/react";
import { LoaderFunction, ActionFunction } from "@remix-run/node";
import { getExpense, updateExpense } from "~/lib/db.server";

export const loader: LoaderFunction = async ({ params }) => {
  const id = Number(params.id);
  const expense = await getExpense(id);
  return { expense };
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  const updated = {
    description: form.get("description"),
    amount: Number(form.get("amount")),
    category: form.get("category"),
    date: form.get("date"),
  };
  await updateExpense(Number(params.id), updated);
  return redirect("/");
};

export default function Edit() {
  const { expense } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Edit Expense</h1>
      <Form method="post" className="space-y-4">
        <input name="description" defaultValue={expense.description} required className="w-full border p-2" />
        <input name="amount" type="number" defaultValue={expense.amount} required className="w-full border p-2" />
        <select name="category" defaultValue={expense.category} className="w-full border p-2" required>
          <option>Food</option>
          <option>Transport</option>
          <option>Utilities</option>
          <option>Health</option>
        </select>
        <input name="date" type="date" defaultValue={expense.date} className="w-full border p-2" />
        <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded">Update</button>
      </Form>
    </div>
  );
}
