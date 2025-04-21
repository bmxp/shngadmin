
import { Component, AfterViewChecked, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
// import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

import { saveAs } from 'file-saver';

import {ServicesApiService} from '../common/services/services-api.service';
import {ServerApiService} from '../common/services/server-api.service';
import {FilesApiService} from '../common/services/files-api.service';

import { ServerInfo } from '../common/models/server-info';
import {TranslateService} from '@ngx-translate/core';
import {SharedService} from '../common/services/shared.service';

import {sha512} from 'js-sha512';
// import {LogicsWatchItem} from '../common/models/logics-watch-item';
// import {SelectItem} from 'primeng/api';


export interface CacheEntryType {
  filename: string;
  created: string;
  last_modified: string;
  checked?: boolean;
}


@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: []
})


export class ServicesComponent implements AfterViewChecked, OnInit {

//  schedulerinfo: SchedulerInfo[];

  constructor(private http: HttpClient,
              private translate: TranslateService,
              public  shared: SharedService,
              private fileService: FilesApiService,
              private dataService: ServicesApiService,
              private dataServiceServer: ServerApiService,
              private titleService: Title) {
  }

  serverInfo = <ServerInfo>{};
  default_language: string;
  shng_status: string;
  status_errorcount = 0;

  valid_languagelist = [];

  valid_default_language = '          ';
  selected_language = null;
  shng_statuscode = 0;

  pwd_clear = '';
  pwd_hash: string;
  pwd_show: boolean;

  backup_disabled = false;
  restore_disabled = false;
  show_backup_confirm = false;
  show_restore_chooser = false;

  // -----------------------------------------------------------------
  //  Vars for the codemirror components
  //
  rulers = [];

  // -----------------------------------------------------
  //  Vars for the EVAL syntax checker
  //
  @ViewChild('evalcodeeditor', { static: true }) private evalCodeEditor;
  @ViewChild('evalcodeeditor2', { static: true }) private evalCodeEditor2;

  myEvalTextarea = '';
  myRelativeTo = '';
  myEvalResult = '';
  myResultType = '';
  cmEvalOptions = {
    indentWithTabs: false,
    indentUnit: 4,
    tabSize: 4,
    extraKeys: {
      'Tab': 'insertSoftTab',
      'Shift-Tab': 'indentLess'
    },
    lineNumbers: true,
    readOnly: false,
    lineSeparator: '\n',
    rulers: this.rulers,
    mode: 'python',
    lineWrapping: false,
    firstLineNumber: 1,
    autorefresh: true,
    fixedGutter: true,
  };

  myEvalTextOutput = '';
  cmEvalOptionsOutput = {
    indentWithTabs: false,
    indentUnit: 4,
    tabSize: 4,
    extraKeys: {
      'Tab': 'insertSoftTab',
      'Shift-Tab': 'indentLess'
    },
    lineNumbers: true,
    readOnly: false,
    lineSeparator: '\n',
    rulers: this.rulers,
    mode: 'python',
    lineWrapping: false,
    firstLineNumber: 1,
    autorefresh: true,
    fixedGutter: true,
  };


  // -----------------------------------------------------
  //  Vars for the YAML syntax checker
  //
  @ViewChild('codeeditor', { static: true }) private codeEditor;
  @ViewChild('codeeditor2', { static: true }) private codeEditor2;

  myTextarea = '';
  cmOptions = {
    indentWithTabs: false,
    indentUnit: 4,
    tabSize: 4,
    extraKeys: {
      'Tab': 'insertSoftTab',
      'Shift-Tab': 'indentLess'
    },
    lineNumbers: true,
    readOnly: false,
    lineSeparator: '\n',
    rulers: this.rulers,
    mode: 'yaml',
    lineWrapping: false,
    firstLineNumber: 1,
    autorefresh: true,
    fixedGutter: true,
  };

