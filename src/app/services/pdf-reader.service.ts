import { Injectable } from '@angular/core';
import * as pdfjslib from 'pdfjs-dist';
import { FileReaderService } from './file-reader.service';

pdfjslib.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';

@Injectable({
  providedIn: 'root'
})
export class PdfReaderService {

  constructor(
    private fileReaderService: FileReaderService
  ) { }

  async getData(file: File) {
    // const buffer = await this.fileReaderService.readAsArrayBuffer(file);
    // return pdfjslib.getDocument({ data: buffer.data }).promise.then(pdf => {
    //   return this.getPageText(1, pdf)});
    try{
      const buffer = await this.fileReaderService.readAsArrayBuffer(file);
      const pdf = await pdfjslib.getDocument({ data: buffer.data }).promise;
      let allText: string[] = [];
      
      for(let i=1; i <= 33; i++){
        try{
          const pageText = await this.getPageText(i, pdf);
          allText = [...allText, ...pageText];
        } catch (error){
          console.error(`Error extracting text from page ${i}:`, error);
          allText.push(`Error on page ${i}`);
        }
      }
      console.log('allText--->', allText);
      return allText;
    } catch(error){
      console.log('Error reading PDF page: ', error);
      throw new Error('Falied to extract Data from PDF');
    }
  }

  private getPageText(pageNum: any, pdfDocumentInstance: any): Promise<string[]> {
    // Return a Promise that is solved once the text of the page is retrieven
    return new Promise((resolve, reject) => {
      pdfDocumentInstance.getPage(pageNum).then((pdfPage: any) => {
        // The main trick to obtain the text of the PDF page, use the getTextContent method
        pdfPage.getTextContent().then((textContent: any) => {
          const textItems = textContent.items;
          const data: any = {};
          // Concatenate the string of the item to the final string
          for (const item of textItems) {
            if ((item.str !== undefined) && (!item.hasEOL)) {
              const y: any = item.transform['5'];
              (data[y] = data[y] || []).push(item.str.trim());
            }}
          const result: string[] = [];
          Object.keys(data) // => array of y-positions (type: float)
            .sort((y1, y2) => parseFloat(y2) - parseFloat(y1)) // sort float positions
            .forEach((y) => {
              result.push((data[y] || []).join(';'))
            });
          // Solve promise with the text retrieven from the page
          resolve(result);
        });
      });
    });
  }
// Make sure you have pdfjs-dist installed

// async getData(file: File): Promise<string[]> {
//   try {
//     // Read the file as an ArrayBuffer
//     const buffer = await this.fileReaderService.readAsArrayBuffer(file);

//     // Load the PDF document from the buffer
//     const pdf = await pdfjslib.getDocument({ data: buffer.data }).promise;

//     // Loop through pages 1 to 10 and extract text
//     const allText: string[] = [];
    
//     // Loop through pages 1 to 10 (or however many pages you want to process)
//     for (let pageNumber = 1; pageNumber <= 10; pageNumber++) {
//       try {
//         const pageText = await this.getPageText(pageNumber, pdf);
//         allText.push(pageText);
//       } catch (error) {
//         console.error(`Error extracting text from page ${pageNumber}:`, error);
//         allText.push(`Error on page ${pageNumber}`);
//       }
//     }

//     // Return the array of page texts
//     console.log('alltext',allText)
//     return allText;

//   } catch (error) {
//     console.error("Error reading PDF:", error);
//     throw new Error('Failed to extract text from the PDF');
//   }
// }

// // Method to extract text from a specific page
// async getPageText(pageNumber: number, pdf: pdfjslib.PDFDocumentProxy): Promise<string> {
//   const page = await pdf.getPage(pageNumber);  // Get the specific page
//   const textContent = await page.getTextContent();  // Extract the text content

//   // Combine all the text items into a single string
//   const textItems = textContent.items.map((item: any) => item.str);
//   return textItems.join(' ');
// }


}
