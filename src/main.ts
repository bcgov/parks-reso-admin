import { enableProdMode, APP_INITIALIZER, importProvidersFrom } from '@angular/core';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { FaqModule } from './app/faq/faq.module';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PassManagementModule } from './app/pass-management/pass-management.module';
import { HeaderModule } from './app/header/header.module';
import { BreadcrumbModule } from './app/shared/components/breadcrumb/breadcrumb.module';
import { ToggleButtonModule } from './app/shared/components/toggle-button/toggle-button.module';
import { SidebarModule } from './app/shared/components/sidebar/sidebar.module';
import { AppRoutingModule } from './app/app-routing.module';
import { CommonModule } from '@angular/common';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { LoadingService } from './app/services/loading.service';
import { ToastService } from './app/services/toast.service';
import { EventService } from './app/services/event.service';
import { DataService } from './app/services/data.service';
import { LoggerService } from './app/services/logger.service';
import { TokenInterceptor } from './app/shared/utils/token-interceptor';
import { HTTP_INTERCEPTORS, withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { KeycloakService } from './app/services/keycloak.service';
import { AutoFetchService } from './app/services/auto-fetch.service';
import { ApiService } from './app/services/api.service';
import { ConfigService } from './app/services/config.service';

if (environment.production) {
    enableProdMode();
}

function initConfig(
    configService: ConfigService,
    apiService: ApiService,
    autoFetchService: AutoFetchService,
    keycloakService: KeycloakService
) {
    return async () => {
        await configService.init();
        apiService.init();
        await keycloakService.init();
        if (keycloakService.isAuthorized()) {
            autoFetchService.run();
        }
    };
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, CommonModule, AppRoutingModule, SidebarModule, ToggleButtonModule, BreadcrumbModule, HeaderModule, PassManagementModule, ToastrModule.forRoot(), FaqModule),
        {
            provide: APP_INITIALIZER,
            useFactory: initConfig,
            deps: [ConfigService, ApiService, AutoFetchService, KeycloakService],
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true,
        },
        ConfigService,
        KeycloakService,
        LoggerService,
        DataService,
        EventService,
        ToastService,
        AutoFetchService,
        LoadingService,
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
    ]
})
    .catch(err => console.error(err));
