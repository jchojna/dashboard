import React, {Component} from "react";
import classNames from "classnames";
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
    this.date = new Date();
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
        month: this.date.getMonth() + 1,
        year: this.date.getFullYear(),
        mapData: {},
        histData: [],
        summaryData: [],
      },
      yearsArray: [],
      colors: {},
      maximizedPanel: null,
    };
  }

  componentDidMount = () => {
    const {
      data,
      stats: {period},
      analytics,
      analytics: {field, month, year},
    } = this.state;
    const {getAnalyticsData, getSummaryData, getColorRgb} = dataHandlers;
    const {statsFields} = dataHelpers;
    const [mapData, histData] = getAnalyticsData(data, field, month, year);
    const summaryData = getSummaryData(data, month, year);
    const colors = {};
    Object.keys(statsFields).forEach(
      (field) => (colors[field] = getColorRgb(field))
    );

    this.handleStats(period);
    this.setState({
      yearsArray: dataHandlers.getYears(data),
      analytics: {
        ...analytics,
        mapData,
        histData,
        summaryData,
      },
      colors,
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
    console.log("id", id);
    console.log("type", type);
    const {data, analytics} = this.state;
    let {field, month, year} = this.state.analytics;
    const {getAnalyticsData, getSummaryData, getColorRgb} = dataHandlers;

    field = type === "field" ? id : field;
    month = type === "month" ? id : month;
    year = type === "year" ? id : year;
    const [mapData, histData] = getAnalyticsData(data, field, month, year);
    const summaryData =
      type === "month" || type === "year"
        ? getSummaryData(data, month, year)
        : analytics.summaryData;
    const accentColor =
      type === "field" ? getColorRgb(id) : this.state.accentColor;

    this.setState({
      analytics: {
        ...analytics,
        [type]: id,
        mapData,
        histData,
        summaryData,
      },
      accentColor,
    });
  };

  renderAnalytics = (type) => {
    const {
      analytics: {field, mapData, histData, summaryData},
      colors,
    } = this.state;

    switch (type) {
      case "histogram":
        return (
          <Histogram
            data={histData}
            keys={[field]}
            type="histogram"
            layout="vertical"
            margin={{top: 60, right: 30, bottom: 30, left: 60}}
            colors={colors[field]}
            enableGridY={true}
          />
        );

      case "map":
        return <Map data={mapData} />;

      case "summary":
        return (
          <Histogram
            data={summaryData}
            keys={[
              "profitBefore",
              "profitCurrent",
              "usersBefore",
              "usersCurrent",
              "ordersBefore",
              "ordersCurrent",
              "complaintsBefore",
              "complaintsCurrent",
            ]}
            type="summary"
            layout="horizontal"
            margin={{top: 60, right: 30, bottom: 50, left: 100}}
            colors={[
              "#fff",
              colors.profit,
              "#fff",
              colors.users,
              "#fff",
              colors.orders,
              "#fff",
              colors.complaints,
            ]}
            enableGridX={true}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              tickValues: [20, 40, 60, 80],
            }}
          />
        );

      default:
        return false;
    }
  };

  handleMaximize = (id) => {
    this.setState((prevState) => ({
      maximizedPanel: prevState.maximizedPanel === id ? null : id,
    }));
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
      analytics: {field, month, year},
      yearsArray,
      maximizedPanel,
    } = this.state;

    const {statsFields, statsPeriods, months, analyticsPanels} = dataHelpers;
    const statsDescription = `${lastPeriodStartDate} - ${lastPeriodEndDate} vs.
    ${prevPeriodStartDate} - ${prevPeriodEndDate}`;

    const dropdownsLists = {
      field: [statsFields, field],
      month: [months, month],
      year: [yearsArray, year],
    };

    const analyticsClass = classNames(
      "App__section",
      "App__section--analytics",
      {
        [`App__section--${maximizedPanel}Max`]: maximizedPanel,
      }
    );

    return (
      <main className="App">
        <h1 className="App__heading">dashboard</h1>

        {/* LATEST STATS SECTION */}
        <section className="App__section App__section--stats">
          {/* LATEST STATS HEADER */}
          <header className="App__header App__header--stats">
            <h2 className="App__heading">Latest Stats</h2>
            <p className="App__info">{statsDescription}</p>
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

        {/* ANALYTICS SECTION */}
        <section className={analyticsClass}>
          {/* ANALYTICS HEADER */}
          <header className="App__header App__header--analytics">
            <h2 className="App__heading">Analytics</h2>
            {/* DROPDOWNS */}
            {Object.entries(dropdownsLists).map(([type, [list, id]]) => {
              return (
                <Dropdown
                  key={id}
                  currentId={id}
                  type={type}
                  menuList={list}
                  onMenuClick={this.handleAnalytics}
                />
              );
            })}
          </header>

          {/* ANALYTICS CHARTS */}
          {analyticsPanels.map((panel) => {
            const isMaximized = this.state.maximizedPanel === panel;
            return (
              <VisualPanel
                key={panel}
                id={panel}
                heading={panel}
                isMaximized={isMaximized}
                onMaximize={this.handleMaximize}>
                {this.renderAnalytics(panel)}
              </VisualPanel>
            );
          })}

          {/* ANALYTICS FOOTER */}
          <footer className="App__footer">
            <Button id="export" label="export" hasLabel="true" />
            <Button id="print" label="print" hasLabel="true" />
          </footer>
        </section>
      </main>
    );
  }
}

export default App;
