import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';

type Tokens ={
  access_token: string,
  refresh_token: string
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private jwtSvc: JwtService){}

   async create(createUserDto: CreateUserDto){
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.contraseña, 10);
      const createdUser = new this.userModel({
        ... createUserDto,
        contraseña : hashedPassword
      });
      const user = await createdUser.save()
      const {access_token,refresh_token} = await this.generateTokens(user);
      return{
        access_token,
        refresh_token,
        user: this.removePassword(user),
        status:HttpStatus.CREATED,
        message:'User create Successfully'
      } 
      
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  async loginUser(correo: string, contraseña:string) {
    try {
      const user = await this.userModel.findOne({correo});
      if(!user){
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);

      if(!isPasswordValid){
        throw new HttpException('Contraseña incorrecta', HttpStatus.UNAUTHORIZED);

      }
      if(user && isPasswordValid){
        const payload = {sub: user._id, correo: user.correo, nombre: user.nombre}
        const {access_token,refresh_token} = await this.generateTokens(payload);
        return {
          access_token,
          refresh_token,
          user: this.removePassword(user),
          message:'Usuario autenticado exitosamente'
        };
      }
    } catch (error) {
      throw new HttpException('Revisa tus credenciales', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async refreshToken(refreshToken:string){
    try {
      const user = this.jwtSvc.verify(refreshToken,{ secret:'jwt_secret_refresh' });
      const payload = {sub: user._id, correo: user.correo, nombre: user.nombre};
      const {access_token,refresh_token} = await this.generateTokens(payload);
      return{
        access_token,
        refresh_token,
        status:200,
        message:'Refresh Token Successfully'
      } 
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new HttpException('Refresh token expirado', HttpStatus.UNAUTHORIZED);
      }
      if (error.name === 'JsonWebTokenError') {
        throw new HttpException('Refresh token inválido', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Error al refrescar el token', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async generateTokens(user):Promise<Tokens>{
    const jwtPayload = {sub: user._id, correo: user.correo, nombre: user.nombre}
    const [accessToken,refreshToken] = await Promise.all([
      this.jwtSvc.signAsync(jwtPayload,{
        secret:'jwt_secret',
        expiresIn:'1d'
      }),
      this.jwtSvc.signAsync(jwtPayload,{
        secret:'jwt_secret_refresh',
        expiresIn:'7d'
      })
    ])
    return {
      access_token: accessToken,
      refresh_token: refreshToken
    }
  }
  private removePassword(user){
    const {contraseña, ... rest} = user.toObject();
    return rest

  }
  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
