import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { jwtConstants } from 'src/common/constants'
import { UsersModule } from 'src/modules/users/users.module'
import { AuthController } from './controllers/auth.controller'
import { AuthService } from './services/auth.service'

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60 days' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
