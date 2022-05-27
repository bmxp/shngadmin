

import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import {ConfigApiService} from '../../common/services/config-api.service';
import {SchedulersApiService} from '../../common/services/schedulers-api.service';
import {ServerApiService} from '../../common/services/server-api.service';

import { SharedService } from '../../common/services/shared.service';

import {sha512} from 'js-sha512';
import {Title} from '@angular/platform-browser';


@Component({
  selector: 'app-system-config',
  templateUrl: './system-config.component.html',
  styleUrls: ['./system-config.component.css']
})

export class SystemConfigComponent implements OnInit {

  config: any;
  lang: string;

  common_parameters: any[];
  common_parameter_cols: any[];
  common_parameters_beforeEdit: any[];

  http_parameters: any[];
  http_parameter_cols: any[];
  http_parameters_beforeEdit: any[];

  websocket_parameters: any[];
  websocket_parameter_cols: any[];
  websocket_parameters_beforeEdit: any[];

  admin_parameters: any[];
  admin_parameter_cols: any[];
  admin_parameters_beforeEdit: any[];

  mqtt_parameters: any[];
  mqtt_parameter_cols: any[];
  mqtt_parameters_beforeEdit: any[];

  data_changed = false;
  restart_core_button = false;

  rowclicked_foredit: any = false;
  dialog_readonly = false;



  pwd_change_dialog_display = false;
  pwd_rowData: any;
  pwd_col: any;

  pwd_old: string = null;
  pwd_new1: string = null;
  pwd_new2: string = null;
  pwd_hash_old: string = null;
  pwd_hash_new: string = null;
  pwd_show: boolean;

  pwd_old_is_empty: boolean;
  pwd_old_is_wrong: boolean;
  pwd_new_not_identical: boolean;

  validation_dialog_display = false;
  validation_dialog_parameter: string;
  validation_dialog_text: string[];


  constructor(private dataService: ConfigApiService,
              private dataServiceServer: ServerApiService,
              private shared: SharedService,
              private translate: TranslateService,
              private titleService: Title) { }


  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  ngOnInit() {
    // console.log('SystemConfigComponent.ngOnInit');

    this.dataServiceServer.getServerinfo()
      .subscribe(
        (response) => {
          this.setTitle(this.translate.instant('MENU.SYSTEM_CONFIGURATION'));

          this.dataService.getConfig()
            .subscribe(
              (configResponse) => {
                this.config = configResponse;
                // console.log({response}, {configResponse});
                this.fillDialogData();
              }
            );
        }
      );

  }


  fillDialogData() {
    this.fillCommonDialogData();
    this.fillHttpDialogData();
    this.fillWebsocketDialogData();
    this.fillAdminDialogData();
    this.fillMqttDialogData();
  }


  // ---------------------------------------------------------
  // Column definitions for parameter configuration tables
  //
  columnDefinitions() {
    const columnDefinitions = [
      {field: 'name', sfield: 'confname', header: 'PLUGIN.PARAMETER', width: '190px'},
      {field: 'type', sfield: 'conftype', header: 'PLUGIN.TYPE', width: '80px'},
      {field: 'value', sfield: 'paramvalue', header: 'PLUGIN.VALUE', width: '240px'},
      {field: 'desc', sfield: '', header: 'PLUGIN.DESCRIPTION', width: ''}
    ];

    const paddingRight = 6; // distance between rnd of value field and beginning of description
    const widthWide = 600;  // width of wide value fields (gui_type: wide_str)

    for (let i = 0; i < columnDefinitions.length; i++) {
      const width = parseInt(columnDefinitions[i]['width'], 10);
      if (columnDefinitions[i]['width'] !== '') {
        columnDefinitions[i]['iwidth'] = String(width - paddingRight) + 'px';
      } else {
        columnDefinitions[i]['iwidth'] = '';
      }
      columnDefinitions[i]['iwidthwide'] = String(widthWide) + 'px';
      if (i === 2) {
        // if column = 2 (value) -> adjust padding for description (in column 3)
        columnDefinitions[3]['paddingleft'] = String(widthWide - width + paddingRight) + 'px';
      }
    }
    return columnDefinitions;
  }


