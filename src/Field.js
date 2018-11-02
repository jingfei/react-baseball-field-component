import React from 'react';
import PropTypes from 'prop-types';
import { Runners, Fielders, GrassField, Diamond, InField, Lines, PitcherMound, Bases } from './FieldComponent';

export class Field extends React.Component {
  static defaultProps = {
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

  static propTypes = {
    color: PropTypes.object,
    fielderUpdate: PropTypes.object,
    runners: PropTypes.array,
    onStartDrag: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    isShowFielders: PropTypes.bool,
    isShowRunners: PropTypes.bool,
    isShowBatter: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.init();

    this.state = { fielders: this.getInitFielders };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.fielderUpdate) {
      var update = props.fielderUpdate;
      if (update.x && update.y && update.pos) {
        state.fielders[update.pos].x = update.x;
        state.fielders[update.pos].y = update.y;
      }
    }
    return state;
  }

  consts = {
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
    return this.consts.bases.map(base => {
      return { x: base.x - this.consts.baseWidth * 2,
               y: base.y - this.consts.baseWidth * 2 };
    });
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
    return fielders;
  }

  render() {
    var fielderComponent = this.props.isShowFielders
          ? <Fielders
              fielders={this.state.fielders}
              onStartDrag={this.props.onStartDrag} /> : '';

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
      <Runners
        isShowRunners={this.props.isShowRunners}
        isShowBatter={this.props.isShowBatter}
        runners={this.props.runners || this.getRunnersXY}
        baseWidth={this.consts.baseWidth} />
      {fielderComponent}
    </g>);
  }
}
