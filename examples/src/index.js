import React from 'react';
import { render } from 'react-dom';
import { BaseballField } from '../../src/BaseballField';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.firstRunner = { pos: 0, name: "Posada" };
    this.secondRunner = { pos: 0, name: "Jeter" };
    this.fieldersNameList = ["Jakie", "Brock", "Steve", "Rafael", "Blake", "Brandon", "Christian", "Sam", "Tzu-Wei"];

    this.state = {
      isShowFielders: true,
      runnersUpdate: this.firstRunner,
      isRunnerAdded: false
    };

    this.handleRun1 = this.handleRun.bind(this, this.firstRunner);
    this.handleRun2 = this.handleRun.bind(this, this.secondRunner);
    this.handleToggleFielders = this.handleToggleFielders.bind(this);
    this.handleAddRunner = this.handleAddRunner.bind(this);
  }

  handleToggleFielders() {
    this.setState({ isShowFielders: !this.state.isShowFielders });
  }

  handleAddRunner() {
    this.setState({ runnersUpdate: this.secondRunner, isRunnerAdded: true });
  }

  handleRun(runner) {
    var runnersUpdate = runner;
    console.log(runner);
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
        <button onClick={this.handleRun1}>Run (Posada)</button>
        {this.state.isRunnerAdded ? <button onClick={this.handleRun2}>Run (Jeter)</button> : ''}
        {this.state.isRunnerAdded ? '' : <button onClick={this.handleAddRunner}>Add runner</button>}
        <button onClick={this.handleToggleFielders}>Toggle Fielders</button>
        <BaseballField 
           isShowFielders={this.state.isShowFielders}
           resetFieldersBtn={resetFieldersBtn}
           onFieldersMove={this.handleFieldersMove}
           setRunner={this.state.runnersUpdate} 
           fieldersNameList={this.fieldersNameList} />
        </div>);
  }
}

render(<App />, document.getElementById("root"));
