import React from "react";
import TextPanel from "./TextPanel";
import VisualPanel from "./VisualPanel";
import "../scss/App.scss";

function App() {
  return (
    <main className="App">
      <h1 className="App__heading">Enterprise Shiny Dashboards</h1>
      <section className="App__section App__section--latest">
        <h1 className="App__heading">Latest Stats</h1>
        <TextPanel
          key="profit"
          id="profit"
          heading="Total profit"
          value="2674862"
          percentage="4,5"
        />
        <TextPanel
          key="users"
          id="users"
          heading="Active users"
          value="657"
          percentage="8,5"
        />
        <TextPanel
          key="orders"
          id="orders"
          heading="New orders"
          value="245"
          percentage="3,9"
        />
        <TextPanel
          key="complaints"
          id="complaints"
          heading="Open complaints"
          value="12"
          percentage="-5,3"
        />
      </section>
      <section className="App__section App__section--analysis">
        <h1 className="App__heading">Analysis</h1>
        <VisualPanel id="production" heading="Production" />
        <VisualPanel id="sales" heading="Sales Revenue By Country" />
        <VisualPanel id="summary" heading="Summary" />
      </section>
    </main>
  );
}

export default App;
