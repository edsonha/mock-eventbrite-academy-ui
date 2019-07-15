import moment from "moment";

const mockEvents = [
  {
    title: "What is your Plan B?",
    description: "Lorum Ipsum.",
    speaker: "Michele Ferrario",
    time: moment.utc("2019-08-15T19:00"),
    duration: 120,
    location: "WeWork Robinson Rd"
  },
  {
    title: "Investing in ETFs",
    description: "Lorum Ipsum Blah Blah.",
    speaker: "Freddie",
    time: moment.utc("2019-08-17T18:00"),
    duration: 90,
    location: "WeWork Beach Rd"
  }
];

export default mockEvents;
