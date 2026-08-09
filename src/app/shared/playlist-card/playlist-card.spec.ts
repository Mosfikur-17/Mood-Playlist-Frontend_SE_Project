import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { PlaylistCardComponent } from './playlist-card';

describe('PlaylistCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistCardComponent]
    }).compileComponents();
  });

  it('should create playlist card component', () => {
    const fixture = TestBed.createComponent(PlaylistCardComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
