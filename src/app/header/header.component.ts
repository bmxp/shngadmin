
import { Component, OnInit } from '@angular/core';
// import { isSuccess } from '@angular/http/src/http_utils';

import { TranslateService } from '@ngx-translate/core';
// import { MenuItem } from 'primeng/api';

import { ServerInfo } from '../common/models/server-info';
import { ServerApiService } from '../common/services/server-api.service';
import { AuthService } from '../common/services/auth.service';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: []
})


export class HeaderComponent implements OnInit {

//  faCircleNotch = faCircleNotch;

//  items: MenuItem[];
  items: any;
  menuInitialized: boolean;

  // server_info: ServerInfo;
  developerMode: boolean;


  constructor(private appComponent: AppComponent,
              private dataServiceServer: ServerApiService,
              private translate: TranslateService,
              protected router: Router,
              public authService: AuthService) {

  }



  ngOnInit() {
    // console.log('HeaderComponent.ngOnInit');

    this.dataServiceServer.getServerinfo()
      .subscribe(
        (response) => {
          this.developerMode = (sessionStorage.getItem('developer_mode') === 'true');
          this.buildMenu();

          const credentials = {'username': '', 'password': ''};
          // console.log('signIn', {credentials});
          this.authService.login(credentials)
            .subscribe((result: boolean) => {
              // console.log('Anonymous login:', {result});

              this.buildMenu();
            });

        }
      );

  }


  buildMenu() {
    // console.log('HeaderComponent.buildMenu');
    this.items = [
      {
        label: this.translate.instant('MENU.SYSTEM'),
        routerLink: ['/system'],
        items: [
          {
            label: this.translate.instant('MENU.SYSTEM_PROPERTIES'),
            routerLink: ['/system/systemproperties'],
          },
          {
            label: this.translate.instant('MENU.CONFIGURATION'),
            routerLink: ['/system/config'],
          }
        ]
      },
      {
        label: this.translate.instant('MENU.SERVICES'),
        routerLink: ['/services'],
      },
      {
        label: this.translate.instant('MENU.ITEMS'),
        routerLink: ['/items'],
        items: []
      },
      {
        label: this.translate.instant('MENU.LOGICS'),
        routerLink: ['/logics'],
      },
/*
      {
        label: this.translate.instant('MENU.SCHEDULERS'),
        routerLink: ['/schedulers'],
      },
*/
      {
        label: this.translate.instant('MENU.PLUGINS'),
        routerLink: ['/plugins'],
        items: [
          {
            label: this.translate.instant('MENU.PLUGINS_LIST'),
            routerLink: ['/plugins_list'],
          },
          {
            label: this.translate.instant('MENU.CONFIGURATION'),
            routerLink: ['/plugins/config'],
          }
        ]
      },
      {
        label: this.translate.instant('MENU.SCENES'),
        routerLink: ['/scenes'],
        items: [
          {
            label: this.translate.instant('MENU.SCENE_LIST'),
            routerLink: ['/scenes/list'],
          },
          {
            label: this.translate.instant('MENU.SCENE_CONFIGURATION'),
            routerLink: ['/scenes/config'],
          }
        ]
      },
      {
        label: this.translate.instant('MENU.SCHEDULERS'),
        routerLink: ['/schedulers'],
        items: [
          {
            label: this.translate.instant('MENU.SCHEDULERS'),
            routerLink: ['/schedulers'],
          },
          {
            label: this.translate.instant('MENU.THREADS'),
            routerLink: ['/threads'],
          }
        ]
      },
      {
        label: this.translate.instant('MENU.LOGS'),
        routerLink: ['/logs'],
        items: [
          {
            label: this.translate.instant('MENU.LOGS_DISPLAY'),
            routerLink: ['/logs/display'],
          },
          {
            label: this.translate.instant('MENU.LOGGER_LIST'),
            routerLink: ['/logs/logger-list'],
          },
          {
            label: this.translate.instant('MENU.CONFIGURATION'),
            routerLink: ['/logs/logging-configuration'],
          }
        ]
      },
      {
        label: this.translate.instant('MENU.LOGIN'),
        routerLink: ['/login'],
        disabled: false,
      },
      /*
                    {
                      label: this.translate.instant('MENU.CONFIGURATION'),
                      routerLink: ['/plugins'],
      //                    routerLink: [],
                      disabled: false,
                      items: [
                        {
                          label: this.translate.instant('MENU.PLUGINS'),
                          routerLink: ['/config/plugins'],
                        },
      /*
                        {
                          label: 'Test 1',
                          icon: 'pi pi-fw pi-plus',
                          items: [
                            {label: 'Sub 1'},
                            {label: 'Sub 2'},
                          ]
                        },
                        {label: 'Test 2'},
                        {label: 'Test 3'}
                      ]
                    },
      */
    ];

    for (let i = 0; i < 4; i++) {
      this.items[2].items.push({ label: '--dev--', routerLink: [''] });
    }
    if (this.developerMode) {
      // Add another menu item if in developer mode
      this.items[2].items.push({ label: '--dev--', routerLink: [''] });
    }

    this.menuInitialized = true;
  }


