import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: [],
})
export class SidebarComponent {
  constructor(private router: Router) {}
  logout() {
    this.router.navigate(['/login']);
  }
  @Input() loggedIn: boolean = false;
}
