import { IsMongoId, IsNumber } from 'class-validator';

export class VoteShrubDto {
  @IsMongoId()
  shrubId: string;

  @IsMongoId()
  voterId: string;

  @IsNumber()
  points: number;
}
