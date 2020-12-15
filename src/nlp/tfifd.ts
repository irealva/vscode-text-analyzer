
/**
 * @fileoverview Utilities to obtain tfIdf analysis
 * Comments missing for the sake of time
 */

import * as natural from 'natural';
import {getFileText} from '../utils/fileio';

const tfIdf = natural.TfIdf;
const tfidf = new tfIdf();

export async function getTfidf(pathArray: string[], files: string[], numberWords: number) {    
    for (let i = 0; i < pathArray.length; i++)  {
        const documentContent = await getFileText(pathArray[i]);
        if (documentContent === null) {
        	return null;
        }

        tfidf.addDocument(documentContent);
    }
    
    
    let allDocuments = '';
    for (let i = 0; i < files.length; i++) {
        allDocuments += `${files[i]}:\n`;

        let frequencyText = '';
        let spliceIndex = numberWords > (tfidf.listTerms(i).length) ? tfidf.listTerms(i).length : numberWords;

        const tfidfData = tfidf.listTerms(i).slice(0, spliceIndex);
        tfidfData.forEach((item) => {
            frequencyText += `${item.term}, ${item.tfidf}\n`;
        });

        allDocuments += `${frequencyText}\n\n`;
    }

    return allDocuments;
}