  // ---------------------------------------------------------
  // Fill ParamData for display/editing of parameters
  //
  fillParamData(meta, param, data) {
    // fill valuelist
    const vl = [];
    if (meta['parameters'][param]['valid_list'] !== undefined) {
      let wrk = {};
      for (let i = 0; i < meta['parameters'][param]['valid_list'].length; i++) {
        wrk = {label: String(meta['parameters'][param]['valid_list'][i]), value: meta['parameters'][param]['valid_list'][i]};
        vl.push(wrk);
      }
    }

    // generate a valid_list for bool parameters
    if (meta['parameters'][param]['type'] === 'bool') {
      let wrk = {};
      wrk = {label: 'true', value: true};
      vl.push(wrk);
      wrk = {label: 'false', value: false};
      vl.push(wrk);
    }

    // fill description with active language
//    const paramdesc = this.shared.getDescription(meta['parameters'][param]['description']);
    let paramdesc = '';
    if (meta['parameters'][param]['description'] !== undefined) {
      paramdesc = meta['parameters'][param]['description'][this.lang];
      if (paramdesc === '' || paramdesc === undefined) {
        paramdesc = meta['parameters'][param]['description'][this.shared.getFallbackLanguage()];
        if (paramdesc === '' || paramdesc === undefined) {
          paramdesc = meta['parameters'][param]['description'][this.shared.getFallbackLanguage(1)];
        }
      }
    }

    paramdesc = paramdesc.replace(new RegExp('\n', 'g'), '<br>');
    paramdesc = paramdesc.replace(new RegExp(' \\*\\*', 'g'), ' <b><mark>');
    paramdesc = paramdesc.replace(new RegExp('\\*\\* ', 'g'), '</mark></b> ');
    paramdesc = paramdesc.replace(new RegExp(' \\*', 'g'), ' <i><mark>');
    paramdesc = paramdesc.replace(new RegExp('\\* ', 'g'), '</mark></i> ');

    const paramdata = {
      'name': param,
      'type': meta['parameters'][param]['type'],
      'gui_type': meta['parameters'][param]['gui_type'],
      'valid_list': vl,
      'valid_min': meta['parameters'][param]['valid_min'],
      'valid_max': meta['parameters'][param]['valid_max'],
      'default': meta['parameters'][param]['default'],
      'mandatory': meta['parameters'][param]['mandatory'],
      'value': data[param],
      'desc': paramdesc
    };

    if (paramdata.value === undefined) {
      paramdata.value = null;
    }

    return paramdata;
  }


  // ---------------------------------------------------------
  // Fill the mask with core parameter data
  //
  fillCommonDialogData() {
    this.lang = sessionStorage.getItem('default_language');

    this.common_parameter_cols = this.columnDefinitions();
    this.common_parameters = [];

    const meta = this.config.common.meta;
    const data = this.config.common.data;

    // console.log({data});
    for (const param in meta.parameters) {
      // console.log({param}, data[param]);
      if (meta.parameters.hasOwnProperty(param)) {
        // Fill ParamData for display/editing of parameters
        const paramdata = this.fillParamData(meta, param, data);
        // add to the table of configured plugins
        this.common_parameters.push(paramdata);
      }
    }
    // deepcopy form data
    this.common_parameters_beforeEdit = JSON.parse(JSON.stringify(this.common_parameters));
  }

