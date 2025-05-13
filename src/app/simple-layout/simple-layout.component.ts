import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-simple-layout',
  templateUrl: './simple-layout.component.html',
  styleUrls: ['./simple-layout.component.css']
})
export class SimpleLayoutComponent implements OnInit {
  currentRoute: string = '';
  isAuthPage: boolean = false;
  userName: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
      this.checkIfAuthPage();
      this.updateUserName();
    });
  }

  ngOnInit(): void {
    // Check if we're on the root path and redirect to dashboard
    if (this.router.url === '/') {
      this.router.navigate(['/dashboard']);
    }

    this.checkIfAuthPage();
    this.updateUserName();
  }

  checkIfAuthPage(): void {
    this.isAuthPage = this.currentRoute.includes('/login') ||
                      this.currentRoute.includes('/register');
  }

  updateUserName(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.email.split('@')[0]; // Use the part before @ as username
    }
  }

  getPageTitle(): string {
    // Extract the page title from the current route
    if (this.currentRoute.includes('/dashboard')) {
      return 'Dashboard';
    } else if (this.currentRoute.includes('/feed')) {
      return 'Feed Management';
    } else if (this.currentRoute.includes('/ingredients')) {
      return 'Ingredients Management';
    } else if (this.currentRoute.includes('/animals')) {
      return 'Animals Management';
    } else if (this.currentRoute.includes('/dairy')) {
      return 'Dairy Management';
    } else if (this.currentRoute.includes('/newborn')) {
      return 'New Born Management';
    } else if (this.currentRoute.includes('/vaccination')) {
      return 'Vaccination Management';
    } else if (this.currentRoute.includes('/reports')) {
      return 'Reports';
    } else if (this.currentRoute.includes('/statistics')) {
      return 'Statistics';
    } else if (this.currentRoute.includes('/settings')) {
      return 'Settings';
    } else if (this.currentRoute.includes('/help')) {
      return 'Help Center';
    } else if (this.currentRoute.includes('/login')) {
      return 'Login';
    } else if (this.currentRoute.includes('/register')) {
      return 'Register';
    } else {
      return 'Dashboard';
    }
  }

  logout(): void {
    this.authService.logout();
  }

  getUserRole(): string {
    return this.authService.getUserRole() || '';
  }
}
