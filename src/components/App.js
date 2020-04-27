import React, {Component} from "react";
import classNames from "classnames";
import {getData} from "../lib/dataGenerator";
import countriesList from "../lib/countryData";
import * as dataHandlers from "../lib/dataHandlers";
import * as dataHelpers from "../lib/dataHelpers";
import Intro from "./Intro";
import TextPanel from "./TextPanel";
import VisualPanel from "./VisualPanel";
import Dropdown from "./Dropdown";
import Button from "./Button";
import BarChart from "./BarChart";
import Map from "./Map";
import "../scss/App.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.date = new Date();
    this.state = {
      isIntroVisible: true,
      isIntroMounted: true,
      data: getData(countriesList),
      isMounted: false,
      income: {},
      users: {},
      orders: {},
      complaints: {},
      stats: {
        period: "week",
        timeRanges: "",
      },
      analytics: {
        field: "income",
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
    const {getMapData, getHistData, getSummaryData, getColorRgb} = dataHandlers;
    const {statsFields} = dataHelpers;

    const loadData = () => {
      return [
        getMapData(data, field, month, year),
        getHistData(data, field, month, year),
        getSummaryData(data, month, year),
      ];
    };

    const dataPromise = new Promise((resolve, reject) => {
      setTimeout(resolve, 2000);
    });

    dataPromise
      .then(() => loadData())
      .then((response) => {
        const [mapData, histData, summaryData] = response;
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
          isIntroVisible: false,
        });
      })
      .then(() =>
        setTimeout(
          () =>
            this.setState({
              isIntroMounted: false,
            }),
          1000
        )
      );
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
    const {getMapData, getHistData, getSummaryData} = dataHandlers;

    field = type === "field" ? id : field;
    month = type === "month" ? id : month;
    year = type === "year" ? id : year;
    const mapData = getMapData(data, field, month, year);
    const histData = getHistData(data, field, month, year);
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

  renderAnalytics = (type) => {
    const {
      analytics: {field, mapData, histData, summaryData},
      colors,
    } = this.state;
    const alertClass = "VisualPanel__alert";
    const alertText = "No data for this time range...";

    switch (type) {
      case "histogram":
        const isHistData = histData.length > 0;

        return isHistData ? (
          <BarChart
            data={histData}
            keys={[field]}
            type="histogram"
            layout="vertical"
            margin={{left: 60}}
            colors={(id) => colors[id]}
            enableGridX={true}
            enableGridY={true}
          />
        ) : (
          <div className={alertClass}>{alertText}</div>
        );

      case "map":
        return <Map data={mapData} />;

      case "summary":
        const isSummaryData = summaryData.length > 0;
        const enableGridX = isSummaryData ? true : false;
        const axisBottom =
          isSummaryData > 0
            ? {
                tickSize: 5,
                tickPadding: 0,
                tickRotation: 0,
                tickValues: [20, 40, 60, 80],
              }
            : null;

        return isSummaryData ? (
          <BarChart
            data={summaryData}
            keys={[
              "incomeBefore",
              "incomeCurrent",
              "usersBefore",
              "usersCurrent",
              "ordersBefore",
              "ordersCurrent",
              "complaintsBefore",
              "complaintsCurrent",
            ]}
            type="summary"
            layout="horizontal"
            margin={{left: 100}}
            colors={(id) => {
              const isCurrent = id.includes("Current");
              return isCurrent ? colors[id.replace("Current", "")] : "#fff";
            }}
            enableGridX={enableGridX}
            gridXValues={[20, 40, 60, 80]}
            axisBottom={axisBottom}
          />
        ) : (
          <div className={alertClass}>{alertText}</div>
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
      isIntroVisible,
      isIntroMounted,
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

    const introClass = classNames("Intro", {
      "Intro--visible": isIntroVisible,
    });

    const analyticsClass = classNames(
      "App__section",
      "App__section--analytics",
      {
        [`App__section--${maximizedPanel}Max`]: maximizedPanel,
      }
    );

    const sectionHeadingClass = "App__heading App__heading--section";

    const appInfoCurrent = timeRanges ? timeRanges.split("vs.")[0] : "";
    const appInfoBefore = timeRanges ? timeRanges.split("vs.")[1] : "";

    return (
      <main className="App">
        {/* INTRO */}
        {isIntroMounted && <Intro className={introClass} />}

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
          {Object.entries(analyticsPanels).map(([id, info]) => {
            const isMaximized = this.state.maximizedPanel === id;
            const heading = id === "summary" ? "summary" : statsFields[field];

            return (
              <VisualPanel
                key={id}
                id={id}
                heading={heading}
                info={info}
                isMaximized={isMaximized}
                onMaximize={this.handleMaximize}>
                {this.renderAnalytics(id)}
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
