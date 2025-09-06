import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsMongoId,
  IsNumber,
} from 'class-validator';

export class CreateShrubDto {
  @IsMongoId()
  shrubber: string;

  @IsMongoId()
  createdBy: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  originalWord: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  shrub: string;

  @IsNumber()
  points?: number = 1;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