  getMenuItems() {
    // console.log('HeaderComponent.getMenuItems');
    if (!this.menuInitialized) {
      this.buildMenu();
    }

    this.translate.use(sessionStorage.getItem('default_language'));

    const isLoggedIn = this.authService.isLoggedIn();
    if (this.items) {
      if (this.items[0].visible && !isLoggedIn) {
        // console.log('HeaderComponent.getMenuItems: Just logged out');
        this.router.navigate(['/login']);
      }
      this.items[0].visible = isLoggedIn;
      this.items[1].visible = isLoggedIn;
      this.items[2].visible = isLoggedIn;
      this.items[3].visible = isLoggedIn;
      this.items[4].visible = isLoggedIn;
      this.items[5].visible = isLoggedIn;
      this.items[6].visible = isLoggedIn;
      this.items[7].visible = isLoggedIn;

      this.items[8].visible = !isLoggedIn;

      this.items[0].label = this.translate.instant('MENU.SYSTEM');
      this.items[0].items[0].label = this.translate.instant('MENU.SYSTEM_PROPERTIES');
      this.items[0].items[1].label = this.translate.instant('MENU.CONFIGURATION');
      this.items[1].label = this.translate.instant('MENU.SERVICES');

      this.items[2].label = this.translate.instant('MENU.ITEMS');
      this.items[2].items[0].label = this.translate.instant('MENU.ITEM_TREE');
      this.items[2].items[0].routerLink = ['/item_tree'];
      this.items[2].items[1].label = this.translate.instant('MENU.ITEM_CONFIGURATION');
      this.items[2].items[1].routerLink = ['/items/config'];
      if (this.items[2].items.length < 5) {
        this.items[2].items[2].label = this.translate.instant('MENU.ITEM_STRUCTS');
        this.items[2].items[2].routerLink = ['/items/structs'];
        this.items[2].items[3].label = this.translate.instant('MENU.ITEM_STRUCT_CONFIGURATION');
        this.items[2].items[3].routerLink = ['/items/struct_config'];
      } else {
        this.items[2].items[2].label = this.translate.instant('MENU.ITEM_CONFIGURATION') + ' (dev)';
        this.items[2].items[2].routerLink = ['/items/config2'];
        this.items[2].items[3].label = this.translate.instant('MENU.ITEM_STRUCTS');
        this.items[2].items[3].routerLink = ['/items/structs'];
        this.items[2].items[4].label = this.translate.instant('MENU.ITEM_STRUCT_CONFIGURATION');
        this.items[2].items[4].routerLink = ['/items/struct_config'];
      }

      this.items[3].label = this.translate.instant('MENU.LOGICS');
//      this.items[4].label = this.translate.instant('MENU.SCHEDULERS');
      this.items[4].label = this.translate.instant('MENU.PLUGINS');
      this.items[4].items[0].label = this.translate.instant('MENU.PLUGINS_LIST');
      this.items[4].items[1].label = this.translate.instant('MENU.CONFIGURATION');

      this.items[5].label = this.translate.instant('MENU.SCENES');
      this.items[5].items[0].label = this.translate.instant('MENU.SCENE_LIST');
      this.items[5].items[1].label = this.translate.instant('MENU.SCENE_CONFIGURATION');
      this.items[6].label = this.translate.instant('MENU.SCHEDULERS');
      this.items[6].items[0].label = this.translate.instant('MENU.SCHEDULERS');
      this.items[6].items[1].label = this.translate.instant('MENU.THREADS');
      this.items[7].label = this.translate.instant('MENU.LOGS');
      this.items[7].items[0].label = this.translate.instant('MENU.LOGS_DISPLAY');
      this.items[7].items[1].label = this.translate.instant('MENU.LOGGER_LIST');
      this.items[7].items[2].label = this.translate.instant('MENU.CONFIGURATION');

      this.items[8].label = this.translate.instant('MENU.LOGIN');
    }
    return this.items;
  }

  logout() {
    this.router.navigate(['/login']);
    this.authService.logout();
  }
}
