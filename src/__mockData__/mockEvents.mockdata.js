import moment from "moment";

const mockEvents = [
  {
    title: "What is your Plan B?",
    description: "Lorum Ipsum.",
    speaker: "Michele Ferrario",
    time: moment("07-15-2019 19:00 PM", "MM-DD-YYYY hh:mm A"),
    duration: 60,
    location: "Wework Robinson Rd"
  },
  {
    title: "Investing in ETFs",
    description: "Lorum Ipsum Blah Blah.",
    speaker: "Freddie",
    time: moment("07-17-2019 20:00 PM", "MM-DD-YYYY hh:mm A"),
    duration: 90,
    location: "Wework Beach Rd"
  }
];

export default mockEvents;
