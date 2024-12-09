import { Component } from '@angular/core';
import { PdfReaderService } from './services/pdf-reader.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  /** String with all csv content after the conversion */
  csvText = '';
  /** List with the csv data converted from pdf files */ 
  data: string[][] = [];
  /** Files selected in the input */
  files: File[] = [];
  /** Count of rows needed in the textarea*/
  textAreaRows = 0;
  header: any[] = [];
  txnData: any[] = [];
  hdata:any[]=[];
  tdata:any[]=[];

  constructor(
    /** Service responsible for convert pdf to csv */
    private pdfReaderService: PdfReaderService
  ) { }

  /** Action of the button Convert */
  async convert() {
    this.files.length > 0
    const dataStr = [];
    this.data = [];
    this.textAreaRows = 0;
    // Convert all the pdf files selected in the input
    for (const file of this.files) {
      // Get the data converted in csv pattern
      const item = await this.pdfReaderService.getData(file);
      // Add on the list the string resulted from the convertion
      // console.log('PDF Data--------->',item);
      
      item.forEach(data=>{
        const date = data.split(';;');
        if(data.startsWith("Date;;Narration")){
          this.header.push(...data.split(';;'));
        }else if(date && date[0] && date[0].length === 8 && date[0].split('/') && date[0].split('/').length === 3){
          this.txnData.push(this.mergeArray(date)); 
        }
      })
      this.header.splice(5);
      console.log('header Data---->', this.header);
      console.log('txnData Data---->', this.txnData);
      const customHeader = ['Tranaction Date', 'Details', 'Reference No', 'Date', 'Debit Amount']
      this.hdata = customHeader.map(data=>{
        const obj:any ={};
        if(data === 'Debit Amount'){
          obj.field = data;
          obj.valueGetter = (params:any) =>{
            let amount = params.data['Debit Amount'];
            if(amount && typeof(amount) === 'string'){
            return parseFloat(amount.replace(/[;,]/g,''));
            }
            return amount;
          };
          obj.sortable = true;
          obj.filter = true;
        }else{
          obj.field = data;
          obj.sortable = true;
          obj.filter = true;
        }        
        return obj;
      });
      this.tdata=this.txnData.map(txn=>{        
        const obj: any ={};
        this.hdata.forEach((data, index)=>{
          obj[data.field]=txn[index];
        });
        return obj;
      });
      console.log('ag-grid header Data---->', this.hdata);
      console.log('ag-grid txn Data---->', this.tdata);
      this.data.push(item);
      dataStr.push(item.join('\n'));
      this.textAreaRows += item.length;
    }
    // Set Return all the data
    this.csvText = dataStr.toString();
    this.textAreaRows += 5;
  }

  /** Get the files selected on the input file */
  incomingFiles(event: any) {
    this.files = event.target.files;
    this.csvText = '';
  }

  mergeArray(arr: any[]){
    // let amount = arr[arr.length -1];
    // arr[arr.length -1] = parseFloat(amount.replace(/[;,]/g,''));
    if(arr.length === 6){
      const [first, second, third, ...rest] = arr;
      const mergedArray = [first, `${second} ${third}`,...rest];
      return mergedArray;
    } else if(arr.length === 4){
      // const [first, second, third, ...rest] = arr;
      // const mergedArray = [first, 'text',second,third,];
      // arr
      // console.log('merge array 4---->',mergedArray,arr);
      arr.splice(1,0,"text");
      console.log('merge array 4---->',arr);
      return arr;
    }
    return arr;
  }

  save() {
    let wb = XLSX.utils.book_new();
    let ws_name = "SheetJS";
    for (const file of this.data) {
      let ws_data = [];
      for (const line of file) {
        ws_data.push(line.split(';'))
      }
      let ws = XLSX.utils.aoa_to_sheet(ws_data);
      XLSX.utils.book_append_sheet(wb, ws, ws_name);
    }
    /* Add the worksheet to the workbook */
    XLSX.writeFile(wb, 'teste.xlsx')
    console.log('Fez')
  }

}
