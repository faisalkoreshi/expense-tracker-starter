import { useState } from 'react'
import './App.css'
import ConfirmDialog from './ConfirmDialog'

function formatSignedAmount(t) {
  return `${t.type === "income" ? "+" : "-"}$${t.amount}`;
}

function TransactionList({ transactions, filterType, filterCategory, categories, onFilterTypeChange, onFilterCategoryChange, onDelete }) {
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  let filteredTransactions = transactions;
  if (filterType !== "all") {
    filteredTransactions = filteredTransactions.filter(t => t.type === filterType);
  }
  if (filterCategory !== "all") {
    filteredTransactions = filteredTransactions.filter(t => t.category === filterCategory);
  }

  const pendingDelete = transactions.find(t => t.id === pendingDeleteId) || null;

  const handleConfirmDelete = () => {
    onDelete(pendingDelete.id);
    setPendingDeleteId(null);
  };

  const handleCancelDelete = () => {
    setPendingDeleteId(null);
  };

  return (
    <div className="transactions">
      <h2>Transactions</h2>
      <div className="filters">
        <select value={filterType} onChange={onFilterTypeChange}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={filterCategory} onChange={onFilterCategoryChange}>
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length === 0 && (
            <tr>
              <td colSpan="5">No transactions</td>
            </tr>
          )}
          {filteredTransactions.map(t => (
            <tr key={t.id}>
              <td>{t.date}</td>
              <td>{t.description}</td>
              <td>{t.category || "Uncategorized"}</td>
              <td className={t.type === "income" ? "income-amount" : "expense-amount"}>
                {formatSignedAmount(t)}
              </td>
              <td>
                <button className="delete-btn" onClick={() => setPendingDeleteId(t.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {pendingDelete && (
        <ConfirmDialog
          title="Delete transaction?"
          message={`${pendingDelete.description} (${formatSignedAmount(pendingDelete)}) will be permanently removed.`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}

export default TransactionList
