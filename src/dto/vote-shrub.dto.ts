import { IsMongoId, IsNumber } from 'class-validator';

export class VoteShrubDto {
  @IsMongoId()
  shrub: string;

  @IsMongoId()
  voter: string;

  @IsNumber()
  points: number;
}
