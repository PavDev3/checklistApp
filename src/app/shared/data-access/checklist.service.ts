import { Injectable, computed, inject, signal } from '@angular/core';
import { AddChecklist, Checklist } from '../interafaces/checklist';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { StorageService } from './storage.service';

export interface ChecklistsState {
    checklists: Checklist[];
    loaded: boolean;
    error: string | null;

}

@Injectable ({
    providedIn: 'root',
})

export class ChecklistService {

  private storageService = inject(StorageService);
  

    // State
    private state = signal<ChecklistsState>({
        checklists: [],
        loaded: false,
        error: null,
    });
    // Selectors
    loaded = computed(() => this.state().loaded);
    checklists = computed(() => this.state().checklists);

    // sources
    private checklistsLoaded$ = this.storageService.loadChecklists()
    add$ = new Subject<AddChecklist>();
  
    constructor() {
      // reducers
      this.checklistsLoaded$.pipe(takeUntilDestroyed()).subscribe({
        next: (checklists) =>
          this.state.update((state) => ({
            ...state,
            checklists,
            loaded: true,
          })),
          error: (err) => this.state.update((state) => ({ ...state, error: err })),
      }
      );

      this.add$.pipe(takeUntilDestroyed()).subscribe((checklist) =>
        this.state.update((state) => ({
          ...state,
          checklists: [...state.checklists, this.addIdToChecklist(checklist)],
        }))
      );
    }

      // effects
      effects() {
        if (this.loaded()) {
          this.storageService.saveChecklists(this.checklists());
        }
      }

  
    private addIdToChecklist(checklist: AddChecklist) {
      return {
        ...checklist,
        id: this.generateSlug(checklist.title),
      };
    }
  
    private generateSlug(title: string) {
      // NOTE: This is a simplistic slug generator and will not handle things like special characters.
      let slug = title.toLowerCase().replace(/\s+/g, '-');
  
      // Check if the slug already exists
      const matchingSlugs = this.checklists().find(
        (checklist) => checklist.id === slug
      );
  
      // If the title is already being used, add a string to make the slug unique
      if (matchingSlugs) {
        slug = slug + Date.now().toString();
      }
  
      return slug;
    }
  }


