import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDTO } from './dto/login.dto';
import { LoadUserDTO } from './dto/loadUser.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { email, password }: LoginDTO) {
    return this.authService.login(email, password);
  }

  @Post('load-user')
  @ApiOkResponse({type : AuthEntity })
  loadUser(@Body() {accessToken, refreshToken}:LoadUserDTO ){
    return this.authService.loadUser(accessToken, refreshToken)
  }
}