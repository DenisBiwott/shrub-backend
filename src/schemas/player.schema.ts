import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type PlayerDocument = Player & Document;

@Schema({ timestamps: true })
export class Player {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Shrub', default: [] })
  shrubs: Types.ObjectId[];

  @Prop()
  email?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
