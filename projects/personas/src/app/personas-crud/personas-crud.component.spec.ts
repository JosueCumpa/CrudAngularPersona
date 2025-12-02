import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonasCrudComponent } from './personas-crud.component';

describe('PersonasCrudComponent', () => {
  let component: PersonasCrudComponent;
  let fixture: ComponentFixture<PersonasCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonasCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonasCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
