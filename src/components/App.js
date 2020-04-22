import React, {Component} from "react";
import TextPanel from "./TextPanel";
import VisualPanel from "./VisualPanel";
import Dropdown from "./Dropdown";
import Button from "./Button";
import {countriesList, getData} from "../lib/data";
import "../scss/App.scss";

class App extends Component {

  componentDidMount = () => {
    getData(countriesList);
  }

  render() {
    return (
      <main className="App">
        <h1 className="App__heading">Enterprise Shiny Dashboards</h1>
        <section className="App__section App__section--stats">
          <header className="App__header App__header--stats">
            <h2 className="App__heading">Latest Stats</h2>
            <p className="App__range">X to Y vs. A to B</p>
            <Dropdown id="stats" label="" />
          </header>
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
        <section className="App__section App__section--analytics">
          <header className="App__header App__header--analytics">
            <h2 className="App__heading">Analytics</h2>
            <p className="App__range">Some info</p>
            <Dropdown id="latestStats" label="" />
            <Dropdown id="latestStats" label="" />
          </header>
          <VisualPanel id="production" heading="Production" />
          <VisualPanel id="sales" heading="Sales Revenue By Country" />
          <VisualPanel id="summary" heading="Summary" />
          <footer className="App__footer">
            <p className="App__info">Some info</p>
            <Button id="export" />
            <Button id="print" />
          </footer>
        </section>
      </main>
    );
  }
}

export default App;
