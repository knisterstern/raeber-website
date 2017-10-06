import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { globalSearchVariableService } from './globalSearchVariablesService';
import { AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';


@Component({
  moduleId: module.id,
  selector: 'rae-suche',
  templateUrl: 'suche.component.html',
  styleUrls: [ 'suche.component.css' ]
})
export class SucheComponent implements OnInit {
  vocabulary: 'http%3A%2F%2Fwww.knora.org%2Fontology%2Ftext';
  numberOfComponents = 1;

  myResources: Array<any>;
  myProperties: Array<any>;
  searchResult: Array<any>;
  selectedResource: string;
  selectedProperty: string;
  boolOperator: string;
  encodedURL: string;
  searchForVal: string;
  query: string;
  availableboolOperators = [
    { name: 'equal to', operator: 'EQ' },
    { name: 'not equal to', operator: '!EQ' },
    { name: 'greater than', operator: 'GT' },
    { name: 'greater or equal', operator: 'GT_EQ' },
    { name: 'lower than', operator: 'LT' },
    { name: 'lower or equal than', operator: 'LT_EQ' },
    { name: 'exists', operator: 'EXISTS' },
    { name: 'match', operator: 'MATCH' },
    { name: 'like', operator: 'LIKE' },
    { name: '!like', operator: '!LIKE' },
    { name: 'match_boolean', operator: 'MATCH_BOOLEAN' }
  ];
  arraySize: number;
  array = [
    1
  ];
  i: number;
  j: number;
  k: number;
  l: number;
  m: number;
  o: number;
  isAlreadyInArray = 0;
  helperMap = new Map();
  mapOfAllQueries = new Map();
  count = 0;
  numberOfPropertiesInSearchBox = '';
  str: string;
  value: string;
  keys: Array<any>;
  finalQueryArray = [ '' ];
  currentSearchBox = '1';
  allSearchResults: Array<any>;
  notizbuchDisabled = false;
  manuskriptDisabled = false;
  typoscriptDisabled = false;
  druckDisabled = false;
  materialDisabled = false;
  inputSearchStringToBeParsed: string;
  numberOfQueries = 0;
  input: Array<any>;
  searchTerm: string;
  numberOfSearchResults: number;
  queries: Array<any>;
  partOfAllSearchResults: Array<any>;
  trueIfDuplicate = false;
  temporarySearchResults: Array<any>;
  finalTemporaryResults: Array<any>;
  firstTermAfterOr = true;

  constructor(private http: Http, private route: ActivatedRoute, private location: Location) {
    this.route.params.subscribe(params => console.log(params));
  }

  handleSearchEvent(arg: AbstractControl) {
    console.log(arg);
    //Send String to Parser:
    this.inputSearchStringToBeParsed = arg.get('suchwortForm').value.suchwortInput;
    this.location.replaceState('/suche/' + this.inputSearchStringToBeParsed);
  }

  ngOnInit() {
    //console.log(this.vocabulary);
    this.initialQuery();
    if (!this.inputSearchStringToBeParsed) {
      this.inputSearchStringToBeParsed = this.route.snapshot.params[ 'queryParameters' ];
      console.log('Queryparameters: ' + this.inputSearchStringToBeParsed);
    }
    if (this.allSearchResults === undefined) {
      this.numberOfSearchResults = 0;
    } else {
      this.numberOfSearchResults = this.allSearchResults.length;
    }
  }

  initialQuery() {
    return this.http.get
    (
      globalSearchVariableService.API_URL +
      globalSearchVariableService.resourceTypesPath +
      globalSearchVariableService.initialVocabulary
    )
      .map(
        (lambda: Response) => {
          const data = lambda.json();
          console.log(data);
          return data.resourcetypes;
        }
      )
      .subscribe(response => this.myResources = response);
  }

  propertyQuery(): Subscription {
    if (this.selectedResource !== undefined) {

      //console.log('Path to request property:' + globalSearchVariableService.propertyListsQuery);
      this.encodedURL = encodeURIComponent(this.selectedResource);
      //console.log('Selected resource:' + this.encodedURL);

      return this.http.get(globalSearchVariableService.API_URL + globalSearchVariableService.propertyListsQuery + this.encodedURL)
        .map(
          (lambda: Response) => {
            const data = lambda.json();
            console.log(data);
            return data.properties;
          }
        )
        .subscribe(response => this.myProperties = response);
    } else {
      return null;
    }
  }


  finalQuery() {
    this.query = globalSearchVariableService.API_URL +
      globalSearchVariableService.extendedSearch +
      encodeURIComponent(this.selectedResource) +
      globalSearchVariableService.extendedProperty +
      encodeURIComponent(this.selectedProperty) +
      globalSearchVariableService.compareOperator +
      this.boolOperator +
      globalSearchVariableService.searchval +
      encodeURIComponent(this.searchForVal);
    //console.log(
    //'Final extended search URl: ' + this.query);
    return this.http.get(this.query)
      .map(
        (lambda: Response) => {
          const data = lambda.json();
          console.log(data);
          return data.subjects;
        }
      )
      .subscribe(response => this.searchResult = response);
  }

  increaseNumberOfComponents() {
    this.numberOfComponents += 1;
    console.log(this.numberOfComponents);
    console.log(typeof this.arraySize);
  }

  increaseArrayElement() {
    this.arraySize = this.array[ this.array.length - 1 ];
    this.arraySize += 1;
    this.array.push(this.arraySize);
    console.log(this.arraySize);
  }

  updateQuerySet(propertyTriple: Array<any>) {
    this.k = 0;
    // Case: setOfAllQueries it totally empty:
    console.log('PropertyTriple: ' + propertyTriple);
    console.log('Resource: ' + this.selectedResource);
    this.mapOfAllQueries.set(
      propertyTriple[ 0 ].toString() + propertyTriple[ 1 ].toString(), [
        propertyTriple[ 2 ], [
          propertyTriple[ 3 ], propertyTriple[ 4 ]
        ]
      ]
    );
    this.str = JSON.stringify(this.mapOfAllQueries, null, 4);
    console.log(this.str);
    //Final list of Queries:
    this.keys = Array.from(this.mapOfAllQueries.keys());
    console.log(this.keys);
    this.mapOfAllQueries.forEach(
      value => {
        if (this.keys[ this.k ][ 1 ] === '1') {
          this.searchTerm = value[ 1 ][ 1 ];
          console.log('Add first property');
          this.finalQueryArray[ this.keys[ this.k ][ 0 ] - 1 ] =
            globalSearchVariableService.API_URL
            + globalSearchVariableService.extendedSearch
            + encodeURIComponent(propertyTriple[ 5 ])
            + globalSearchVariableService.extendedProperty
            + encodeURIComponent(value[ 0 ])
            + globalSearchVariableService.compareOperator
            + value[ 1 ][ 0 ]
            + globalSearchVariableService.searchval
            + encodeURIComponent(value[ 1 ][ 1 ]);
        } else {
          console.log('Add additional property');
          this.finalQueryArray[ this.keys[ this.k ][ 0 ] - 1 ]
            += globalSearchVariableService.extendedProperty
            + encodeURIComponent(value[ 0 ])
            + globalSearchVariableService.compareOperator
            + value[ 1 ][ 0 ]
            + globalSearchVariableService.searchval
            + encodeURIComponent(value[ 1 ][ 1 ]);
        }
        this.k++;
        console.log(value[ 0 ]);
        for (this.i = 0; this.i < value[ 1 ].length; this.i++) {
          console.log(value[ 1 ][ this.i ]);
        }
      }
    );

  }

  executeFinalQueriesOld() {
    //Old generic Search:
    console.log('Execute final query old');
    this.allSearchResults = undefined;
    if (this.finalQueryArray) {
      this.allSearchResults = [];
      console.log(this.finalQueryArray);
      for (this.i = 0; this.i < this.finalQueryArray.length; this.i++) {
        this.performQueryOld(this.finalQueryArray[ this.i ]);
      }
    }
  }

  executeFinalQueries() {
    this.executeFinalQueriesOld();
    if (!this.queries) {
      console.log('No query defined');
    } else {
      this.allSearchResults = undefined;
      console.log('execute simple full text search');
      this.translateQueriesReturnedFromParserToKnoraRequests(this.queries);
    }
  }


  performQueryOld(query: string) {
    return this.http.get(query)
      .map(
        (lambda: Response) => {
          const data = lambda.json();
          console.log(data);
          this.k = 0;
          if (data.subjects !== undefined) {
            if (this.allSearchResults === undefined) {
              this.allSearchResults = [];
            }
            this.allSearchResults.push.apply(this.allSearchResults, data.subjects);
            /*
             if(data.obj_id !== undefined) {
             this.allSearchResults.push.apply(this.allSearchResults, data.subjects);
             } else {
             console.log('Keine Treffer fuer diese Suchanzeige');
             }*/
            if (this.allSearchResults === undefined) {
              this.numberOfSearchResults = 0;
            } else {
              this.numberOfSearchResults = this.allSearchResults.length;
            }
          }
          console.log(this.allSearchResults);
          return data.subjects;
        }
      )
      .subscribe(response => this.searchResult = response);
  }

  translateQueriesReturnedFromParserToKnoraRequests(queries: Array<any>) {
    this.str = JSON.stringify(queries, null, 4);
    console.log('Queries: ' + this.str);
    this.numberOfQueries = 0;
    this.temporarySearchResults = undefined;
    for (this.i = 0; this.i < queries.length; this.i++) {
      this.firstTermAfterOr = true;
      console.log('Request Group nr: ' + this.i);
      this.finalTemporaryResults = undefined;
      this.temporarySearchResults = undefined;
      for (this.j = 0; this.j < queries[ this.i ].length; this.j++) {
        if (this.j !== 0) {
          console.log('And merge with?');
        }
        this.numberOfQueries += 1;
        console.log('Search for: '
          + queries[ this.i ][ this.j ].searchString
          + ' in: ' + queries[ this.i ][ this.j ].where);
        this.searchTerm = queries[ this.i ][ this.j ].searchString;
        this.performQuery(this.searchTerm, queries[ this.i ][ this.j ].where, this.firstTermAfterOr, this.i, queries[ this.i ].length);
        this.firstTermAfterOr = false;
      }
    }
  }

  getQueries(queries: Array<any>) {
    this.queries = queries;
  }

  performQuery(searchTerm: string, location: string, firstTermAfterOr: boolean, searchGroup: number, numberOfTermsInSearchGroup: number) {
    if (location === 'anywhere') {
      this.performSearchInTitle(searchTerm, firstTermAfterOr, searchGroup, numberOfTermsInSearchGroup);
    }
  }

  performSearchInTitle(searchTerm: string, firstTermAfterOr: boolean, searchGroup: number, numberOfTermsInSearchGroup: number) {
    return this.http.get(
      globalSearchVariableService.API_URL +
      globalSearchVariableService.extendedSearch +
      'http%3A%2F%2Fwww.knora.org%2Fontology%2Fkuno-raeber%23Convolute' +
      '&property_id=http%3A%2F%2Fwww.knora.org%2Fontology%2Ftext%23hasConvoluteTitle' +
      '&compop=LIKE' +
      '&searchval=' +
      encodeURIComponent(searchTerm))
      .map(
        (lambda: Response) => {
          const data = lambda.json();
          console.log(data);
          if (data.subjects[ 0 ] !== undefined) {
            this.addToTemporarySearchResultArray(data.subjects, firstTermAfterOr, searchGroup, numberOfTermsInSearchGroup);
          } else {
            console.log('Keine Treffer fuer diese Suche');
          }
          return data.properties;
        }
      )
      .subscribe(response => this.myProperties = response);
  }

  // For more statements between the ORs
  // Scenarios: 2 times the same word, one word without output
  addToTemporarySearchResultArray(searchResults: Array<any>,
                                  firstTermAfterOr: boolean,
                                  searchGroup: number,
                                  numberOfTermsInSearchGroup: number) {
    console.log('Add to temporary Search Results and only take one of the duplicates');
    console.log('firstTermAfterOr: ' + firstTermAfterOr);
    console.log(searchResults);
    console.log(this.temporarySearchResults);
    if (searchResults !== undefined) {
      if (this.temporarySearchResults === undefined) {
        this.temporarySearchResults = [];
        this.temporarySearchResults[ searchGroup ] = searchResults;
      }
      if (this.temporarySearchResults[ searchGroup ] === undefined) {
        this.temporarySearchResults[ searchGroup ] = searchResults;
        console.log(this.temporarySearchResults);
      } else {
        for (this.l = 0; this.l < searchResults.length; this.l++) {
          console.log('SearchGroup:' + searchGroup);
          for (this.m = 0; this.m < this.temporarySearchResults[ searchGroup ].length; this.m++) {
            if (searchResults[ this.l ].obj_id === this.temporarySearchResults[ searchGroup ][ this.m ].obj_id) {
              console.log('found duplicate in temporary array');
              if (this.finalTemporaryResults === undefined) {
                this.finalTemporaryResults = [];
              }
              this.finalTemporaryResults[ this.finalTemporaryResults.length ] = searchResults[ this.l ];
            }
          }
        }
      }
      //TODO: consider more than 2 searchTerms between ORs
      //Following statement for one search without output
      if (searchResults.length === 0 && this.temporarySearchResults !== undefined) {
        this.addToFinalSearchResultArray(this.temporarySearchResults);
      }
      console.log('Final Temporary Search Results: ');
      console.log(this.finalTemporaryResults);
      this.addToFinalSearchResultArray(this.finalTemporaryResults);
      console.log('Number of terms in searchgroup: ' + numberOfTermsInSearchGroup);
      if (numberOfTermsInSearchGroup === 1) {
        this.addToFinalSearchResultArray(searchResults);
      }
    }
  }

  addToFinalSearchResultArray(searchResults: Array<any>) {
    console.log('Add to final Search Results');
    console.log(searchResults);
    console.log(this.allSearchResults);
    if (searchResults !== undefined && searchResults.length !== 0) {
      if (this.allSearchResults === undefined) {
        this.allSearchResults = [];
        this.allSearchResults = searchResults;
      } else {
        for (this.k = 0; this.k < searchResults.length; this.k++) {
          for (this.o = 0; this.o < this.allSearchResults.length; this.o++) {
            if (searchResults[ this.k ].obj_id === this.allSearchResults[ this.o ].obj_id) {
              console.log('found duplicate in final array');
              this.trueIfDuplicate = true;
            }
          }
          if (this.trueIfDuplicate === false) {
            this.allSearchResults[ this.allSearchResults.length ] = searchResults[ this.k ];
            console.log('allSearchResults after appending: ');
            console.log(this.allSearchResults);
          } else {
            this.trueIfDuplicate = false;
          }
        }
      }
      if (this.allSearchResults === undefined) {
        this.numberOfSearchResults = 0;
      } else {
        this.numberOfSearchResults = this.allSearchResults.length;
      }
    }
  }

}