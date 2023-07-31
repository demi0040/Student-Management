import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUser: string = '';
  private userType: string = '';

  constructor() {}

  setCurrentUser(username: string) {
    this.currentUser = username;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  setUserType(userType: string) {
    this.userType = userType;
  }

  getUserType() {
    return this.userType;
  }
}
