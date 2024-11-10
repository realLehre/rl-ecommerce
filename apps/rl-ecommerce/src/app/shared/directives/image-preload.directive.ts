import {
  Directive,
  ElementRef,
  inject,
  input,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appImagePreload]',
  standalone: true,
})
export class ImagePreloadDirective implements OnInit {
  private el = inject(ElementRef);
  private render = inject(Renderer2);
  image = input.required<string>();
  private placeholderImage = 'assets/images/placeholder.gif';
  constructor() {}

  ngOnInit() {
    this.setPlaceHolderImage();
    this.preloadImage();
  }

  private setPlaceHolderImage() {
    this.render.setAttribute(
      this.el.nativeElement,
      'src',
      this.placeholderImage,
    );
    this.render.setAttribute(this.el.nativeElement, 'loading', 'eager');
  }

  private preloadImage() {
    const img = new Image();
    img.src = this.image();

    img.onload = () => this.setActualImage();
  }

  private setActualImage() {
    this.render.setAttribute(this.el.nativeElement, 'src', this.image());
  }
}
