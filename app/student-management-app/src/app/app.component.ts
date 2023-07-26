import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'student-management-app';

  hideNavbarAndSidebar: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Subscribe to the router events to detect navigation changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Check if the current route is login or registration
        this.hideNavbarAndSidebar =
          event.url.includes('/login') || event.url.includes('/registration');
      }
    });
  }
}
