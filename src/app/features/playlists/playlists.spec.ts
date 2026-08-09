import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { PlaylistsComponent } from './playlists';

describe('PlaylistsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistsComponent]
    }).compileComponents();
  });

  it('should create playlists component', () => {
    const fixture = TestBed.createComponent(PlaylistsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});