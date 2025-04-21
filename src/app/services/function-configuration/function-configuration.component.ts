
import {Component, OnInit, AfterViewChecked, ViewChild} from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';
import {SelectItem} from 'primeng/api';

import {FilesApiService} from '../../common/services/files-api.service';
import {ServerInfo} from '../../common/models/server-info';
import {ServicesApiService} from '../../common/services/services-api.service';
import {FunctionsApiService} from '../../common/services/functions-api.service';


@Component({
  selector: 'app-function-configuration',
  templateUrl: './function-configuration.component.html',
  styleUrls: ['./function-configuration.component.css']
})
export class FunctionConfigurationComponent implements AfterViewChecked, OnInit {

  constructor(private translate: TranslateService,
              private fileService: FilesApiService,
              private functionApiService: FunctionsApiService,
              private dataService: ServicesApiService,
              private titleService: Title) { }

  // -----------------------------------------------------------------
  //  Vars for the codemirror components
  //
  rulers = [];

  // -----------------------------------------------------
  //  Vars for the YAML syntax checker
  //
  @ViewChild('codeeditor', { static: true }) private codeEditor;

  filelist: string[];
  functionFiles: SelectItem[];
  selectedFunctionfile: SelectItem;

  reloadButtonDisabled = false;
  reloadAllButtonDisabled = false;

  myEditFilename = '';
  myTextarea = '';
  myTextareaOrig = '';

  cmOptions = {
    indentWithTabs: false,
    indentUnit: 4,
    tabSize: 4,
    extraKeys: {
      'Tab': 'insertSoftTab',
      'Shift-Tab': 'indentLess',
      'F11': function(cm) {
        cm.setOption('fullScreen', !cm.getOption('fullScreen'));
        // cm.getScrollerElement().style.maxHeight = 'none';
      },
      'Esc': function(cm, fullScreen) {
        if (cm.getOption('fullScreen')) {
          cm.setOption('fullScreen', false);
        }
      },
      'Ctrl-Q': function(cm) {
        cm.foldCode(cm.getCursor());
      },
      'Shift-Ctrl-Q': function(cm) {
        for (let l = cm.firstLine(); l <= cm.lastLine(); ++l) {
          cm.foldCode({line: l, ch: 0}, null, 'unfold');
        }
      }
    },
    fullScreen: false,
    lineNumbers: true,
    readOnly: false,
    lineSeparator: '\n',
    rulers: this.rulers,
    mode: 'python',
    lineWrapping: false,
    firstLineNumber: 1,
    autorefresh: true,
    fixedGutter: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
  };

  editorHelp_display = false;
  error_display = false;
  myTextOutput = '';
  newconfig_display = false;
  newFilename = '';
  add_enabled = false;

  confirmdelete_display: boolean = false;
  delete_param: {};

  public setTitle(newTitle: string) {
      this.titleService.setTitle(newTitle);
  }

  ngOnInit() {
    // console.log('LoggingConfigurationComponent.ngOnInit');

    this.setTitle(this.translate.instant('MENU.FUNCTION_CONFIGURATION'));

    for (let i = 1; i <= 100; i++) {
      this.rulers.push({color: '#eee', column: i * 4, lineStyle: 'dashed'});
    }
    this.getFunctionFile('');

    this.functionFiles = [];
    this.fileService.getfileList('functions')
      .subscribe(
        (response) => {
          this.filelist = <string[]> response;
          for (let i = 0; i < this.filelist.length; i++) {
            //
            // I get it. The sample code here and in the docs is wrong, it should read like this:
            //
            // fails
            //   this.cities.push({name:'New York', code: 'NY'});
            //
            // correct
            //   this.cities = [...this.cities, {name:'New York', code: 'NY'}];
            //
            this.functionFiles = [...this.functionFiles, <SelectItem> {'label': this.filelist[i], 'value': this.filelist[i]}];
          }
        }
      );


  }


  ngAfterViewChecked() {

    const editor1 = this.codeEditor.codeMirror;

    if (editor1.getOption('fullScreen')) {
      editor1.setSize('100vw', '100vh');
    } else {
      editor1.setSize('calc(100% - 10px)', 'calc(100vh - 160px)');
      // width: min(80%, 100% - 280px);       calc(80vw - 90px)
    }

    editor1.refresh();
  }


  newConfig() {
    this.newFilename = '';
    this.newconfig_display = true;
  }


  deleteConfig() {
    this.delete_param = {'config': this.myEditFilename};
    this.confirmdelete_display = true;
  }


