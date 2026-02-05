"use client";

import { useState, useEffect } from "react";
import { DollarSign, Plus, Wallet, Receipt, CheckCircle2 } from "lucide-react";

export default function BudgetPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [newExpense, setNewExpense] = useState({
    item: "",
    category: "",
    estimated_cost: "",
    actual_cost: "",
    vendor: "",
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const deleteExpense = (id: string) => {
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    localStorage.setItem("expenses", JSON.stringify(updated));
  };

  const totalEstimated = expenses.reduce((sum, e) => sum + (e.estimated_cost || 0), 0);
  const totalActual = expenses.reduce((sum, e) => sum + (e.actual_cost || 0), 0);
  const totalPaid = expenses.filter((e) => e.paid).reduce((sum, e) => sum + (e.actual_cost || 0), 0);
  const remaining = totalActual - totalPaid;

  const categories = ["Venue", "Catering", "Photography", "Flowers", "Music", "Attire", "Other"];

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Wedding Budget</h2>
        <p className="text-gray-500 mt-1">Track expenses and stay on budget</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-lg shadow-gray-200/50">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
            <Receipt className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${totalEstimated.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Estimated</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-lg shadow-gray-200/50">
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center mb-3">
            <Wallet className="w-5 h-5 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${totalActual.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Actual Total</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold">${totalPaid.toLocaleString()}</p>
          <p className="text-sm text-emerald-100">Paid ✅</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold">${remaining.toLocaleString()}</p>
          <p className="text-sm text-amber-100">Remaining</p>
        </div>
      </div>

      {/* Progress Bar */}
      {totalActual > 0 && (
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6">
          <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
            <span>Budget Progress</span>
            <span>{Math.round((totalPaid / totalActual) * 100)}% Paid</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((totalPaid / totalActual) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Add Expense Form */}
      <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-rose-500" />
          Add Expense
        </h3>
        <form onSubmit={addExpense} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <input
            type="text"
            placeholder="Item/Service"
            required
            value={newExpense.item}
            onChange={(e) => setNewExpense({ ...newExpense, item: e.target.value })}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all outline-none"
          />
          <select
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all outline-none"
          >
            <option value="">Category</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <input
            type="number"
            placeholder="Estimated $"
            value={newExpense.estimated_cost}
            onChange={(e) => setNewExpense({ ...newExpense, estimated_cost: e.target.value })}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all outline-none"
          />
          <input
            type="number"
            placeholder="Actual $"
            value={newExpense.actual_cost}
            onChange={(e) => setNewExpense({ ...newExpense, actual_cost: e.target.value })}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all outline-none"
          />
          <input
            type="text"
            placeholder="Vendor"
            value={newExpense.vendor}
            onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all outline-none"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-xl font-semibold shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 hover:-translate-y-0.5 transition-all"
          >
            Add
          </button>
        </form>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 overflow-hidden">
        <h3 className="font-serif text-xl font-bold text-gray-900 mb-6">All Expenses</h3>
        
        {expenses.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No expenses yet</p>
            <p className="text-sm">Start tracking your wedding costs above</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Item</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Category</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Estimated</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actual</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{expense.item}</p>
                      {expense.vendor && <p className="text-xs text-gray-500">{expense.vendor}</p>}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">
                        {expense.category || "Other"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {expense.estimated_cost ? `$${expense.estimated_cost.toLocaleString()}` : "-"}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">
                      {expense.actual_cost ? `$${expense.actual_cost.toLocaleString()}` : "-"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => togglePaid(expense.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          expense.paid 
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        }`}
                      >
                        {expense.paid ? 'Paid ✅' : 'Unpaid'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        ×
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
