// registration.component.ts

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from '../snackbar/snackbar.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const REGISTER_MUTATION = gql`
  mutation newRegistration(
    $username: String!
    $password: String!
    $userType: String!
    $profileInput: ProfileInput!
  ) {
    newRegistration(
      username: $username
      password: $password
      userType: $userType
      profileInput: $profileInput
    ) {
      user {
        username
        userType
      }
      profile {
        ... on Student {
          name
          grade
        }
        ... on Teacher {
          name
          subject
        }
        ... on Parent {
          name
          children
        }
      }
    }
  }
`;

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: [],
})
export class RegistrationComponent implements OnInit {
  userType = 'Student';

  registrationForm = new FormGroup({
    userType: new FormControl(this.userType),
    name: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl(''),
    grade: new FormControl(''),
    subject: new FormControl(''),
    children: new FormControl(''),
  });

  constructor(
    private apollo: Apollo,
    private router: Router,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {}

  onClear() {
    this.registrationForm.reset();
    this.userType = 'Student';
    this.registrationForm.controls['userType'].setValue(this.userType);
  }

  onSubmit() {
    let profileInput: { [key: string]: any } = {
      name: this.registrationForm.get('name')?.value,
      email: this.registrationForm.get('email')?.value,
      phone: this.registrationForm.get('phone')?.value,
      userTypeDetails: '',
    };

    switch (this.registrationForm.get('userType')?.value) {
      case 'Student':
        profileInput['userTypeDetails'] =
          this.registrationForm.get('grade')?.value;
        break;
      case 'Teacher':
        profileInput['userTypeDetails'] =
          this.registrationForm.get('subject')?.value;
        break;
      case 'Parent':
        profileInput['userTypeDetails'] =
          this.registrationForm.get('children')?.value;
        break;
    }

    this.apollo
      .mutate({
        mutation: REGISTER_MUTATION,
        variables: {
          username: this.registrationForm.get('username')?.value,
          password: this.registrationForm.get('password')?.value,
          userType: this.registrationForm.get('userType')?.value,
          profileInput: profileInput,
        },
      })
      .subscribe(
        ({ data }) => {
          const typedData = data as any;
          this.router.navigate(['/login']);
          this.snackbarService.showSnackbar(
            `Registration successful for user: ${typedData.newRegistration.user.username}`,
            'Success'
          );
        },
        (error) => {
          console.error('There was an error during registration', error);
        }
      );
  }
}