  myTextOutput = '';
  cmOptionsOutput = {
    indentWithTabs: false,
    indentUnit: 4,
    tabSize: 4,
    extraKeys: {
      'Tab': 'insertSoftTab',
      'Shift-Tab': 'indentLess'
    },
    lineNumbers: true,
    readOnly: false,
    lineSeparator: '\n',
    rulers: this.rulers,
    mode: 'yaml',
    lineWrapping: false,
    firstLineNumber: 1,
    autorefresh: true,
    fixedGutter: true,
  };

  // -----------------------------------------------------
  //  Vars for the YAML converter
  //
  @ViewChild('convertercodeeditor', { static: true }) private converterCodeEditor;
  @ViewChild('convertercodeeditor2', { static: true }) private converterCodeEditor2;

  myConverterTextarea = '';
  cmConveterOptions = {
    lineNumbers: true,
    readOnly: false,
    indentUnit: 4,
    lineSeparator: '\n',
    rulers: this.rulers,
    // mode: 'yaml',
    lineWrapping: false,
    firstLineNumber: 1,
    indentWithTabs: false,
    autorefresh: true,
    fixedGutter: true,
  };

  myConverterTextOutput = '';
  cmConverterOptionsOutput = {
    lineNumbers: true,
    readOnly: false,
    indentUnit: 4,
    lineSeparator: '\n',
    rulers: this.rulers,
    mode: 'yaml',
    lineWrapping: false,
    firstLineNumber: 1,
    indentWithTabs: false,
    autorefresh: true,
    fixedGutter: true,
  };

