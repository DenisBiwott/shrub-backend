import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Shrub, ShrubDocument } from '../schemas/shrub.schema';
import { Vote, VoteDocument } from '../schemas/vote.schema';
import { CreateShrubDto } from '../dto/create-shrub.dto';
import { VoteShrubDto } from '../dto/vote-shrub.dto';
import { PlayersService } from '../players/players.service';

@Injectable()
export class ShrubsService {
  constructor(
    @InjectModel(Shrub.name) private shrubModel: Model<ShrubDocument>,
    @InjectModel(Vote.name) private voteModel: Model<VoteDocument>,
    private playersService: PlayersService,
  ) {}

  async create(createShrubDto: CreateShrubDto): Promise<Shrub> {
    // Verify player exists
    await this.playersService.findOne(createShrubDto.shrubber);

    const createdShrub = new this.shrubModel(createShrubDto);

    // Create the vote — The creator of the shrub votes for themself
    const vote = new this.voteModel({
      shrub: createdShrub._id,
      voter: createShrubDto.createdBy,
      points: createShrubDto.points,
    });
    const savedVote = await vote.save();
    // When a user submits a shrub, they have to vote for it
    createdShrub.votes.push(savedVote._id as Types.ObjectId);

    // Add shrub to player's shrub list
    this.playersService.addShrubToPlayer(
      createShrubDto.shrubber,
      createdShrub._id as string,
    );

    const savedShrub = await createdShrub.save();
    return savedShrub.populate('votes');
  }

  async findAll(): Promise<Shrub[]> {
    return this.shrubModel
      .find()
      .populate('shrubber', 'name')
      .sort({ votes: -1, createdAt: -1 })
      .exec();
  }

  async findByPlayer(shrubber: string): Promise<Shrub[]> {
    return this.shrubModel.find({ shrubber }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Shrub> {
    const shrub = await this.shrubModel
      .findById(id)
      .populate('shrubber', 'name')
      .exec();

    if (!shrub) {
      throw new NotFoundException(`Shrub with ID ${id} not found`);
    }
    return shrub;
  }

  async vote(voteShrubDto: VoteShrubDto): Promise<{ success: boolean }> {
    const { shrub, voter, points } = voteShrubDto;

    // Check if voter exists
    await this.playersService.findOne(voter);

    try {
      // Create vote record (will fail if duplicate due to unique index)
      const vote = new this.voteModel({ shrub, voter, points });
      await vote.save();

      // Increment vote count on shrub
      const updatedShrub = await this.shrubModel
        .findByIdAndUpdate(
          shrub,
          {
            $addToSet: { vote },
          },
          { new: true },
        )
        .exec();

      if (!updatedShrub) {
        throw new NotFoundException(`Shrub with ID ${shrub} not found`);
      }

      return { success: true };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('You have already voted for this shrub');
      }
      throw error;
    }
  }

  async removeVote(voteShrubDto: VoteShrubDto): Promise<{ success: boolean }> {
    const { shrub, voter } = voteShrubDto;

    // Check if vote exists
    const vote = await this.voteModel.findOne({ shrub, voter }).exec();
    if (!vote) {
      throw new NotFoundException('Vote not found');
    }

    // Remove vote record
    await this.voteModel.deleteOne({ shrub, voter }).exec();
    return { success: true };
  }

  async getTopShrubs(limit: number = 50): Promise<Shrub[]> {
    return await this.shrubModel
      .aggregate([
        // Lookup votes for each shrub
        {
          $lookup: {
            from: 'votes',
            localField: '_id',
            foreignField: 'shrub',
            as: 'votes',
          },
        },

        // Compute totals
        {
          $addFields: {
            totalPoints: { $sum: '$votes.points' },
            voterCount: { $size: { $setUnion: '$votes.voter' } }, // unique voters
          },
        },
        // Lookup shrub owner (player)
        {
          $lookup: {
            from: 'players',
            localField: 'shrubber',
            foreignField: '_id',
            as: 'player',
          },
        },
        { $unwind: '$player' },

        // Sort by points
        { $sort: { totalPoints: -1 } },

        // Limit (optional)
        { $limit: 100 },

        // Final projection
        {
          $project: {
            _id: 1,
            shrub: 1, // or whatever fields your Shrub has
            originalWord: 1,
            description: 1,
            shrubber: '$player.name',
            totalPoints: 1,
            voterCount: 1,
            createdAt: 1,
          },
        },
      ])
      .exec();
  }
}
