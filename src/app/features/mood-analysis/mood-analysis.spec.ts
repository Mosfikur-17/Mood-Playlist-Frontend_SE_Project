import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodAnalysis } from './mood-analysis';

describe('MoodAnalysis', () => {
  let component: MoodAnalysis;
  let fixture: ComponentFixture<MoodAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodAnalysis],
    }).compileComponents();

    fixture = TestBed.createComponent(MoodAnalysis);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
