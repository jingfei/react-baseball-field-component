import React from 'react';
import PropTypes from 'prop-types';
import { Runners, Fielders, GrassField, Diamond, InField, Lines, PitcherMound, Bases, RunnerOptions } from './FieldComponent';

export class Field extends React.Component {
  constructor(props) {
    super(props);
    this.consts = {
      edge: 0,
      pitcherR: 0,
      pitcherDis: 0,
      baseR: 0,
      fieldEdge: 0,
      baseWidth: 0,
      sDiamondMove: 0,
      sDiamondAway: 0,
      lDiamondAway: 0,
      centerX: 0,
      centerY: 0,
      bases: [ { x: 0, y: 0, dir: [1,-1], rotate: 0 },
            { x: 0, y: 0, dir: [-1,-1], rotate: 135 },
            { x: 0, y: 0, dir: [-1,1], rotate: 45 },
            { x: 0, y: 0, dir: [1,1], rotate: 315 } ]
    };

    this.init();

    this.state = { 
      fielders: this.getInitFielders,
      runners: this.getInitRunners,
      prevSetRunner: {},
      setRunner: {}
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.setRunner) {
      var setRunner = props.setRunner;
      var prevSetRunner = state.prevSetRunner;
      if (prevSetRunner.pos === setRunner.pos && prevSetRunner.runto === setRunner.runto) {
        state.setRunner = {};
      } else {
        state.prevSetRunner = Object.assign({}, setRunner);
        state.setRunner = Object.assign({}, setRunner);
      }
    }

    if (props.showRunnersOption && props.runnerUpdate) {
      var runnerUpdate = props.runnerUpdate;
      if (runnerUpdate.x && runnerUpdate.y) {
        state.runners[runnerUpdate.pos].x = runnerUpdate.x;
        state.runners[runnerUpdate.pos].y = runnerUpdate.y;
      }
    }

    if (props.fielderUpdate) {
      var update = props.fielderUpdate;
      if (update.x && update.y && update.pos) {
        state.fielders[update.pos].x = update.x;
        state.fielders[update.pos].y = update.y;
      }
    }
    return state;
  }

  componentDidUpdate(prevProps) {
    if (this.state.setRunner.hasOwnProperty('pos')) {
      if (this.state.setRunner.runto) {
        this.run(this.state.setRunner.pos, this.state.setRunner.runto - this.state.setRunner.pos);
      } else {
        var runners = this.state.runners;
        runners[this.state.setRunner.pos].isOnBase = true;
        runners[this.state.setRunner.pos].name = this.state.setRunner.name;
        this.setState({ runners: runners });
      }
    }
    if (!this.props.showRunnersOption && prevProps.showRunnersOption !== this.props.showRunnersOption) {
      var base = prevProps.showRunnersOption;
      var runners = this.state.runners;
      runners[base] = this.getRunnersXY[base];
      runners[base].isOnBase = true;
      this.setState({ runners: runners });
    }
  }

  init() {
    this.consts.edge = ( this.props.width > this.props.height ? this.props.height : this.props.width ) / 2.5;
    this.consts.pitcherR = this.consts.edge * .1875 * .5;
    this.consts.pitcherDis = this.consts.edge * .675;
    this.consts.baseR = this.consts.edge * .15;
    this.consts.fieldEdge = this.consts.edge / Math.sqrt(2);

    let lineGap = this.consts.edge * .0375;
    this.consts.baseWidth = this.consts.edge * .05;
    this.consts.sDiamondMove = lineGap * Math.sqrt(2);
    this.consts.sDiamondAway = (Math.sqrt(this.consts.baseR*this.consts.baseR - lineGap*lineGap) - lineGap) / Math.sqrt(2);
    this.consts.lDiamondAway = (Math.sqrt(this.consts.baseR*this.consts.baseR - lineGap*lineGap) + lineGap) / Math.sqrt(2);
    this.consts.centerX = this.props.width * .5;
    this.consts.centerY = this.props.height - this.consts.sDiamondAway * 3;
    this.consts.bases = [ { x: this.consts.centerX, y: this.consts.centerY, dir: [1,-1], rotate: 0 },
              { x: this.consts.centerX + this.consts.fieldEdge, y: this.consts.centerY - this.consts.fieldEdge, dir: [-1,-1], rotate: 135 },

              { x: this.consts.centerX, y: this.consts.centerY - this.consts.fieldEdge * 2, dir: [-1,1], rotate: 45 },
              { x: this.consts.centerX - this.consts.fieldEdge, y: this.consts.centerY - this.consts.fieldEdge, dir: [1,1], rotate: 315 } ];
  }

  get getBaseWidth() {
    return this.consts.baseWidth;
  }

  get getRunnersXY() {
    return this.consts.bases.map((base, i) => {
      return { pos: i,
               x: base.x - this.consts.baseWidth * 2,
               y: base.y - this.consts.baseWidth * 2 };
    });
  }

  get getInitRunners() {
    var runners = this.getRunnersXY;
    if (this.props.setRunner) {
      runners[this.props.setRunner.pos].isOnBase = true;
      runners[this.props.setRunner.pos].name  = this.props.setRunner.name;
    }
    return runners;
  }

  resetFielders() {
    this.setState({ fielders: this.getInitFielders });
  }

  getFielder(pos) {
    return this.state.fielders[pos];
  }

