import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { HeaderModule } from './header/header.module';
import { ConfigService } from './services/config.service';
import { DataService } from './services/data.service';
import { EventService } from './services/event.service';
import { LoggerService } from './services/logger.service';
import { ToastService } from './services/toast.service';
import { BreadcrumbModule } from './shared/components/breadcrumb/breadcrumb.module';
import { SidebarModule } from './shared/components/sidebar/sidebar.module';
import { ToggleButtonModule } from './shared/components/toggle-button/toggle-button.module';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        SidebarModule,
        ToggleButtonModule,
        BreadcrumbModule,
        HeaderModule,
        FooterComponent,
        HomeComponent,
        ToastrModule.forRoot(),
        AppComponent,
      ],
      providers: [
        ConfigService,
        LoggerService,
        DataService,
        EventService,
        ToastService,
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
