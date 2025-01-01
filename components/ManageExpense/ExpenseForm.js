import { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Input from './Input';
import Button from '../UI/Button';
import { getFormattedDate } from '../../util/date';

function ExpenseForm({ submitButtonLabel, onCancel, onSubmit, defaultValues }) {
	// One state object encapsulating all 3 states
	const [inputValues, setInputValues] = useState({
		amount: defaultValues ? defaultValues.amount.toString() : '',
		date: defaultValues ? getFormattedDate(defaultValues.date) : '',
		description: defaultValues ? defaultValues.description : '',
	});

	// TextInputs onChangeText event handler
	function inputChangedHandler(inputIdentifier, enteredValue) {
		setInputValues((currentInputValues) => {
			return {
				...currentInputValues,
				[inputIdentifier]: enteredValue,
			};
		});
	}
	// Form onSubmit event handler
	function submitHandler() {
		const expenseData = {
			amount: +inputValues.amount, // + -> Convert returning string value to number
			date: new Date(inputValues.date),
			description: inputValues.description,
		};

		onSubmit(expenseData);
	}

	return (
		<View style={styles.form}>
			<Text style={styles.title}>Your Expense</Text>
			<View style={styles.inputsRow}>
				<Input
					style={styles.rowInput}
					label='Amount'
					textInputConfig={{
						keyboardType: 'decimal-pad',
						onChangeText: inputChangedHandler.bind(this, 'amount'),
						value: inputValues.amount,
					}}
				/>
				<Input
					style={styles.rowInput}
					label='Date'
					textInputConfig={{
						placeholder: 'YYYY-MM-DD',
						maxLength: 10,
						onChangeText: inputChangedHandler.bind(this, 'date'),
						value: inputValues.date,
					}}
				/>
			</View>

			<Input
				label='Description'
				textInputConfig={{
					multiline: true,
					onChangeText: inputChangedHandler.bind(this, 'description'),
					value: inputValues.description,
					//autoCorrect: false, // default is true,
					//autoCapitalize: 'none'
				}}
			/>
			<View style={styles.buttons}>
				<Button style={styles.button} mode='flat' onPress={onCancel}>
					Cancel
				</Button>
				<Button style={styles.button} onPress={submitHandler}>
					{submitButtonLabel}
				</Button>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	form: {
		marginTop: 40,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: 'white',
		marginVertical: 24,
		textAlign: 'center',
	},
	inputsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	rowInput: {
		flex: 1,
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

export default ExpenseForm;