  get getInitFielders() {
    var fielders = [{}];
    fielders.push({ pos: 1, x: this.consts.centerX, y: this.consts.centerY - this.consts.pitcherDis - this.consts.pitcherR * 0.5 });
    fielders.push({ pos: 2, x: this.consts.centerX, y: this.consts.centerY });
    fielders.push({ pos: 3, x: this.consts.centerX + this.consts.fieldEdge - this.consts.edge * 0.1, y: this.consts.centerY - this.consts.fieldEdge - this.consts.edge * 0.35 });
    fielders.push({ pos: 4, x: this.consts.centerX + this.consts.edge * 0.25, y: this.consts.centerY - this.consts.fieldEdge * 2 - this.consts.baseWidth * 0.5 });
    fielders.push({ pos: 5, x: this.consts.centerX - this.consts.fieldEdge, y: this.consts.centerY - this.consts.fieldEdge - this.consts.edge * 0.35 });
    fielders.push({ pos: 6, x: this.consts.centerX - this.consts.edge * 0.35, y: this.consts.centerY - this.consts.fieldEdge * 2 - this.consts.baseWidth * 0.5 });
    fielders.push({ pos: 7, x: this.consts.centerX - this.consts.edge, y: this.consts.centerY - this.consts.fieldEdge * 2.5 });
    fielders.push({ pos: 8, x: this.consts.centerX - 9, y: this.consts.centerY  - this.consts.fieldEdge * 3 });
    fielders.push({ pos: 9, x: this.consts.centerX + this.consts.edge - 9, y: this.consts.centerY - this.consts.fieldEdge * 2.5 });
    if (this.props.fieldersNameList) {
      this.props.fieldersNameList.forEach((name, i) => fielders[i + 1].name = name);
    }
    return fielders;
  }

  run(base, step) {
    // TODO: adjust speed based on screen size
    var speed = 10;
    var runners = this.state.runners;
    if (base > 3) {
      return;
    }
    if (base + step > 3) {
      runners[base].isScoring = true;
    }
    var go = setInterval(() => {
      var runto = base + 1 > 3 ? 0 : base + 1;
      var { x: toX, y: toY } = this.getRunnersXY[runto];
      var dir = this.consts.bases[base].dir;
      runners[base].x += dir[0] * speed;
      runners[base].y += dir[1] * speed;
      if(dir[0]*(runners[base].x - toX) > 0 || dir[1]*(runners[base].y - toY) > 0) {
        runners[base].x = toX;
        runners[base].y = toY;

        clearInterval(go);
        var name = runners[base].name;
        runners[base] = this.getRunnersXY[base];
        runners[base].isOnBase = false;
        runners[runto].isOnBase = true;
        runners[runto].name = name;
        if (step > 1) {
          this.setState({ runners: runners });
          this.run(base + 1, step - 1);
        }
      }
      this.setState({ runners: runners });
    }, 10);
  }

  render() {
    var fielderComponent = this.props.isShowFielders
          ? <Fielders
              fielders={this.state.fielders}
              onStartDrag={this.props.onStartDrag} /> : '';
    var runnerOptionsComponent = this.props.showRunnersOption
          ? [this.props.showRunnersOption, this.props.showRunnersOption + 1].map(option => <RunnerOptions key={'runnerOptions'+option}
              runnerPos={this.props.runnerUpdate}
              base={this.consts.bases[option > 3 ? 0 : option]}
              baseWidth={this.consts.baseWidth}
              onStartDrag={this.props.onStartDrag} />) : '';
    return (<g>
      <GrassField 
        grassColor={this.props.color.grass}
        width={this.props.width}
        centerX={this.consts.centerX}
        centerY={this.consts.centerY}
        sDiamondAway={this.consts.sDiamondAway}
        edge={this.consts.edge} />
      <Diamond 
        mudColor={this.props.color.mud}
        centerX={this.consts.centerX}
        centerY={this.consts.centerY}
        pitcherDis={this.consts.pitcherDis}
        sDiamondMove={this.consts.sDiamondMove}
        sDiamondAway={this.consts.sDiamondAway}
        lDiamondAway={this.consts.lDiamondAway}
        baseR={this.consts.baseR}
        edge={this.consts.edge} />
      <InField
        grassColor={this.props.color.grass}
        bases={this.consts.bases}
        sDiamondMove={this.consts.sDiamondMove}
        sDiamondAway={this.consts.sDiamondAway}
        baseR={this.consts.baseR} />
      <Bases
        baseColor={this.props.color.base}
        bases={this.consts.bases}
        baseWidth={this.consts.baseWidth} />
      <Lines
        strokeColor={this.props.color.stroke}
        bases={this.consts.bases}
        centerX={this.consts.centerX}
        centerY={this.consts.centerY}
        edge={this.consts.edge} />
      <PitcherMound 
        mudColor={this.props.color.mud}
        centerX={this.consts.centerX}
        centerY={this.consts.centerY}
        pitcherDis={this.consts.pitcherDis}
        pitcherR={this.consts.pitcherR} />
      {runnerOptionsComponent}
      <Runners
        isShowRunners={this.props.isShowRunners}
        isShowBatter={this.props.isShowBatter}
        runners={this.state.runners}
        baseWidth={this.consts.baseWidth} 
        onStartDrag={this.props.onStartDrag} />
      {fielderComponent}
    </g>);
  }
}

Field.defaultProps = {
  isShowFielders: true,
  isShowRunners: true,
  isShowBatter: true,
  color: {
    mud: '#E41010',
    grass: '#50A160',
    stroke: '#ccc',
    base: '#ccc'
  }
};

Field.propTypes = {
  color: PropTypes.object,
  fielderUpdate: PropTypes.object,
  runnerUpdate: PropTypes.object,
  setRunner: PropTypes.object,
  onStartDrag: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  /* fieldersNameList: string array with length 9, runnersNameList: string array with max length 4 */
  fieldersNameList: PropTypes.array,
  runnersNameList: PropTypes.array,
  isShowFielders: PropTypes.bool,
  isShowRunners: PropTypes.bool,
  isShowBatter: PropTypes.bool,
  showRunnersOption: PropTypes.number
};
