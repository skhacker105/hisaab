import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  OnDestroy,
  Output
} from '@angular/core';

@Directive({
  selector: '[appLongPress]'
})
export class LongPressDirective implements OnDestroy {
  @Output() longPressTriggered = new EventEmitter<void>();

  private pressTimer: any = null;
  private readonly pressThreshold = 5000; // 5 seconds

  constructor(private el: ElementRef) { }



  @HostListener('mouseup')
  @HostListener('mouseleave')
  @HostListener('touchend')
  @HostListener('touchcancel')
  onPressEnd(): void {
    this.clearTimer();
  }

  @HostListener('mousedown')
  @HostListener('touchstart')
  onPressStart(): void {
    this.clearTimer();
    this.pressTimer = setTimeout(() => {
      this.longPressTriggered.emit();
    }, this.pressThreshold);
  };

  private clearTimer(): void {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
      this.pressTimer = null;
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }
}

