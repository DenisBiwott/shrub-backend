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

  // When a user submits a shrub, they have to vote for it
  async create(createShrubDto: CreateShrubDto): Promise<Shrub> {
    // Verify player exists
    await this.playersService.findOne(createShrubDto.shrubber);

    const createdShrub = new this.shrubModel(createShrubDto);
    // Create the vote — The creator of the shrub votes for themself
    const vote = new this.voteModel({
      shrubId: createdShrub._id,
      voterId: createShrubDto.createdBy,
      points: createShrubDto.points,
    });
    const savedVote = await vote.save();

    createdShrub.votes.push(savedVote._id as Types.ObjectId);
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
    const { shrubId, voterId } = voteShrubDto;

    // Check if voter exists
    await this.playersService.findOne(voterId);

    try {
      // Create vote record (will fail if duplicate due to unique index)
      const vote = new this.voteModel({ shrubId, voterId });
      await vote.save();

      // Increment vote count on shrub
      const updatedShrub = await this.shrubModel
        .findByIdAndUpdate(
          shrubId,
          {
            $addToSet: { vote },
          },
          { new: true },
        )
        .exec();

      if (!updatedShrub) {
        throw new NotFoundException(`Shrub with ID ${shrubId} not found`);
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
    const { shrubId, voterId } = voteShrubDto;

    // Check if vote exists
    const vote = await this.voteModel.findOne({ shrubId, voterId }).exec();
    if (!vote) {
      throw new NotFoundException('Vote not found');
    }

    // Remove vote record
    await this.voteModel.deleteOne({ shrubId, voterId }).exec();
    return { success: true };
  }

  //! Update to check vote.points totals
  async getTopShrubs(limit: number = 10): Promise<Shrub[]> {
    return this.shrubModel
      .find()
      .populate('shrubber', 'name')
      .sort({ votes: -1 })
      .limit(limit)
      .exec();
  }
}
