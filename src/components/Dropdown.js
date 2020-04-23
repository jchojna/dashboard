import React, {Component} from "react";
import {statsPeriods, months} from "../lib/dataHelpers";
import DropdownMenu from "./DropdownMenu";
import Icon from "./Icon";
import "../scss/Dropdown.scss";

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  handleDropdown = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
  }

  handleMenu = (item) => {
    this.handleDropdown();
    this.props.onMenuClick(item);
  }

  renderMenu = () => {
    const {id} = this.props;
    const menuList =
      id === "stats" ? Object.keys(statsPeriods) : id === "month" ? months : [];

    return (
      <DropdownMenu>
        {menuList.map((item) => {
          const label = id === "stats" ? statsPeriods[item] : item;

          return (
            <li key={item}>
              <button onClick={() => this.handleMenu(item)}>{label}</button>
            </li>
          );
        })}
      </DropdownMenu>
    );
  };

  render() {
    const {isOpen} = this.state;
    const {period} = this.props;
    const label = statsPeriods[period];

    return (
      <div className="Dropdown">
        <button className="Dropdown__button" onClick={this.handleDropdown}>
          <span className="Dropdown__label">{label}</span>
          <Icon id="dropdown" />
        </button>
        {isOpen && this.renderMenu()}
      </div>
    );
  }
}
export default Dropdown;
