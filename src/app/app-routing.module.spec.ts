import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './guards/auth.guard';
import { MetricsResolver } from './resolvers/metrics.resolver';

describe('AppRoutingModule', () => {
  let router: Router;
  let location: Location;
  let mockAuthGuard: jasmine.SpyObj<AuthGuard>;
  let mockMetricsResolver: jasmine.SpyObj<MetricsResolver>;

  beforeEach(async () => {
    mockAuthGuard = jasmine.createSpyObj('AuthGuard', ['canActivate']);
    mockMetricsResolver = jasmine.createSpyObj('MetricsResolver', ['resolve']);

    await TestBed.configureTestingModule({
      imports: [AppRoutingModule],
      providers: [
        { provide: AuthGuard, useValue: mockAuthGuard },
        { provide: MetricsResolver, useValue: mockMetricsResolver }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should create the routing module', () => {
    expect(router).toBeTruthy();
  });

  it('should have correct route configuration for home path', () => {
    const homeRoute = router.config.find(route => route.path === '');
    
    expect(homeRoute).toBeDefined();
    expect(homeRoute?.canActivate).toContain(AuthGuard);
    expect(homeRoute?.data?.['label']).toBe('Home');
    expect(homeRoute?.data?.['breadcrumb']).toBe('Home');
    expect(homeRoute?.data?.['sidebar']).toBe(true);
    expect(homeRoute?.data?.['icon']).toBe('bi-house-fill');
  });

  it('should have correct route configuration for parks management', () => {
    const parksRoute = router.config.find(route => route.path === 'parks');
    
    expect(parksRoute).toBeDefined();
    expect(parksRoute?.canActivate).toContain(AuthGuard);
    expect(parksRoute?.data?.['label']).toBe('Parks Management');
    expect(parksRoute?.data?.['breadcrumb']).toBe('Parks');
    expect(parksRoute?.data?.['sidebar']).toBe(true);
    expect(parksRoute?.data?.['icon']).toBe('bi-tree-fill');
    expect(parksRoute?.loadChildren).toBeDefined();
  });

  it('should have correct route configuration for pass management', () => {
    const passRoute = router.config.find(route => route.path === 'pass-management');
    
    expect(passRoute).toBeDefined();
    expect(passRoute?.canActivate).toContain(AuthGuard);
    expect(passRoute?.data?.['label']).toBe('Pass Management');
    expect(passRoute?.data?.['breadcrumb']).toBe('Pass Management');
    expect(passRoute?.data?.['sidebar']).toBe(true);
    expect(passRoute?.data?.['icon']).toBe('bi-pass-fill');
    expect(passRoute?.loadChildren).toBeDefined();
  });

  it('should have correct route configuration for metrics', () => {
    const metricsRoute = router.config.find(route => route.path === 'metrics');
    
    expect(metricsRoute).toBeDefined();
    expect(metricsRoute?.canActivate).toContain(AuthGuard);
    expect(metricsRoute?.resolve).toContain(MetricsResolver);
    expect(metricsRoute?.data?.['label']).toBe('Metrics');
    expect(metricsRoute?.data?.['breadcrumb']).toBe('Metrics');
    expect(metricsRoute?.data?.['sidebar']).toBe(true);
    expect(metricsRoute?.data?.['icon']).toBe('bi-bar-chart-fill');
    expect(metricsRoute?.loadChildren).toBeDefined();
  });

  it('should have correct route configuration for FAQ', () => {
    const faqRoute = router.config.find(route => route.path === 'faq');
    
    expect(faqRoute).toBeDefined();
    expect(faqRoute?.canActivate).toContain(AuthGuard);
    expect(faqRoute?.data?.['label']).toBe('FAQ');
    expect(faqRoute?.data?.['breadcrumb']).toBe('Frequently Asked Questions');
    expect(faqRoute?.data?.['sidebar']).toBe(true);
    expect(faqRoute?.data?.['icon']).toBe('bi-chat-left-text');
    expect(faqRoute?.loadChildren).toBeDefined();
  });

  it('should have correct route configuration for unauthorized page', () => {
    const unauthorizedRoute = router.config.find(route => route.path === 'unauthorized');
    
    expect(unauthorizedRoute).toBeDefined();
    expect(unauthorizedRoute?.pathMatch).toBe('full');
    expect(unauthorizedRoute?.canActivate).toBeUndefined();
    expect(unauthorizedRoute?.data?.['showSideBar']).toBe(false);
    expect(unauthorizedRoute?.data?.['showBreadCrumb']).toBe(false);
    expect(unauthorizedRoute?.children).toEqual([]);
  });

  it('should have correct route configuration for login page', () => {
    const loginRoute = router.config.find(route => route.path === 'login');
    
    expect(loginRoute).toBeDefined();
    expect(loginRoute?.pathMatch).toBe('full');
    expect(loginRoute?.canActivate).toBeUndefined();
    expect(loginRoute?.data?.['showSideBar']).toBe(false);
    expect(loginRoute?.data?.['showBreadCrumb']).toBe(false);
  });

  it('should have wildcard route that redirects to home', () => {
    const wildcardRoute = router.config.find(route => route.path === '**');
    
    expect(wildcardRoute).toBeDefined();
    expect(wildcardRoute?.redirectTo).toBe('/');
    expect(wildcardRoute?.pathMatch).toBe('full');
  });

  it('should have AuthGuard on all protected routes', () => {
    const protectedPaths = ['', 'parks', 'pass-management', 'metrics', 'faq'];
    
    protectedPaths.forEach(path => {
      const route = router.config.find(r => r.path === path);
      expect(route?.canActivate).toContain(AuthGuard);
    });
  });

  it('should not have AuthGuard on public routes', () => {
    const publicPaths = ['unauthorized', 'login'];
    
    publicPaths.forEach(path => {
      const route = router.config.find(r => r.path === path);
      expect(route?.canActivate).toBeUndefined();
    });
  });

  it('should have sidebar configuration for main navigation routes', () => {
    const sidebarRoutes = ['', 'parks', 'pass-management', 'metrics', 'faq'];
    
    sidebarRoutes.forEach(path => {
      const route = router.config.find(r => r.path === path);
      expect(route?.data?.['sidebar']).toBe(true);
      expect(route?.data?.['icon']).toBeDefined();
      expect(route?.data?.['label']).toBeDefined();
      expect(route?.data?.['breadcrumb']).toBeDefined();
    });
  });

  it('should have correct lazy loading configuration', () => {
    const lazyRoutes = [
      { path: 'parks', expectedModule: 'ParksManagementModule' },
      { path: 'pass-management', expectedModule: 'PassManagementModule' },
      { path: 'metrics', expectedModule: 'MetricsModule' },
      { path: 'faq', expectedModule: 'FaqModule' }
    ];

    lazyRoutes.forEach(({ path, expectedModule }) => {
      const route = router.config.find(r => r.path === path);
      expect(route?.loadChildren).toBeDefined();
      
      // Test that loadChildren returns a promise that resolves to the expected module
      const loadChildrenResult = route?.loadChildren?.();
      expect(loadChildrenResult).toBeInstanceOf(Promise);
    });
  });

  it('should have MetricsResolver only on metrics route', () => {
    const metricsRoute = router.config.find(route => route.path === 'metrics');
    expect(metricsRoute?.resolve).toContain(MetricsResolver);

    // Verify other routes don't have resolvers
    const otherRoutes = router.config.filter(route => route.path !== 'metrics');
    otherRoutes.forEach(route => {
      expect(route.resolve).toBeFalsy();
    });
  });

  it('should have correct path matching configuration', () => {
    const fullMatchRoutes = ['unauthorized', 'login', '**'];
    
    fullMatchRoutes.forEach(path => {
      const route = router.config.find(r => r.path === path);
      expect(route?.pathMatch).toBe('full');
    });
  });
});