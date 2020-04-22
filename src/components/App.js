import React, {Component} from "react";
import TextPanel from "./TextPanel";
import VisualPanel from "./VisualPanel";
import Dropdown from "./Dropdown";
import Button from "./Button";
import {countriesList, getData} from "../lib/data";
import "../scss/App.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: getData(countriesList),
      profit: 0,
      users: 0,
      orders: 0,
      complaints: 0
    };
  }

  componentDidMount = () => {
    this.setState({
      profit: this.getTotal("profit"),
      users: this.getTotal("users"),
      orders: this.getTotal("orders"),
      complaints: this.getTotal("complaints"),
    });
  };

  getTotal = (type) => {
    const {data} = this.state;
    let total = 0;

    Object.values(data).forEach((country) => {
      total += Object.values(country)
        .map((date) => date[type])
        .reduce((acc, curr) => acc + curr, 0);
    });

    return total;
  };

  render() {
    const {profit, users, orders, complaints} = this.state;

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
            value={profit}
            percentage="4,5"
          />
          <TextPanel
            key="users"
            id="users"
            heading="Active users"
            value={users}
            percentage="8,5"
          />
          <TextPanel
            key="orders"
            id="orders"
            heading="New orders"
            value={orders}
            percentage="3,9"
          />
          <TextPanel
            key="complaints"
            id="complaints"
            heading="Open complaints"
            value={complaints}
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
