import { useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import Input from './Input';
import Button from '../UI/Button';
import { getFormattedDate } from '../../util/date';
import { GlobalStyles } from '../../constants/styles';

function ExpenseForm({ submitButtonLabel, onCancel, onSubmit, defaultValues }) {
	// One state object encapsulating all 3 states
	const [inputs, setInputs] = useState({
		amount: {
			value: defaultValues ? defaultValues.amount.toString() : '',
			isValid: true,
		},
		date: {
			value: defaultValues ? getFormattedDate(defaultValues.date) : '',
			isValid: true,
		},
		description: {
			value: defaultValues ? defaultValues.description : '',
			isValid: true,
		},
	});

	// TextInputs onChangeText event handler
	function inputChangedHandler(inputIdentifier, enteredValue) {
		setInputs((currentInputs) => {
			return {
				...currentInputs,
				[inputIdentifier]: {
					value: enteredValue,
					isValid: true,
				},
			};
		});
	}
	// Form onSubmit event handler
	function submitHandler() {
		const expenseData = {
			amount: +inputs.amount.value, // + -> Convert returning string value to number
			date: new Date(inputs.date.value),
			description: inputs.description.value,
		};

		// Validating user inputs
		const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
		const dateIsValid = !isNaN(expenseData.date);
		//const dateIsValid = expenseData.date.toString() !== 'Invalid Date';
		const descriptionIsValid = expenseData.description.trim().length > 0;

		if (!amountIsValid || !dateIsValid || !descriptionIsValid) {
			//Alert.alert('Invalid Input', 'Please check your input values');
			setInputs((currentInputs) => {
				return {
					amount: {
						value: currentInputs.amount.value,
						isValid: amountIsValid,
					},
					date: {
						value: currentInputs.date.value,
						isValid: dateIsValid,
					},
					description: {
						value: currentInputs.description.value,
						isValid: descriptionIsValid,
					},
				};
			});
			return; // if condition is true, just return, not submitting data object
		}
		onSubmit(expenseData);
	}

	const formIsInvalid =
		!inputs.amount.isValid ||
		!inputs.date.isValid ||
		!inputs.description.isValid;

	return (
		<View style={styles.form}>
			<Text style={styles.title}>Your Expense</Text>
			<View style={styles.inputsRow}>
				<Input
					style={styles.rowInput}
					label='Amount'
					invalid={!inputs.amount.isValid}
					textInputConfig={{
						keyboardType: 'decimal-pad',
						onChangeText: inputChangedHandler.bind(this, 'amount'),
						value: inputs.amount.value,
					}}
				/>
				<Input
					style={styles.rowInput}
					label='Date'
					invalid={!inputs.date.isValid}
					textInputConfig={{
						placeholder: 'YYYY-MM-DD',
						maxLength: 10,
						onChangeText: inputChangedHandler.bind(this, 'date'),
						value: inputs.date.value,
					}}
				/>
			</View>

			<Input
				label='Description'
				invalid={!inputs.description.isValid}
				textInputConfig={{
					multiline: true,
					onChangeText: inputChangedHandler.bind(this, 'description'),
					value: inputs.description.value,
					//autoCorrect: false, // default is true,
					//autoCapitalize: 'none'
				}}
			/>
			{formIsInvalid && (
				<Text style={styles.errorText}>
					Invalid input values - please check your entered data!
				</Text>
			)}
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
	errorText: {
		textAlign: 'center',
		color: GlobalStyles.colors.error500,
		margin: 8,
	},
});

export default ExpenseForm;
