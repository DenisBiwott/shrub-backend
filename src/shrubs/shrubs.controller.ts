import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ShrubsService } from './shrubs.service';
import { CreateShrubDto } from '../dto/create-shrub.dto';
import { VoteShrubDto } from '../dto/vote-shrub.dto';
import { Shrub } from '../schemas/shrub.schema';

@Controller('shrubs')
export class ShrubsController {
  constructor(private readonly shrubsService: ShrubsService) {}

  @Post()
  async create(
    @Body(ValidationPipe) createShrubDto: CreateShrubDto,
  ): Promise<Shrub> {
    return this.shrubsService.create(createShrubDto);
  }

  @Get()
  async findAll(): Promise<Shrub[]> {
    return this.shrubsService.findAll();
  }

  @Get('leaderboard')
  async getTopShrubs(@Query('limit') limit?: number): Promise<Shrub[]> {
    return this.shrubsService.getTopShrubs(
      limit ? parseInt(limit.toString()) : 10,
    );
  }

  @Get('player/:shrubber')
  async findByPlayer(@Param('shrubber') shrubber: string): Promise<Shrub[]> {
    return this.shrubsService.findByPlayer(shrubber);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Shrub> {
    return this.shrubsService.findOne(id);
  }

  @Post('vote')
  async vote(
    @Body(ValidationPipe) voteShrubDto: VoteShrubDto,
  ): Promise<{ success: boolean }> {
    return this.shrubsService.vote(voteShrubDto);
  }

  @Delete('vote')
  async removeVote(
    @Body(ValidationPipe) voteShrubDto: VoteShrubDto,
  ): Promise<{ success: boolean }> {
    return this.shrubsService.removeVote(voteShrubDto);
  }
}
