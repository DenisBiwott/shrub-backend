import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type ShrubDocument = Shrub & Document;

@Schema({ timestamps: true })
export class Shrub {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Player', required: true })
  shrubber: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Player', required: true })
  createdBy: Types.ObjectId;

  @Prop({ required: true })
  originalWord: string;

  @Prop({ required: true })
  shrub: string;

  @Prop()
  description?: string;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Vote', default: [] })
  votes: Types.ObjectId[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ShrubSchema = SchemaFactory.createForClass(Shrub);
ShrubSchema.index({ shrubber: 1 });
