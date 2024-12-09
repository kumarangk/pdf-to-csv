import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AgGridModule } from 'ag-grid-angular';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes),AgGridModule],
  exports: [RouterModule,AgGridModule]
})
export class AppRoutingModule { }