  DeleteConfigConfirm() {
    // console.log('FunctionConfigurationComponent.DeleteConfigConfirm:');

    // close confirm dialog
    this.confirmdelete_display = false;

    // delete on backend server
    this.fileService.deleteFile('functions', this.myEditFilename)
      .subscribe(
        (response: any) => {
          if (response) {
            // close configuration dialog
            this.confirmdelete_display = false;
            console.log('FunctionConfigurationComponent.DeleteConfigConfirm(): call ngOnInit()');
            this.ngOnInit();
//            this.restart_core_button = true;

          }
        }
      );

    // alert('code for removal of plugin "' + this.dialog_configname + '" configurations is not yet implemented');


    return true;
  }


  checkInput() {
    this.add_enabled = false;
    if (this.newFilename.length > 0) {
      this.add_enabled = true;
      for (const filenno in this.filelist) {
        const fn = this.filelist[filenno].slice(0, -5);
        if (this.newFilename === fn) {
          this.add_enabled = false;
        }
      }

    }
  }


  addFile() {
    this.newconfig_display = false;

    // prefill file with template
    this.fileService.readFile('functions', 'uf.tpl')
        .subscribe(
            (response) => {
              this.myTextarea = response;
              this.myTextareaOrig = response;
              if ((this.myTextarea === '') || (this.myTextarea.startsWith('{"result": "error"'))) {
                  this.myTextarea = '# Userfunctions - file: ' + this.newFilename + '.py   (template file \'uf.tpl\' not found)\n';
              } else {
                this.cmOptions.readOnly = false;
              }

              this.myTextareaOrig = this.myTextarea;
              this.myEditFilename = this.newFilename;
              this.cmOptions.readOnly = false;

              // save new file before editing
              this.fileService.saveFile('functions', this.myEditFilename, this.myTextarea)
                  .subscribe(
                      (response2) => {
                        this.myTextareaOrig = this.myTextarea;

                        this.functionFiles = [];
                        this.fileService.getfileList('functions')
                            .subscribe(
                                (response) => {
                                  this.filelist = <string[]> response;
                                  for (let i = 0; i < this.filelist.length; i++) {
                                    this.functionFiles = [...this.functionFiles, <SelectItem> {'label': this.filelist[i], 'value': this.filelist[i]}];
                                  }
                                }
                            );
                      }
                  );

            }
        );

  }



  functionFileSelected() {
    let filename = this.selectedFunctionfile.value;
    if (filename.toLowerCase().endsWith('.py')) {
      filename = filename.slice(0, -3);
      // console.log('functionFileSelected()' , {filename});
      this.getFunctionFile(filename);
    } else {
      this.myEditFilename = '';
      this.myTextarea = '';
      this.cmOptions.readOnly = true;
      this.myTextarea = this.translate.instant('FUNCTION_CONFIG.FILETYPE_UNSUPPORTED');
    }
  }


  getFunctionFile(filename) {
    this.myEditFilename = '';
    this.myTextarea = '';
    this.cmOptions.readOnly = true;
    if (filename === '') {
      return;
    }

    this.fileService.readFile('functions', filename)
      .subscribe(
        (response) => {
          this.myTextarea = response;
          this.myTextareaOrig = response;
          if (this.myTextarea === '') {
            if (!filename.endsWith('.tpl')) {
              this.myTextarea = filename + ': ' + this.translate.instant('FUNCTION_CONFIG.FILE_NOT_FOUND');
            }
          } else {
            this.myEditFilename = filename;
            this.cmOptions.readOnly = false;
          }
        }
      );
  }


  saveConfig() {
    console.log('FunctionConfigurationComponent.saveConfig');

    this.myTextOutput = this.myTextarea;
    if (this.myTextOutput.startsWith('ERROR:')) {
      this.error_display = true;
    } else {
      this.fileService.saveFile('functions', this.myEditFilename, this.myTextarea)
          .subscribe(
              (response2) => {
                this.myTextareaOrig = this.myTextarea;
              }
          );

    }
    if (this.codeEditor !== undefined) {
      const editor = this.codeEditor.codeMirror;
      editor.refresh();
    }

  }


  reloadFunction(name) {
    // console.log('reloadPlugin', {pluginConfigName});

    console.log('reloadFunctions:', name);
    this.reloadButtonDisabled = true;
    this.functionApiService.reloadFunction(name)
        .subscribe(
            (response) => {
              console.log('reloadFunction', '\nresponse', {response});
              setTimeout(() => { this.reloadButtonDisabled = false; }, 200);
            }
        );
  }


  reloadFunctions() {
    // console.log('reloadPlugin', {pluginConfigName});

    console.log('reloadFunctions: all');
    this.reloadAllButtonDisabled = true;
    this.functionApiService.reloadFunctions()
        .subscribe(
            (response) => {
              console.log('reloadFunctions', '\nresponse', {response});
              setTimeout(() => { this.reloadAllButtonDisabled = false; }, 200);
            }
        );
  }

}
