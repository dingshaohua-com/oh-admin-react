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
