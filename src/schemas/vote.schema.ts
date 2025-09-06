import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VoteDocument = Vote & Document;

@Schema({ timestamps: true })
export class Vote {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Shrub' })
  shrubId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Player' })
  voterId: Types.ObjectId;

  @Prop({ default: 1 })
  points: number;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);

// Ensure one vote per user per shrub
VoteSchema.index({ shrubId: 1, voterId: 1 }, { unique: true });
