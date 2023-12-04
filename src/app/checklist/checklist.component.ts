import { Component, computed, effect, inject, signal } from "@angular/core";
import { ChecklistService } from "../shared/data-access/checklist.service";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { ChecklistHeaderComponent } from "./ui/checklist-header.component";
import { ChecklistItemService } from "../shared/data-access/checklist-item.service";
import { FormBuilder } from "@angular/forms";
import { ChecklistItem } from "../shared/interafaces/checklist-item";
import { ModalComponent } from "../shared/ui/modal.component";
import { FormModalComponent } from "../shared/ui/form-modal.component";
import { ChecklistItemListComponent } from "../shared/ui/checklist-item-list.component";

@Component ({
    standalone: true,
    selector: 'app-checklist',
    template: `
    
    @if (checklist(); as checklist){
  <app-checklist-header
    [checklist]="checklist"
    (addItem)="checklistItemBeingEdited.set({})"
    (resetChecklist)="checklistItemService.reset$.next($event)"
  />
}

    <app-checklist-item-list [checklistItems]="items()"
    (toggle)="checklistItemService.toggle$.next($event)" />

    <app-modal [isOpen]="!!checklistItemBeingEdited()">
        <ng-template>
            <app-form-modal
                title="Create item"
                [formGroup]="checklistItemForm"
                (save)="checklistItemService.add$.next({
                    item: checklistItemForm.getRawValue(),
                    checklistId: checklist()?.id!,
                })"
                (close)="checklistItemBeingEdited.set(null)"
            >
            </app-form-modal>
        </ng-template>
    </app-modal>
    `,
    imports: [ChecklistHeaderComponent, RouterLink, ModalComponent, FormModalComponent, ChecklistItemListComponent]
})

    
export default class ChecklistComponent {
    checklistService = inject(ChecklistService);
    checklistItemService = inject(ChecklistItemService);
    route = inject(ActivatedRoute);
    formBuilder = inject(FormBuilder);

    checklistItemBeingEdited = signal<Partial<ChecklistItem> | null>(null);

    params = toSignal(this.route.paramMap);

    items = computed(() =>
    this.checklistItemService
    .checklistItems()
    .filter((item) => item.checklistId === this.params()?.get('id'))
    );

    checklist = computed(() => 
        this.checklistService
            .checklists()
            .find((checklist) => checklist.id === this.params()?.get('id'))
    );

    checklistItemForm = this.formBuilder.nonNullable.group({
        title: [''],
    });

    constructor() {
        effect(() => {
            const checklistItem = this.checklistItemBeingEdited();

            if (!checklistItem) {
                this.checklistItemForm.reset();
            }
        });
    }
}
    