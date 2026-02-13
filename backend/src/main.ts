import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/strategies/jwt.Guard';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173', //frondend React Vite URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalGuards(new JwtAuthGuard());

  app.useStaticAssets('uploads', { prefix: '/uploads/' });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();