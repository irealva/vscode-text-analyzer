/**
 * @fileoverview File input and output utilities
 * Comments missing for the sake of time
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { launchSingleFilePicker } from './ui';

export async function pickFiles() {
	const filePath = await launchSingleFilePicker();

	if (filePath === null) {
		return null;
	}

	let documentText = await getFileText(filePath);
	if (documentText === null) {
		vscode.window.showErrorMessage('Error: Problem reading your file');
		return null;
	}

	return { input: filePath, documentPath: filePath, documentText: documentText };
}

export function getActiveFile(activeEditor: vscode.TextEditor) {
	const documentText = getActiveFileText(activeEditor);
	const documentPath = activeEditor.document.uri.fsPath;
	const input = activeEditor;

	return { input, documentPath, documentText };
}

export function getActiveFileText(activeTextEditor: vscode.TextEditor) {
	const document = activeTextEditor.document;
	return document.getText();
}

export  function createFilePath(startingPath: vscode.TextEditor | string, fileName: string) {
	if (typeof startingPath === 'string') {
		return vscode.Uri.parse('untitled:' + path.join(startingPath, '../', fileName));
	} else {
		return vscode.Uri.parse('untitled:' + path.join(startingPath.document.uri.fsPath, '../', fileName));
	}
}

export function getFileName(activeFile: vscode.TextEditor | string) {
	let fileName = '';
	if (typeof activeFile === 'string') {
		fileName = path.basename(activeFile);
	} else {
		fileName = path.basename(activeFile.document.fileName);
	}

	return fileName .split('.')[0];
}

export async function getFileText(path: string) {
	try {
		const document = await vscode.workspace.openTextDocument(path);
		return document.getText();
	} catch(e) {
		console.log(e);
	}

	return null;
}

export async function createFile(path: vscode.Uri, content: string) {
	const document = await vscode.workspace.openTextDocument(path);

	const edit = new vscode.WorkspaceEdit();
	edit.insert(path, new vscode.Position(0, 0), content);
	const documentStatus = await vscode.workspace.applyEdit(edit);

	if (documentStatus) {
		vscode.window.showTextDocument(document);
	} else {
		vscode.window.showInformationMessage('Error creating new document!');
	}
}