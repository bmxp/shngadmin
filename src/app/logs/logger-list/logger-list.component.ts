
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
                        this.loggers = response2;
                        this.loggersList = Object.keys(this.loggers);
                        this.loggersList = this.loggersList.sort();
                        console.log('getLoggers', {response2});
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
    console.log({logger}, {level}, this.loggers[logger]);
    this.dataService.setLoggerLevel(logger, level)
      .subscribe(
        (response) => {
        }
      );

    this.loggers[logger].level = this.loggers[logger].active.level;
  }

}
