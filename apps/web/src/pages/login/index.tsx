import { toast } from 'sonner';
import { useState } from 'react';
import logoImg from '@/assets/logo.png';
import { User, Mail } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Input } from '@repo/shadcn-comps/input';
import { cn } from '@repo/shadcn-comps/lib/utils';
import { Button } from '@repo/shadcn-comps/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { loginSchema, initData, LoginForm } from './helper';
import { Field, FieldError, FieldLabel } from '@repo/shadcn-comps/field';

export default function Login() {
  const navigate = useNavigate();
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 初始化表单
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    watch,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: initData.passwordForm,
  });

  // 监听当前登录类型
  const loginType = watch('loginType');

  // 登录处理
  const onLogin = async (values: LoginForm) => {
    try {
      console.log('登录数据:', values);
      // TODO: 调用登录 API
      toast.success('登录成功');
      navigate('/');
    } catch (error) {
      toast.error('登录失败，请检查账号密码或验证码');
    }
  };

  // 发送验证码
  const sendCode = async () => {
    try {
      const values = getValues();

      if (values.loginType === 'email') {
        const email = values.email;
        if (!email) {
          toast.error('请输入邮箱地址');
          return;
        }
        // TODO: 调用发送验证码 API
        console.log('发送验证码到邮箱:', email);
      }

      setIsCodeSent(true);
      toast.success('验证码已发送');

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

  // 切换快捷登录类型
  const switchQuickLoginType = (type: 'password' | 'email') => {
    setIsCodeSent(false);
    setCountdown(0);
    // 根据类型重置表单为对应的默认值
    reset(type === 'password' ? initData.passwordForm : initData.emailForm);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white rounded-xl shadow-soft p-10 w-full max-w-sm">
        <img className="w-20 mx-auto rounded-full" src={logoImg} alt="Logo" />

        <div className="space-y-6 mt-6">
          {/* 统一登录表单 */}
          <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
            {loginType === 'password' && (
              <>
                <Field orientation="horizontal">
                  <FieldLabel className="w-16 shrink-0">账号</FieldLabel>
                  <Controller name="account" control={control} render={({ field }) => <Input {...field} placeholder="用户名/邮箱/手机号" />} />
                  {'account' in errors && errors.account && <FieldError>{errors.account.message}</FieldError>}
                </Field>

                <Field orientation="horizontal">
                  <FieldLabel className="w-16 shrink-0">密码</FieldLabel>
                  <Controller name="password" control={control} render={({ field }) => <Input {...field} type="password" placeholder="请输入密码" />} />
                  {'password' in errors && errors.password && <FieldError>{errors.password.message}</FieldError>}
                </Field>
              </>
            )}

            {loginType === 'email' && (
              <>
                <Field orientation="horizontal">
                  <FieldLabel className="w-16 shrink-0">邮箱</FieldLabel>
                  <Controller name="email" control={control} render={({ field }) => <Input {...field} type="email" placeholder="请输入邮箱地址" />} />
                  {'email' in errors && errors.email && <FieldError>{errors.email.message}</FieldError>}
                </Field>

                <Field orientation="horizontal">
                  <FieldLabel className="w-16 shrink-0">验证码</FieldLabel>
                  <div className="flex gap-2">
                    <Controller name="code" control={control} render={({ field }) => <Input {...field} placeholder="请输入验证码" />} />
                    <Button type="button" onClick={sendCode} disabled={isCodeSent} className="w-24">
                      {isCodeSent ? `${countdown}s` : '发送'}
                    </Button>
                  </div>
                  {'code' in errors && errors.code && <FieldError>{errors.code.message}</FieldError>}
                </Field>
              </>
            )}

            <Button type="submit" className="w-full h-12">
              登录
            </Button>
          </form>
        </div>

        {/* 登录方式选项 */}
        <div className="mt-5">
          <div className="flex items-center justify-center mb-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-3 text-sm text-gray-500">登录方式</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="flex justify-center gap-4 flex-wrap">
            <Button type="button" onClick={() => switchQuickLoginType('password')} className={cn('icon-btn', { 'icon-btn-inactive': loginType !== 'password' })}>
              <User className="w-5 h-5" />
            </Button>
            <Button type="button" onClick={() => switchQuickLoginType('email')} className={cn('icon-btn', { 'icon-btn-inactive': loginType !== 'email' })}>
              <Mail className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
