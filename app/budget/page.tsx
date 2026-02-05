import db from "@/lib/db";
import { DollarSign, Plus } from "lucide-react";
import { redirect } from "next/navigation";

async function addExpense(formData: FormData) {
  "use server";
  const item = formData.get("item");
  const category = formData.get("category");
  const estimated_cost = formData.get("estimated_cost");
  const actual_cost = formData.get("actual_cost");
  const vendor = formData.get("vendor");
  
  db.prepare(
    "INSERT INTO expenses (item, category, estimated_cost, actual_cost, vendor) VALUES (?, ?, ?, ?, ?)"
  ).run(item, category, estimated_cost, actual_cost, vendor);
  redirect("/budget");
}

const categories = ["Venue", "Catering", "Photography", "Music", "Flowers", "Attire", "Invitations", "Decor", "Other"];

export default function BudgetPage() {
  const expenses = db.prepare("SELECT * FROM expenses ORDER BY category").all();
  
  const totalEstimated = expenses.reduce((sum: number, e: any) => sum + (e.estimated_cost || 0), 0);
  const totalActual = expenses.reduce((sum: number, e: any) => sum + (e.actual_cost || 0), 0);
  const totalPaid = expenses.filter((e: any) => e.paid).reduce((sum: number, e: any) => sum + (e.actual_cost || 0), 0);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Wedding Budget</h2>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200">
          <p className="text-3xl font-bold text-blue-700">${totalEstimated.toLocaleString()}</p>
          <p className="text-sm text-blue-600">Estimated Total</p>
        </div>
        <div className="bg-rose-50 p-6 rounded-lg shadow-md border border-rose-200">
          <p className="text-3xl font-bold text-rose-700">${totalActual.toLocaleString()}</p>
          <p className="text-sm text-rose-600">Actual Total</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200">
          <p className="text-3xl font-bold text-green-700">${totalPaid.toLocaleString()}</p>
          <p className="text-sm text-green-600">Paid So Far</p>
        </div>
      </div>

      {/* Add Expense */}
      <form action={addExpense} className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Expense
        </h3>
        <div className="grid grid-cols-6 gap-4">
          <input
            type="text"
            name="item"
            placeholder="Item/Service"
            required
            className="border rounded-lg px-4 py-2"
          />
          <select name="category" className="border rounded-lg px-4 py-2">
            <option value="">Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="number"
            name="estimated_cost"
            placeholder="Estimated $"
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="number"
            name="actual_cost"
            placeholder="Actual $"
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="text"
            name="vendor"
            placeholder="Vendor"
            className="border rounded-lg px-4 py-2"
          />
          <button
            type="submit"
            className="bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700"
          >
            Add
          </button>
        </div>
      </form>

      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">All Expenses</h3>
        {expenses.length === 0 ? (
          <p className="text-gray-500">No expenses added yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Item</th>
                <th className="text-left py-3">Category</th>
                <th className="text-right py-3">Estimated</th>
                <th className="text-right py-3">Actual</th>
                <th className="text-left py-3">Vendor</th>
                <th className="text-center py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense: any) => (
                <tr key={expense.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{expense.item}</td>
                  <td className="py-3">{expense.category}</td>
                  <td className="py-3 text-right">
                    {expense.estimated_cost ? `$${expense.estimated_cost.toLocaleString()}` : "-"}
                  </td>
                  <td className="py-3 text-right font-semibold">
                    {expense.actual_cost ? `$${expense.actual_cost.toLocaleString()}` : "-"}
                  </td>
                  <td className="py-3">{expense.vendor || "-"}</td>
                  <td className="py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      expense.paid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {expense.paid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
