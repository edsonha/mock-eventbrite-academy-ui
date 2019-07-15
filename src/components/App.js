import React from "react";
import Header from "./Header";
import "../styles/App.css";
import UpcomingEvents from "./UpcomingEvents";

function App() {
  return (
    <div className="App">
      <Header />
      <UpcomingEvents />
      Stashaway
      <UpcomingEvents upcomingEvents={[]} />
    </div>
  );
}

export default App;
