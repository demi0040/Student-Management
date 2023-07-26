import { Component, Input } from '@angular/core';

interface UserProfile {
  userType: 'student' | 'teacher' | 'parent';
  name: string;
  email: string;
  phone: string;
  grade?: string; // Only for students
  subject?: string; // Only for teachers
  children?: string[]; // Only for parents
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  // Mock data for demonstration purposes
  userProfile: UserProfile = {
    userType: 'student',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    grade: '10th',
  };
}
