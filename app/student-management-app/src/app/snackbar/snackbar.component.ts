import { Component, OnInit, OnDestroy } from '@angular/core';
import { SnackbarService } from './snackbar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-snackbar',
  template: `
    <div
      class="fixed top-0 p-4 text-center w-full transition-all duration-500"
      [class.hidden]="!visible"
      [ngClass]="{
        'bg-green-500': action === 'Success',
        'bg-red-500': action === 'Error'
      }"
    >
      <div class="text-white">{{ message }}</div>
    </div>
  `,
  styles: [],
})
export class SnackbarComponent implements OnInit, OnDestroy {
  message = '';
  action = '';
  visible = false;

  private subscription: Subscription | undefined;

  constructor(private snackbarService: SnackbarService) {}

  ngOnInit() {
    this.subscription = this.snackbarService.snackbar$.subscribe((snackbar) => {
      this.message = snackbar.message;
      this.action = snackbar.action;
      this.visible = true;

      setTimeout(() => {
        this.visible = false;
      }, snackbar.duration);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
