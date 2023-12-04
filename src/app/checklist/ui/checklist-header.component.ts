import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Checklist, RemoveChecklist } from "../../shared/interafaces/checklist";

@Component ({
    standalone: true,
    selector: 'app-checklist-header',
    imports: [RouterLink],
    template: `
    <header>
        <a routerLink="/home">Back</a>
        <h1>{{ checklist.title }}</h1>
        <div>
            <button (click)="resetChecklist.emit()">Reset</button>
            <button (click)="addItem.emit()">Add item</button>
        </div>
    </header>
    `,
})

export class ChecklistHeaderComponent {
    @Input({required: true}) checklist!: Checklist;
    @Output() addItem = new EventEmitter<void>();
    @Output() resetChecklist  = new EventEmitter<string>();
}


