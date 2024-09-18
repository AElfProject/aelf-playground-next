import { User } from '@/src/domain/entities/User';

export interface UserRepository {
  getUserById(userId: string): Promise<User>;
}
