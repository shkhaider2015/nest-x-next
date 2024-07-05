import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {  JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      throw new NotFoundException(`No user found for email ${email}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is not valid');
    }

    const accessToken = this.jwtService.sign(
      { sub: user.id, username: user.name },
      { secret: process.env.JWT_ACCESS_SECRET_KEY, expiresIn: '5m' },
    );
    const refreshToken = this.jwtService.sign(
      { sub: user.id, username: user.name },
      { secret: process.env.JWT_REFRESH_SECRET_KEY, expiresIn: '5h' },
    );
    
    delete user.password;

    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }

  async loadUser(
    accessToken: string,
    refreshToken: string,
  ): Promise<AuthEntity> {
    try {
      let accessTokenSecret = process.env.JWT_ACCESS_SECRET_KEY;

      const { sub, ...rest } = this.jwtService.verify(accessToken, {
        secret: accessTokenSecret,
      });
      console.log('Sub : ', { sub, ...rest });

      const user = await this.prisma.user.findUnique({
        where: { id: sub }
      });

      delete user.password

      return {
        ...user,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      if (error?.message === 'jwt expired') {
        // throw new UnauthorizedException('Token has been expired, Please login');
       return this.updateRefreshToken(refreshToken);
      } else throw new NotFoundException(error?.message || 'Error not known');
    }
  }

  async updateRefreshToken(refreshToken: string): Promise<AuthEntity> {
    try {
      let refreshTokenSecret = process.env.JWT_REFRESH_SECRET_KEY;
      let accessTokenSecret = process.env.JWT_ACCESS_SECRET_KEY;

      const { sub, ...rest } = this.jwtService.verify(refreshToken, {
        secret: refreshTokenSecret,
      });
      console.log('Sub : ', { sub, ...rest });
      const user = await this.prisma.user.findUnique({
        where: { id: sub }
      });
      const newAccessToken = this.jwtService.sign(
        { sub: user.id, username: user.name },
        { secret: accessTokenSecret, expiresIn: '5m' },
      );
      
      delete user.password;

      return {
        ...user,
        accessToken: newAccessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      if (error?.message === 'jwt expired') {
        throw new UnauthorizedException('Token has been expired, Please login');
      } else throw new NotFoundException(error?.message || 'Error not known');
    }
  }
}
