import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private apollo: Apollo) {}

  login(username: string, password: string) {
    return this.apollo.query<any>({
      query: gql`
        query getUser($username: String!) {
          getUser(username: $username) {
            username
            password
            userType
          }
        }
      `,
      variables: {
        username,
      },
    });
  }
}
