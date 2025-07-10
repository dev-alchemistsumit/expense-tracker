// app/routes/edit.$id.tsx
import { useLoaderData, Form, useActionData, redirect } from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getExpenseById, updateExpense } from "~/lib/db.server";
import { expenseSchema } from "~/lib/validation";
import type { Expense } from "~/types";

export const loader: LoaderFunction = async ({ params }) => {
  const id = Number(params.id);
  const expense = await getExpenseById(id);
  if (!expense) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ expense });
};

export const action: ActionFunction = async ({ request, params }) => {
  const id = Number(params.id);
  const form = Object.fromEntries(await request.formData());
  const parsed = expenseSchema.safeParse(form);

  if (!parsed.success) {
    return json(
      { errors: parsed.error.flatten().fieldErrors, values: form },
      { status: 400 }
    );
  }

  await updateExpense(id, parsed.data);
  return redirect(`/?success=Expense+updated!`);
};

export default function EditExpense() {
  const { expense } = useLoaderData<{ expense: Expense }>();
  const actionData = useActionData<typeof action>();
  const values = actionData?.values ?? expense;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Edit Expense</h1>
      <Form method="post" className="space-y-4">
        <div>
          <input
            name="description"
            defaultValue={values.description}
            placeholder="Description"
            className="w-full border p-2"
          />
          {actionData?.errors?.description && (
            <p className="text-red-500 text-sm mt-1">{actionData.errors.description[0]}</p>
          )}
        </div>

        <div>
          <input
            name="amount"
            type="number"
            defaultValue={values.amount}
            placeholder="Amount"
            className="w-full border p-2"
          />
          {actionData?.errors?.amount && (
            <p className="text-red-500 text-sm mt-1">{actionData.errors.amount[0]}</p>
          )}
        </div>

        <div>
          <select
            name="category"
            defaultValue={values.category}
            className="w-full border p-2"
          >
            <option value="">Select Category</option>
            <option>Food</option>
            <option>Transport</option>
            <option>Utilities</option>
            <option>Health</option>
          </select>
          {actionData?.errors?.category && (
            <p className="text-red-500 text-sm mt-1">{actionData.errors.category[0]}</p>
          )}
        </div>

        <div>
          <input
            name="date"
            type="date"
            defaultValue={values.date}
            className="w-full border p-2"
          />
          {actionData?.errors?.date && (
            <p className="text-red-500 text-sm mt-1">{actionData.errors.date[0]}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </Form>
    </div>
  );
}
