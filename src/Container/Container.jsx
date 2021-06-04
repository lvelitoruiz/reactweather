import React from "react";
import Cities from "../Cities/Cities";
import Detail from "../Detail/Detail";

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.callChildApi = this.callChildApi.bind(this);
  }

  callChildApi(identification) {
    window.scrollTo(0,0);
    this.child.current.callApi(identification);
  }

  render() {
    return (
      <div className="grid relative grid-cols-12 h-full">
        <div className="lg:col-span-6 col-span-12 bg-indigo-500 h-full">
          <Detail ref={this.child} />
        </div>
        <div className="lg:col-span-6 col-span-12 grid grid-cols-12 justify-items-center items-center py-16 px-8 shadow-lg bg-white bg-opacity-100 h-full">
          <Cities whenClicked={this.callChildApi} />
        </div>
      </div>
    );
  }
}

export default Container;
