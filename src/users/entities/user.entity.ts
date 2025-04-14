import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = User & Document;

@Schema({ collection: 'usuarios' })
export class User {
    @Prop({ required: true })
    nombre: string;

    @Prop({ required: true })
    apellido: string;

    @Prop({ required: true })
    dni: string;

    @Prop({ required: true })
    direccion: string;

    @Prop({ required: true })
    telefono: string;

    @Prop({ required: true, unique: true })
    correo: string;

    @Prop({ required: true })
    contraseña: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

