import React from "react";
import Header from "./Header";
import "../styles/App.css";
import UpcomingEvents from "./UpcomingEvents";

function App() {
  return (
    <div className="App">
      <Header />
      <UpcomingEvents />
    </div>
  );
}

export default App;
