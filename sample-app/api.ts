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

export async function handleApiResponse(response) {
  const data = await response;
  console.log(data);
  if (response) {
    return data;
  } else {
    return Promise.reject(data);
  }
}

export async function getUserProfile() {
  const data = await request(
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
  );
  return data.me;
}

export async function loginWithEmailAndPassword(user): Promise<AuthResponse> {
  console.log('USER---', user);
  const { login } = await request(
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
  );
  return login;
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
