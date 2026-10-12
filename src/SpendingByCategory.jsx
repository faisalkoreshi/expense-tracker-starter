import './App.css'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const COLORS = {
	food: '#ff6b6b',
	housing: '#4ecdc4',
	utilities: '#ffe66d',
	transport: '#a8e6cf',
	entertainment: '#ffd3b6',
	salary: '#c977d9',
	other: '#9ca8b3',
}

const formatCurrency = (value) => {
	return `$${Number(value).toFixed(2)}`
}

const renderTooltip = ({ active, payload }) => {
	if (active && payload && payload.length) {
		return (
			<div className="chart-tooltip">
				<p className="chart-tooltip-label">{payload[0].payload.category}</p>
				<p className="chart-tooltip-value">{formatCurrency(payload[0].value)}</p>
			</div>
		)
	}
	return null
}

function SpendingByCategory({ transactions }) {
	const expenseData = transactions
		.filter(t => t.type === 'expense')
		.reduce((acc, t) => {
			const amount = Number(t.amount)
			const category = t.category || 'other'
			acc[category] = (acc[category] || 0) + amount
			return acc
		}, {})

	const data = Object.entries(expenseData).map(([category, amount]) => ({
		category,
		amount,
		color: COLORS[category] || COLORS.other,
	}))

	if (data.length === 0) {
		return (
			<div className="chart-section">
				<h2>Spending by Category</h2>
				<p className="chart-empty">No expenses to display</p>
			</div>
		)
	}

	return (
		<div className="chart-section">
			<h2>Spending by Category</h2>
			<div className="chart-container">
				<ResponsiveContainer width="100%" height={260}>
					<BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
						<XAxis dataKey="category" stroke="#888" />
						<YAxis />
						<CartesianGrid stroke="#ddd" strokeDasharray="5 5" />
						<Tooltip content={renderTooltip} />
						<Bar dataKey="amount" fill="#333">
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} />
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}

export default SpendingByCategory
