import React from "react";
import style from "../styles/DataField.module.css";

const DataField = (props) => {
  function handleInvalid(e) {
    const validityState = e.target.validity;
    if (validityState.valueMissing)
      e.target.setCustomValidity("Bitte füllen Sie dieses Feld aus");
  }
  function test(e) {
    const validityState = e.target.validity;
    if (!validityState.valueMissing) e.target.setCustomValidity("");
  }

  if (props.type === "radio") return;
  else {
    if (props.required === true) {
      return (
        <div className={style.element}>
          <label htmlFor={props.name}>{props.name}</label>
          <input
            type={props.type}
            id={props.name}
            name={props.name}
            value={props.value}
            onChange={props.onChange}
            onInvalid={handleInvalid}
            onInput={test}
            maxLength={props.maxlength}
            className={style.inputfield}
          ></input>
        </div>
      );
    } else {
      return (
        <div className={style.element}>
          <label htmlFor={props.name}>{props.name}</label>
          <input
            type={props.type}
            id={props.name}
            name={props.name}
            value={props.value}
            onChange={props.onChange}
            maxLength={props.maxlength}
            className={style.inputfield}
          ></input>
        </div>
      );
    }
  }
};

export { DataField };
