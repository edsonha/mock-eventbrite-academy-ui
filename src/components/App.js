import React from "react";
import Header from "./Header";
import "../styles/App.css";
import UpcomingEvents from "./UpcomingEvents";
import mockEvents from "../__tests__/mockEvents.mockdata";

function App() {
  return (
    <div className="App">
      <Header />
      <UpcomingEvents upcomingEvents={mockEvents} />
    </div>
  );
}

export default App;
