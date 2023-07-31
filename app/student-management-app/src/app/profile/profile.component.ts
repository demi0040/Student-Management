import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: [],
})
export class ProfileComponent implements OnInit {
  user: string = this.userService.getCurrentUser();
  userProfile: any = {};
  userType: string = this.userService.getUserType();

  constructor(
    private userService: UserService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.profileService
      .getProfile(this.userType, this.user)
      .subscribe((result) => {
        this.userProfile = result.data.getProfile;
      });
  }
}
