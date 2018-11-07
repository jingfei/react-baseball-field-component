import React from 'react';
import { render } from 'react-dom';
import { BaseballField } from '../../src/BaseballField';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      runnersUpdate: [
        { pos: 0 },
        { pos: 2 }
      ]
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    var runnersUpdate = this.state.runnersUpdate;
    runnersUpdate[0].runto = 1;
    runnersUpdate[1].runto = 4;
    this.setState({ runnersUpdate: runnersUpdate });
  }

  render() {
    return (<div style={{height: '100%'}}>
        <button onClick={this.handleClick}>click me</button>
        <BaseballField 
           runners={this.state.runnersUpdate} />
        </div>);
  }
}

render(<App />, document.getElementById("root"));
