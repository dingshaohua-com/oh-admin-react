
import { z } from 'zod';

// 使用 discriminatedUnion 定义表单验证 schema
export const loginSchema = z.discriminatedUnion('loginType', [
  z.object({
    loginType: z.literal('password'),
    account: z.string().min(1, '请输入用户名、邮箱'),
    password: z.string().min(1, '请输入密码'),
  }),
  z.object({
    loginType: z.literal('email'),
    email: z.string().email({ message: '请输入有效的邮箱地址' }),
    code: z.string().min(1, '请输入验证码'),
  }),
]);

export type LoginForm = z.infer<typeof loginSchema>;

// 一些状态默认值
export const initData: { passwordForm: LoginForm; emailForm: LoginForm } = {
  passwordForm: {
    loginType: 'password',
    account: '',
    password: '',
  },
  emailForm: {
    loginType: 'email',
    email: '',
    code: '',
  },
};
