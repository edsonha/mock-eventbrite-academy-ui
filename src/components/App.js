import React from "react";
import Header from "./Header";
import "../styles/App.css";
import UpcomingEvents from "./UpcomingEvents";
// import mockEvents from "../__mockData__/mockEvents.mockdata";
import mockEventsWithSeats from "../__mockData__/mockEventsWithSeats.mockdata";

function App() {
  return (
    <div className="App">
      <Header />
      {/* <UpcomingEvents upcomingEvents={mockEvents} /> */}
      <UpcomingEvents upcomingEvents={mockEventsWithSeats} />
    </div>
  );
}

export default App;
