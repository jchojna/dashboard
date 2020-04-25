import React, {Component} from "react";
import {countriesList, getData} from "../lib/dataGenerator";
import * as dataHandlers from "../lib/dataHandlers";
import * as dataHelpers from "../lib/dataHelpers";
import TextPanel from "./TextPanel";
import VisualPanel from "./VisualPanel";
import Dropdown from "./Dropdown";
import Button from "./Button";
import Histogram from "./Histogram";
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
      analytics: {
        field: "profit",
        month: "0",
        year: new Date().getFullYear(),
        mapData: {},
        histData: [],
        summaryData: [],
      },
      yearsArray: [],
    };
  }

  componentDidMount = () => {
    const {
      data,
      stats: {period},
      analytics,
      analytics: {field, month, year},
    } = this.state;
    const {getAnalyticsData, getSummaryData} = dataHandlers;
    const [mapData, histData] = getAnalyticsData(data, field, month, year);
    const summaryData = getSummaryData(data, month, year);

    this.handleStats(period);
    this.setState({
      yearsArray: dataHandlers.getYears(data),
      analytics: {
        ...analytics,
        mapData,
        histData,
        summaryData,
      },
    });
  };

  handleStats = (period) => {
    const {data} = this.state;
    const {getTotalInTimeRange, getBreakpointDates} = dataHandlers;
    const {statsFields} = dataHelpers;

    const breakpointDates = getBreakpointDates(period);
    const [
      lastPeriodEndDate,
      lastPeriodStartDate,
      prevPeriodEndDate,
      prevPeriodStartDate,
    ] = breakpointDates;

    Object.keys(statsFields).forEach((field) => {
      const statsOutput = getTotalInTimeRange(data, field, breakpointDates);
      const [lastPeriodTotal, percentage] = statsOutput;

      this.setState({
        [field]: {
          value: `${field === "profit" ? "$ " : ""}${lastPeriodTotal}`,
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

  handleAnalytics = (type, id) => {
    const {data, analytics} = this.state;
    let {field, month, year} = this.state.analytics;
    const {getAnalyticsData, getSummaryData} = dataHandlers;

    field = type === "field" ? id : field;
    month = type === "month" ? id : month;
    year = type === "year" ? id : year;
    const [mapData, histData] = getAnalyticsData(data, field, month, year);
    const summaryData =
      type === "month" || type === "year"
        ? getSummaryData(data, month, year)
        : analytics.summaryData;

    this.setState({
      analytics: {
        ...analytics,
        [type]: id,
        mapData,
        histData,
        summaryData,
      },
    });
  };

  render() {
    const {
      stats: {
        period,
        lastPeriodEndDate,
        lastPeriodStartDate,
        prevPeriodEndDate,
        prevPeriodStartDate,
      },
      analytics: {field, month, year, mapData, histData, summaryData},
      yearsArray,
    } = this.state;

    const {statsFields, statsPeriods, months} = dataHelpers;

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
              currentId={period}
              type="period"
              menuList={statsPeriods}
              onMenuClick={this.handleStats}
            />
          </header>

          {/* LATEST STATS TEXT PANELS */}
          {Object.entries(statsFields).map(([field, heading]) => {
            const {value, percentage} = this.state[field];

            return (
              <TextPanel
                key={field}
                id={field}
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
              currentId={field}
              type="field"
              menuList={statsFields}
              onMenuClick={this.handleAnalytics}
            />
            <Dropdown
              currentId={month}
              type="month"
              menuList={months}
              onMenuClick={this.handleAnalytics}
            />
            <Dropdown
              currentId={year}
              type="year"
              menuList={yearsArray}
              onMenuClick={this.handleAnalytics}
            />
          </header>

          {/* HISTOGRAM */}
          <VisualPanel id="histogram" heading="Histogram">
            <Histogram data={histData} keys={[field]} layout="vertical" />
          </VisualPanel>

          {/* MAP */}
          <VisualPanel id="map" heading="Map">
            <Map data={mapData} />
          </VisualPanel>

          {/* SUMMARY */}
          <VisualPanel id="summary" heading="Summary">
            <Histogram
              data={summaryData}
              keys={["all before", "current period"]}
              layout="horizontal"
            />
          </VisualPanel>

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
