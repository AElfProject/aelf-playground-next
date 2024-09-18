import { FetchUser } from '../../application/usecases/fetchUser';
import { UserRepositoryImpl } from '../../infrastructure/repositories/UserRepositoryImpl';
import useSWR from 'swr';

export default function UserProfile({ userId }) {
  const fetchUser = new FetchUser(new UserRepositoryImpl());

  const { data: user, error } = useSWR(`/api/user/${userId}`, () => fetchUser.execute(userId));

  if (error) return <div>Error loading user profile</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
