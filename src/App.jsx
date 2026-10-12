import { useState, useEffect } from 'react'
import './App.css'
import Summary from './Summary'
import SpendingByCategory from './SpendingByCategory'
import TransactionForm from './TransactionForm'
import TransactionList from './TransactionList'
import { categories } from './data/categories.js'

function App() {
  const [transactions, setTransactions] = useState([
    { id: 1, description: "Salary", amount: "5000", type: "income", category: "salary", date: "2025-01-01" },
    { id: 2, description: "Rent", amount: "1200", type: "expense", category: "housing", date: "2025-01-02" },
    { id: 3, description: "Groceries", amount: "150", type: "expense", category: "food", date: "2025-01-03" },
    { id: 4, description: "Freelance Work", amount: "800", type: "income", category: "salary", date: "2025-01-05" },
    { id: 5, description: "Electric Bill", amount: "95", type: "expense", category: "utilities", date: "2025-01-06" },
    { id: 6, description: "Dinner Out", amount: "65", type: "expense", category: "food", date: "2025-01-07" },
    { id: 7, description: "Gas", amount: "45", type: "expense", category: "transport", date: "2025-01-08" },
    { id: 8, description: "Netflix", amount: "15", type: "expense", category: "entertainment", date: "2025-01-10" },
  ]);

  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  const handleAddTransaction = (transaction) => {
    setTransactions([...transactions, { ...transaction, id: Date.now() }]);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="app">
      <div className="app-header">
        <div className="header-title">
          <h1>Finance Tracker</h1>
          <p className="subtitle">Track your income and expenses</p>
        </div>
        <button
          className="theme-toggle"
          onClick={() => setIsDark(!isDark)}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <div className="panel">
        <Summary transactions={transactions} />
      </div>
      <SpendingByCategory transactions={transactions} />
      <TransactionForm onSubmit={handleAddTransaction} />
      <TransactionList
        transactions={transactions}
        filterType={filterType}
        filterCategory={filterCategory}
        categories={categories}
        onFilterTypeChange={(e) => setFilterType(e.target.value)}
        onFilterCategoryChange={(e) => setFilterCategory(e.target.value)}
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
}

export default App
