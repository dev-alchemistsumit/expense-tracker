// app/routes/add.tsx
import { Form, useActionData, redirect } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { addExpense } from "~/lib/db.server";
import { expenseSchema } from "~/lib/validation";
import type { z } from "zod";

// Types for action data
type ActionData = {
  errors?: z.inferFlattenedErrors<typeof expenseSchema>["fieldErrors"];
  values?: Record<string, string>;
};

export const action: ActionFunction = async ({ request }) => {
  const form = Object.fromEntries(await request.formData());
  const parsed = expenseSchema.safeParse(form);

  if (!parsed.success) {
    return json<ActionData>(
      {
        errors: parsed.error.flatten().fieldErrors,
        values: form,
      },
      { status: 400 }
    );
  }

  await addExpense(parsed.data);
  return redirect("/");
};

export default function Add() {
  const actionData = useActionData<ActionData>();
  const values = actionData?.values ?? {};

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Add Expense</h1>

      {actionData?.errors && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
          Please correct the errors below and try again.
        </div>
      )}

      <Form method="post" className="space-y-4">
        {/* Description */}
        <div>
          <input
            name="description"
            defaultValue={values.description}
            placeholder="Description"
            aria-invalid={!!actionData?.errors?.description}
            aria-describedby={
              actionData?.errors?.description ? "description-error" : undefined
            }
            className={`w-full border p-2 ${
              actionData?.errors?.description ? "border-red-500" : ""
            }`}
          />
          {actionData?.errors?.description && (
            <p id="description-error" className="text-red-500 text-sm">
              {actionData.errors.description[0]}
            </p>
          )}
        </div>

        {/* Amount */}
        <div>
          <input
            name="amount"
            type="number"
            defaultValue={values.amount}
            placeholder="Amount"
            aria-invalid={!!actionData?.errors?.amount}
            aria-describedby={
              actionData?.errors?.amount ? "amount-error" : undefined
            }
            className={`w-full border p-2 ${
              actionData?.errors?.amount ? "border-red-500" : ""
            }`}
          />
          {actionData?.errors?.amount && (
            <p id="amount-error" className="text-red-500 text-sm">
              {actionData.errors.amount[0]}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <select
            name="category"
            defaultValue={values.category}
            aria-invalid={!!actionData?.errors?.category}
            aria-describedby={
              actionData?.errors?.category ? "category-error" : undefined
            }
            className={`w-full border p-2 ${
              actionData?.errors?.category ? "border-red-500" : ""
            }`}
          >
            <option value="">Select Category</option>
            <option>Food</option>
            <option>Transport</option>
            <option>Utilities</option>
            <option>Health</option>
          </select>
          {actionData?.errors?.category && (
            <p id="category-error" className="text-red-500 text-sm">
              {actionData.errors.category[0]}
            </p>
          )}
        </div>

        {/* Date */}
        <div>
          <input
            name="date"
            type="date"
            defaultValue={
              values.date || new Date().toISOString().split("T")[0]
            }
            aria-invalid={!!actionData?.errors?.date}
            aria-describedby={
              actionData?.errors?.date ? "date-error" : undefined
            }
            className={`w-full border p-2 ${
              actionData?.errors?.date ? "border-red-500" : ""
            }`}
          />
          {actionData?.errors?.date && (
            <p id="date-error" className="text-red-500 text-sm">
              {actionData.errors.date[0]}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </Form>
    </div>
  );
}
