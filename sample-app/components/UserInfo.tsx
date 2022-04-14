import { useAuth } from '../lib/auth';

export function UserInfo() {
  const { user, logout } = useAuth();
  return (
    <div>
      Welcome {user.email}
      <button onClick={() => logout()}>Log Out</button>
    </div>
  );
}
