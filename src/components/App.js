import React, {Component} from "react";
import {countriesList, getData} from "../lib/dataGenerator";
import * as dataHandlers from "../lib/dataHandlers";
import * as dataHelpers from "../lib/dataHelpers";
import TextPanel from "./TextPanel";
import VisualPanel from "./VisualPanel";
import Dropdown from "./Dropdown";
import Button from "./Button";
import Map from "./Map";
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
        period: "month",
        lastPeriodEndDate: "",
        lastPeriodStartDate: "",
        prevPeriodEndDate: "",
        prevPeriodStartDate: "",
      },
      years: null
    };
  }

  componentDidMount = () => {
    const {data, stats: {period}} = this.state;
    this.handleStats(period);
    this.setState({years: dataHandlers.getYears(data)})
  };

  handleStats = (period) => {
    const {data} = this.state;
    const {getTotalInTimeRange, getBreakpointDates} = dataHandlers;
    const {statsNames} = dataHelpers;

    const breakpointDates = getBreakpointDates(period);
    const [
      lastPeriodEndDate,
      lastPeriodStartDate,
      prevPeriodEndDate,
      prevPeriodStartDate,
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
      period,
      lastPeriodEndDate,
      lastPeriodStartDate,
      prevPeriodEndDate,
      prevPeriodStartDate,
    };
    this.setState({stats});
  };

  handleAnalytics = (period) => {
    console.log(period);
  };

  render() {
    const {years} = this.state;
    const {
      period,
      lastPeriodEndDate,
      lastPeriodStartDate,
      prevPeriodEndDate,
      prevPeriodStartDate,
    } = this.state.stats;
    const {statsNames} = dataHelpers;

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
            <Dropdown
              id="periods"
              period={period}
              onMenuClick={this.handleStats}
            />
          </header>

          {/* LATEST STATS TEXT PANELS */}
          {statsNames.map((stat) => {
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
          {/* ANALYTICS HEADER */}
          <header className="App__header App__header--analytics">
            <h2 className="App__heading">Analytics</h2>
            <p className="App__range">Some info</p>
            <Dropdown
              id="stats"
              period="month"
              onMenuClick={this.handleAnalytics}
            />
            <Dropdown
              id="month"
              period="month"
              onMenuClick={this.handleAnalytics}
            />
            <Dropdown
              id="year"
              period="year"
              years={years}
              onMenuClick={this.handleAnalytics}
            />
          </header>

          {/* ANALYTICS VISUAL PANELS WITH CHARTS */}
          <VisualPanel id="histogram" heading="Temp1" />
          <VisualPanel id="map" heading="Temp2">

            <Map />

          </VisualPanel>
          <VisualPanel id="summary" heading="Summary" />

          {/* ANALYTICS FOOTER */}
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
