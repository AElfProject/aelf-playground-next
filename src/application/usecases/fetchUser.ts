import { UserRepository } from '@/src/application/ports/UserRepository';
import { User } from '@/src/domain/entities/User';

export class FetchUser {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<User> {
    return this.userRepository.getUserById(userId);
  }
}
