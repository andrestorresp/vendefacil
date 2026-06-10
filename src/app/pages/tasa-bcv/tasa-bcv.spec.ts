import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasaBcvComponent } from './tasa-bcv';

describe('TasaBcv', () => {
  let component: TasaBcvComponent;
  let fixture: ComponentFixture<TasaBcvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasaBcvComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TasaBcvComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
