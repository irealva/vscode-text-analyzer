/**
 * @fileoverview Natural language processing utilities
 * Comments missing for the sake of time
 */

import nlp from 'compromise';
import * as sw from 'stopword';

// more info: https://observablehq.com/@spencermountain/compromise-normalization
export function cleanupText(text: string, options = { case: true, contractions: true, acronyms: true, possessives: true, plurals: true, verbs: false }) {
	const doc: nlp.DefaultDocument = nlp(text);
  	doc.normalize(options);
	  // return doc.out('text');
	return doc.text();
}

// More info here: https://observablehq.com/@spencermountain/compromise-contractions
export function removeContractions(text: string) {
	const doc: nlp.DefaultDocument = nlp(text);
	doc.contractions().expand();
	return doc.text();
}

export function tokenizeSentences(text: string): nlp.Document[] {
	const sentenceTokens: nlp.Document[] = nlp.tokenize(text).json();
	return sentenceTokens;
}

export function tokenizeWords(text: string) {
	const sentenceTokens = tokenizeSentences(text);

	const wordArray = sentenceTokens.map(sentence => {
		const terms = sentence.terms as unknown as nlp.Term[];
		return terms.map(term => {
			return term.text;
		});
	});

	const flattened = wordArray.reduce((accumulator, currentValue) => {
		return accumulator.concat(currentValue);
	});
	
	return flattened;
}

export function removeStopwords(textArray: string[]) {
	return sw.removeStopwords(textArray);
}

export function splitOnNewLines(text: string) {
	// should be usable by both Windows and UNIX systems.
	return text.split(/\r?\n/);
}

 
/*
stemming

const lowerCaseStems = [];

		for (const token of tokens) {
			const stem = natural.PorterStemmer.stem(token.toLowerCase());
			lowerCaseStems.push(stem);
		}

		console.log(lowerCaseStems);
		*/

