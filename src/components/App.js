import React, {Component} from "react";
import {countriesList, getData} from "../lib/generateData";
import {stats, getTotalInTimeRange} from "../lib/aquireData";
import TextPanel from "./TextPanel";
import VisualPanel from "./VisualPanel";
import Dropdown from "./Dropdown";
import Button from "./Button";
import "../scss/App.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: getData(countriesList),
      profit: 0,
      users: 0,
      orders: 0,
      complaints: 0,
    };
  }

  componentDidMount = () => {
    const {data} = this.state;

    stats.forEach((stat) => {
      const {id} = stat;
      this.setState({
        [id]: getTotalInTimeRange(data, id),
      });
    });
  };

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
          {stats.map((stat) => {
            const {id, heading} = stat;
            const value = `${id === "profit" ? "$ " : ""}${this.state[id]}`;
            return (
              <TextPanel
                key={id}
                id={id}
                heading={heading}
                value={value}
                percentage="4,5"
              />
            );
          })}
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
