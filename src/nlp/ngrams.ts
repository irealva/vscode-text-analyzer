/**
 * @fileoverview Utilities to get ngrams
 * Comments missing for the sake of time
 */

import nlp from 'compromise';
import ngrams from 'compromise-ngrams';
import { removeStopwords } from '../utils/nlp';

const nlpEx = nlp.extend(ngrams);

type Ngram = { size: number, count: number, normal: string};

export function getNgrams(text: string, size = 2, sort = true, shouldRemoveStopwords = false) {
	const document = nlpEx(text);
	const ngrams: Ngram[] = document.ngrams({size: size});

	if (sort) {
		ngrams.sort((a, b) => b.count - a.count);
	}

	if (shouldRemoveStopwords) {
		let ngramsWithoutStopwords = [];

		for (const ngram of ngrams) {
			const res = removeStopwords(ngram.normal.split(' '));
			if (res.length === size) {
				ngramsWithoutStopwords.push(ngram);
			}
		}
		
		return ngramsWithoutStopwords;
	}

	return ngrams;
}

export function formatNgrams(ngrams: Ngram[]) {
	let formattedString = '';
	ngrams.forEach((ngram) => {
		formattedString += `${ngram.normal}, ${ngram.count}\n`;
	});

	return formattedString;
}
