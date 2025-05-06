import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appSwipe]'
})
export class SwipeDirective {

  @Output() swipeRight = new EventEmitter<void>();
  @Output() swipeLeft = new EventEmitter<void>();

  private touchStartX = 0;

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].clientX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    const endX = event.changedTouches[0].clientX;
    const diff = endX - this.touchStartX;

    if (diff > 50) this.swipeRight.emit();
    else if (diff < -50) this.swipeLeft.emit();
  }

}
