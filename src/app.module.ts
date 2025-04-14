import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://Admin:%40admin%40@practicaslaborales.ka5xbj5.mongodb.net/gestor?retryWrites=true&w=majority&appName=practicasLaborales'),UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
