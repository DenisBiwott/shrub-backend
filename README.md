# Shrub Leaderboard Backend

A NestJS-powered backend API for the Shrub Leaderboard - a fun voting system where players submit and vote on amusing shrubs (shrubs).

## Description

This backend manages players, shrub submissions, and voting for a leaderboard system. Players can create accounts, submit shrubs (word shrubs), and vote on others' submissions to earn points.

## Features

- **Player Management**: Create and manage player accounts with unique names and optional emails
- **Shrub Submissions**: Players can submit shrubs with original word and description
- **Voting System**: Vote on shrubs to increase their popularity and award points
- **Leaderboard**: Track player points and shrub counts
- **MongoDB Integration**: Persistent data storage with Mongoose ODM

## Tech Stack

- **Framework**: NestJS v11 with TypeScript
- **Database**: MongoDB with Mongoose
- **Validation**: Class-validator and Class-transformer
- **Testing**: Jest (unit, e2e, coverage)
- **Code Quality**: ESLint + Prettier

## Project Setup

### Prerequisites

- Node.js (v18+)
- MongoDB (local or remote connection)

### Installation

```bash
$ npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```bash
MONGODB_URI=mongodb://localhost:27017/shrub-leaderboard
```

### Running the Application

```bash
# development mode
$ npm run start

# watch mode (recommended for development)
$ npm run start:dev

# production mode
$ npm run start:prod
```

The API will be available at `http://localhost:3000` or the port specified in the `.env` file.

## API Endpoints

### Players

- `GET /players` - Get all players with leaderboard rankings
- `POST /players` - Create a new player
- `GET /players/:id` - Get player by ID

### Shrubs

- `GET /shrubs` - Get all shrubs with vote counts
- `POST /shrubs` - Submit a new shrub
- `POST /shrubs/:id/vote` - Vote for a shrub
- `GET /shrubs/:id` - Get shrub by ID

## Data Models

### Player

- `name`: Unique player name (2-30 characters)
- `email`: Optional email address
- `totalPoints`: Points earned from votes
- `totalShrubs`: Number of shrubs submitted

### Shrub

- `shrubber`: Reference to the submitting player
- `originalWord`: The correctly pronounced word
- `shrub`: The amusing shrub
- `description`: Optional context or explanation
- `votes`: Votes cast on the shrub, has the voter's ID and points

## Development

### Running Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Code Quality

```bash
# lint code
$ npm run lint

# format code
$ npm run format
```

### Building for Production

```bash
$ npm run build
```

## License

This project is [UNLICENSED](LICENSE).
