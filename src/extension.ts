/**
 * @fileoverview This code contains all the main extension commands including:
 * 1. most frequent words in a text
 * 2. ngrams
 * 3. topics
 * 4. frequency–inverse document frequency (tfIdf) of a collection of files
 */

import * as vscode from 'vscode';
import { createFilePath, getFileName, pickFiles, getActiveFile } from './utils/fileio';
import { showQuickPick, showNumberInputBox } from './utils/ui'; 
import { analyzeFrequentWords, analyzeNgrams, analyzeTfidf, analyzeTopics } from './textAnalyze';

/**
 * Two ways to select files
 * 'active' is the active file in the viewer
 * 'picker' is a file picker
 */
type ModeTypes = 'active' | 'picker';

/**
 * What to display as UI instructions for each mode
 */
const modes: Record<ModeTypes, string> = {
	active: 'Current file',
	picker: 'Choose file'
};

/**
 * Commands to register
 */
enum Commands {
	frequent = "frequentWords",
	ngrams = "ngrams",
	topics = "topics",
	tfidf = "tfidf"
}

/**
 * Called when the extension is activated
 * extension is activated the very first time the command is executed
 * 
 * @param {vscode.ExtensionContext} context The vscode extension context
 */
export function activate(context: vscode.ExtensionContext) {
	console.log('Extension "text-analyzer" is now active');

	/**
	 * Frequent words command
	 */
	const frequentWordsCommand = vscode.commands.registerCommand(`text-analyzer.${Commands.frequent}`, async (isTest = false) => {
		// this is a hack because test cases fail with showQuickPick() and showInputBox()
		// have to handle a rejected promise in a different way to make this work with tests
		// more in the utils/ui.ts file
		const modeType = isTest ? 'active' : await getMode(modes);	

		let fileInfo;
		if (modeType === 'active' && vscode.window.activeTextEditor) {
			fileInfo = getActiveFile(vscode.window.activeTextEditor);
		} else {
			fileInfo = await pickFiles();
		}

		if (fileInfo === null) {
			return;
		}

		const fileName = getFileName(fileInfo.input);
		const newFile = createFilePath(fileInfo.input, `${Commands.frequent}-${fileName}.txt`);
		const promise = analyzeFrequentWords(fileInfo.documentText, newFile);
		return promise;
	});

	/**
	 * Ngrams command
	 */
	const ngramsCommand = vscode.commands.registerCommand(`text-analyzer.${Commands.ngrams}`, async (isTest = false) => {
		// this is a hack because test cases fail with showQuickPick() and showInputBox()
		// have to handle a rejected promise in a different way to make this work with tests
		// more in the utils/ui.ts file
		const modeType = isTest ? 'active' : await getMode(modes);
		const ngrams = isTest ? 2 : await showNumberInputBox(2);

		let fileInfo;
		if (modeType === 'active' && vscode.window.activeTextEditor) {
			fileInfo = getActiveFile(vscode.window.activeTextEditor);
		} else {
			fileInfo = await pickFiles();
		}

		if (fileInfo === null) {
			return;
		}

		const fileName = getFileName(fileInfo.input);
		const newFile = createFilePath(fileInfo.input, `${Commands.ngrams}-${fileName}.txt`);
		const promise = analyzeNgrams(fileInfo.documentText, newFile, ngrams);
		return promise;
	});

	/**
	 * Topics command
	 */
	const topicsCommand = vscode.commands.registerCommand(`text-analyzer.${Commands.topics}`, async (isTest = false) => {
		// this is a hack because test cases fail with showQuickPick() and showInputBox()
		// have to handle a rejected promise in a different way to make this work with tests
		// more in the utils/ui.ts file
		const modeType = isTest ? 'active' : await getMode(modes);

		let fileInfo;
		if (modeType === 'active' && vscode.window.activeTextEditor) {
			fileInfo = getActiveFile(vscode.window.activeTextEditor);
		} else {
			fileInfo = await pickFiles();
		}

		if (fileInfo === null) {
			return;
		}

		const fileName = getFileName(fileInfo.input);
		const newFile = createFilePath(fileInfo.input, `${Commands.topics}-${fileName}.txt`);
		const promise = analyzeTopics(fileInfo.documentText, newFile);
		return promise;
	});

	/**
	 * Tfidf command
	 */
	const tfidfCommand = vscode.commands.registerCommand(`text-analyzer.${Commands.tfidf}`, async (isTest = false) => {
		// this is a hack because test cases fail with showQuickPick() and showInputBox()
		// have to handle a rejected promise in a different way to make this work with tests
		// more in the utils/ui.ts file
		const modeType = isTest ? 'active' : await getMode(modes);
		const numberWords = isTest ? 10 : await showNumberInputBox(10);
		
		let fileInfo;
		if (modeType === 'active' && vscode.window.activeTextEditor) {
			fileInfo = getActiveFile(vscode.window.activeTextEditor);
		} else {
			fileInfo = await pickFiles();
		}

		if (fileInfo === null) {
			return;
		}
		
		const fileName = getFileName(fileInfo.input);
		const newFile = createFilePath(fileInfo.input, `${Commands.tfidf}-${fileName}.txt`);
		const promise = analyzeTfidf(fileInfo.documentText, fileInfo.documentPath, newFile, numberWords);
		return promise;
	});

	context.subscriptions.push(frequentWordsCommand, ngramsCommand, tfidfCommand);
}

/**
 * Called when your extension is deactivated
 */
export function deactivate() {}

/**
 * Gets a Mode key by value
 * 
 * @param {Record<ModeTypes, string>} object a record object from which to find a key
 * @param {string} value a value to search
 * 
 * @return {(Mode | undefined)} a mode key
 */
function getModesByValue(object: Record<ModeTypes, string>, value: string) {
	const key = (Object.keys(object) as Array<ModeTypes>).find(key => object[key] === value);
	return key;
}

/**
 * Show a quick pick to select what file picking mode a user wants
 * 
 * @param {Record<ModeTypes, string>} getModes list of file picking modes
 * 
 * @return {(Mode | undefined)} a file picking mode
 */
async function getMode(getModes: Record<ModeTypes, string>) {
	const modeSelection = await showQuickPick(Object.values(getModes), 'Where to get the input file from?');
	const modeType = getModesByValue(getModes, String(modeSelection));
	return modeType as ModeTypes;
}