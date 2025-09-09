import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class RegistroDocument extends Document {
  @Prop({ required: true })
  admissionDate: string;

  @Prop({ required: true, min: 1, max: 100000 })
  salary: number;

  @Prop({ required: true })
  calculatedSalary: number;

  @Prop({ required: true, maxlength: 30 })
  employee: string;

  @Prop()
  calculatedAdmissionDate?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const RegistroSchema = SchemaFactory.createForClass(RegistroDocument);
