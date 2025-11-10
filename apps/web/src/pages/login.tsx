import type { FormProps } from 'antd';
import React, { useState } from 'react';
import logoImg from '@/assets/logo.png';
import { useNavigate } from 'react-router';
import { setToken, syncUserInfo } from '@/store/action-creator';
import { Button, Input, Form, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, MobileOutlined, WechatOutlined, QqOutlined, SafetyOutlined } from '@ant-design/icons';



type LoginFieldType = {
  account?: string;
  password?: string;
  email?: string;
  phone?: string;
  code?: string;
};

export function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [quickLoginType, setQuickLoginType] = useState<QuickLoginType | null>('email');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 登录
  const onLogin: FormProps<LoginFieldType>['onFinish'] = async (values) => {
    try {
      let token: string;
      if (quickLoginType === 'password') {
        const res = await api.root.login(values);
        token = res.token;
      } else {
        const loginData = quickLoginType === 'email' ? { email: values.email, code: values.code } : { phone: values.phone, code: values.code };
        const res = await api.root.login(loginData);
        token = res.token;
      }
      dispatch(setToken(token));
      const userInfo = await dispatch(syncUserInfo());
      console.log('userInfo:', userInfo);
      if (userInfo.payload.username) {
        navigate('/'+userInfo.payload.username);
      } else {
        navigate('/set-uname');
      }

    } catch (error) {
      message.error('登录失败，请检查账号密码或验证码');
    }
  };

  // 发送验证码
  const sendCode = async () => {
    try {
      let loginData: { email?: string; phone?: string };
      if (quickLoginType === 'email') {
        const emailInput = document.querySelector('input[placeholder="请输入邮箱地址"]') as HTMLInputElement;
        const email = emailInput?.value;
        if (!email) {
          message.error('请输入邮箱地址');
          return;
        }
        loginData = { email };
      } else if (quickLoginType === 'sms') {
        const phoneInput = document.querySelector('input[placeholder="请输入手机号"]') as HTMLInputElement;
        const phone = phoneInput?.value;
        if (!phone) {
          message.error('请输入手机号');
          return;
        }
        loginData = { phone };
      }
      setIsCodeSent(true);
      await api.root.sendCode(loginData);

      message.success('验证码已发送');

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
      message.error('验证码发送失败');
    }
  };

  // 第三方登录
  const handleThirdPartyLogin = (type: 'wechat' | 'qq') => {
    if (type === 'wechat') {
      // 微信登录逻辑
      message.info('微信登录功能开发中...');
    } else {
      // QQ登录逻辑
      message.info('QQ登录功能开发中...');
    }
  };

  // 切换快捷登录类型
  const switchQuickLoginType = (type: QuickLoginType | null) => {
    setQuickLoginType(type);
    setIsCodeSent(false);
    setCountdown(0);
  };

  const onFinishFailed: FormProps<any>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white rounded-xl shadow-[0_4px_8px_-4px_rgba(0,0,0,.13),0_6px_16px_0_rgba(0,0,0,.08),0_12px_24px_16px_rgba(0,0,0,.04)] p-10 w-full max-w-sm">
        <img className="w-20  mx-auto  rounded-full" src={logoImg} alt="" />
        <div className="pt-1 h-6">{quickLoginType === 'password' && <div className="text-red-300 text-xs text-center">若首次使用 请选邮箱/手机，进入后再设密码即可</div>}</div>
        <div className="space-y-6">
          {/* 统一登录表单 */}
          <Form name="unified-login" layout="vertical" onFinish={onLogin} onFinishFailed={onFinishFailed} autoComplete="off" className="space-y-4" initialValues={quickLoginType === 'email' ? { email: '3426612142@qq.com' } : {}}>
            {quickLoginType === 'password' && (
              <>
                <Form.Item<LoginFieldType> name="account" rules={[{ required: true, message: '请输入用户名、邮箱或手机号' }]} className="mb-4">
                  <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="用户名/邮箱/手机号" size="large" className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                </Form.Item>

                <Form.Item<LoginFieldType> name="password" rules={[{ required: true, message: '请输入密码' }]} className="mb-6">
                  <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="请输入密码" size="large" className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                </Form.Item>
              </>
            )}

            {quickLoginType === 'email' && (
              <>
                <Form.Item<LoginFieldType>
                  name="email"
                  rules={[
                    { required: true, message: '请输入邮箱地址' },
                    { type: 'email', message: '请输入有效的邮箱地址' },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="请输入邮箱地址" size="large" />
                </Form.Item>

                <Form.Item<LoginFieldType> name="code" rules={[{ required: true, message: '请输入验证码' }]}>
                  <div className="flex">
                    <Input
                      prefix={<SafetyOutlined />}
                      placeholder="请输入验证码"
                      size="large"
                      className="flex-1 rounded-r-none"
                      addonAfter={
                        <Button onClick={sendCode} disabled={isCodeSent} type="link" className="px-0 h-full border-0 text-blue-500 hover:text-blue-600 font-medium" style={{ width: '100px' }}>
                          {isCodeSent ? `${countdown}s` : '发送验证码'}
                        </Button>
                      }
                    />
                  </div>
                </Form.Item>
              </>
            )}

            {quickLoginType === 'sms' && (
              <>
                <Form.Item<LoginFieldType>
                  name="phone"
                  rules={[
                    { required: true, message: '请输入手机号' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
                  ]}
                >
                  <Input prefix={<MobileOutlined />} placeholder="请输入手机号" size="large" />
                </Form.Item>

                <Form.Item<LoginFieldType> name="code" rules={[{ required: true, message: '请输入验证码' }]}>
                  <div className="flex">
                    <Input
                      prefix={<SafetyOutlined />}
                      placeholder="请输入验证码"
                      size="large"
                      className="flex-1 rounded-r-none"
                      addonAfter={
                        <Button onClick={sendCode} disabled={isCodeSent} type="link" className="px-0 h-full border-0 text-blue-500 hover:text-blue-600 font-medium" style={{ width: '100px' }}>
                          {isCodeSent ? `${countdown}s` : '发送验证码'}
                        </Button>
                      }
                    />
                  </div>
                </Form.Item>
              </>
            )}

            <Form.Item className="mb-0">
              <Button type="primary" htmlType="submit" size="large" className="w-full h-12 bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 rounded-lg font-medium">
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>

        {/* 登录方式选项 */}
        <div className="mt-5">
          <div className="flex items-center justify-center mb-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-3 text-sm text-gray-500">登录方式</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="flex justify-center gap-4 flex-wrap">
            <div onClick={() => switchQuickLoginType('password')} className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${quickLoginType === 'password' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <UserOutlined className="text-lg" />
            </div>
            <div onClick={() => switchQuickLoginType('email')} className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${quickLoginType === 'email' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <MailOutlined className="text-lg" />
            </div>
            <div onClick={() => switchQuickLoginType('sms')} className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${quickLoginType === 'sms' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <MobileOutlined className="text-lg" />
            </div>
            <div onClick={() => handleThirdPartyLogin('wechat')} className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all bg-gray-100 text-green-500 hover:bg-green-50">
              <WechatOutlined className="text-lg" />
            </div>
            <div onClick={() => handleThirdPartyLogin('qq')} className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all bg-gray-100 text-blue-400 hover:bg-blue-50">
              <QqOutlined className="text-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};