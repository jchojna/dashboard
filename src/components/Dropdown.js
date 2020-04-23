import React, {Component} from "react";
import classNames from "classnames";
import {statsNames, statsPeriods, months} from "../lib/dataHelpers";
import Icon from "./Icon";
import "../scss/Dropdown.scss";

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.dropdown = React.createRef();
    this.state = {
      isOpen: false,
    };
  }

  componentDidMount = () => {
    document.addEventListener("mousedown", this.exitDropdownMenu, false);
  };

  componentWillUnmount = () => {
    document.removeEventListener("mousedown", this.exitDropdownMenu, false);
  };

  exitDropdownMenu = (e) => {
    if (this.state.isOpen && !this.dropdown.current.contains(e.target)) {
      this.toggleDropdown();
    }
  };

  toggleDropdown = () => {
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen,
    }));
  };

  handleMenu = (item) => {
    this.toggleDropdown();
    this.props.onMenuClick(item);
  };

  renderMenu = () => {
    const {id, years} = this.props;
    let menuList;

    switch (id) {
      case "periods":
        menuList = Object.keys(statsPeriods);
        break;

      case "month":
        menuList = months;
        break;

      case "year":
        menuList = years;
        break;

      case "stats":
        menuList = Object.values(statsNames).map((name) => name.heading);
        break;

      default:
        break;
    }

    return (
      <ul className="Dropdown__list">
        {menuList.map((item) => {
          const label = id === "periods" ? statsPeriods[item] : item;

          return (
            <li key={item} className="Dropdown__item">
              <button
                className="Dropdown__button"
                onClick={() => this.handleMenu(item)}>
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  render() {
    const {isOpen} = this.state;
    const {period} = this.props;
    const label = statsPeriods[period];

    const buttonClass = classNames("Dropdown__button", {
      "Dropdown__button--active": isOpen,
    });

    return (
      <div className="Dropdown" ref={this.dropdown}>
        <button className={buttonClass} onClick={this.toggleDropdown}>
          <span className="Dropdown__label">{label}</span>
          <Icon id="dropdown" isRotated={isOpen} />
        </button>
        {isOpen && this.renderMenu()}
      </div>
    );
  }
}
export default Dropdown;
