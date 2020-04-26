import React, {Component} from "react";
import classNames from "classnames";
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
    const {type, onMenuClick} = this.props;
    this.toggleDropdown();
    type === "period" ? onMenuClick(item) : onMenuClick(type, item);
  };

  renderMenu = () => {
    const {type, menuList} = this.props;
    const isListAnArray = Array.isArray(menuList);
    const menuItems = isListAnArray ? menuList : Object.keys(menuList);
    const buttonClass = `
      Dropdown__button
      Dropdown__button--menu
      Dropdown__button--${type}
    `;

    return (
      <ul className="Dropdown__list">
        {menuItems.map((item) => {
          const label = isListAnArray ? item : menuList[item];

          return (
            <li key={item} className="Dropdown__item">
              <button
                className={buttonClass}
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
    const {type, currentId, menuList} = this.props;
    const label = Array.isArray(menuList) ? currentId : menuList[currentId];

    const buttonClass = classNames(
      "Dropdown__button",
      `Dropdown__button--${type}`,
      {
        "Dropdown__button--active": isOpen,
      }
    );

    return (
      <div className={`Dropdown Dropdown--${type}`} ref={this.dropdown}>
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
