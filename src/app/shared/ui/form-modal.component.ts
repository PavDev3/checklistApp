import { KeyValuePipe } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
    standalone: true,
    selector: 'app-form-modal',
    imports: [ReactiveFormsModule, KeyValuePipe],
    template: `
    <header>
        <h2>{{ title }}</h2>
        <button (click)="close.emit">Close</button>
    </header>
    <section>
        <form [formGroup]="formGroup" (ngSubmit)="save.emit(); close.emit">
            @for (control of formGroup.controls | keyvalue; track control.key) {
                <div>
                <label [for]="control.key">{{control.key}}</label>
                <input 
                [id]="control.key"
                type="text"
                [formControlName]="control.key"
                />
                </div>
            }
            <button type="submit">Save</button>
        </form>
    </section>
    `,
})

export class FormModalComponent {
    @Input({ required: true }) formGroup!: FormGroup;
    @Input({ required: true }) title!: string;
    @Output() close = new EventEmitter<void>();
    @Output() save = new EventEmitter<void>();
}