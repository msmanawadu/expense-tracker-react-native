import { useContext, useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import IconButton from '../components/UI/IconButton';
import { GlobalStyles } from '../constants/styles';
import { ExpensesContext } from '../store/expenses-context';
import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import { deleteExpense, storeExpense, updateExpense } from '../util/http';

function ManageExpense({ route, navigation }) {
	const expensesCtx = useContext(ExpensesContext);

	// If we have a value for expenseID, we are editing it. Else, we are creating a new expense object.
	const editedExpenseId = route.params?.expenseId;
	// Convert editedExpenseId value into a boolean value. Valid expenseID->editing->true
	const isEditing = !!editedExpenseId;
	// Find the expense object to edit.
	const selectedExpense = expensesCtx.expenses.find(
		(expense) => expense.id === editedExpenseId
	);

	// Avoid screen title flickering effect
	useLayoutEffect(() => {
		navigation.setOptions({
			title: isEditing ? 'Edit Expense' : 'Add Expense',
		});
	}, [navigation, isEditing]);

	async function deleteExpenseHandler() {
		expensesCtx.deleteExpense(editedExpenseId); // Delete locally first
		await deleteExpense(editedExpenseId); // Then delete remotely
		// Close modal
		navigation.goBack();
	}

	function cancelHandler() {
		// Close modal
		navigation.goBack();
	}

	// Update an existing expense object
	async function confirmHandler(expenseData) {
		if (isEditing) {
			expensesCtx.updateExpense(editedExpenseId, expenseData); // Update locally first
			await updateExpense(editedExpenseId, expenseData); // Then update remotely
		} else {
			const id = await storeExpense(expenseData); // POST -> CREATE
			expensesCtx.addExpense({ ...expenseData, id: id });
		}
		// Close modal
		navigation.goBack();
	}

	return (
		<View style={styles.container}>
			<ExpenseForm
				submitButtonLabel={isEditing ? 'Update' : 'Add'}
				onSubmit={confirmHandler}
				onCancel={cancelHandler}
				defaultValues={selectedExpense}
			/>
			{isEditing && (
				<View style={styles.deleteContainer}>
					<IconButton
						icon='trash'
						color={GlobalStyles.colors.error500}
						size={36}
						onPress={deleteExpenseHandler}
					/>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		backgroundColor: GlobalStyles.colors.primary800,
	},
	deleteContainer: {
		marginTop: 16,
		paddingTop: 8,
		borderTopWidth: 2,
		borderTopColor: GlobalStyles.colors.primary200,
		alignItems: 'center',
	},
});

export default ManageExpense;