  // ---------------------------------------------------------
  // Fill the mask with http parameter data
  //
  fillHttpDialogData() {
    this.lang = sessionStorage.getItem('default_language');

    this.http_parameter_cols = this.columnDefinitions();
    this.http_parameters = [];

    const meta = this.config.http.meta;
    const data = this.config.http.data;

    // if plain password is defined, create a hashed password and delete the plain password
    if (data.password !== undefined && data.password !== null) {
      if (data.password !== '') {
        if (data.hashed_password === undefined || data.hashed_password === null || data.hashed_password === '') {
          data.hashed_password = sha512(data.password);
          data.password = null;
        }
      }
    }

    // if plain service-password is defined, create a hashed service-password and delete the plain service-password
    if (data.service_password !== undefined && data.service_password !== null) {
      if (data.service_password !== '') {
        if (data.service_hashed_password === undefined || data.service_hashed_password === null || data.service_hashed_password === '') {
          data.service_hashed_password = sha512(data.service_password);
          data.service_password = null;
        }
      }
    }

    for (const param in meta.parameters) {
      if (meta.parameters.hasOwnProperty(param)) {

        // ignore plain text password fields
        if (['password', 'service_password'].indexOf(param) === -1) {
          // Fill ParamData for display/editing of parameters
          const paramdata = this.fillParamData(meta, param, data);
          // add to the table of configured plugins
          this.http_parameters.push(paramdata);
        }

      }
    }
    // deepcopy form data
    this.http_parameters_beforeEdit = JSON.parse(JSON.stringify(this.http_parameters));

  }

  // ---------------------------------------------------------
  // Fill the mask with webocket parameter data
  //
  fillWebsocketDialogData() {
    this.lang = sessionStorage.getItem('default_language');

    this.websocket_parameter_cols = this.columnDefinitions();
    this.websocket_parameters = [];

    const meta = this.config.websocket.meta;
    const data = this.config.websocket.data;

    // if plain password is defined, create a hashed password and delete the plain password
    if (data.password !== undefined && data.password !== null) {
      if (data.password !== '') {
        if (data.hashed_password === undefined || data.hashed_password === null || data.hashed_password === '') {
          data.hashed_password = sha512(data.password);
          data.password = null;
        }
      }
    }

    // if plain service-password is defined, create a hashed service-password and delete the plain service-password
    if (data.service_password !== undefined && data.service_password !== null) {
      if (data.service_password !== '') {
        if (data.service_hashed_password === undefined || data.service_hashed_password === null || data.service_hashed_password === '') {
          data.service_hashed_password = sha512(data.service_password);
          data.service_password = null;
        }
      }
    }

    for (const param in meta.parameters) {
      if (meta.parameters.hasOwnProperty(param)) {

        // ignore plain text password fields
        if (['password', 'service_password'].indexOf(param) === -1) {
          // Fill ParamData for display/editing of parameters
          const paramdata = this.fillParamData(meta, param, data);
          // add to the table of configured plugins
          this.websocket_parameters.push(paramdata);
        }

      }
    }
    // deepcopy form data
    this.websocket_parameters_beforeEdit = JSON.parse(JSON.stringify(this.websocket_parameters));

  }

  // ---------------------------------------------------------
  // Fill the mask with admin parameter data
  //
  fillAdminDialogData() {
    this.lang = sessionStorage.getItem('default_language');

    this.admin_parameter_cols = this.columnDefinitions();
    this.admin_parameters = [];

    const meta = this.config.admin.meta;
    const data = this.config.admin.data;

    for (const param in meta.parameters) {
      if (meta.parameters.hasOwnProperty(param)) {
        // Fill ParamData for display/editing of parameters
        const paramdata = this.fillParamData(meta, param, data);
        // add to the table of configured plugins
        this.admin_parameters.push(paramdata);
      }
    }
    // deepcopy form data
    this.admin_parameters_beforeEdit = JSON.parse(JSON.stringify(this.admin_parameters));

  }


