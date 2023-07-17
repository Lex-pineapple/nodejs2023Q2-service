import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Database from 'src/database/mainDb';

@Injectable()
export class AppService {
  database: Database;

  constructor() {
    this.database = new Database();
  }

  getUsers() {
    return this.database.user.findMany();
  }

  getUser(userId: string) {
    if (!this.database.validateId(userId))
      throw new BadRequestException('User ID is invalid');
    const user = this.database.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user)
      throw new NotFoundException(`User with ID ${userId} does not exist`);
    return user;
  }
}
