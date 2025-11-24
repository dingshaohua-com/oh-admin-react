import { MailerModule } from '@nestjs-modules/mailer';

export function getMailerModule() {
  return MailerModule.forRoot({
    transport: {
      host: 'smtp.qq.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: '960423114@qq.com',
        pass: 'jmjunnhegjsibahi',
      },
    },
    defaults: {
      from: '"oh admin⚙️" <960423114@qq.com>',
    },
    // 这里不需要配置 template.adapter，因为我们传的是编译好的 HTML
  });
}

export const templates = {
  login({ to, code }: { to: string | string[]; code: string }) {
    return {
      to, // "bar@example.com, baz@example.com"
      subject: '登录验证码',
      text: '验证码', // plain‑text body
      html: `您的验证码为：<b>${code}</b>`, // HTML body
    };
  },
};
