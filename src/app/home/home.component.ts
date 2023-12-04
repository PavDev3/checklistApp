import { Component, effect, inject, signal } from "@angular/core";
import { ModalComponent } from "../shared/ui/modal.component";
import { Checklist } from "../shared/interafaces/checklist";
import { FormBuilder } from "@angular/forms";
import { FormModalComponent } from "../shared/ui/form-modal.component";
import { ChecklistService } from "../shared/data-access/checklist.service";
import { ChecklistListComponent } from "../shared/ui/checklist-list.component";



@Component ({
    standalone: true,
    selector: 'app-home',
    imports: [ModalComponent, FormModalComponent, ChecklistListComponent],
    template: `
    <header>
        <h1>Checklist</h1>
        <button (click)="checklistBeingEdited.set({})">Add Checklist</button>
    </header>
    
    <app-modal [isOpen]="!!checklistBeingEdited()">
        <ng-template> 
            <app-form-modal 
            [title]="
            checklistBeingEdited()?.title
              ? checklistBeingEdited()!.title!
              : 'Add Checklist'
          "
          [formGroup]="checklistForm"
          (close)="checklistBeingEdited.set(null)"
          (save)="checklistService.add$.next(checklistForm.getRawValue())"
        />
        </ng-template>
    </app-modal>
    <section>
        <app-checklist-list [checklists]="checklistService.checklists()" />
    </section>
    `
})

export default class HomeComponent {
    formBuilder = inject(FormBuilder);
    checklistBeingEdited = signal<Partial<Checklist> | null>(null);
    checklistService = inject(ChecklistService);

    checklistForm = this.formBuilder.nonNullable.group({
        title: [''],
    });

    constructor() {
        effect(() => {
            const checklist = this.checklistBeingEdited();

            if (!checklist) {
                this.checklistForm.reset();
            }
        });
    }
}
