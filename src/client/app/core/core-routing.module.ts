import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomepageComponent } from '../statisch/homepage.component';
import { ImpressumComponent } from '../statisch/impressum.component';
import { SignaturenComponent } from '../statisch/signaturen.component';
import { WerklisteSelbstComponent } from '../statisch/werkliste-selbst.component';
import { WerklisteUnselbstComponent } from '../statisch/werkliste-unselbst.component';
import { LebensdatenComponent } from '../statisch/lebensdaten.component';
import { AnleitungComponent } from '../statisch/anleitung.component';
import { WerkausgabeComponent } from '../statisch/werkausgabe.component';
import { TextausagabenComponent } from '../statisch/textausgaben.component';
import { SucheModule } from '../suche/suche.module';
import { PdfNotizbuecherComponent } from '../statisch/pdf-notizbuecher.component';
import { PdfSynopsenComponent } from '../statisch/pdf-synopsen.component';
import { PageNotFoundComponent } from './404.component';
import { HomepageWithInitTextComponent } from '../statisch/homepagewithinittext.component';

@NgModule({
  imports: [
    SucheModule,
    RouterModule.forRoot([
      { path: 'werkausgabe', component: WerkausgabeComponent },
      { path: 'textausgaben', component: TextausagabenComponent },
      { path: 'material/pdf-dateien/notizbuecher', component: PdfNotizbuecherComponent },
      { path: 'anleitung', component: AnleitungComponent },
      { path: 'lebensdaten', component: LebensdatenComponent },
      { path: 'werkliste-selbst', component: WerklisteSelbstComponent },
      { path: 'werkliste-unselbst', component: WerklisteUnselbstComponent },
      { path: 'signaturen', component: SignaturenComponent },
      { path: 'impressum', component: ImpressumComponent },
      { path: 'material/pdf-dateien/synopsen', component: PdfSynopsenComponent },
      { path: '', redirectTo: '/init', pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent }
    ])
  ],
  exports: [ RouterModule ]
})
export class CoreRoutingModule {
}

export const routingComponents = [
  AnleitungComponent,
  HomepageComponent,
  HomepageWithInitTextComponent,
  ImpressumComponent,
  LebensdatenComponent,
  PageNotFoundComponent,
  PdfNotizbuecherComponent,
  PdfSynopsenComponent,
  SignaturenComponent,
  WerkausgabeComponent,
  TextausagabenComponent,
  WerklisteSelbstComponent,
  WerklisteUnselbstComponent
];

