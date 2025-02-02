
/*
 * Copyright (c) Aista Ltd, and Thomas Hansen - For license inquiries you can contact thomas@ainiro.io.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IdeComponent } from '../ide.component';

const routes: Routes = [
  {
    path: '',
    component: IdeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IdeRoutingModule { }
