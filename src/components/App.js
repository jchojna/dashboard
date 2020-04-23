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
        lastPeriodEndDate: "",
        lastPeriodStartDate: "",
        prevPeriodEndDate: "",
        prevPeriodStartDate: "",
      },
    };
  }

  handleStats = () => {
    const {
      data,
      stats: {range},
    } = this.state;

    const {
      statsNames,
      getTotalInTimeRange,
      getBreakpointDates,
      getDateFormatted,
    } = dataHandlers;

    const breakpointDates = getBreakpointDates(range);
    const [
      lastPeriodEndDate,
      lastPeriodStartDate,
      prevPeriodEndDate,
      prevPeriodStartDate
    ] = breakpointDates;
    



    statsNames.forEach((stat) => {
      const {id} = stat;
      const statsOutput = getTotalInTimeRange(data, id, breakpointDates);
      const [lastPeriodTotal, percentage] = statsOutput;

      this.setState({
        [id]: {
          value: `${id === "profit" ? "$ " : ""}${lastPeriodTotal}`,
          percentage,
        },
      });
    });

    const stats = {
      ...this.state.stats,
      lastPeriodEndDate,
      lastPeriodStartDate,
      prevPeriodEndDate,
      prevPeriodStartDate
    };
    this.setState({stats});
  };

  componentDidMount = () => {
    this.handleStats();
  };

  render() {
    const {
      lastPeriodEndDate,
      lastPeriodStartDate,
      prevPeriodEndDate,
      prevPeriodStartDate
    } = this.state.stats;

    return (
      <main className="App">
        <h1 className="App__heading">Enterprise Shiny Dashboards</h1>
        <section className="App__section App__section--stats">
          {/* LATEST STATS HEADER */}
          <header className="App__header App__header--stats">
            <h2 className="App__heading">Latest Stats</h2>
            <p className="App__range">
              {`${lastPeriodStartDate} - ${lastPeriodEndDate} vs.
              ${prevPeriodStartDate} - ${prevPeriodEndDate}`}
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
