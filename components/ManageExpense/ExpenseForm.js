import { View, StyleSheet, Text } from 'react-native';
import Input from './Input';

function ExpenseForm() {
	// TextInput onChangeText event handler
	function amountChangedHandler() {}

	return (
		<View style={styles.form}>
			<Text style={styles.title}>Your Expense</Text>
			<View style={styles.inputsRow}>
				<Input
					style={styles.rowInput}
					label='Amount'
					textInputConfig={{
						keyboardType: 'decimal-pad',
						onChangeText: amountChangedHandler,
					}}
				/>
				<Input
					style={styles.rowInput}
					label='Date'
					textInputConfig={{
						placeholder: 'YYYY-MM-DD',
						maxLength: 10,
						onChangeText: () => {},
					}}
				/>
			</View>

			<Input
				label='Description'
				textInputConfig={{
					multiline: true,
					//autoCorrect: false, // default is true,
					//autoCapitalize: 'none'
				}}
			/>
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
});

export default ExpenseForm;
