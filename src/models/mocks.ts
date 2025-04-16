import { Option, OptionType, Participant, Poll } from ".";

const option1: Option<unknown> = {
  id: "opt1",
  type: OptionType.GOOGLE_PLACE,
  name: "Central Park",
  description: "A large public park in NYC",
  uri: "https://maps.google.com/centralpark",
  img: "https://example.com/images/centralpark.jpg",
};

const option2: Option<unknown> = {
  id: "opt2",
  type: OptionType.GOOGLE_PLACE,
  name: "Brooklyn Botanic Garden",
  description: "Botanical garden in Brooklyn",
  uri: "https://maps.google.com/bbg",
  img: "https://example.com/images/bbg.jpg",
};

const option3: Option<unknown> = {
  id: "opt3",
  type: OptionType.GOOGLE_SEARCH_RESULT,
  name: "Prospect Park Zoo",
  description: "Family-friendly zoo with exhibits",
  uri: "https://example.com/zoo",
  img: "https://example.com/images/zoo.jpg",
};

const option4: Option<unknown> = {
  id: "opt4",
  type: OptionType.GOOGLE_PLACE,
  name: "NYC Ferry Ride",
  description: "Scenic ferry ride through NYC",
  uri: "https://example.com/ferry",
  img: "https://example.com/images/ferry.jpg",
};

const option5: Option<unknown> = {
  id: "opt5",
  type: OptionType.GOOGLE_SEARCH_RESULT,
  name: "The High Line",
  description: "Elevated park and greenway",
  uri: "https://example.com/highline",
  img: "https://example.com/images/highline.jpg",
};

const participant1: Participant = {
  id: "p1",
  name: "Alice",
  email: "alice@example.com",
};

const participant2: Participant = {
  id: "p2",
  name: "Bob",
  email: "bob@example.com",
};

const participant3: Participant = {
  id: "p3",
  name: "Charlie",
  email: "charlie@example.com",
};

const participant4: Participant = {
  id: "p4",
  name: "Dana",
  email: "dana@example.com",
};

export const pollWithWinner: Poll = {
  id: "poll1",
  name: "Weekend Activity",
  description: "Vote on where we should go this weekend!",
  owner: {
    name: "Organizer One",
    email: "organizer1@example.com",
  },
  optionsList: [option1, option2, option3, option4, option5],
  optionsMap: {
    opt1: option1,
    opt2: option2,
    opt3: option3,
    opt4: option4,
    opt5: option5,
  },
  participants: [participant1, participant2, participant3, participant4],
  rankings: [
    {
      participantEmail: "alice@example.com",
      pollId: "poll1",
      choices: [
        { optionId: "opt1" },
        { optionId: "opt2" },
        { optionId: "opt3" },
      ],
      matchups: [],
    },
    {
      participantEmail: "bob@example.com",
      pollId: "poll1",
      choices: [
        { optionId: "opt1" },
        { optionId: "opt3" },
        { optionId: "opt4" },
      ],
      matchups: [],
    },
    {
      participantEmail: "charlie@example.com",
      pollId: "poll1",
      choices: [{ optionId: "opt1" }, { optionId: "opt5" }],
      matchups: [],
    },
    {
      participantEmail: "dana@example.com",
      pollId: "poll1",
      choices: [{ optionId: "opt2" }, { optionId: "opt1" }],
      matchups: [],
    },
  ],
};

export const pollWithTie: Poll = {
  id: "poll2",
  name: "Spring Outing",
  description: "Where should we go for our spring trip?",
  owner: {
    name: "Organizer Two",
    email: "organizer2@example.com",
  },
  optionsList: [option1, option2, option3, option4, option5],
  optionsMap: {
    opt1: option1,
    opt2: option2,
    opt3: option3,
    opt4: option4,
    opt5: option5,
  },
  participants: [participant1, participant2, participant3, participant4],
  rankings: [
    {
      participantEmail: "alice@example.com",
      pollId: "poll2",
      choices: [
        { optionId: "opt2" }, // Brooklyn Botanic Garden
        { optionId: "opt3" }, // Prospect Park Zoo
        { optionId: "opt5" },
      ],
      matchups: [],
    },
    {
      participantEmail: "bob@example.com",
      pollId: "poll2",
      choices: [
        { optionId: "opt3" }, // Prospect Park Zoo
        { optionId: "opt2" }, // Brooklyn Botanic Garden
      ],
      matchups: [],
    },
    {
      participantEmail: "charlie@example.com",
      pollId: "poll2",
      choices: [
        { optionId: "opt3" }, // Prospect Park Zoo
      ],
      matchups: [],
    },
    {
      participantEmail: "dana@example.com",
      pollId: "poll2",
      choices: [
        { optionId: "opt2" }, // Brooklyn Botanic Garden
      ],
      matchups: [],
    },
  ],
  // Tie between Brooklyn Botanic Garden (opt2) & Prospect Park Zoo (opt3)
};
