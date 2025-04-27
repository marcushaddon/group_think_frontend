import { Candidate, OptionType, Voter, Election, MatchupAward } from ".";

const option1: Candidate<unknown> = {
  id: "opt1",
  type: OptionType.GOOGLE_PLACE,
  name: "Central Park",
  description: "A large public park in NYC",
  uri: "https://maps.google.com/centralpark",
  img: "https://example.com/images/centralpark.jpg",
};

const option2: Candidate<unknown> = {
  id: "opt2",
  type: OptionType.GOOGLE_PLACE,
  name: "Brooklyn Botanic Garden",
  description: "Botanical garden in Brooklyn",
  uri: "https://maps.google.com/bbg",
  img: "https://example.com/images/bbg.jpg",
};

const option3: Candidate<unknown> = {
  id: "opt3",
  type: OptionType.GOOGLE_SEARCH_RESULT,
  name: "Prospect Park Zoo",
  description: "Family-friendly zoo with exhibits",
  uri: "https://example.com/zoo",
  img: "https://example.com/images/zoo.jpg",
};

const option4: Candidate<unknown> = {
  id: "opt4",
  type: OptionType.GOOGLE_PLACE,
  name: "NYC Ferry Ride",
  description: "Scenic ferry ride through NYC",
  uri: "https://example.com/ferry",
  img: "https://example.com/images/ferry.jpg",
};

const option5: Candidate<unknown> = {
  id: "opt5",
  type: OptionType.GOOGLE_SEARCH_RESULT,
  name: "The High Line",
  description: "Elevated park and greenway",
  uri: "https://example.com/highline",
  img: "https://example.com/images/highline.jpg",
};

const participant1: Voter = {
  id: "p1",
  name: "Alice",
  email: "alice@example.com",
};
const participant2: Voter = {
  id: "p2",
  name: "Bob",
  email: "bob@example.com",
};
const participant3: Voter = {
  id: "p3",
  name: "Charlie",
  email: "charlie@example.com",
};
const participant4: Voter = {
  id: "p4",
  name: "Dana",
  email: "dana@example.com",
};

export const pollWithWinner: Election = {
  id: "poll1",
  name: "Weekend Activity",
  description: "Vote on where we should go this weekend!",
  owner: { name: "Organizer One", email: "organizer1@example.com" },
  candidateList: [option1, option2, option3, option4, option5],
  candidateMap: {
    opt1: option1,
    opt2: option2,
    opt3: option3,
    opt4: option4,
    opt5: option5,
  },
  voters: [participant1, participant2, participant3, participant4],
  rankings: [
    {
      voterEmail: "alice@example.com",
      pollId: "poll1",
      choices: [
        { candidateId: "opt1" },
        { candidateId: "opt2" },
        { candidateId: "opt3" },
        { candidateId: "opt4" },
        { candidateId: "opt5" },
      ],
      matchups: [],
    },
    {
      voterEmail: "bob@example.com",
      pollId: "poll1",
      choices: [
        { candidateId: "opt1" },
        { candidateId: "opt3" },
        { candidateId: "opt4" },
        { candidateId: "opt2" },
        { candidateId: "opt5" },
      ],
      matchups: [],
    },
    {
      voterEmail: "charlie@example.com",
      pollId: "poll1",
      choices: [
        { candidateId: "opt1" },
        { candidateId: "opt5" },
        { candidateId: "opt4" },
        { candidateId: "opt3" },
        { candidateId: "opt2" },
      ],
      matchups: [],
    },
    {
      voterEmail: "dana@example.com",
      pollId: "poll1",
      choices: [
        { candidateId: "opt2" },
        { candidateId: "opt1" },
        { candidateId: "opt3" },
        { candidateId: "opt4" },
        { candidateId: "opt5" },
      ],
      matchups: [],
    },
  ],
};

export const pollWithTie: Election = {
  id: "poll2",
  name: "Spring Outing",
  description: "Where should we go for our spring trip?",
  owner: { name: "Organizer Two", email: "organizer2@example.com" },
  candidateList: [option1, option2, option3, option4, option5],
  candidateMap: {
    opt1: option1,
    opt2: option2,
    opt3: option3,
    opt4: option4,
    opt5: option5,
  },
  voters: [participant1, participant2, participant3, participant4],
  rankings: [
    {
      voterEmail: "alice@example.com",
      pollId: "poll2",
      choices: [
        { candidateId: "opt2" }, // BBG
        { candidateId: "opt3" }, // Zoo
        { candidateId: "opt5" },
        { candidateId: "opt1" },
        { candidateId: "opt4" },
      ],
      matchups: [],
    },
    {
      voterEmail: "bob@example.com",
      pollId: "poll2",
      choices: [
        { candidateId: "opt3" }, // Zoo
        { candidateId: "opt2" }, // BBG
        { candidateId: "opt4" },
        { candidateId: "opt1" },
        { candidateId: "opt5" },
      ],
      matchups: [
        {
          candidateA: "opt4",
          candidateB: "opt1",
          winnerAward: MatchupAward.POSITIVE_TIE,
        },
      ],
    },
    {
      voterEmail: "charlie@example.com",
      pollId: "poll2",
      choices: [
        { candidateId: "opt3" }, // Zoo
        { candidateId: "opt5" },
        { candidateId: "opt1" },
        { candidateId: "opt2" },
        { candidateId: "opt4" },
      ],
      matchups: [
        {
          candidateA: "opt3",
          candidateB: "opt5",
          winnerAward: MatchupAward.POSITIVE_TIE,
        },
        {
          candidateA: "opt5",
          candidateB: "opt1",
          winnerAward: MatchupAward.POSITIVE_TIE,
        },
        {
          candidateA: "opt5",
          candidateB: "opt1",
          winnerAward: MatchupAward.POSITIVE_TIE,
        },
      ],
    },
    {
      voterEmail: "dana@example.com",
      pollId: "poll2",
      choices: [
        { candidateId: "opt2" }, // BBG
        { candidateId: "opt4" },
        { candidateId: "opt3" },
        { candidateId: "opt5" },
        { candidateId: "opt1" },
      ],
      matchups: [],
    },
  ],
  // Tie between Brooklyn Botanic Garden (opt2) & Prospect Park Zoo (opt3)
};
