import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShrubsController } from './shrubs.controller';
import { ShrubsService } from './shrubs.service';
import { Shrub, ShrubSchema } from '../schemas/shrub.schema';
import { Vote, VoteSchema } from '../schemas/vote.schema';
import { PlayersModule } from '../players/players.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shrub.name, schema: ShrubSchema },
      { name: Vote.name, schema: VoteSchema }
    ]),
    PlayersModule,
  ],
  controllers: [ShrubsController],
  providers: [ShrubsService],
  exports: [ShrubsService],
})
export class ShrubsModule {}