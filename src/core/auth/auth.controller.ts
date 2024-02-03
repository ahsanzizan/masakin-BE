import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ResponseTemplate } from 'src/utils/interceptors/transform.interceptor';
import { AllowAnon } from './auth.decorator';
import { AuthService } from './auth.service';
import SignInDto from './dto/signIn.dto';
import SignUpDto from './dto/signUp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AllowAnon()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'User login', tags: ['auth'] })
  async signIn(@Body() credentials: SignInDto): Promise<
    ResponseTemplate<{
      sub: string;
      createdAt: Date;
      username: string;
      email: string;
      avatar: string | null;
      access_token: string;
    }>
  > {
    return {
      message: 'Logged in successfully',
      result: await this.authService.signIn(
        credentials.username,
        credentials.password,
      ),
    };
  }

  @AllowAnon()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @ApiOperation({ summary: 'User registration', tags: ['auth'] })
  async signUp(
    @Body() credentials: SignUpDto,
  ): Promise<ResponseTemplate<null>> {
    await this.authService.signUp(
      credentials.username,
      credentials.email,
      credentials.password,
    );

    return { message: 'Registered successfully', result: null };
  }
}
