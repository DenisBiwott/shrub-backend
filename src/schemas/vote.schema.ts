import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type VoteDocument = Vote & Document;

@Schema({ timestamps: true })
export class Vote {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Shrub' })
  shrub: Types.ObjectId;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Player' })
  voter: Types.ObjectId;

  @Prop({ default: 1 })
  points: number;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);

// Ensure one vote per user per shrub
VoteSchema.index({ shrub: 1, voter: 1 }, { unique: true });
