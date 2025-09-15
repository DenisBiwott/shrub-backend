import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
