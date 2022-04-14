import { storage } from './utils';
import { request, gql } from 'graphql-request';
interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export async function handleApiResponse(data) {
  if (data.errors !== undefined) {
    return Promise.reject(data);
  } else {
    return data;
  }
}

export async function getUserProfile(): Promise<User> {
  return await request(
    'http://localhost:4000/graphql',
    gql`
      query {
        me {
          id
          email
        }
      }
    `,
    {},
    {
      Authorization: `Bearer ${storage.getToken()}`,
    }
  ).then(handleApiResponse).then((data): User => data.me);
  
}

export async function loginWithEmailAndPassword(user): Promise<AuthResponse> {
  console.log('USER---', user);
  return await request(
    'http://localhost:4000/graphql',
    gql`
      mutation {
        login(data: { email: "${user.email}", password: "${user.password}" }) {
          accessToken
          refreshToken
          user {
            id
            email
          }
        }
      }
    `
  ).then(handleApiResponse).then((data): AuthResponse => data.login);
  
}

export async function registerWithEmailAndPassword(
  data
): Promise<AuthResponse> {
  return window
    .fetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then(handleApiResponse);
}
