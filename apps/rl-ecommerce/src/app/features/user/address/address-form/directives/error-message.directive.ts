import { Directive, ElementRef, inject, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer } from '@angular/forms';

@Directive({
  selector: '[appErrorMessage]',
  standalone: true,
})
export class ErrorMessageDirective implements OnInit {
  controlContainer = inject(ControlContainer);
  el = inject(ElementRef);
  @Input() controlName!: string;

  constructor() {}

  ngOnInit(): void {
    this.updateErrorMessage();

    const control = this.controlContainer.control?.get(this.controlName);
    if (control) {
      control.statusChanges.subscribe(() => {
        this.updateErrorMessage();
      });
      control.valueChanges.subscribe(() => {
        this.updateErrorMessage();
      });
    }
  }

  private getErrorMessage(control: AbstractControl): string {
    if (control.hasError('required')) {
      return 'This field is required';
    }
    if (control.hasError('minlength')) {
      return `Minimum length is ${
        control.errors!['minlength'].requiredLength
      } characters`;
    }
    if (control.hasError('pattern')) {
      return 'Invalid format';
    }
    return '';
  }

  private updateErrorMessage(): void {
    const control = this.controlContainer.control?.get(this.controlName);
    if (control) {
      this.el.nativeElement.innerHTML =
        control.invalid && control.touched ? this.getErrorMessage(control) : '';
    }
  }
}
