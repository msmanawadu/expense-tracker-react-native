import { useContext, useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import IconButton from '../components/UI/IconButton';
import { GlobalStyles } from '../constants/styles';
import Button from '../components/UI/Button';
import { ExpensesContext } from '../store/expenses-context';
import ExpenseForm from '../components/ManageExpense/ExpenseForm';

function ManageExpense({ route, navigation }) {
	const expensesCtx = useContext(ExpensesContext);

	// If we have a value for expenseID, we are editing it. Else, we are creating a new expense object.
	const editedExpenseId = route.params?.expenseId;
	// Convert editedExpenseId value into a boolean value. Valid expenseID->editing->true
	const isEditing = !!editedExpenseId;

	// Avoid screen title flickering effect
	useLayoutEffect(() => {
		navigation.setOptions({
			title: isEditing ? 'Edit Expense' : 'Add Expense',
		});
	}, [navigation, isEditing]);

	function deleteExpenseHandler() {
		expensesCtx.deleteExpense(editedExpenseId);
		// Close modal
		navigation.goBack();
	}

	function cancelHandler() {
		// Close modal
		navigation.goBack();
	}

	function confirmHandler() {
		if (isEditing) {
			expensesCtx.updateExpense(editedExpenseId, {
				description: 'Test!!!',
				amount: 30,
				date: new Date('2024-12-29'),
			});
		} else {
			expensesCtx.addExpense({
				description: 'Test',
				amount: 20,
				date: new Date('2024-12-30'),
			});
		}
		// Close modal
		navigation.goBack();
	}

	return (
		<View style={styles.container}>
			<ExpenseForm />
			<View style={styles.buttons}>
				<Button style={styles.button} mode='flat' onPress={cancelHandler}>
					Cancel
				</Button>
				<Button style={styles.button} onPress={confirmHandler}>
					{isEditing ? 'Update' : 'Add'}
				</Button>
			</View>
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
	buttons: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	button: {
		minWidth: 120,
		marginHorizontal: 8,
	},
});

export default ManageExpense;
