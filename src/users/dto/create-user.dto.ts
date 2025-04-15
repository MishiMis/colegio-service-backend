import {
  IsString,
  MinLength,
  IsEmail,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly apellido: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'El DNI debe tener al menos 8 caracteres' })
  @Matches(/^[0-9]+$/, {
    message: 'El DNI solo puede contener números',
  })
  readonly dni: string;

  @IsString()
  @IsNotEmpty()
  readonly direccion: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9, { message: 'El teléfono debe tener al menos 9 dígitos' })
  readonly telefono: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  readonly correo: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  readonly contraseña: string;
}
