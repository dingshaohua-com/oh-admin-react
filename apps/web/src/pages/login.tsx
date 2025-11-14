import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Field, FieldError, FieldGroup, FieldLabel } from '@repo/shadcn-comps/field';
import { Button } from '@repo/shadcn-comps/button';
import { Input } from '@repo/shadcn-comps/input';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { User, Lock, Mail, Smartphone, MessageSquare } from 'lucide-react';
// import logoImg from '@/assets/logo.png';
import type { QuickLoginType } from '@/types';

// 定义表单验证 schema
const passwordLoginSchema = z.object({
  account: z.string().min(1, '请输入用户名、邮箱或手机号'),
  password: z.string().min(1, '请输入密码'),
});

const emailLoginSchema = z.object({
  email: z.string().email({ message: '请输入有效的邮箱地址' }),
  code: z.string().min(1, '请输入验证码'),
});

const smsLoginSchema = z.object({
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号'),
  code: z.string().min(1, '请输入验证码'),
});

type PasswordLoginForm = z.infer<typeof passwordLoginSchema>;
type EmailLoginForm = z.infer<typeof emailLoginSchema>;
type SmsLoginForm = z.infer<typeof smsLoginSchema>;

export function Login() {
  const navigate = useNavigate();
  const [quickLoginType, setQuickLoginType] = useState<QuickLoginType>('email');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 根据登录类型选择对应的 schema
  const getSchema = () => {
    switch (quickLoginType) {
      case 'password':
        return passwordLoginSchema;
      case 'email':
        return emailLoginSchema;
      case 'sms':
        return smsLoginSchema;
      default:
        return emailLoginSchema;
    }
  };

  // 初始化表单
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    resolver: zodResolver(getSchema()),
    defaultValues:
      quickLoginType === 'email'
        ? { email: '3426612142@qq.com', code: '' }
        : quickLoginType === 'sms'
          ? { phone: '', code: '' }
          : { account: '', password: '' },
  });

  // 登录处理
  const onLogin = async (values: PasswordLoginForm | EmailLoginForm | SmsLoginForm) => {
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

      if (quickLoginType === 'email') {
        const email = (values as EmailLoginForm).email;
        if (!email) {
          toast.error('请输入邮箱地址');
          return;
        }
        // TODO: 调用发送验证码 API
        console.log('发送验证码到邮箱:', email);
      } else if (quickLoginType === 'sms') {
        const phone = (values as SmsLoginForm).phone;
        if (!phone) {
          toast.error('请输入手机号');
          return;
        }
        // TODO: 调用发送验证码 API
        console.log('发送验证码到手机:', phone);
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
  const switchQuickLoginType = (type: QuickLoginType) => {
    setQuickLoginType(type);
    setIsCodeSent(false);
    setCountdown(0);
    reset(); // 重置表单
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white rounded-xl shadow-[0_4px_8px_-4px_rgba(0,0,0,.13),0_6px_16px_0_rgba(0,0,0,.08),0_12px_24px_16px_rgba(0,0,0,.04)] p-10 w-full max-w-sm">
        {/* <img className="w-20 mx-auto rounded-full" src={logoImg} alt="Logo" /> */}
        <div className="pt-1 h-6">
          {quickLoginType === 'password' && (
            <div className="text-red-300 text-xs text-center">
              若首次使用 请选邮箱/手机，进入后再设密码即可
            </div>
          )}
        </div>

        <div className="space-y-6 mt-6">
          {/* 统一登录表单 */}
          <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
            {quickLoginType === 'password' && (
              <>
                <Field>
                  <FieldLabel>账号</FieldLabel>
                  <FieldGroup>
                    <User className="w-4 h-4 text-gray-400" />
                    <Controller
                      name="account"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="用户名/邮箱/手机号"
                          className="border-0 focus-visible:ring-0"
                        />
                      )}
                    />
                  </FieldGroup>
                  {errors.account && <FieldError>{errors.account.message}</FieldError>}
                </Field>

                <Field>
                  <FieldLabel>密码</FieldLabel>
                  <FieldGroup>
                    <Lock className="w-4 h-4 text-gray-400" />
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="password"
                          placeholder="请输入密码"
                          className="border-0 focus-visible:ring-0"
                        />
                      )}
                    />
                  </FieldGroup>
                  {errors.password && <FieldError>{errors.password.message}</FieldError>}
                </Field>
              </>
            )}

            {quickLoginType === 'email' && (
              <>
                <Field>
                  <FieldLabel>邮箱</FieldLabel>
                  <FieldGroup>
                    <Mail className="w-4 h-4 text-gray-400" />
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="email"
                          placeholder="请输入邮箱地址"
                          className="border-0 focus-visible:ring-0"
                        />
                      )}
                    />
                  </FieldGroup>
                  {errors.email && <FieldError>{errors.email.message}</FieldError>}
                </Field>

                <Field>
                  <FieldLabel>验证码</FieldLabel>
                  <div className="flex gap-2">
                    <FieldGroup className="flex-1">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      <Controller
                        name="code"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="请输入验证码"
                            className="border-0 focus-visible:ring-0"
                          />
                        )}
                      />
                    </FieldGroup>
                    <Button
                      type="button"
                      onClick={sendCode}
                      disabled={isCodeSent}
                      variant="outline"
                      className="w-24"
                    >
                      {isCodeSent ? `${countdown}s` : '发送'}
                    </Button>
                  </div>
                  {errors.code && <FieldError>{errors.code.message}</FieldError>}
                </Field>
              </>
            )}

            {quickLoginType === 'sms' && (
              <>
                <Field>
                  <FieldLabel>手机号</FieldLabel>
                  <FieldGroup>
                    <Smartphone className="w-4 h-4 text-gray-400" />
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="请输入手机号"
                          className="border-0 focus-visible:ring-0"
                        />
                      )}
                    />
                  </FieldGroup>
                  {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
                </Field>

                <Field>
                  <FieldLabel>验证码</FieldLabel>
                  <div className="flex gap-2">
                    <FieldGroup className="flex-1">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      <Controller
                        name="code"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="请输入验证码"
                            className="border-0 focus-visible:ring-0"
                          />
                        )}
                      />
                    </FieldGroup>
                    <Button
                      type="button"
                      onClick={sendCode}
                      disabled={isCodeSent}
                      variant="outline"
                      className="w-24"
                    >
                      {isCodeSent ? `${countdown}s` : '发送'}
                    </Button>
                  </div>
                  {errors.code && <FieldError>{errors.code.message}</FieldError>}
                </Field>
              </>
            )}

            <Button type="submit" className="w-full h-12 bg-blue-500 hover:bg-blue-600">
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
            <button
              type="button"
              onClick={() => switchQuickLoginType('password')}
              className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                quickLoginType === 'password'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <User className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => switchQuickLoginType('email')}
              className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                quickLoginType === 'email'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Mail className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => switchQuickLoginType('sms')}
              className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                quickLoginType === 'sms'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Smartphone className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};