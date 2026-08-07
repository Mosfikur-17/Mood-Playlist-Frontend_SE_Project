import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodCard } from './mood-card';

describe('MoodCard', () => {
  let component: MoodCard;
  let fixture: ComponentFixture<MoodCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodCard],
    }).compileComponents();

    fixture = TestBed.createComponent(MoodCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