  cacheInfo: CacheEntryType[] = [];
  cacheAllChecked: boolean;

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }


  ngOnInit() {
    // console.log('ServicesComponent.ngOnInit');

    for (let i = 1; i <= 100; i++) {
      this.rulers.push({color: '#eee', column: i * 4, lineStyle: 'dashed'});
    }

    this.dataServiceServer.getServerinfo()
      .subscribe(
        (response) => {
          this.shng_status = '?';
          this.default_language = sessionStorage.getItem('default_language');

          this.serverInfo = <ServerInfo> response;

          this.getShngStatus();

//        this.valid_languagelist = [{label: 'English', value: 'en'},{label: 'Deutsch', value: 'de'},{label: 'Français', value: 'fr'},
//        {label: 'Polski', value: 'pl'}];
          this.valid_languagelist = [
            {label: 'English', value: 'en'},
            {label: 'Deutsch', value: 'de'},
            {label: 'Français', value: 'fr'}
            ];

          // this.valid_default_language = 'Deutsch';
          this.selected_language = this.default_language;

          this.setTitle(this.translate.instant('SERVICES.SERVICES'));

          this.loadCacheOrphans();
        }
      );

  }


  loadCacheOrphans() {

    this.dataService.getCacheOrphans()
      .subscribe(
        (response) => {
          this.cacheInfo = <CacheEntryType[]> response;
          this.cacheAllChecked = false;
          // console.log('loadChacheOrphans', this.cacheInfo);
        }
      );
  }


  deleteCacheEntry(entryNr) {
    // console.log('deleteCacheEntry', this.cacheInfo[entryNr].filename);
    this.dataService.deleteCacheFile(this.cacheInfo[entryNr].filename)
      .subscribe(
        () => {
          this.loadCacheOrphans();
        }
      );
  }


  deleteCacheSelected() {
    const filelist = [];
    for (let i = 0; i < this.cacheInfo.length; i++) {
      if (this.cacheInfo[i].checked) {
        filelist.push(this.cacheInfo[i].filename);
      }
    }

    this.dataService.deleteCacheFile(JSON.stringify(filelist))
      .subscribe(
        () => {
          this.loadCacheOrphans();
        }
      );

  }


  cacheCheckAll() {
    for (let i = 0; i < this.cacheInfo.length; i++) {
      this.cacheInfo[i].checked = this.cacheAllChecked;
    }
  }


  ngAfterViewChecked() {

    const evalEditor1 = this.evalCodeEditor.codeMirror;
    const evalEditor2 = this.evalCodeEditor2.codeMirror;
    // const h = evalEditor1.getViewport();

    evalEditor1.setSize('100%', 160);
    evalEditor1.refresh();
    evalEditor2.setSize('100%', 160);
    evalEditor2.refresh();

    const editor1 = this.codeEditor.codeMirror;
    const editor2 = this.codeEditor2.codeMirror;
    editor1.refresh();
    editor2.refresh();
    const editor3 = this.converterCodeEditor.codeMirror;
    const editor4 = this.converterCodeEditor2.codeMirror;
    editor3.refresh();
    editor4.refresh();
  }


  createPwdHash() {
    console.log('createPwdHash');
    this.pwd_hash = sha512(this.pwd_clear);
  }


  checkYaml() {
    // this.myTextoutput = this.myTextarea;

    this.dataService.CheckYamlText(this.myTextarea)
      .subscribe(
        (response) => {
          this.myTextOutput = <any> response;
          this.cmOptionsOutput.lineNumbers = true;
          // if (this.myTextOutput.startsWith('ERROR:')) {
          //   this.cmOptionsOutput.lineNumbers = false;
          // }
          this.cmOptionsOutput.lineNumbers = !(this.myTextOutput.startsWith('ERROR:'));
          const editor2 = this.codeEditor2.codeMirror;
          editor2.refresh();
        }
      );

  }


  checkEval() {
    const evalData = {'expression': this.myEvalTextarea, 'relative_to': this.myRelativeTo};
    this.dataService.CheckEvalData(evalData)
      .subscribe(
        (response) => {
          const myResponse = <any> response;
          this.myEvalTextOutput = myResponse.expression;
          this.myResultType = myResponse.type;
          if (this.myResultType === 'list' || this.myResultType === 'dict') {
            this.myEvalResult = JSON.stringify(myResponse.result);
          } else {
            this.myEvalResult = myResponse.result;
          }
        }
      );

  }


  convertYaml() {
    // this.myTextoutput = this.myTextarea;

    this.dataService.ConvertToYamlText(this.myConverterTextarea)
      .subscribe(
        (response) => {
          this.myConverterTextOutput = <any> response;
          this.cmConverterOptionsOutput.lineNumbers = true;
//          if (this.myConverterTextOutput.startsWith('ERROR:')) {
//            this.cmConverterOptionsOutput.lineNumbers = false;
//          }
//          const editor4 = this.converterCodeEditor2.codeMirror;
//          editor4.refresh();
        }
      );

  }


  setLanguage() {
    console.log('setLanguage', this.selected_language);
    sessionStorage.setItem('default_language', this.selected_language);
    this.shared.setGuiLanguage();
    this.default_language = sessionStorage.getItem('default_language');
  }


  // -------------------------------------------------------
  // translate status text of SmartHomeNG
  //
  translate_shngStatus(text) {
//    const translated_text = this.translate.instant('SHNG_STATE.' + text);
//    if (translated_text.startsWith('SHNG_STATE.')) {
//      return text;
//    }
    return this.translate.instant('SHNG_STATE.' + text);
  }


  // -------------------------------------------------------
  // poll the status of SmartHomeNG and schedule next poll
  //
  getShngStatus() {
    // duration in seconds
    const interval1 = 5000;    // standard polling: every 5 seconds
    const interval2 = 1000;    // polling while (re)starting: every second
    const interval3 = 3000;    // polling while in error state (shng not running)
    this.dataServiceServer.getShngServerStatus()
      .subscribe(
        (response) => {
          const res = <any> response;
          if (res.code === undefined) {
            // shng is not running
            this.status_errorcount += 1;
            console.log('getShngStatus', 'SmartHomeNG not running');
            this.shng_status =  this.translate_shngStatus('waiting') + '...';
          } else {
            // console.log('getShngStatus', res.code, res.text);
            this.shng_statuscode = res.code;
            this.shng_status = this.translate_shngStatus(res.text);
            if (res.details !== undefined) {
              this.shng_status += ' (' + res.details + ')';
            }
            this.status_errorcount = 0;
          }
          if (this.status_errorcount < 20) {
            // schedule next status check
            let interval = interval1;
            if (res.code !== 20) {
              // code = 20 -> status running
              if (this.status_errorcount === 0) {
                interval = interval2;
              } else {
                interval = interval3;
              }
            }
            this.sleep(interval).then(() => {
              this.getShngStatus();
            });
          } else {
            console.warn('getShngStatus', 'Statuspolling aborted');
            this.shng_status = this.translate_shngStatus('not active');
            this.shng_statuscode = -1;
          }
        }
      );
  }


  sleep (time) {
    // https://davidwalsh.name/javascript-sleep-function
    return new Promise((resolve) => setTimeout(resolve, time));
  }


  // -------------------------------------------------------
  // restart SmartHomeNG server application
  //
  restartShng() {
    this.dataServiceServer.restartShngServer()
      .subscribe(
        (response) => {
          const res = <any> response;
          console.log('restartShng', res.result);
          this.shng_status = this.translate_shngStatus('Restart clicked');
          this.shng_statuscode = -1;
        }
      );
  }

  downloadBackup() {
    const todayDate = new Date();
    const dd = String(todayDate.getDate()).padStart(2, '0');
    const mm = String(todayDate.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = todayDate.getFullYear();
    const today = yyyy + '-' + mm + '-' + dd;

    this.backup_disabled = true;
    this.restore_disabled = true;

    let filename = '';
    if (this.serverInfo.backup_stem != null) {
      filename = this.serverInfo.backup_stem;
    }
    if (filename !== '') {
      filename += '_';
    }
    filename += 'shng_config_backup_' + today + '.zip';

    this.dataServiceServer.downloadConfigBackup()
      .subscribe(
        (response) => {
          const res = <any> response;
          // saveAs(res, 'shng_config_backup_' + today + '.zip');
          saveAs(res, filename);
          this.show_backup_confirm = true;
          this.backup_disabled = false;
          this.restore_disabled = false;

          this.ngOnInit();
        }
      );
  }

  restoreBackup() {

    this.backup_disabled = true;
    this.restore_disabled = true;
    this.show_restore_chooser = true;

    this.backup_disabled = false;
    this.restore_disabled = false;
  }


  myUploader(event, form) {
    console.log('myUploader', event.files);
    console.log('myUploader', event.files[0].name);

    let filecontent: any;

    const reader = new FileReader();

    // file reading started
    reader.addEventListener('loadstart', function () {
      console.log('File reading started');
    });

    // file reading finished successfully
    reader.addEventListener('load', function () {
      // const text = this.result;

      // contents of the file
      // console.log(text);
    });

    // file reading failed
    reader.addEventListener('error', function () {
      alert('Error : Failed to read file');
    });

    // file read progress
    reader.addEventListener('progress', function (e) {
      if (e.lengthComputable === true) {
        const percent_read = Math.floor((e.loaded / e.total) * 100);
        console.log(percent_read + '% read');
      }
    });

    reader.onloadend = () => {
      // console.warn(reader.result);
      filecontent = reader.result;

      this.fileService.saveFile('restore', event.files[0].name, filecontent)
        .subscribe(
          () => {
            this.ngOnInit();
          }
        );

      form.clear();
      this.show_restore_chooser = false;
    };

    // read as text file
    // reader.readAsText(event.files[0]);
    // reader.readAsBinaryString(event.files[0]);
    reader.readAsDataURL(event.files[0]);
  }



  doUpload(form) {
    console.log('doUpload');

/*
    this.fileService.saveFile('restore', event.files[0].name, 'TEST test')
      .subscribe(
        (response2) => {
        }
      );
*/

    form.clear();
    this.show_restore_chooser = false;
  }
}
