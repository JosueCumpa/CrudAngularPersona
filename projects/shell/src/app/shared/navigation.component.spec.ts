import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationComponent } from './navigation.component';

describe('NavigationComponent', () => {
  let fixture: ComponentFixture<NavigationComponent>;
  let component: NavigationComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle navOpen when toggleNav is called', () => {
    expect(component.navOpen).toBe(false);
    component.toggleNav();
    expect(component.navOpen).toBe(true);
    component.toggleNav();
    expect(component.navOpen).toBe(false);
  });

  it('should close nav on Escape keydown when open', () => {
    component.navOpen = true;
    component.onNavKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(component.navOpen).toBe(false);
  });

  it('should toggle dropdown and close other dropdowns', () => {
    const container = document.createElement('div');
    const link = document.createElement('a');
    const dropdown = document.createElement('div');
    dropdown.classList.add('nav-dropdown');

    const otherDropdown = document.createElement('div');
    otherDropdown.classList.add('nav-dropdown', 'active');

    container.append(link, dropdown, otherDropdown);
    document.body.append(container);

    const event = {
      currentTarget: link,
      stopPropagation: jasmine.createSpy('stopPropagation'),
    } as unknown as Event;

    component.toggleDropdown(event);

    expect(dropdown.classList.contains('active')).toBeTrue();
    expect(otherDropdown.classList.contains('active')).toBeFalse();
    expect(event.stopPropagation).toHaveBeenCalled();

    container.remove();
  });

  it('should remove active class from dropdowns on global click (setupNavigation)', () => {
    const dropdownA = document.createElement('div');
    const dropdownB = document.createElement('div');
    dropdownA.classList.add('nav-dropdown', 'active');
    dropdownB.classList.add('nav-dropdown', 'active');

    document.body.append(dropdownA, dropdownB);

    component.setupNavigation();
    document.dispatchEvent(new Event('click'));

    expect(dropdownA.classList.contains('active')).toBeFalse();
    expect(dropdownB.classList.contains('active')).toBeFalse();

    dropdownA.remove();
    dropdownB.remove();
  });
});
