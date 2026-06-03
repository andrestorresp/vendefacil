import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasaBcv } from './tasa-bcv';

describe('TasaBcv', () => {
  let component: TasaBcv;
  let fixture: ComponentFixture<TasaBcv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasaBcv],
    }).compileComponents();

    fixture = TestBed.createComponent(TasaBcv);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
