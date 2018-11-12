import React from 'react';
import { render } from 'react-dom';
import { BaseballField } from '../../src/BaseballField';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowFielders: true,
      runnersUpdate: { pos: 0 }
    };
    this.firstRunner = { pos: 0 };
    this.secondRunner = { };
    this.handleClick = this.handleClick.bind(this);
    this.handleClick2 = this.handleClick2.bind(this);
    this.handleClick3 = this.handleClick3.bind(this);
  }

  handleClick2() {
    this.setState({ isShowFielders: !this.state.isShowFielders });
  }

  handleClick3() {
    this.secondRunner = { pos: 0 };
    this.setState({ runnersUpdate: { pos: 0 } });
  }

  handleClick() {
    var runnersUpdate = this.firstRunner;
    if (runnersUpdate.runto) {
      runnersUpdate.pos = runnersUpdate.runto;
    }
    runnersUpdate.runto = runnersUpdate.pos + 1;
    this.setState({ runnersUpdate: runnersUpdate });
  }

  handleFieldersMove(fielder) {
    console.log(fielder);
  }

  render() {
    return (<div style={{height: '100%'}}>
        <button onClick={this.handleClick}>Run</button>
        <button onClick={this.handleClick3}>Add runner</button>
        <button onClick={this.handleClick2}>Toggle Fielders</button>
        <BaseballField 
           isShowFielders={this.state.isShowFielders}
           onFieldersMove={this.handleFieldersMove}
           setRunner={this.state.runnersUpdate} />
        </div>);
  }

}

render(<App />, document.getElementById("root"));
