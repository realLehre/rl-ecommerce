import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appPhoneNumber]',
  standalone: true,
})
export class PhoneNumberDirective {
  private regex: RegExp = new RegExp(/^[0-9+-]*$/); // Only allow numbers, +, and -

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const inputChar = event.key;
    // Allow control keys such as backspace, tab, etc.
    if (
      event.key === 'Backspace' ||
      event.key === 'Tab' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.ctrlKey ||
      event.metaKey
    ) {
      return;
    }

    // Prevent input if it does not match the regex
    if (!this.regex.test(inputChar)) {
      event.preventDefault();
    }
  }
}
