import { Component, signal } from "@angular/core";
import { ModalComponent } from "../shared/ui/modal.component";
import { Checklist } from "../shared/interafaces/checklist";

@Component ({
    standalone: true,
    selector: 'app-home',
    imports: [ModalComponent],
    template: `
    <header>
        <h1>Checklist</h1>
        <button (click)="checklistBeingEdited.set({})">Add Checklist</button>
    </header>
    
    <app-modal [isOpen]="!!checklistBeingEdited()">
        <ng-template> No puedes verlo aun</ng-template>
    </app-modal>`
})

export default class HomeComponent {
    checklistBeingEdited = signal<Partial<Checklist> | null>(null);
}
