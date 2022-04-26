import { initReactQueryAuth } from './react-query-auth';
import {
  loadUser,
  registerWithEmailAndPassword,
  loginWithEmailAndPassword,
  refreshToken,
  User,
} from './api';
import { storage } from './utils';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  email: string;
  name: string;
  password: string;
};

export interface Token {
  accessToken: number;
  refreshToken: number;
}

// async function handleTokenResponse(token) {
//   storage.setToken(token);
//   return token;
// }

async function loadUserFn(token: Token) {
  const response = await loadUser(token);
  return response;
}

async function loginFn(data: LoginCredentials) {
  const response = await loginWithEmailAndPassword(data);
  // const token = await handleTokenResponse(response);
  return response;
}

async function registerFn(data: RegisterCredentials) {
  const response = await registerWithEmailAndPassword(data);
  // const token = await handleTokenResponse(response);
  return response;
}

async function refreshFn(token: Token) {
  console.log('refreshFn', token)
  const response = await refreshToken(token.refreshToken);
  // const token = await handleTokenResponse(response);
  return response;
}

async function logoutFn() {
  await storage.clearToken();
}
const tokenDate = (token) => JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).exp * 1000;

const tokenExpired = (token: Token) => {
  const now = new Date().getTime();
  console.log('token expired', now, tokenDate(token.accessToken), tokenDate(token.accessToken) - now)
  return token.accessToken < now;
};

const refreshExpired = (token: Token) => {
  const now = new Date().getTime();
  console.log('refresh token expired time:', now, tokenDate(token.refreshToken), tokenDate(token.refreshToken) - now)
  return token.refreshToken < now;
};

const shouldRefreshOnBackground = (token: Token) => {
  const REFRESH_TIME_BEFORE_EXPIRE = 1000;

  const now = new Date().getTime();
  console.log('shouldRefreshOnBackground', tokenDate(token.accessToken) - REFRESH_TIME_BEFORE_EXPIRE, now, now > tokenDate(token.accessToken) - REFRESH_TIME_BEFORE_EXPIRE)
  return now > token.accessToken - REFRESH_TIME_BEFORE_EXPIRE;
};

const authConfig = {
  tokenExpired,
  refreshExpired,
  loadUserFn,
  loginFn,
  registerFn,
  refreshFn,
  logoutFn,
  shouldRefreshOnBackground,
  refreshExpiredError: new Error('401-Refresh token expired'),
};

const { AuthProvider, AuthConsumer, useAuth } = initReactQueryAuth<
  User,
  any,
  LoginCredentials,
  RegisterCredentials
>(authConfig);

export { AuthProvider, AuthConsumer, useAuth };
