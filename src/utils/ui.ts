
/**
 * @fileoverview UI pickers and input box utilities
 * Comments missing for the sake of time
 * Some code inspired from: https://github.com/microsoft/vscode-extension-samples/blob/master/quickinput-sample/src/basicInput.ts
 */

import * as vscode from 'vscode';

// TODO: Have to handle rejected promise handler in a better way
// More info here: https://www.iditect.com/how-to/54105000.html
export async function showQuickPick(options: string[], placeholder: string) {
	let i = 0;
	const result = await vscode.window.showQuickPick(options, {
		placeHolder: placeholder,
		// onDidSelectItem: item => window.showInformationMessage(`Focus ${++i}: ${item}`)
	});

	return result;
}

export async function showNumberInputBox(defaultNum = 10) {
	const inputBoxValue = await showInputBox(defaultNum);

	if (inputBoxValue !== null) {
		const inputBoxValueAsNum = Math.abs(parseInt(inputBoxValue as string));
		if (inputBoxValueAsNum !== NaN) {
			return inputBoxValueAsNum;
		}
	}

	return defaultNum;
} 

export async function showInputBox(defaultNum: number) {
	const result = await vscode.window.showInputBox({
		value: defaultNum.toString(),
		// valueSelection: [2, 4],
		placeHolder: 'Number of unique words to show',
		validateInput: text => {
			const validation = (!isNaN(parseFloat(text as string))) && (parseFloat(text as string) > 0) && (parseFloat(text as string) % 1 === 0);
			if (validation) {
				vscode.window.showInformationMessage(`Unique words to show: ${text}`);
			}
			return !validation ? 'Has to be a positive integer' : null;
		}
	});

	return result;
}

export async function launchSingleFilePicker() {
	const options: vscode.OpenDialogOptions = {
		canSelectMany: false, // TODO-FEATURE: Could enable selecting multiple files
		openLabel: 'Open',
		filters: {
			'textFiles': ['txt'],
			'allFiles': ['*']
		}
	};

	const fileUri = await vscode.window.showOpenDialog(options);

	if (fileUri && fileUri.length > 0) {
		return fileUri[0].fsPath;
	}

	return null;
}
