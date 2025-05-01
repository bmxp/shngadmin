import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'logger-line',
  templateUrl: './logger-line.component.html',
  styleUrls: ['./logger-line.component.css']
})
export class LoggerLineComponent implements OnInit {

  @Input() loggerName: string;
  @Input() logger: any;
  @Input() loggerActive: boolean;
  @Input() definedHandlers: any;
  // @Input() loggerActiveLevel: any;
  @Output() levelChange = new EventEmitter();
  @Output() loggerDelete = new EventEmitter();
  @Output() modifyHandlers = new EventEmitter();


  levelOptions: {}[] = [{label: 'ERROR', value: 'ERROR'},
    {label: 'WARNING', value: 'WARNING'},
    {label: 'NOTICE', value: 'NOTICE'},
    {label: 'INFO', value: 'INFO'},
    {label: 'DBGHIGH', value: 'DBGHIGH'},
    {label: 'DBGMED', value: 'DBGMED'},
    {label: 'DBGLOW', value: 'DBGLOW'},
    {label: 'DEBUG', value: 'DEBUG'}
  ];

  levelDefault: string = 'WARNING';

  confirmdelete_display: boolean = false;
  loggerToDelete: string = '';
  delete_param: {};

  header_param: {};
  handlers = [];
  chooseHandlers_display: boolean = false;
  // loggerToModify: string = '';
  choosableHandlers = [];
  choosableHandlers1 = [];
  choosableHandlers2 = [];
  handlersChangeEnabled = false;

  constructor() {
  }

  ngOnInit() {
  }


  getParent(logger) {
    const parts = logger.split('.');
    parts.pop();
    return parts.join('.');
  }


  baseName(str, withExtension = true) {
    let base = str;
    base = base.substring(base.lastIndexOf('/') + 1);
    if (!withExtension && base.lastIndexOf('.') !== -1) {
      base = base.substring(0, base.lastIndexOf('.'));
    }
    return base;
  }


  levelChanged(lg, level) {
    let activeLevel = this.levelDefault;
    if (level !== null) {
      activeLevel = this.logger.active.level;
    }
    this.levelChange.emit(activeLevel);
  }


  loggerIsDeletable(logger) {

    if (logger === 'plugins' || logger === 'logics' || logger === 'items' || logger === 'functions' ||
        logger === 'lib' || logger === 'modules') {
      return false;
    }
    if (logger.startsWith('plugins.')) {
      return true;
    }

    if (logger.startsWith('logics.')) {
      return true;
    }

    if (logger.startsWith('items.')) {
      return true;
    }

    if (logger.startsWith('functions.') || logger.startsWith('lib.') || logger.startsWith('modules.')) {
      return true;
    }

    return false;
  }


  // ------------------------------------------------------------------------------
  //   functions to support choosing of handlers
  // ------------------------------------------------------------------------------

  chooseHandlers(logger) {
    // this.loggerToModify = logger;
    this.header_param = {'logger': logger};
    this.handlers = [{'name': 'tst_file', 'key': 'tst_file'},
      {'name': 'tst_file2', 'key': 'tst_file2'},
      {'name': 'tst_file3', 'key': 'tst_file3'}];

    this.choosableHandlers = [];
    console.log('definedHandlers', this.definedHandlers);
    for (const key in this.definedHandlers) {
      if (this.definedHandlers.hasOwnProperty(key)) {
        let found = false;
        let parentFound = false;
        if (this.logger.active !== undefined) {
          if (this.logger.active.parent_handlers_names !== undefined) {
            parentFound = this.logger.active.parent_handlers_names.includes(key);
          }
        }
        if (this.logger.handlers !== undefined) {
          found = this.logger.handlers.includes(key);
        }
        let val = [];
        if (!parentFound || this.logger.propagate === false) {
          if (found) {
            val = [true];
          }
        }
        this.choosableHandlers.push({name: key, key: key, value: val, disabled: parentFound});
      }
    }
    this.choosableHandlers = this.choosableHandlers.sort(function(a, b) {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name === b.name) {
        return 0;
      }
      if (a.name < b.name) {
        return -1;
      }
    });

    this.choosableHandlers1 = [];
    this.choosableHandlers2 = [];
    for (let i = 0; i < this.choosableHandlers.length; i++) {
      if (i < Math.round(this.choosableHandlers.length / 2)) {
        this.choosableHandlers1.push(this.choosableHandlers[i]);
      } else {
        this.choosableHandlers2.push(this.choosableHandlers[i]);
      }
    }
    console.log('choosableHandlers1', this.choosableHandlers1);
    console.log('choosableHandlers2', this.choosableHandlers2);

    this.chooseHandlers_display = true;
  }


  doModifyHandlers() {
    this.chooseHandlers_display = false;

    const selectedHandlers = [];
    for (let i = 0; i < this.choosableHandlers.length; i++) {
      if (this.choosableHandlers[i].value.length > 0) {
        selectedHandlers.push(this.choosableHandlers[i].key);
      }
    }
    this.modifyHandlers.emit(selectedHandlers);


  }

  // ------------------------------------------------------------------------------
  //   functions to support logger deletion
  // ------------------------------------------------------------------------------

  deleteLogger(logger) {
    this.loggerToDelete = logger;
    this.delete_param = {'logger': logger};
    this.confirmdelete_display = true;
  }


  deleteLoggerConfirm() {
    this.confirmdelete_display = false;
    this.loggerDelete.emit(this.loggerToDelete);
  }

  deleteLoggerAbort() {
    this.confirmdelete_display = false;
    this.loggerToDelete = '';
  }
}
