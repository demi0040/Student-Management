import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  snackbar$ = new Subject<{
    message: string;
    action: string;
    duration: number;
  }>();

  showSnackbar(message: string, action = 'Close', duration = 3000) {
    this.snackbar$.next({ message, action, duration });
  }
}
