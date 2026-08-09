import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { MoodCardComponent } from './mood-card';

describe('MoodCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodCardComponent]
    }).compileComponents();
  });

  it('should create mood card component', () => {
    const fixture = TestBed.createComponent(MoodCardComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
