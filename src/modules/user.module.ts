import { Module } from '@nestjs/common';
import { UserController } from 'src/controllers/user.controller';
import { UserService } from 'src/service/user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
