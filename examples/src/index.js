import React from 'react';
import { render } from 'react-dom';
import { BaseballField } from '../../src/BaseballField';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowFielders: true,
      runnersUpdate: [
        { pos: 0 },
        { pos: 2 }
      ]
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClick2 = this.handleClick2.bind(this);
  }

  handleClick2() {
    this.setState({ isShowFielders: !this.state.isShowFielders });
  }

  handleClick() {
    var runnersUpdate = this.state.runnersUpdate;
    if (runnersUpdate[0].runto) {
      runnersUpdate[0].pos = runnersUpdate[0].runto;
      runnersUpdate[1].pos = runnersUpdate[1].runto;
    }
    runnersUpdate[0].runto = runnersUpdate[0].pos + 1;
    runnersUpdate[1].runto = runnersUpdate[1].pos + 1;
    this.setState({ runnersUpdate: runnersUpdate });
  }

  render() {
    return (<div style={{height: '100%'}}>
        <button onClick={this.handleClick}>click me</button>
        <button onClick={this.handleClick2}>click me again</button>
        <BaseballField 
           isShowFielders={this.state.isShowFielders}
           runners={this.state.runnersUpdate} />
        </div>);
  }
}

render(<App />, document.getElementById("root"));
