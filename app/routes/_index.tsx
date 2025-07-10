// app/routes/index.tsx
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Form, useSearchParams } from "@remix-run/react";
import { readExpenses } from "~/lib/db.server";
import type { Expense } from "~/types";

//Chart
import ExpensesCharts from "~/components/ExpensesCharts";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  let expenses: Expense[] = await readExpenses();

  if (category) {
    expenses = expenses.filter((e: Expense) => e.category === category);
  }
  if (from) {
    expenses = expenses.filter((e: Expense) => e.date >= from);
  }
  if (to) {
    expenses = expenses.filter((e: Expense) => e.date <= to);
  }

  return json({ expenses });
};

export default function Index() {
  const { expenses } = useLoaderData<{ expenses: Expense[] }>();
  const [searchParams] = useSearchParams();

  const successMessage = new URLSearchParams(location.search).get("success");
  const total = expenses.reduce((sum: number, e: Expense) => sum + e.amount, 0);

  const isFiltered =
    searchParams.get("category") ||
    searchParams.get("from") ||
    searchParams.get("to");

  return (
    <div className="max-w-2xl mx-auto p-4">
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
          {successMessage}
        </div>
      )}

      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Expenses</h1>
        <div className="mb-4 text-lg">Total: ₹{total}</div>
        <a
          href="/add"
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
        >
          Add Expense
        </a>
        <Form method="get" className="flex gap-2 items-end mb-6 flex-wrap">
          <select name="category" className="border p-2 rounded">
            <option value="">All Categories</option>
            <option>Food</option>
            <option>Transport</option>
            <option>Utilities</option>
            <option>Health</option>
          </select>
          <div>
            <label className="text-sm">From:</label>
            <input name="from" type="date" className="border p-2 ml-1" />
          </div>
          <div>
            <label className="text-sm">To:</label>
            <input name="to" type="date" className="border p-2 ml-1" />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Filter
          </button>
        </Form>

        {/* 🔁 See All Expenses Button */}
        {isFiltered && (
          <a
            href="/"
            className="bg-gray-400 text-white px-4 py-2 rounded inline-block mb-6"
          >
            See All Expenses
          </a>
        )}

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
                  <a href={`/edit/${e.id}`} className="text-blue-600 mr-2">
                    Edit
                  </a>
                  <Form method="post">
                    <input type="hidden" name="id" value={e.id} />
                    <button
                      type="submit"
                      name="_action"
                      value="delete"
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </Form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 🔍 Expense Charts */}
        <ExpensesCharts expenses={expenses} />
      </div>
    </div>
  );
}

//action delete expense
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
