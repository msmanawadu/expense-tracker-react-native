import { createContext, useReducer } from 'react';

const DUMMY_EXPENSES = [
	{
		id: 'e1',
		description: 'Rent',
		amount: 800,
		date: new Date('2024-12-25'),
	},
	{
		id: 'e2',
		description: 'Utility',
		amount: 400,
		date: new Date('2024-12-5'),
	},
	{
		id: 'e3',
		description: 'Living',
		amount: 250,
		date: new Date('2024-11-30'),
	},
	{
		id: 'e4',
		description: 'Transportation',
		amount: 200,
		date: new Date('2024-12-20'),
	},
	{
		id: 'e5',
		description: 'Leisure',
		amount: 120,
		date: new Date('2024-12-14'),
	},
	{
		id: 'e6',
		description: 'Council Tax',
		amount: 80,
		date: new Date('2024-12-01'),
	},
	{
		id: 'e7',
		description: 'Income Tax',
		amount: 140,
		date: new Date('2024-11-30'),
	},
	{
		id: 'e8',
		description: 'Charity',
		amount: 50,
		date: new Date('2024-12-07'),
	},
	{
		id: 'e9',
		description: 'Life + Car Insurance',
		amount: 180,
		date: new Date('2024-12-20'),
	},
	{
		id: 'e10',
		description: 'Private GP Appointment',
		amount: 200,
		date: new Date('2024-11-08'),
	},
	{
		id: 'e11',
		description: 'Fuel',
		amount: 200,
		date: new Date('2024-12-24'),
	},
	{
		id: 'e12',
		description: 'Car service',
		amount: 400,
		date: new Date('2024-12-26'),
	},
	{
		id: 'e13',
		description: 'Phone repair',
		amount: 50,
		date: new Date('2024-12-27'),
	},
	{
		id: 'e14',
		description: 'Gutter repair',
		amount: 130,
		date: new Date('2024-12-28'),
	},
	{
		id: 'e15',
		description: 'Cosmetics',
		amount: 80,
		date: new Date('2024-12-29'),
	},
];

export const ExpensesContext = createContext({
	expenses: [],
	addExpense: ({ description, amount, date }) => {},
	deleteExpense: (id) => {},
	updateExpense: (id, { description, amount, date }) => {},
});

function expensesReducer(state, action) {
	switch (action.type) {
		case 'ADD':
			const id = new Date().toString() + Math.random().toString();
			return [{ ...action.payload, id: id }, ...state];
		case 'UPDATE':
			const updatableExpenseIndex = state.findIndex(
				(expense) => expense.id === action.payload.id
			);
			const updatableExpense = state[updatableExpenseIndex];
			const updatedItem = { ...updatableExpense, ...action.payload.data };
			const updatedExpenses = [...state];
			updatedExpenses[updatableExpenseIndex] = updatedItem;
			return updatedExpenses;
		case 'DELETE':
			return state.filter((expense) => expense.id !== action.payload);
		default:
			return state;
	}
}

function ExpensesContextProvider({ children }) {
	const [expensesState, dispatch] = useReducer(expensesReducer, DUMMY_EXPENSES);

	function addExpense(expenseData) {
		dispatch({ type: 'ADD', payload: expenseData });
	}

	function deleteExpense(id) {
		dispatch({ type: 'DELETE', payload: id });
	}

	function updateExpense(id, expenseData) {
		dispatch({ type: 'UPDATE', payload: { id: id, data: expenseData } });
	}

	const value = {
		expenses: expensesState,
		addExpense: addExpense,
		deleteExpense: deleteExpense,
		updateExpense: updateExpense,
	};

	return (
		<ExpensesContext.Provider value={value}>
			{children}
		</ExpensesContext.Provider>
	);
}

export default ExpensesContextProvider;
