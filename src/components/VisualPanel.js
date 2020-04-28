import React from "react";
import classNames from "classnames";
import Icon from "./Icon";
import "../scss/VisualPanel.scss";

const VisualPanel = (props) => {
  const {id, heading, info, isMaximized, onMaximize, isDataLoading} = props;
  const iconId = isMaximized ? "minimize" : "maximize";

  const overlayClass = classNames("VisualPanel__overlay", {
    "VisualPanel__overlay--visible": isDataLoading,
  });

  return (
    <section className={`VisualPanel VisualPanel--${id}`}>
      <header className="VisualPanel__header">
        <h3 className="VisualPanel__heading">
          {heading}
          <span className="VisualPanel__heading--info">{` - ${info}`}</span>
        </h3>
        <button className="VisualPanel__button" onClick={() => onMaximize(id)}>
          <Icon id={iconId} />
        </button>
      </header>
      <div className={overlayClass}>
        <div className="loader loader--panel"></div>
      </div>
      {props.children}
    </section>
  );
};
export default VisualPanel;
