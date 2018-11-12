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
    this.handleResetFielders = this.handleResetFielders.bind(this);
  }

  handleToggleFielders() {
    this.setState({ isShowFielders: !this.state.isShowFielders });
    if (this.state.isShowFielders) {
      this.setState({ isResetFielders: false });
    }
  }

  handleAddRunner() {
    this.secondRunner = { pos: 0 };
    this.setState({ runnersUpdate: { pos: 0 } });
  }

  handleResetFielders() {
    this.setState({ isResetFielders: true });
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
    return (<div style={{height: '100%'}}>
        <button onClick={this.handleRun}>Run</button>
        <button onClick={this.handleAddRunner}>Add runner</button>
        <button onClick={this.handleToggleFielders}>Toggle Fielders</button>
        <button onClick={this.handleResetFielders}>Reset Fielders</button>
        <BaseballField 
           isShowFielders={this.state.isShowFielders}
           isResetFielders={this.state.isResetFielders}
           onFieldersMove={this.handleFieldersMove}
           setRunner={this.state.runnersUpdate} />
        </div>);
  }

}

render(<App />, document.getElementById("root"));
