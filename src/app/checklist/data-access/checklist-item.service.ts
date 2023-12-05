import { Injectable, computed, effect, inject, signal } from "@angular/core";
import { AddChecklistItem, ChecklistItem, RemoveChecklistItem, EditChecklistItem } from "../../shared/interafaces/checklist-item";
import { Subject } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { RemoveChecklist } from "../../shared/interafaces/checklist";
import { StorageService } from "../../shared/data-access/storage.service";

export interface ChecklistItemsState {
    checklistItems: ChecklistItem[];
    loaded: boolean
  }
  
  @Injectable({
    providedIn: 'root',
  })
  export class ChecklistItemService {
    private storageService = inject(StorageService);
    // state
    private state = signal<ChecklistItemsState>({
      checklistItems: [],
      loaded: false,
    });
  
    // selectors
    loaded = computed(() => this.state().loaded);
    checklistItems = computed(() => this.state().checklistItems);
  
    // sources
    private checklistItemsLoaded$ = this.storageService.loadChecklistItems();
    add$ = new Subject<AddChecklistItem>();
    toggle$ = new Subject<RemoveChecklistItem>();
    reset$ = new Subject<RemoveChecklist>();
    remove$ = new Subject<RemoveChecklistItem>();
    edit$ = new Subject<RemoveChecklistItem>();
    checklistRemoved$ = new Subject<RemoveChecklist>()
    
  

    
    constructor() {

      // reducers
    this.add$.pipe(takeUntilDestroyed()).subscribe((checklistItem) =>
      this.state.update((state) => ({
        ...state,
          checklistItems: [
          ...state.checklistItems,
            {
              ...checklistItem.item,
              id: Date.now().toString(),
              checklistId: checklistItem.checklistId,
              checked: false,
            },
          ],
        }))
      );

    this.toggle$.pipe(takeUntilDestroyed()).subscribe((checklistItemId) =>
      this.state.update((state) => ({
        ...state,
          checklistItems: state.checklistItems.map((item) =>
            item.id === checklistItemId
              ? {
                  ...item,
                  checked: !item.checked,
                }
              : item
          ),
        }))
      );

    this.reset$.pipe(takeUntilDestroyed()).subscribe((checklistId) =>
      this.state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.map((item) =>
          item.checklistId === checklistId ? { ...item, checked: false } : item
        ),
      }))
    );
    
    this.checklistItemsLoaded$
      .pipe(takeUntilDestroyed())
      .subscribe((checklistItems) =>
        this.state.update((state) => ({
          ...state,
          checklistItems,
          loaded: true,
      }))
    );

    this.edit$.pipe(takeUntilDestroyed()).subscribe((update) =>
    this.state.update((state) => ({
      ...state,
      checklistItems: state.checklistItems.map((item) =>
        item.id === update.id ? { ...item, title: update.data.title } : item
      ),
    }))
  );

  this.remove$.pipe(takeUntilDestroyed()).subscribe((id) =>
      this.state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.filter((item) => item.id !== id),
      }))
    );

  this.checklistRemoved$.pipe(takeUntilDestroyed()).subscribe((checklistId) =>
    this.state.update((state) => ({
      ...state,
      checklistItems: state.checklistItems.filter(
        (item) => item.checklistId !== checklistId
      ),
    }))
  );

    // effects
    effect(() => {
      if (this.loaded()) {
        this.storageService.saveChecklistItems(this.checklistItems());
      }
    });
  }
}