  // ---------------------------------------------------------
  // Fill the mask with mqtt parameter data
  //
  fillMqttDialogData() {
    this.lang = sessionStorage.getItem('default_language');

    this.mqtt_parameter_cols = this.columnDefinitions();
    this.mqtt_parameters = [];

    const meta = this.config.mqtt.meta;
    const data = this.config.mqtt.data;

    for (const param in meta.parameters) {
      if (meta.parameters.hasOwnProperty(param)) {
        // Fill ParamData for display/editing of parameters
        const paramdata = this.fillParamData(meta, param, data);
        // add to the table of configured plugins
        this.mqtt_parameters.push(paramdata);

      }
    }
    // deepcopy form data
    this.mqtt_parameters_beforeEdit = JSON.parse(JSON.stringify(this.mqtt_parameters));

  }


  // ---------------------------------------------------------
  // change password
  //
  change_password_dialog($event, rowData, col_field) {
    console.log('change_password_dialog()');
    console.log('hash', rowData[col_field]);
    this.pwd_hash_old = rowData[col_field];
    this.pwd_rowData = rowData;
    this.pwd_col = col_field;

    this.pwd_old = null;
    this.pwd_new1 = null;
    this.pwd_new2 = null;
    this.pwd_old_is_wrong = false;
    this.pwd_change_dialog_display = true;
  }


  change_password($event) {
    console.log('change_password()');
    this.pwd_old_is_empty = false;
    this.pwd_old_is_wrong = false;
    this.pwd_new_not_identical = false;

    if (this.pwd_hash_old !== null) {
      if (this.pwd_old === null || this.pwd_old === '') {
        this.pwd_old_is_empty = true;
        return;
      }

      // const wrk = sha512(this.pwd_old);
      if (this.pwd_hash_old !== sha512(this.pwd_old)) {
        this.pwd_old_is_wrong = true;
        return;
      }
    }
    if (this.pwd_new1 !== this.pwd_new2) {
      this.pwd_new_not_identical = true;
      return;
    }

    console.log('pwd_new1', this.pwd_new1);
    console.log('pwd_new2', this.pwd_new2);

    this.pwd_hash_new = null;
    if (this.pwd_new1 !== null) {
      this.pwd_hash_new = sha512(this.pwd_new1);
    }
    console.log('pwd_hash_new', this.pwd_hash_new);

    this.pwd_rowData[this.pwd_col] = this.pwd_hash_new;
    this.pwd_change_dialog_display = false;
    this.check_values();
  }

  check_values() {
    this.data_changed = false;
    for (const p in this.common_parameters) {
      if (this.common_parameters.hasOwnProperty(p)) {
        if (this.common_parameters[p].value !== this.common_parameters_beforeEdit[p].value) {
          this.data_changed = true;
          // console.log(this.common_parameters[p]);
        }
      }
    }
    for (const p in this.http_parameters) {
      if (this.http_parameters.hasOwnProperty(p)) {
        if (this.http_parameters[p].value !== this.http_parameters_beforeEdit[p].value) {
          this.data_changed = true;
          // console.log(this.http_parameters[p]);
        }
      }
    }
    for (const p in this.websocket_parameters) {
      if (this.websocket_parameters.hasOwnProperty(p)) {
        if (this.websocket_parameters[p].value !== this.websocket_parameters_beforeEdit[p].value) {
          this.data_changed = true;
          // console.log(this.websocket_parameters[p]);
        }
      }
    }
    for (const p in this.admin_parameters) {
      if (this.admin_parameters.hasOwnProperty(p)) {
        if (this.admin_parameters[p].value !== this.admin_parameters_beforeEdit[p].value) {
          this.data_changed = true;
          // console.log(this.admin_parameters[p]);
        }
      }
    }
    for (const p in this.mqtt_parameters) {
      if (this.mqtt_parameters.hasOwnProperty(p)) {
        if (this.mqtt_parameters[p].value !== this.mqtt_parameters_beforeEdit[p].value) {
          this.data_changed = true;
          // console.log(this.admin_parameters[p]);
        }
      }
    }
  }


