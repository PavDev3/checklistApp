import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Checklist } from "../../shared/interafaces/checklist";

@Component({
    standalone: true,
    selector: 'app-checklist-header',
    template: `
      <header>
        <a routerLink="/home">Back</a>
        <h1>
          {{ checklist.title }}
        </h1>
        <div>
          <button
            (click)="resetChecklist.emit(checklist.id)"
          >
            Reset
          </button>
          <button
            (click)="addItem.emit()"
          >
            Add item
          </button>
        </div>
      </header>
    `,
    styles: [
      `
        button {
          margin-left: 1rem;
        }
      `,
    ],
    imports: [RouterModule],
  })
  export class ChecklistHeaderComponent {
    @Input({ required: true }) checklist!: Checklist;
    @Output() addItem = new EventEmitter<void>();
    @Output() resetChecklist = new EventEmitter<string>();
  }

