"use client";

import { useState, useEffect } from "react";

export default function BudgetPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [newExpense, setNewExpense] = useState({
    item: "",
    category: "",
    estimated_cost: "",
    actual_cost: "",
    vendor: "",
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("expenses") || "[]");
    setExpenses(stored);
  }, []);

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const expense = {
      id: Date.now().toString(),
      ...newExpense,
      estimated_cost: parseFloat(newExpense.estimated_cost) || 0,
      actual_cost: parseFloat(newExpense.actual_cost) || 0,
      paid: false,
    };
    const updated = [...expenses, expense];
    setExpenses(updated);
    localStorage.setItem("expenses", JSON.stringify(updated));
    setNewExpense({ item: "", category: "", estimated_cost: "", actual_cost: "", vendor: "" });
  };

  const togglePaid = (id: string) => {
    const updated = expenses.map((e) =>
      e.id === id ? { ...e, paid: !e.paid } : e
    );
    setExpenses(updated);
    localStorage.setItem("expenses", JSON.stringify(updated));
  };

  const totalEstimated = expenses.reduce((sum, e) => sum + (e.estimated_cost || 0), 0);
  const totalActual = expenses.reduce((sum, e) => sum + (e.actual_cost || 0), 0);
  const totalPaid = expenses.filter((e) => e.paid).reduce((sum, e) => sum + (e.actual_cost || 0), 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold">Wedding Budget</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-blue-50 p-4 md:p-6 rounded-lg shadow-md">
          <p className="text-xl md:text-3xl font-bold text-blue-700">${totalEstimated.toLocaleString()}</p>
          <p className="text-xs md:text-sm text-blue-600">Estimated Total</p>
        </div>
        <div className="bg-rose-50 p-4 md:p-6 rounded-lg shadow-md">
          <p className="text-xl md:text-3xl font-bold text-rose-700">${totalActual.toLocaleString()}</p>
          <p className="text-xs md:text-sm text-rose-600">Actual Total</p>
        </div>
        <div className="bg-green-50 p-4 md:p-6 rounded-lg shadow-md">
          <p className="text-xl md:text-3xl font-bold text-green-700">${totalPaid.toLocaleString()}</p>
          <p className="text-xs md:text-sm text-green-600">Paid So Far</p>
        </div>
      </div>

      <form onSubmit={addExpense} className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold mb-4">Add Expense</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">
          <input
            type="text"
            placeholder="Item/Service"
            required
            value={newExpense.item}
            onChange={(e) => setNewExpense({ ...newExpense, item: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm md:text-base"
          />
          <select
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm md:text-base"
          >
            <option value="">Category</option>
            <option value="Venue">Venue</option>
            <option value="Catering">Catering</option>
            <option value="Photography">Photography</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="number"
            placeholder="Estimated $"
            value={newExpense.estimated_cost}
            onChange={(e) => setNewExpense({ ...newExpense, estimated_cost: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm md:text-base"
          />
          <input
            type="number"
            placeholder="Actual $"
            value={newExpense.actual_cost}
            onChange={(e) => setNewExpense({ ...newExpense, actual_cost: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm md:text-base"
          />
          <input
            type="text"
            placeholder="Vendor"
            value={newExpense.vendor}
            onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm md:text-base"
          />
          <button
            type="submit"
            className="bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 text-sm md:text-base"
          >
            Add
          </button>
        </div>
      </form>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 overflow-x-auto">
        <h3 className="text-lg md:text-xl font-semibold mb-4">All Expenses</h3>
        {expenses.length === 0 ? (
          <p className="text-gray-500 text-sm md:text-base">No expenses added yet.</p>
        ) : (
          <div className="min-w-[600px]">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 md:py-3 text-sm">Item</th>
                  <th className="text-left py-2 md:py-3 text-sm">Category</th>
                  <th className="text-right py-2 md:py-3 text-sm">Estimated</th>
                  <th className="text-right py-2 md:py-3 text-sm">Actual</th>
                  <th className="text-center py-2 md:py-3 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 md:py-3 text-sm">{expense.item}</td>
                    <td className="py-2 md:py-3 text-sm">{expense.category}</td>
                    <td className="py-2 md:py-3 text-right text-sm">
                      {expense.estimated_cost ? `$${expense.estimated_cost.toLocaleString()}` : "-"}
                    </td>
                    <td className="py-2 md:py-3 text-right font-semibold text-sm">
                      {expense.actual_cost ? `$${expense.actual_cost.toLocaleString()}` : "-"}
                    </td>
                    <td className="py-2 md:py-3 text-center">
                      <button
                        onClick={() => togglePaid(expense.id)}
                        className={`px-2 md:px-3 py-1 rounded text-xs md:text-sm ${
                          expense.paid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {expense.paid ? 'Paid' : 'Unpaid'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
