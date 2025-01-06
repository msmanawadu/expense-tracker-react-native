import { useContext, useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import IconButton from '../components/UI/IconButton';
import { GlobalStyles } from '../constants/styles';
import { ExpensesContext } from '../store/expenses-context';
import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import { deleteExpense, storeExpense, updateExpense } from '../util/http';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import ErrorOverlay from '../components/UI/ErrorOverlay';

function ManageExpense({ route, navigation }) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState();

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
		setIsSubmitting(true);
		try {
			await deleteExpense(editedExpenseId); // Delete remotely
			expensesCtx.deleteExpense(editedExpenseId); // Delete locally
			navigation.goBack(); // Close modal
		} catch (error) {
			setError('Could not delete expense - please try again later!');
			setIsSubmitting(false);
		}
	}

	function cancelHandler() {
		navigation.goBack(); // Close modal
	}

	// Update / Save an expense object
	async function confirmHandler(expenseData) {
		setIsSubmitting(true);
		try {
			if (isEditing) {
				expensesCtx.updateExpense(editedExpenseId, expenseData); // Update locally first
				await updateExpense(editedExpenseId, expenseData); // Then update remotely
			} else {
				const id = await storeExpense(expenseData); // Save remotely first
				expensesCtx.addExpense({ ...expenseData, id: id }); // Then save locally
			}
			navigation.goBack(); // Close modal
		} catch (error) {
			setError('Could not save data - please try again later!');
			setIsSubmitting(false);
		}
	}

	// Error message if update/create/delete fails
	if (error && !isSubmitting) {
		return <ErrorOverlay message={error} />;
	}

	// Loading spinner while submitting data
	if (isSubmitting) {
		return <LoadingOverlay />;
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
