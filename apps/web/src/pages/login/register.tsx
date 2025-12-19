import { toast } from 'sonner';
import { useState } from 'react';
import logoImg from '@/assets/logo.svg';
import { Input } from '@repo/shadcn-comps/input';
import { Button } from '@repo/shadcn-comps/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Field, FieldError, FieldLabel } from '@repo/shadcn-comps/field';
import { authControllerCheckUsername, authControllerCheckEmail, authControllerRegister } from '@/api/endpoints/auth';
import { verificationControllerSendCode } from '@/api/endpoints/verification';

// 检查用户名是否存在
const checkUsernameExists = async (username: string): Promise<boolean> => {
  const response = await authControllerCheckUsername({username});
  return response;
};

// 检查邮箱是否存在
const checkEmailExists = async (email: string): Promise<boolean> => {
  const response = await authControllerCheckEmail({email});
  console.log(response);
  return response;
};

// 注册表单验证 schema
const registerSchema = z.object({
  username: z
    .string()
    .min(1, '请输入用户名')
    .refine((val) => val.length >= 2, { message: '用户名至少2个字符' }),
  email: z.string().min(1, '请输入邮箱地址').email({ message: '请输入有效的邮箱地址' }),
  code: z.string().min(1, '请输入验证码'),
  password: z.string().min(1, '请输入密码').min(6, '密码至少6个字符'),
});

type RegisterForm = z.infer<typeof registerSchema>;

const initRegisterData: RegisterForm = {
  username: '',
  email: '',
  code: '',
  password: '',
};

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export default function Register({ onSwitchToLogin }: RegisterProps) {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isValidatingUsername, setIsValidatingUsername] = useState(false);
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);

  // 初始化表单
  // prettier-ignore
  const { control, handleSubmit, formState: { errors, isValid }, getValues, trigger, setError, clearErrors } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: initRegisterData,
    mode: 'onBlur', // 失焦时验证
  });

  // 验证用户名
  const validateUsername = async (username: string) => {
    // 如果用户名为空，让 schema 的基础验证处理必填错误
    if (!username) {
      return true; // 基础验证由 schema 处理
    }
    
    // 如果用户名长度不足，让 schema 的基础验证处理
    if (username.length < 2) {
      return true; // 基础验证由 schema 处理
    }
    
    // 执行异步验证检查用户名是否存在
    setIsValidatingUsername(true);
    
    try {
      const exists = await checkUsernameExists(username);
      console.log(1111, exists);
      
      if (exists) {
        return '用户名已存在';
      }
      return true;
    } catch (error) {
      return '验证失败，请稍后重试';
    } finally {
      setIsValidatingUsername(false);
    }
  };

  // 验证邮箱
  const validateEmail = async (email: string) => {
    if (!email) {
      return true; // 基础验证由 schema 处理
    }
    
    // 先验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return true; // 格式验证由 schema 处理
    }
    
    setIsValidatingEmail(true);
    try {
      const exists = await checkEmailExists(email);
      if (exists) {
        return '邮箱已被注册';
      }
      return true;
    } catch (error) {
      return '验证失败，请稍后重试';
    } finally {
      setIsValidatingEmail(false);
    }
  };

  // 注册处理
  const onRegister = async (values: RegisterForm) => {
    try {
      console.log('注册数据:', values);
      // TODO: 调用注册 API
      await authControllerRegister(values);
      toast.success('注册成功');
      // 注册成功后切换到登录页面
      onSwitchToLogin();
    } catch (error) {
      toast.error('注册失败，请检查输入信息');
    }
  };

  // 发送验证码
  const sendCode = async () => {
    try {
      const values = getValues();
      const email = values.email;
      
      if (!email) {
        toast.error('请输入邮箱地址');
        return;
      }
      
      // TODO: 调用发送验证码 API
      await verificationControllerSendCode({email, type: 'register'});
      console.log('发送验证码到邮箱:', email);

      setIsCodeSent(true);

      // 开始倒计时
      let count = 60;
      setCountdown(count);
      const timer = setInterval(() => {
        count--;
        setCountdown(count);
        if (count === 0) {
          clearInterval(timer);
          setIsCodeSent(false);
        }
      }, 1000);
    } catch (error) {
      toast.error('验证码发送失败');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white rounded-xl shadow-soft px-10 py-8 w-full max-w-sm relative">
        <div className="flex items-center justify-center gap-1">
          <img className="w-10" src={logoImg} alt="Logo" />
          <span className="font-bold">oh admin</span>
        </div>

        <div className="space-y-6 mt-6">
          {/* 注册表单 */}
          <form onSubmit={handleSubmit(onRegister)} className="space-y-2">
            <Field className="gap-1">
              <div className="flex items-center gap-2">
                <FieldLabel className="w-12 shrink-0">用户名</FieldLabel>
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="请输入用户名"
                      onBlur={async () => {
                        field.onBlur();
                        // 直接调用验证函数
                        await validateUsername(field.value).then((result) => {
                          if (result !== true) {
                            setError('username', { type: 'validate', message: result });
                          }
                        });
                      }}
                    />
                  )}
                />
              </div>
              <div className="min-h-5 text-right">
                {errors.username && <FieldError>{errors.username.message}</FieldError>}
                {isValidatingUsername && <span className="text-xs text-gray-400">验证中...</span>}
              </div>
            </Field>

            <Field className="gap-1">
              <div className="flex items-center gap-2">
                <FieldLabel className="w-12 shrink-0">邮箱</FieldLabel>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="请输入邮箱地址"
                      onBlur={async () => {
                        field.onBlur();
                        // 直接调用验证函数
                        await validateEmail(field.value).then((result) => {
                          if (result !== true) {
                            setError('email', { type: 'validate', message: result });
                          }
                        });
                      }}
                    />
                  )}
                />
              </div>
              <div className="min-h-5 text-right">
                {errors.email && <FieldError>{errors.email.message}</FieldError>}
                {isValidatingEmail && <span className="text-xs text-gray-400">验证中...</span>}
              </div>
            </Field>

            <Field className="gap-1">
              <div className="flex items-center gap-2">
                <FieldLabel className="w-12 shrink-0">验证码</FieldLabel>
                <div className="flex gap-2 flex-1">
                  <Controller name="code" control={control} render={({ field }) => <Input {...field} placeholder="请输入验证码" />} />
                  <Button type="button" onClick={sendCode} disabled={isCodeSent} className="w-24">
                    {isCodeSent ? `${countdown}s` : '获取'}
                  </Button>
                </div>
              </div>
              <div className="min-h-5 text-right">{errors.code && <FieldError>{errors.code.message}</FieldError>}</div>
            </Field>

            <Field className="gap-1">
              <div className="flex items-center gap-2">
                <FieldLabel className="w-12 shrink-0">密码</FieldLabel>
                <Controller name="password" control={control} render={({ field }) => <Input {...field} type="password" placeholder="请输入密码" />} />
              </div>
              <div className="min-h-5 text-right">{errors.password && <FieldError>{errors.password.message}</FieldError>}</div>
            </Field>

            <Button type="submit" className="w-full h-12" disabled={!isValid || isValidatingUsername || isValidatingEmail}>
              注册
            </Button>
          </form>
        </div>

        {/* 切换到登录 */}
        <div className="mt-4 text-center">
          <button type="button" onClick={onSwitchToLogin} className="text-sm text-gray-500 hover:text-gray-700">
            已有账号？去登录
          </button>
        </div>
      </div>
    </div>
  );
}

