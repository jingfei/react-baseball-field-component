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
    this.handleRun = this.handleRun.bind(this);
    this.handleToggleFielders = this.handleToggleFielders.bind(this);
    this.handleAddRunner = this.handleAddRunner.bind(this);
  }

  handleToggleFielders() {
    this.setState({ isShowFielders: !this.state.isShowFielders });
  }

  handleAddRunner() {
    this.secondRunner = { pos: 0 };
    this.setState({ runnersUpdate: { pos: 0 } });
  }

  handleRun() {
    var runnersUpdate = this.firstRunner;
    if (runnersUpdate.runto) {
      runnersUpdate.pos = runnersUpdate.runto;
    }
    runnersUpdate.runto = runnersUpdate.pos + 1;
    this.setState({ runnersUpdate: runnersUpdate });
  }

  handleFieldersMove(fielder) {
    console.log(`Fielder ${fielder.pos} moves to (${fielder.x}, ${fielder.y}) !`);
  }

  render() {
    var resetFieldersBtn = document.querySelector('#resetBtn');
    return (<div style={{height: '90%'}}>
        <button onClick={this.handleRun}>Run</button>
        <button onClick={this.handleAddRunner}>Add runner</button>
        <button onClick={this.handleToggleFielders}>Toggle Fielders</button>
        <BaseballField 
           isShowFielders={this.state.isShowFielders}
           resetFieldersBtn={resetFieldersBtn}
           onFieldersMove={this.handleFieldersMove}
           setRunner={this.state.runnersUpdate} />
        </div>);
  }

}

render(<App />, document.getElementById("root"));
