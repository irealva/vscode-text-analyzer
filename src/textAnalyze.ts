/**
 * @fileoverview The bulk of the text processing code for each command
 */

import * as vscode from 'vscode';
import { ProgressLocation, Uri } from 'vscode';
import * as path from 'path';
import { createFile } from './utils/fileio';
import { cleanupText, splitOnNewLines, removeStopwords, tokenizeWords } from './utils/nlp';
import { getNgrams, formatNgrams } from './nlp/ngrams';
import { getWordCount, formatWordCount } from './nlp/frequentWords';
import { getTopics } from './nlp/topics';
import { getTfidf } from './nlp/tfifd';

/**
 * Obtain most frequent words in a text
 * 
 * @param {string} text text of original document to analyze
 * @param {Uri} newFile path of new file that will contain most frequent words
 * 
 * @return {Thenable<string>} a string with most frequent words
 */
export function analyzeFrequentWords(text: string, newFile: Uri): Thenable<string> {
	return vscode.window.withProgress({
		location: ProgressLocation.Notification,
		title: "Frequent words progress",
		cancellable: true
	},
	p => {
		return new Promise((resolve, reject) => {
			p.report({message: 'Analyzing frequent words...' });
			const textCleanup = cleanupText(text);
			const wordTokens = tokenizeWords(textCleanup);
			const wordTokensNoStopwords = removeStopwords(wordTokens);			
			const wordCount = getWordCount(wordTokensNoStopwords);

			p.report({message: 'Formatting new file...' });
			const wordCountText = formatWordCount(wordCount);

			createFile(newFile, wordCountText);
			
			vscode.window.showInformationMessage('Complete: Frequent words analysis');
			resolve(wordCountText);
			return wordCountText;
		});
	});
}

/**
 * Obtain ngrams in a text
 * 
 * @param {string} text text of original document to analyze
 * @param {Uri} newFile path of new file that will contain ngrams
 * @param {number} ngramsSize size of ngrams
 * 
 * @return {Thenable<string>} a string with ngrams
 */
export function analyzeNgrams(text: string, newFile: Uri, ngramsSize = 2): Thenable<string> {
	return vscode.window.withProgress({
		location: ProgressLocation.Notification,
		title: "Ngrams progress",
		cancellable: true
	},
	p => {
		return new Promise((resolve, reject) => {
			p.report({message: 'Analyzing ngrams...' });
			const textCleanup = cleanupText(text);
			const ngrams = getNgrams(textCleanup, ngramsSize, true, true);

			p.report({message: 'Formatting new file...' });
			const ngramsText = formatNgrams(ngrams);

			createFile(newFile, ngramsText);
			
			vscode.window.showInformationMessage('Complete: Ngrams analysis');
			resolve(ngramsText);
			return ngramsText;
		});
	});
}

/**
 * Obtain topics
 * 
 * @param {string} text text of original document to analyze
 * @param {Uri} newFile path of new file that will contain ngrams
 * 
 * @return {Thenable<string>} a string with ngrams
 */
export function analyzeTopics(text: string, newFile: Uri): Thenable<string> {
	return vscode.window.withProgress({
		location: ProgressLocation.Notification,
		title: "Topics analysis progress",
		cancellable: true
	},
	p => {
		return new Promise((resolve, reject) => {
			p.report({message: 'Analyzing topics...' });
			const textCleanup = cleanupText(text);

			const topics = getTopics(textCleanup);
			const topicsText = formatWordCount(topics);

			createFile(newFile, topicsText);

			resolve(topicsText);
			return topicsText;
		});
	});
}

/**
 * Obtain tfidf of a collection of texts
 * 
 * @param {string} text text of original document (list of files to analyze)
 * @param {string} documentPath path of original document
 * @param {Uri} newFile path of new file that will contain ngrams
 * @param {number} numberWords number of most frequent unique words to display
 * 
 * @return {Thenable<string>} a string tfidf anlysis
 */
export function analyzeTfidf(text: string, documentPath: string, newFile: Uri, numberWords = 10): Thenable<string> {	
	return vscode.window.withProgress({
		location: ProgressLocation.Notification,
		title: "Tfidf progress",
		cancellable: true
	},
	p => {
		return new Promise(async (resolve, reject) => {
			p.report({message: 'Getting files...' });
			const files = splitOnNewLines(text);

			const pathArray = [];
			for (const file of files) {
				const uri = vscode.Uri.parse(path.join(documentPath, '../', file));
				pathArray.push(uri.path);
			}

			p.report({message: 'Analyzing tfidf...' });
			const allDocuments = await getTfidf(pathArray, files, numberWords);

			if (allDocuments === null) {
				vscode.window.showErrorMessage('Error: Problem reading your file');
				reject();
				return;
			}

			createFile(newFile, allDocuments);

			vscode.window.showInformationMessage('Complete: Tfidf analysis');
			resolve(allDocuments);
			return allDocuments;
		});
	});
}
