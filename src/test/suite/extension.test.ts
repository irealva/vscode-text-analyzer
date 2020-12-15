/**
 * @fileoverview Test suite
 * Comments missing for the sake of time
 * Some code inspired from: https://github.com/lannonbr/vscode-js-annotations/blob/master/src/test/e2e/extension.test.ts
 */

import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';

const testFolderLocation = '../../files/';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('should return correct frequentWords first line', async () => {
		const uri = vscode.Uri.file(
			path.join(__dirname + testFolderLocation + 'gettysburg.txt')
		);

		const document = await vscode.workspace.openTextDocument(uri);
		const editor = await vscode.window.showTextDocument(document);
		await sleep(500);

		const prom = await vscode.commands.executeCommand('text-analyzer.frequentWords', true);
		const firstLine = String(prom).split('\n')[0];
		assert.strictEqual("nation, 5", firstLine);
		await sleep(500);
	});

	test('should return correct ngrams first line', async () => {
		const uri = vscode.Uri.file(
			path.join(__dirname + testFolderLocation + 'ihaveadream.txt')
		);

		const document = await vscode.workspace.openTextDocument(uri);
		const editor = await vscode.window.showTextDocument(document);
		await sleep(500);

		const prom = await vscode.commands.executeCommand('text-analyzer.ngrams', true);
		const firstLine = String(prom).split('\n')[0];
		assert.strictEqual("let freedom, 10", firstLine);
		await sleep(500);
	});

	test('should return correct tfidf first line', async () => {
		const uri = vscode.Uri.file(
			path.join(__dirname + testFolderLocation + 'files.txt')
		);

		const document = await vscode.workspace.openTextDocument(uri);
		const editor = await vscode.window.showTextDocument(document);
		await sleep(500);

		const prom = await vscode.commands.executeCommand('text-analyzer.tfidf', true);
		const firstLine = String(prom).split('\n')[0];
		assert.strictEqual("./gettysburg.txt:", firstLine);
		await sleep(500);
	});
});

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}