  check_value_restrictions(parameter) {
    let error_found = false;
    let error_text = '';

    // console.log('check_value_restrictions', {parameter});

    if (parameter['value'] === undefined) { parameter['value'] = null; }

    // checking data types
    if (parameter['value'] !== null && parameter['value'] !== '') {
      error_text = '\'' + parameter['value'] + '\' '  ;
      if (parameter['type'].toLowerCase() === 'knx_ga' && !this.shared.is_knx_groupaddress(parameter['value'])) {
        error_found = true;
        error_text += this.translate.instant('PLUGIN.INVALID_KNX_ADDRESS');
      }
      if (parameter['type'].toLowerCase() === 'mac' && !this.shared.is_mac(parameter['value'])) {
        error_found = true;
        error_text += this.translate.instant('PLUGIN.INVALID_MAC_ADDRESS');
      }
      if (parameter['type'].toLowerCase() === 'ipv4' && !this.shared.is_ipv4(parameter['value'])) {
        error_found = true;
        error_text += this.translate.instant('PLUGIN.INVALID_IP_ADDRESS') + ' (v4)';
      }
      if (parameter['type'].toLowerCase() === 'ipv6' && !this.shared.is_ipv6(parameter['value'])) {
        error_found = true;
        error_text += this.translate.instant('PLUGIN.INVALID_IP_ADDRESS') + ' (v6)';
      }
      if (parameter['type'].toLowerCase() === 'ip') {
        if (!this.shared.is_ipv4(parameter['value']) && !this.shared.is_ipv6(parameter['value'])) {
          if (!this.shared.is_hostname(parameter['value'])) {
            error_found = true;
            error_text += this.translate.instant('PLUGIN.INVALID_HOSTNAME');
          }
        }
      }
    }

    // check valid minimum and maximum value
    if ((parameter['value'] !== null) && (parameter['value'] < parameter['valid_min'])) {
      error_found = true;
      error_text = this.translate.instant('PLUGIN.DEFINED_MIN') + ' \'' + parameter['valid_min'] + '\'';
      error_text += ', ' + this.translate.instant('PLUGIN.ACTUAL_VALUE') + ' \'' + parameter['value'] + '\'';
    }
    if ((parameter['value'] !== null) && (parameter['value'] > parameter['valid_max'])) {
      error_found = true;
      error_text = this.translate.instant('PLUGIN.DEFINED_MAX') + ' \'' + parameter['valid_max'] + '\'';
      error_text += ', ' + this.translate.instant('PLUGIN.ACTUAL_VALUE') + ' \'' + parameter['value'] + '\'';
    }

    // check if value is mandantory
    if ((parameter['value'] === null || parameter['value'] === '') && parameter['mandatory']) {
      error_found = true;
      error_text = this.translate.instant('PLUGIN.MANDATORY_VALUE');
    }

    if (error_found) {
      this.validation_dialog_text.push(this.translate.instant('PLUGIN.PARAMETER') + ' \'' + parameter['name'] + '\': ' + error_text);
      this.validation_dialog_parameter = parameter['name'];

      this.validation_dialog_display = true;
      console.warn('Parameter ' + '\'' + parameter['name'] + '\'', error_text);
      return false;
    }
    return true;
  }


