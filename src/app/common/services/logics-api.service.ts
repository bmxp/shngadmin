
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { map, catchError } from 'rxjs/operators';
import {of} from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class LogicsApiService {

  // Das Array groupExpanded dient dazu, den Auf-/Zuklapp Zustand des Accordeon-Tabs zu speichern,
  // während im Browser auf andere Komponenten gewechselt wird.
  groupExpanded: number[] = [];


  constructor(private http: HttpClient) {
  }


  getGroupsInfo() {
    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'logics/' + '?infotype=groups';
    if (apiUrl.includes('localhost')) {
      // url += '.json';
      url = apiUrl + 'logics/groups.json';
    }
    return this.http.get(url)
      .pipe(
        map(response => {
          const result = response;
          // console.warn('LogicsApiService.getGroupsInfo(): ', result);
          return result;
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('LogicsApiService.getGroupsInfo(): Could not read groups data' + ' - ' + err.error.error);
          return of({});
        })
      );
  }


  getLogics() {
    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'logics/';
    if (apiUrl.includes('localhost')) {
      url += 'default.json';
    }
    return this.http.get(url)
      .pipe(
        map(response => {
          const result = response;
          return result;
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('LogicsApiService.getLogics(): Could not read logics data' + ' - ' + err.error.error);
          return of({});
        })
      );
  }


  getLogic(logicname) {
    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'logics/' + logicname;
    if (apiUrl.includes('localhost')) {
      url += '.json';
    }
    return this.http.get(url)
      .pipe(
        map(response => {
          const result = response;
          return result;
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('LogicsApiService.getLogic(' + logicname + '): Could not read logics data' + ' - ' + err.error.error);
          return of({});
        })
      );
  }


  getLogicState(logicname) {
    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'logics/' + logicname + '?infotype=status';
    if (apiUrl.includes('localhost')) {
      url += '.json';
    }
    return this.http.get(url)
      .pipe(
        map(response => {
          const result = response;
          // console.warn('LogicsApiService.getLogicState(' + logicname + '): ', result);
          return result;
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('LogicsApiService.getLogicState(' + logicname + '): Could not read logics data' + ' - ' + err.error.error);
          return of({});
        })
      );
  }


  setLogicState(logicName, action, filename = '') {
    // valid actions are: 'trigger', 'enable', 'disable', 'load', 'unload', 'reload', 'delete', 'create'
    action = action.toLowerCase();
    // console.warn('LogicsApiService.setLogicState', {logicName}, {action});

    const apiUrl = sessionStorage.getItem('apiUrl');
    let url = apiUrl + 'logics/' + logicName + '?action=' + action;
    if (filename !== '') {
      url += '&filename=' + filename;
    }
    if (apiUrl.includes('localhost')) {
      console.warn('LogicsApiService.setLogicState', 'Cannot simulate setting states in dev environment\n', '- logic', logicName, ', action', action);
      return of(true);
    }

    return this.http.put(url, JSON.stringify(''))
      .pipe(
        map(response => {
          const result = <any>response;

          if (result) {
            // console.log('LogicsApiService.setLogicState', '- config', config, '\nresult', {result});
            if (result.result === 'ok') {
              // console.log('LogicsApiService.setLogicState', 'success');
              return true;
            } else {
              console.log('LogicsApiService.setLogicState', 'failed');
              alert('LogicsApiService.setLogicState:\n\n' + result.result + ': ' + result.description);
              return false;
            }

          } else {
            console.log('LogicsApiService.setLogicState', 'failed: Undefined result');
          }
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('LogicsApiService.setLogicState: Could not set logic state' + ' - ' + err.error.error);
          return of({});
        })
      );

  }


  saveLogicParameters(logicName, paramObj) {
    // paramObj is a dict containing the entries of the parameter section in etc/logic.yamls
    // parameters to be deleted must be included with an empty string as value!
    // console.warn('LogicsApiService.saveLogicParameters', {logicName}, {paramObj});

    const apiUrl = sessionStorage.getItem('apiUrl');
    const url = apiUrl + 'logics/' + logicName + '?action=' + 'saveparameters';
    if (apiUrl.includes('localhost')) {
      console.warn('LogicsApiService.saveLogicParameters', 'Cannot simulate saving parameters in dev environment\n', '- logic', logicName, ', action', paramObj);
      return of(true);
    }

    return this.http.put(url, JSON.stringify(paramObj))
      .pipe(
        map(response => {
          const result = <any>response;

          if (result) {
            // console.log('LogicsApiService.setLogicState', '- config', config, '\nresult', {result});
            if (result.result === 'ok') {
              // console.log('LogicsApiService.setLogicState', 'success');
              return true;
            } else {
              console.log('LogicsApiService.saveLogicParameters', 'fail');
              alert('LogicsApiService.saveLogicParameters:\n' + result.result + '\n' + result.description);
              return false;
            }

          } else {
            console.log('LogicsApiService.setLogicState', 'fail: undefined result');
          }
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('LogicsApiService.saveLogicParameters: Could not save logic parameters' + ' - ' + err.error.error);
          return of({});
        })
      );

  }


  saveLogicGroup(groupName, group) {

    const apiUrl = sessionStorage.getItem('apiUrl');
    const url = apiUrl + 'logics/' + groupName + '?action=' + 'savegroup';
    if (apiUrl.includes('localhost')) {
      console.warn('LogicsApiService.saveLogicGroup', 'Cannot simulate saving group in dev environment\n', '- group', groupName, ', data', group);
      return of(true);
    }

    return this.http.put(url, JSON.stringify(group))
      .pipe(
        map(response => {
          const result = <any>response;

          if (result) {
            console.log('LogicsApiService.saveLogicGroup', '- group', groupName, '\nresult', {result});
            if (result.result === 'ok') {
              console.log('LogicsApiService.saveLogicGroup', 'success');
              return true;
            } else {
              console.log('LogicsApiService.saveLogicGroup', 'fail');
              alert('LogicsApiService.saveLogicGroup:\n' + result.result + '\n' + result.description);
              return false;
            }

          } else {
            console.log('LogicsApiService.saveLogicGroup', 'fail: undefined result');
          }
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('LogicsApiService.saveLogicGroup: Could not save logic group' + ' - ' + err.error.error);
          return of({});
        })
      );

  }


  deleteLogicGroup(groupName) {

    const apiUrl = sessionStorage.getItem('apiUrl');
    const url = apiUrl + 'logics/' + groupName + '?action=' + 'deletegroup';
    if (apiUrl.includes('localhost')) {
      console.warn('LogicsApiService.deleteLogicGroup', 'Cannot simulate deleting group in dev environment\n', '- group', groupName);
      return of(true);
    }

    return this.http.put(url, JSON.stringify(''))
      .pipe(
        map(response => {
          const result = <any>response;

          if (result) {
            console.log('LogicsApiService.deleteLogicGroup', '- group', groupName, '\nresult', {result});
            if (result.result === 'ok') {
              console.log('LogicsApiService.deleteLogicGroup', 'success');
              return true;
            } else {
              console.log('LogicsApiService.deleteLogicGroup', 'fail');
              alert('LogicsApiService.deleteLogicGroup:\n' + result.result + '\n' + result.description);
              return false;
            }

          } else {
            console.log('LogicsApiService.deleteLogicGroup', 'fail: undefined result');
          }
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('LogicsApiService.deleteLogicGroup: Could not delete logic group' + ' - ' + err.error.error);
          return of({});
        })
      );

  }

}
