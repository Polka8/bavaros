import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneRisorseComponent } from './gestione-risorse.component';

describe('GestioneRisorseComponent', () => {
  let component: GestioneRisorseComponent;
  let fixture: ComponentFixture<GestioneRisorseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestioneRisorseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestioneRisorseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
