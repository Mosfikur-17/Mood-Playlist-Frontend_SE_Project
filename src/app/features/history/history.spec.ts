import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HistoryComponent } from './history';

describe('HistoryComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryComponent]
    }).compileComponents();
  });

  it('should create history component', () => {
    const fixture = TestBed.createComponent(HistoryComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
