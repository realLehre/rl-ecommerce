import { Injectable } from '@angular/core';
import { QuillModules } from 'ngx-quill';

@Injectable({
  providedIn: 'root',
})
export class MQuillService {
  modules: QuillModules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote'],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction
        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      ],
      handlers: {
        'custom-dropdown': function (value: string) {
          if (value) {
            //@ts-expect-error
            const cursorPosition = this.quill.getSelection().index;
            //@ts-expect-error
            this.quill.insertText(cursorPosition, value);
            //@ts-expect-error
            this.quill.setSelection(cursorPosition + value.length); // Place cursor after inserted text
          }
        },
      },
    },
  };
}
