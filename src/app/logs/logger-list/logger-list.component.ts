
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';

import { LoggersType } from '../../common/models/loggers-info';
import { LoggersApiService } from '../../common/services/loggers-api.service';
import {LogsApiService} from '../../common/services/logs-api.service';
import {TranslateService} from '@ngx-translate/core';
import {Title} from '@angular/platform-browser';
import {ServerApiService} from '../../common/services/server-api.service';

@Component({
  selector: 'app-logger-list',
  templateUrl: './logger-list.component.html',
  styleUrls: ['./logger-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoggerListComponent implements OnInit {

  loggers: LoggersType;
  active_plugins: any[];
  active_logics: any[];
  loggersList: any[];

  loggerList: any[];

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

  loggerOptions: {}[] = [];

  newlogger_display: boolean = false;
  newlogger_name: string = '';
  newlogger_filename: string = '';
  newlogger_add_enabled: boolean = false;
  noLoggerToAdd: boolean = false;
  confirmdelete_display: boolean = false;
  loggerToDelete: string = '';
  delete_param: {};


  constructor(private dataService: LoggersApiService,
              private dataServiceServer: ServerApiService,
              protected router: Router,
              private translate: TranslateService,
              private titleService: Title) {
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  ngOnInit() {
    console.log('LoggerListComponent.ngOnInit');

    this.dataServiceServer.getServerinfo()
        .subscribe(
            (response) => {
              this.setTitle(this.translate.instant('MENU.LOGGER_LIST'));

              this.dataService.getLoggers()
                  .subscribe(
                      (response2: LoggersType) => {
                        this.loggers = response2.loggers;
                        this.active_plugins = response2.active_plugins;
                        this.active_logics = response2.active_logics;
                        this.loggersList = Object.keys(response2.loggers);
                        this.loggersList = this.loggersList.sort();
                      }
                  );
            }
        );

  }

  baseName(str, withExtension = true) {
    let base = str;
    base = base.substring(base.lastIndexOf('/') + 1);
    if (!withExtension && base.lastIndexOf('.') !== -1) {
      base = base.substring(0, base.lastIndexOf('.'));
    }
    return base;
  }

  levelChanged(logger, level) {
    if (level === null) {
      // console.log('Setting to default');
      this.loggers[logger].active.level = this.levelDefault;
    }
    console.log('levelChanged: ' + logger + ' from ', this.loggers[logger].level + ' to ' + level);
    this.dataService.setLoggerLevel(logger, level)
      .subscribe(
        (response) => {
        }
      );

    this.loggers[logger].level = this.loggers[logger].active.level;
  }

  plugin_loaded(logger) {

    if (logger === 'plugins') {
      return true;
    }
    if (logger.startsWith('plugins.')) {
      if (this.active_plugins.includes(logger.slice(8))) {
        return true;
      }
    }
    return false;
  }


  newLogger() {
    console.log('newLogger');

    this.loggerOptions = [{label: '', value: ''}];
    for (let i = 0; i < this.active_plugins.length; i++) {
      const lg = 'plugins.' + this.active_plugins[i];
      if (!this.loggersList.includes(lg)) {
        this.loggerOptions.push({label: lg, value: lg});
      }
    }

    this.newlogger_name = '';
    this.newlogger_filename = '';
    this.newlogger_display = true;
    this.noLoggerToAdd = (this.loggerOptions.length === 1);
  }


  plugins

  newLoggerSelected(loggerOption) {
    this.newlogger_add_enabled = (loggerOption !== '');
  }


  createLogger() {
    this.newlogger_display = false;

    this.dataService.addLogger(this.newlogger_name)
        .subscribe(
            (response) => {
              const result = response['result'];
              const description = response['description'];
              if (result === 'error') {
                console.warn('dataService.addLogger ERROR', {description});
              }

              if (result === 'ok') {
                this.dataService.getLoggers()
                    .subscribe(
                        (response2: LoggersType) => {
                          this.loggers = response2.loggers;
                          this.active_plugins = response2.active_plugins;
                          this.active_logics = response2.active_logics;
                          this.loggersList = Object.keys(response2.loggers);
                          this.loggersList = this.loggersList.sort();
                        }
                    );

              }
            }
        );
  }


  loggerIsDeletable(logger) {

    if (logger === 'plugins') {
      return false;
    }
    if (logger.startsWith('plugins.')) {
      if (this.loggersList.includes(logger)) {
        return true;
      }
    }
    return false;
  }

  deleteLogger(logger) {
    // console.log('deleteLogic', {logicName});

    this.loggerToDelete = logger;
    this.delete_param = {'config': logger};
    this.confirmdelete_display = true;
  }


  deleteLoggerConfirm() {
    this.confirmdelete_display = false;

    this.dataService.deleteLogger(this.loggerToDelete)
        .subscribe(
            (response) => {
              const result = response['result'];
              const description = response['description'];
              if (result === 'error') {
                console.warn('dataService.deleteLogger ERROR', {description});
              }

              if (result === 'ok') {
                const index = this.loggersList.indexOf(this.loggerToDelete, 0);
                if (index > -1) {
                  this.loggersList.splice(index, 1);
                }
              }
            }
        );
  }

  deleteLoggerAbort() {
    this.confirmdelete_display = false;
    this.loggerToDelete = '';
  }

}

