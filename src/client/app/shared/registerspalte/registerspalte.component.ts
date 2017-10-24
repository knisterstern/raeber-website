/**
 * Created by Reto Baumgartner (rfbaumgartner) on 27.06.17.
 */

import { Component, Input, OnChanges } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AlphabeticalSortingService } from '../utilities/alphabetical-sorting.service';
import { DateFormatService } from '../utilities/date-format.service';
import { globalSearchVariableService } from '../../suche/globalSearchVariablesService';

@Component({
  moduleId: module.id,
  selector: 'rae-registerspalte',
  templateUrl: 'registerspalte.component.html',
  styleUrls: [ 'registerspalte.component.css' ],
  providers: [ AlphabeticalSortingService, DateFormatService ]
})
export class RegisterspalteComponent implements OnChanges {

  @Input() konvolutIRI: string;
  @Input() poemsFromKonvolut: Array<any>;
  @Input() konvolutView: boolean;

  konvolutIRItoStartownRequest: string;
  poems: Array<any>;
  poemsOld: Array<any>;
  poemIRIArray: Array<any>;
  nrOfPoems: number;
  konvolutId: string;
  konvolutType: string;
  knoraKonvolutType: string;
  konvolutTypeMap: any = {
    'poem notebook': 'notizbuecher',
    'poem manuscript convolute': 'manuskripte',
    'poem typescript convolute': 'typoskripte',
    'poem typescript convolute with image': 'typoskripte',
    'printed poem book publication': 'drucke',
    'poly-author publication convolute': 'drucke',
    'poem postcard convolute': 'manuskripte',
    'diary convolute': 'material',
    'letter convolute': 'material'
  };
  konvolutTitle: string;
  sortingType: string;
  private sub: any;

  constructor(private http: Http, private sortingService: AlphabeticalSortingService,
              private dateFormatService: DateFormatService) {
  }

  ngOnChanges() {
    if(this.konvolutView) {
      //console.log('dont do request again');
      this.updatePoemInformation(this.poemsFromKonvolut);
    } else {
      if(this.konvolutIRI) {
        this.konvolutIRItoStartownRequest = this.konvolutIRI;
        //console.log('start own request with konvolut - IRI: ' + this.konvolutIRI);
      }
    }
    //console.log(this.poemsFromKonvolut);
    // infos for title and routing
    if (this.konvolutIRI !== undefined) {
      this.sub = this.http.get(globalSearchVariableService.API_URL + '/resources/' + encodeURIComponent(this.konvolutIRI))
        .map(response => response.json()).subscribe(res => {
          this.konvolutTitle = res.props[ 'http://www.knora.org/ontology/text#hasConvoluteTitle' ].values[ 0 ].utf8str;
          this.konvolutId = res.props[ 'http://www.knora.org/ontology/text#hasAlias' ].values[ 0 ].utf8str;
          this.knoraKonvolutType = res.resinfo.restype_label;
          this.konvolutType = this.konvolutTypeMap[ this.knoraKonvolutType ];
        });
    }
  }

  updatePoemInformation(poemInformation: Array<any>) {
    //console.log('Update Poem Information');
    this.poems = [];
    if(poemInformation !== undefined) {
      for (let i = 0; i < poemInformation.length; i++) {
        if (poemInformation[i] !== undefined) {
          this.poems[poemInformation[i]['11'] - 1] = [];
          this.poems[poemInformation[i]['11'] - 1][0] = poemInformation[i][0];
          this.poems[poemInformation[i]['11'] - 1][1] = poemInformation[i][1];
          this.poems[poemInformation[i]['11'] - 1][2] = this.removeHtml(poemInformation[i][2]);
          this.poems[poemInformation[i]['11'] - 1][3] = poemInformation[i][3];
          this.poems[poemInformation[i]['11'] - 1][8] = poemInformation[i][8];
          this.poems[poemInformation[i]['11'] - 1][11] = poemInformation[i][11];
          this.poems[poemInformation[i]['11'] - 1][10] = poemInformation[i][10];
        }
      }
      this.nrOfPoems = poemInformation.length;
    }
    //console.log(this.poems);

    this.sortingType = 'alphabetic';
  }

  createPoemIRIList(poemIRIList: Array<any>) {
    this.poemIRIArray = poemIRIList;
  }

  sortAlphabetically() {
    this.sortingType = 'alphabetic';
    this.poemsOld = [];
    this.poemsOld = this.poems;
    this.poems = [];
    for (let i = 0; i < this.poemsOld.length; i++) {
      //console.log('Alphabetic index: ' + this.poemsOld[i].alphabeticIndex + ' PoemTitle: ' + this.poemsOld[i].title);
      if(this.poemsOld[i]) {
        this.poems[this.poemsOld[i][ '11' ] - 1] = this.poemsOld[i];
      }
    }
    /*this.poems = this.poems.sort((n1, n2) => {
      const k1 = this.sortingService.germanAlphabeticalSortKey(n1.title);
      const k2 = this.sortingService.germanAlphabeticalSortKey(n2.title);
      if (k1 > k2) {
        return 1;
      }

      if (k1 < k2) {
        return -1;
      }

      return 0;
    });*/
  }

  sortChronologically() {
    //console.log('Sort chronologically');
    this.sortingType = 'chronologic';
    //console.log(this.poems);
    this.poemsOld = [];
    this.poemsOld = this.poems;
    this.poems = [];
    //console.log(this.poems);
    for (let i = 0; i < this.poemsOld.length; i++) {
      this.poems[this.poemsOld[i][ '8' ] - 1] = this.poemsOld[i];
    }
    //console.log(this.poems);
    // Sortiere nach obj_id bis eine interne Nummerierung da ist
    // TODO passe an entsprechende Datentypen der Felder an
    /*this.poems = this.poems.sort((n1, n2) => {
      let k1;
      let k2;
      if (this.konvolutType === 'notizbuecher' || this.konvolutType === 'manuskripte') {
        k1 = n1.date;
        k2 = n2.date;
      } else {
        k1 = n1.reihe;
        k2 = n2.reihe;
      }
      if (k1 > k2) {
        return 1;
      }

      if (k1 < k2) {
        return -1;
      }

      return 0;
    });*/
  }

  formatDate(date: string) {
    return this.dateFormatService.germanLongDate(date);
  }

  produceFassungsLink(poem: Array<any>) {
    if(poem) {
      if (poem[0] !== undefined && poem[3] !== undefined) {
        return poem[0].split('/')[ 0 ] + '---' + poem[3].split('raeber/')[ 1 ];
      } else {
        return 'Linkinformation has not arrived yet';
      }
    } else {
      return null;
    }
  }

  removeHtml(content: string) {
    if (content !== undefined) {
      return content.replace(/<[^>]+>/g, '');
    } else {
      return undefined;
      //console.log('no value yet');
    }
  }

}
