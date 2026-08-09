import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { FaqComponent } from './faq';

describe('FaqComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqComponent]
    }).compileComponents();
  });

  it('should create faq component', () => {
    const fixture = TestBed.createComponent(FaqComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
