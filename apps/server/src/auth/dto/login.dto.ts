// 登录 DTO
export class LoginDto {
  loginType: 'password' | 'email';
  account?: string;
  password?: string;
  email?: string;
  code?: string;
}
