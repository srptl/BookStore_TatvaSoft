import React from "react";

const ValidationErrorMessage = (props) => {
  return (
    <>{props.touched && <p className="  text-danger">{props.message}</p>}</>
  );
};

export default ValidationErrorMessage;
