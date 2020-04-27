import React, {Component} from "react";
import classNames from "classnames";
import {getData} from "../lib/dataGenerator";
import countriesList from "../lib/countryData";
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
      isMounted: false,
      profit: {},
      users: {},
      orders: {},
      complaints: {},
      stats: {
        period: "week",
        timeRanges: "",
      },
      analytics: {
        field: "profit",
        month: 0,
        //month: this.date.getMonth() + 1,
        //year: this.date.getFullYear(),
        year: 2017,
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
    const {getMapData, getHistData, getSummaryData, getColorRgb} = dataHandlers;
    const {statsFields} = dataHelpers;
    const mapData = getMapData(data, field, month, year);
    const histData = getHistData(data, field, month, year);
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
      isMounted: true,
    });
  };

  handleStats = (period) => {
    const {data} = this.state;
    const {
      getTotalInTimeRange,
      getBreakpointDates,
      getTimeRanges,
    } = dataHandlers;
    const {statsFields} = dataHelpers;
    const breakpointDates = getBreakpointDates(period);

    Object.keys(statsFields).forEach((field) => {
      const statsOutput = getTotalInTimeRange(data, field, breakpointDates);
      const [lastPeriodTotal, percentage] = statsOutput;

      this.setState({
        [field]: {
          value: lastPeriodTotal,
          percentage,
        },
      });
    });

    const timeRanges = getTimeRanges(breakpointDates, period);

    const stats = {
      period,
      timeRanges,
    };
    this.setState({stats});
  };

  handleAnalytics = (type, id) => {
    const {data, analytics} = this.state;
    let {field, month, year} = this.state.analytics;
    const {getMapData, getHistData, getSummaryData, getColorRgb} = dataHandlers;

    field = type === "field" ? id : field;
    month = type === "month" ? id : month;
    year = type === "year" ? id : year;
    const mapData = getMapData(data, field, month, year);
    const histData = getHistData(data, field, month, year);
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
            //colors={colors[field]}
            colors={{[field]: colors[field]}}
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
            /* colors={[
              "#fff",
              colors.profit,
              "#fff",
              colors.users,
              "#fff",
              colors.orders,
              "#fff",
              colors.complaints,
            ]} */
            colors={{
              profitBefore: "#fff",
              profitCurrent: colors.profit,
              usersBefore: "#fff",
              usersCurrent: colors.users,
              ordersBefore: "#fff",
              ordersCurrent: colors.orders,
              complaintsBefore: "#fff",
              complaintsCurrent: colors.complaints,
            }}
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

  handleExport = (data, filename, type) => {
    const file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob)
      // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
    else {
      // Others
      const a = document.createElement("a"),
        url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  };

  render() {
    const {
      data,
      stats: {period, timeRanges},
      analytics: {field, month, year},
      yearsArray,
      maximizedPanel,
      isMounted,
    } = this.state;

    const {statsFields, statsPeriods, months, analyticsPanels} = dataHelpers;

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

    const sectionHeadingClass = "App__heading App__heading--section"

    const appInfoCurrent = timeRanges ? timeRanges.split("vs.")[0] : "";
    const appInfoBefore = timeRanges ? timeRanges.split("vs.")[1] : "";

    return (
      <main className="App">
        <h1 className="App__heading">dashboard _</h1>

        {/* LATEST STATS SECTION */}
        <section className="App__section App__section--stats">
          {/* LATEST STATS HEADER */}
          <header className="App__header App__header--stats">
            <h2 className={sectionHeadingClass}>Recent</h2>
            <p className="App__info">
              <span className="App__info--current">{appInfoCurrent} vs.</span>
              <span className="App__info--before">{appInfoBefore}</span>
            </p>
            <Dropdown
              currentId={period}
              type="period"
              menuList={statsPeriods}
              onMenuClick={this.handleStats}
            />
          </header>

          {/* LATEST STATS TEXT PANELS */}
          {isMounted &&
            Object.entries(statsFields).map(([field, heading]) => {
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
            <h2 className={sectionHeadingClass}>Analytics</h2>
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
            <Button
              id="export"
              label="export"
              onClick={() =>
                this.handleExport(
                  JSON.stringify(data),
                  "dashboard",
                  "text/plain"
                )
              }
            />
            <Button id="print" label="print" onClick={() => window.print()} />
          </footer>
        </section>
      </main>
    );
  }
}

export default App;
