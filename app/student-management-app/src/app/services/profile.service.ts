import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private apollo: Apollo) {}

  getProfile(userType: string, username: string) {
    return this.apollo.query<any>({
      query: gql`
        query getProfile($userType: String!, $username: String!) {
          getProfile(userType: $userType, username: $username) {
            ... on Student {
              username
              name
              email
              phone
              grade
            }
            ... on Teacher {
              username
              name
              email
              phone
              subject
            }
            ... on Parent {
              username
              name
              email
              phone
              children
            }
          }
        }
      `,
      variables: {
        userType,
        username,
      },
    });
  }
}
