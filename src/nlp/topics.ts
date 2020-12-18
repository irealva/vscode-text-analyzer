/**
 * @fileoverview Utilities to get topics in a text
 * Comments missing for the sake of time
 */

import nlp from 'compromise';
import { getWordCount } from './frequentWords';

export function getTopics(text: string) {
    const topicsArray = nlp(text).topics();
    const topicsArrayAsStrings = topicsArray.out('array');
    const wordCount = getWordCount(topicsArrayAsStrings);
    return wordCount;
}

export function formatTopics(topics: string[]) {
    if (topics.length === 0) {
        return `Warning: No topics in this document`;
    }

    let formattedString = '';
	topics.forEach((topic) => {
		formattedString += `${topic}\n`;
	});

	return formattedString;
}