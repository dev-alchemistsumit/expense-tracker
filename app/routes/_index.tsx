// app/routes/index.tsx
import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { readExpenses } from "~/lib/db.server";

export const loader: LoaderFunction = async () => {
  const expenses = await readExpenses();
  return json({ expenses });
};

export default function Index() {
  const { expenses } = useLoaderData<typeof loader>();
  const total = expenses.reduce((sum: number, e: any) => sum + Number(e.amount), 0);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>
      <div className="bg-green-500 text-white p-4">
  Tailwind is now working! ✅
</div>

      <div className="mb-4 text-lg">Total: ₹{total}</div>
      <a href="/add" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">Add Expense</a>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Description</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e: any) => (
            <tr key={e.id} className="border-t">
              <td className="p-2">{e.description}</td>
              <td>₹{e.amount}</td>
              <td>{e.category}</td>
              <td>{e.date}</td>
              <td>
                <a href={`/edit/${e.id}`} className="text-blue-600 mr-2">Edit</a>
                <Form method="post">
                  <input type="hidden" name="id" value={e.id} />
                  <button type="submit" name="_action" value="delete" className="text-red-600">Delete</button>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { ActionFunction, redirect } from "@remix-run/node";
import { deleteExpense } from "~/lib/db.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  if (form.get("_action") === "delete") {
    const id = Number(form.get("id"));
    await deleteExpense(id);
  }
  return redirect("/");
};
