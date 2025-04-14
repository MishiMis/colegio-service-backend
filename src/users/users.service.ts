import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

   async create(createUserDto: CreateUserDto):  Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.contraseña, 10);
      const createdUser = new this.userModel({
        ... createUserDto,
        contraseña : hashedPassword
      });
      return await createdUser.save();
      
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
        const {correo, nombre } = user
        return {correo, nombre, message: 'Usuario logueado correctamente'};
      }
      

    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);

      
    }
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
