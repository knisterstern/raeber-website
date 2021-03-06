/**
 * Created by Sebastian Schüpbach (sebastian.schuepbach@unibas.ch) on 7/21/17.
 */

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdButtonModule,
  MdButtonToggleModule,
  MdCardModule,
  MdCheckboxModule,
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdDialogModule,
  MdMenuModule,
  MdSelectModule,
  MdSidenavModule,
  MdSlideToggleModule,
  MdToolbarModule,
  MdProgressBarModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';

import { SucheRoutingModule } from './suche-routing.module';
import { SucheComponent } from './suche.component';
import { TextgridModule } from '../shared/textgrid/textgrid.module';
import { SearchForOneResourceModule } from './searchForOneResourceComponent/searchForOneResource.module';
import { ParserModule } from './parser/parser.module';

import { SuchmaskeComponent } from './suchmaske/suchmaske.component';
import { BasicSearchComponent } from './basic-search/basic-search.component';
import { SuchmaskeHilfeComponent } from './suchmaske-hilfe/suchmaske-hilfe.component';
import { SucheWerkzeugleisteComponent } from './suche-werkzeugleiste/suche-werkzeugleiste.component';
import { SucheDarstellungsoptionenService } from './suche-darstellungsoptionen.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    SucheRoutingModule,
    MdButtonModule,
    MdButtonToggleModule,
    MdDialogModule,
    MdCardModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdMenuModule,
    MdCheckboxModule,
    MdToolbarModule,
    BrowserAnimationsModule,
    MdSelectModule,
    MdSidenavModule,
    TextgridModule,
    SearchForOneResourceModule,
    MdSlideToggleModule,
    ParserModule,
    MdProgressBarModule,
    RouterModule.forChild([
      { path: 'suche', component: SucheComponent }
    ])
  ],
  declarations: [
    SucheComponent,
    SuchmaskeComponent,
    SuchmaskeHilfeComponent,
    SucheWerkzeugleisteComponent,
    BasicSearchComponent
  ],
  exports: [
    SucheComponent,
    BasicSearchComponent
  ],
  entryComponents: [
    SuchmaskeHilfeComponent
  ],
  providers: [ SucheDarstellungsoptionenService ]
})
export class SucheModule {
}
