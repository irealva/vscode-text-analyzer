/**
 * @fileoverview Utilities to get most frequent words
 * Comments missing for the sake of time
 */

type WordCount = { word: string, count: number};

export function getWordCount(textArray: string[], sorted = true): WordCount[] {
	const wordCount = textArray.reduce<Record<string, number>>((accumulator, currentValue) => {
		accumulator[currentValue] = (accumulator[currentValue] + 1) || 1;
		return accumulator;
	}, {});

	const wordCountArray = Object.keys(wordCount).map((key) => {
		return { word: key, count: wordCount[key]};
	});

	if (sorted) {
		wordCountArray.sort((a, b) => {
			return b.count - a.count;
		});
	}

	return wordCountArray;
}

export function formatWordCount(wordCountArray: WordCount[]) {
	let formattedString = '';
	wordCountArray.forEach((word) => {
		formattedString += `${word.word}, ${word.count}\n`;
	});

	return formattedString;
}