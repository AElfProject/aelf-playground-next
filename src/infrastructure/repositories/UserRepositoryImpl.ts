import { UserRepository } from '../../application/ports/UserRepository';
import { User } from '../../domain/entities/User';

export class UserRepositoryImpl implements UserRepository {
  async getUserById(userId: string): Promise<User> {
    const response = await fetch(\`/api/user/\${userId}\`);
    const data = await response.json();
    return new User(data.id, data.name, data.email);
  }
}
