import React, {Component} from "react";
import {countriesList, getData} from "../lib/dataGenerator";
import * as dataHandlers from "../lib/dataHandlers";
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
      profit: {},
      users: {},
      orders: {},
      complaints: {},
      stats: {
        range: "month",
        lastPeriodStart: "",
        lastPeriodEnd: "today",
        prevPeriodStart: "",
        prevPeriodEnd: "",
      },
    };
  }

  handleStats = () => {
    const {range} = this.state.stats;
    const {getStartingDates, getDateFormatted} = dataHandlers;
    const now = new Date();
    const startingDates = getStartingDates(now, range);
    const [lastPeriodStartDate, prevPeriodStartDate] = startingDates;

    const lastPeriodStart = lastPeriodStartDate
      ? getDateFormatted(lastPeriodStartDate)
      : "";
    const prevPeriodStart = prevPeriodStartDate
      ? getDateFormatted(prevPeriodStartDate)
      : "";

    const stats = {
      ...this.state.stats,
      lastPeriodStart,
      prevPeriodStart,
      prevPeriodEnd: lastPeriodStart,
    };
    this.setState({stats});
  };

  componentDidMount = () => {
    const {
      data,
      stats,
      stats: {range},
    } = this.state;
    const {statsNames, getTotalInTimeRange} = dataHandlers;

    this.handleStats();

    statsNames.forEach((stat) => {
      const {id} = stat;
      const statsOutput = getTotalInTimeRange(data, id, stats);
      const [lastPeriodTotal, percentage] = statsOutput;

      this.setState({
        [id]: {
          value: `${id === "profit" ? "$ " : ""}${lastPeriodTotal}`,
          percentage,
        },
      });
    });
  };

  render() {
    const {
      lastPeriodStart,
      lastPeriodEnd,
      prevPeriodStart,
      prevPeriodEnd,
    } = this.state.stats;

    return (
      <main className="App">
        <h1 className="App__heading">Enterprise Shiny Dashboards</h1>
        <section className="App__section App__section--stats">
          {/* LATEST STATS HEADER */}
          <header className="App__header App__header--stats">
            <h2 className="App__heading">Latest Stats</h2>
            <p className="App__range">
              {`${lastPeriodStart} - ${lastPeriodEnd} vs.
              ${prevPeriodStart} - ${prevPeriodEnd}`}
            </p>
            <Dropdown id="stats" label="" />
          </header>

          {/* LATEST STATS TEXT PANELS */}
          {dataHandlers.statsNames.map((stat) => {
            const {id, heading} = stat;
            const {value, percentage} = this.state[id];
            return (
              <TextPanel
                key={id}
                id={id}
                heading={heading}
                value={value}
                percentage={percentage}
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
