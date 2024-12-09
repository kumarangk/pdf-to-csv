import { Component, Input, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-dynamic-ag-grid',
  templateUrl: './dynamic-ag-grid.component.html',
  styleUrls: ['./dynamic-ag-grid.component.scss']
})
export class DynamicAgGridComponent implements OnInit {
  private gridApi!: GridApi;
  private gridColumnApi!: any;

  columnDefs: ColDef[] = [];
  rowData: any[] = [];
  @Input() header:any;
  @Input() data:any;
  constructor() { }

  ngOnInit(): void {
    // Dynamically generate column definitions
    const columnNames = ['Column1', 'Column2', 'Column3'];
    this.columnDefs = [
      { field: 'Column 1', sortable: true, filter: true },
      { field: 'Column 2', sortable: true, filter: true },
      { field: 'Column 3', sortable: true, filter: true }
  ];
  this.rowData = [
    ['Data 1.1', 'Data 1.2', 'Data 1.3'],
    ['Data 2.1', 'Data 2.2', 'Data 2.3'],
    ['Data 3.1', 'Data 3.2', 'Data 3.3']
];

    // Sample data
    // this.rowData = [
    //   ['Data 1.1', 'Data 1.2', 'Data 1.3'],
    //   ['Data 2.1', 'Data 2.2', 'Data 2.3'],
    //   ['Data 3.1', 'Data 3.2', 'Data 3.3'],
    // ];
    const rowDataStrings = [
      ['Data 1.1', 'Data 1.2', 'Data 1.3'],
      ['Data 2.1', 'Data 2.2', 'Data 2.3'],
      ['Data 3.1', 'Data 3.2', 'Data 3.3']
  ];
  
  // Assuming columnDefs is already defined
  const formattedRowData = this.rowData.map(row => {
    let obj: {[key: string]: string}  = {};
    columnNames.forEach((colName, index) => {
      obj[index] = row[index];
    });
    console.log('pbj-->',obj)
    return obj;
  });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.calculateTotal(params);
  }

  onModelUpdated(event: any) {
    this.addTotalRow(event);
  }

  calculateTotal(params:any){
    let total = 0;
    params.api.forEachNode((node: any) => {
      total += node.data['Debit Amount'] ? parseFloat(node.data['Debit Amount'].replace(/[;,]/g, '')) : 0;
    });
    console.log('total---->',total);
    // Add the total row to the data
    this.addTotalRow(total);
  }

  addTotalRow(total: number) {
    // Add a new row at the end of the rowData array with the total
    const totalRow = {
      Total: `Total: ${total}`
    };

    // Push the total row to the rowData array
    this.data.push(totalRow);
    console.log(' add total row data---->',this.data);

    // Refresh the grid data to display the new row
    this.gridApi.setRowData(this.data);
  }
  }
