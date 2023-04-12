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
  // @Input() loggerActiveLevel: any;
  @Output() levelChange = new EventEmitter();
  @Output() loggerDelete = new EventEmitter();


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


  deleteLogger(logger) {
    this.loggerToDelete = logger;
    this.delete_param = {'config': logger};
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
