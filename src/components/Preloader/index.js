import React from "react";

import "./style.css";

class Preloader extends React.Component {
  render() {
    return (
      <div className="preloader-absolute-container">
        <div className="cssload-container">
          <div className="cssload-speeding-wheel" />
        </div>
      </div>
    );
  }
}

export default Preloader;
