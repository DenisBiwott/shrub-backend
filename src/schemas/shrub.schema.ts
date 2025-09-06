import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ShrubDocument = Shrub & Document;

@Schema({ timestamps: true })
export class Shrub {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Player' })
  shrubber: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Player' })
  createdBy: Types.ObjectId;

  @Prop({ required: true })
  originalWord: string;

  @Prop({ required: true })
  shrub: string;

  @Prop()
  description?: string;

  @Prop({ type: [Types.ObjectId], ref: 'Vote', default: [] })
  votes: Types.ObjectId[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ShrubSchema = SchemaFactory.createForClass(Shrub);
