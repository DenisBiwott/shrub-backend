import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { Player } from '../schemas/player.schema';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async create(
    @Body(ValidationPipe) createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    return this.playersService.create(createPlayerDto);
  }

  @Get()
  async findAll(): Promise<Player[]> {
    return this.playersService.findAll();
  }

  @Get('leaderboard')
  async getLeaderboard(): Promise<Player[]> {
    return this.playersService.getLeaderboard();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Player> {
    return this.playersService.findOne(id);
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string): Promise<Player> {
    return this.playersService.findByName(name);
  }
}