  saveSettings() {
    let errors_found = false;
    this.validation_dialog_text = [];


    for (const p in this.common_parameters) {
      if (this.common_parameters.hasOwnProperty(p)) {
        if (!this.check_value_restrictions(this.common_parameters[p])) {
          errors_found = true;
        }
      }
    }
    for (const p in this.http_parameters) {
      if (this.http_parameters.hasOwnProperty(p)) {
        if (!this.check_value_restrictions(this.http_parameters[p])) {
          errors_found = true;
        }
      }
    }
    for (const p in this.websocket_parameters) {
      if (this.websocket_parameters.hasOwnProperty(p)) {
        if (!this.check_value_restrictions(this.websocket_parameters[p])) {
          errors_found = true;
        }
      }
    }
    for (const p in this.admin_parameters) {
      if (this.admin_parameters.hasOwnProperty(p)) {
        if (!this.check_value_restrictions(this.admin_parameters[p])) {
          errors_found = true;
        }
      }
    }
    for (const p in this.mqtt_parameters) {
      if (this.mqtt_parameters.hasOwnProperty(p)) {
        if (!this.check_value_restrictions(this.mqtt_parameters[p])) {
          errors_found = true;
        }
      }
    }


    if (errors_found) {
      return false;
    }


    const data = {};
    data['common'] = {};
    data['common']['data'] = {};
    for (const p in this.common_parameters) {
      if (this.common_parameters.hasOwnProperty(p)) {
        if ((this.common_parameters[p].value === '') && (this.common_parameters[p].type === 'str')) {
          this.common_parameters[p].value = null;
        }
        data['common']['data'][this.common_parameters[p].name] = this.common_parameters[p].value;
      }
    }

    data['http'] = {};
    data['http']['data'] = {};
    for (const p in this.http_parameters) {
      if (this.http_parameters.hasOwnProperty(p)) {
        if ((this.http_parameters[p].value === '') && (this.http_parameters[p].type === 'str')) {
          this.http_parameters[p].value = null;
        }
        data['http']['data'][this.http_parameters[p].name] = this.http_parameters[p].value;
      }
    }
    // remove plain passwords
    data['http']['data']['password'] = null;
    data['http']['data']['service_password'] = null;

    data['websocket'] = {};
    data['websocket']['data'] = {};
    for (const p in this.websocket_parameters) {
      if (this.websocket_parameters.hasOwnProperty(p)) {
        if ((this.websocket_parameters[p].value === '') && (this.websocket_parameters[p].type === 'str')) {
          this.websocket_parameters[p].value = null;
        }
        data['websocket']['data'][this.websocket_parameters[p].name] = this.websocket_parameters[p].value;
      }
    }

    data['admin'] = {};
    data['admin']['data'] = {};
    for (const p in this.admin_parameters) {
      if (this.admin_parameters.hasOwnProperty(p)) {
        if ((this.admin_parameters[p].value === '') && (this.admin_parameters[p].type === 'str')) {
          this.admin_parameters[p].value = null;
        }
        data['admin']['data'][this.admin_parameters[p].name] = this.admin_parameters[p].value;
      }
    }

    data['mqtt'] = {};
    data['mqtt']['data'] = {};
    for (const p in this.mqtt_parameters) {
      if (this.mqtt_parameters.hasOwnProperty(p)) {
        if ((this.mqtt_parameters[p].value === '') && (this.mqtt_parameters[p].type === 'str')) {
          this.mqtt_parameters[p].value = null;
        }
        data['mqtt']['data'][this.mqtt_parameters[p].name] = this.mqtt_parameters[p].value;
        // console.warn(this.mqtt_parameters[p].name, this.mqtt_parameters[p].type, this.mqtt_parameters[p].value);
      }
    }


    this.dataService.saveConfig(data)
      .subscribe((result: boolean) => {
        if (result) {
          console.log('saveSettings', 'success');

          this.common_parameters_beforeEdit = JSON.parse(JSON.stringify(this.common_parameters));
          this.http_parameters_beforeEdit = JSON.parse(JSON.stringify(this.http_parameters));
          this.websocket_parameters_beforeEdit = JSON.parse(JSON.stringify(this.websocket_parameters));
          this.admin_parameters_beforeEdit = JSON.parse(JSON.stringify(this.admin_parameters));
          this.mqtt_parameters_beforeEdit = JSON.parse(JSON.stringify(this.mqtt_parameters));

          this.data_changed = false;
          this.restart_core_button = true;
        } else {
          console.warn('saveSettings', 'fail');
        }
      });

  }



  restartShng() {
    this.dataServiceServer.restartShngServer()
      .subscribe(
        (response) => {
          const res = <any> response;
          console.log('restartShng', res.result);
        }
      );
    this.restart_core_button = false;
  }

}
