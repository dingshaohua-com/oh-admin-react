import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { apiReference } from '@scalar/nestjs-api-reference';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 集成openApi(swagger)
  const config = new DocumentBuilder()
    .setTitle('oh admin')
    .setDescription('一个非常优秀的中后台')
    .setVersion('1.0')
    .addTag('Auth', '认证')
    .addTag('User', '用户')
    .addTag('Verification', '验证码')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // 集成api-scalar
  app.use(
    '/reference',
    apiReference({
      // cdn: 'https://github.com/dingshaohua-com/scalar-i18n/releases/download/v1.38.1/scalar-api-reference.js',
      content: documentFactory,
    }),
  );

  app.useGlobalPipes(new ValidationPipe());
  
  // 全局响应拦截器，统一包装响应格式
  app.useGlobalInterceptors(new ResponseInterceptor());
  
  // 全局异常过滤器，统一错误响应格式
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
