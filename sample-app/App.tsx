import React from 'react';
import { Auth } from './components/Auth';
import { UserInfo } from './components/UserInfo';
import { useAuth } from './lib/auth';

export function App() {
  const { user } = useAuth();
  return (
    <div>
      {user && <UserInfo />}
      <Auth />
    </div>
  );
}
