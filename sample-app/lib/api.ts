import { storage } from './utils';
import { request, gql } from 'graphql-request';
import { Token } from './auth';


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

export async function loadUser(token: Token): Promise<User> {
  
  
  if(!token?.accessToken) return undefined;
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
      Authorization: `Bearer ${token.accessToken}`,
    }
  ).then(handleApiResponse).then((data): User => data.me);
  
}

export async function loginWithEmailAndPassword(user): Promise<Token> {
  console.log('USER---', user);
  return await request(
    'http://localhost:4000/graphql',
    gql`
      mutation {
        login(data: { email: "${user.email}", password: "${user.password}" }) {
          accessToken
          refreshToken
        }
      }
    `
  ).then(handleApiResponse).then((data): Token => data.login);
  
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

export async function refreshToken(refreshToken: string): Promise<Token> {
  console.log('refresh vars', refreshToken)
  if(!refreshToken) return undefined;
  console.log('refresh', refreshToken)
  return await request(
    'http://localhost:4000/graphql',
    gql`
      mutation {
        refreshToken(token: "${refreshToken}") {
          accessToken
          refreshToken
        }
      }
    `,
    {},
  ).then(handleApiResponse).then((data): Token => data.refreshToken);
  
}