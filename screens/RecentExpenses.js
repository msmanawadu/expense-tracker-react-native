import { StyleSheet } from 'react-native';
import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput';
import { useContext, useEffect } from 'react';
import { ExpensesContext } from '../store/expenses-context';
import { getDateMinusDays } from '../util/date';
import { fetchExpenses } from '../util/http';

function RecentExpenses() {
	const expensesCtx = useContext(ExpensesContext);

	useEffect(() => {
		async function getExpenses() {
			const expenses = await fetchExpenses();
			expensesCtx.setExpenses(expenses);
		}
		getExpenses();
	}, []);

	const recentExpenses = expensesCtx.expenses.filter((expense) => {
		const today = new Date();
		const date7DaysAgo = getDateMinusDays(today, 7);
		// Filter expenses that happened in the last 7 days.
		return expense.date >= date7DaysAgo && expense.date <= today;
	});

	return (
		<ExpensesOutput
			expenses={recentExpenses}
			expensesPeriod='Last 7 Days'
			fallbackText='No expenses registered for the last 7 days.'
		/>
	);
}

const styles = StyleSheet.create({});

export default RecentExpenses;
