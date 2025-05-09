import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-welcome-screen',
  templateUrl: './welcome-screen.component.html',
  styleUrl: './welcome-screen.component.scss'
})
export class WelcomeScreenComponent {
  @Output() finished = new EventEmitter<void>();

  ngOnInit() {
    setTimeout(() => {
      this.finished.emit();
    }, 2500); // Show for 2.5 seconds
  }
}
