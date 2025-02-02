
/*
 * Copyright (c) Aista Ltd, and Thomas Hansen - For license inquiries you can contact thomas@ainiro.io.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HyperlambdaPlaygroundComponent } from '../hyperlambda-playground.component';
import { HyperlambdaPlaygroundRoutingModule } from './hyperlambda-playground.routing.module';
import { ComponentsModule } from 'src/app/_general/components/components.module';
import { MaterialModule } from 'src/app/material.module';
import { CmModule } from 'src/app/codemirror/_module/cm.module';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

@NgModule({
  declarations: [
    HyperlambdaPlaygroundComponent
  ],
  imports: [
    CommonModule,
    HyperlambdaPlaygroundRoutingModule,
    ComponentsModule,
    MaterialModule,
    CmModule,
    CodemirrorModule
  ]
})
export class HyperlambdaPlaygroundModule { }
