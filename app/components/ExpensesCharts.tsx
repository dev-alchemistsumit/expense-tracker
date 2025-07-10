import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import type { Expense } from "~/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

type Props = {
  expenses: Expense[];
};

export default function ExpensesCharts({ expenses }: Props) {
  const categoryTotals: { [key: string]: number } = {};

  for (const expense of expenses) {
    categoryTotals[expense.category] =
      (categoryTotals[expense.category] || 0) + expense.amount;
  }

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Amount Spent",
        data,
        backgroundColor: [
          "#2563eb", // blue
          "#10b981", // green
          "#f97316", // orange
          "#ef4444", // red
        ],
      },
    ],
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Expense Charts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium mb-2">Bar Chart</h3>
          <Bar data={chartData} />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Pie Chart</h3>
          <Pie data={chartData} />
        </div>
      </div>
    </div>
  );
}
