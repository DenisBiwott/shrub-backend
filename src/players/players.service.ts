import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from '../schemas/player.schema';
import { CreatePlayerDto } from '../dto/create-player.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
  ) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    try {
      const createdPlayer = new this.playerModel(createPlayerDto);
      return await createdPlayer.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Player name already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<Player[]> {
    return this.playerModel.find().sort({ totalPoints: -1 }).exec();
  }

  async findOne(id: string): Promise<Player> {
    const player = await this.playerModel.findById(id).exec();
    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }
    return player;
  }

  async findByName(name: string): Promise<Player> {
    const player = await this.playerModel.findOne({ name }).exec();
    if (!player) {
      throw new NotFoundException(`Player with name ${name} not found`);
    }
    return player;
  }

  async addShrubToPlayer(shrubber: string, shrub: string) {
    await this.playerModel
      .findByIdAndUpdate(
        shrubber,
        { $addToSet: { shrubs: shrub } },
        {
          new: true,
        },
      )
      .exec();
  }

  async getLeaderboard(): Promise<Player[]> {
    return this.playerModel.aggregate([
      // Lookup shrubs for each player
      {
        $lookup: {
          from: 'shrubs',
          localField: '_id',
          foreignField: 'shrubber',
          as: 'shrubs',
        },
      },

      // Lookup votes for those shrubs
      {
        $lookup: {
          from: 'votes',
          localField: 'shrubs._id',
          foreignField: 'shrub',
          as: 'votes',
        },
      },

      // Compute totals
      {
        $addFields: {
          shrubCount: { $size: '$shrubs' },
          totalPoints: { $sum: '$votes.points' },
          voterCount: { $size: { $setUnion: '$votes.voter' } }, // unique voters
        },
      },

      // Sort by totalPoints descending
      { $sort: { totalPoints: -1 } },

      // Limit to top 100
      { $limit: 100 },

      // Return only what you want
      {
        $project: {
          _id: 1,
          name: 1,
          shrubCount: 1,
          totalPoints: 1,
          voterCount: 1,
        },
      },
    ]);
  }
}
