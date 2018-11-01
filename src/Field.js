import React from 'react';
import PropTypes from 'prop-types';
import { GrassField, Diamond, InField, Lines, PitcherMound, Bases, Runners, Fielders } from './FieldComponent';

export class Field extends React.Component {
  constructor(props) {
    super(props);

    this.handleDrag = this.handleDrag.bind(this);
    this.handleStartDrag = this.handleStartDrag.bind(this);
    this.handleEndDrag = this.handleEndDrag.bind(this);
    this.init();
  }

  componentDidMount() {
    window.addEventListener("resize", this.init);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.init);
  }

  static defaultProps = {
    color: {
      mud: '#E41010',
      grass: '#50A160',
      stroke: '#ccc',
      base: '#ccc'
    }
  };

  static propTypes = {
    color: PropTypes.object,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  };

  consts = {
    fielders: [{},
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 }],
    runners: [
      { isOnBase: false, x: 0, y: 0, isScoring: false },
      { isOnBase: false, x: 0, y: 0, isScoring: false },
      { isOnBase: false, x: 0, y: 0, isScoring: false },
      { isOnBase: false, x: 0, y: 0, isScoring: false }],
    graphWidth: 0,
    graphHeight: 0,
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
    this.consts.graphWidth = this.props.width; // this.element.nativeElement.getBoundingClientRect().width;
    this.consts.graphHeight = this.props.height; // window.innerHeight - 50; // minus bottom menu
    this.consts.edge = ( this.consts.graphWidth > this.consts.graphHeight ? this.consts.graphHeight : this.consts.graphWidth ) / 2.5;
    this.consts.pitcherR = this.consts.edge * .1875 * .5;
    this.consts.pitcherDis = this.consts.edge * .675;
    this.consts.baseR = this.consts.edge * .15;
    this.consts.fieldEdge = this.consts.edge / Math.sqrt(2);

    let lineGap = this.consts.edge * .0375;
    this.consts.baseWidth = this.consts.edge * .05;
    this.consts.sDiamondMove = lineGap * Math.sqrt(2);
    this.consts.sDiamondAway = (Math.sqrt(this.consts.baseR*this.consts.baseR - lineGap*lineGap) - lineGap) / Math.sqrt(2);
    this.consts.lDiamondAway = (Math.sqrt(this.consts.baseR*this.consts.baseR - lineGap*lineGap) + lineGap) / Math.sqrt(2);
    this.consts.centerX = this.consts.graphWidth*.5;
    this.consts.centerY = this.consts.graphHeight - this.consts.sDiamondAway * 3;
    this.consts.bases = [ { x: this.consts.centerX, y: this.consts.centerY, dir: [1,-1], rotate: 0 },
              { x: this.consts.centerX + this.consts.fieldEdge, y: this.consts.centerY - this.consts.fieldEdge, dir: [-1,-1], rotate: 135 },

              { x: this.consts.centerX, y: this.consts.centerY - this.consts.fieldEdge * 2, dir: [-1,1], rotate: 45 },
              { x: this.consts.centerX - this.consts.fieldEdge, y: this.consts.centerY - this.consts.fieldEdge, dir: [1,1], rotate: 315 } ];

    this.initFielders();
    for (var i = 0; i < this.consts.runners.length; ++i) {
      var { x, y } = this.getRunnerXY(i);
      this.consts.runners[i].x = x;
      this.consts.runners[i].y = y;
    }
  }

  getRunnerXY(runner) {
    return { x: this.consts.bases[runner].x - this.consts.baseWidth * 2, 
             y: this.consts.bases[runner].y - this.consts.baseWidth * 2 };
  }

  initFielders() {
    this.consts.fielders[1] = { x: this.consts.centerX, y: this.consts.centerY - this.consts.pitcherDis - this.consts.pitcherR * 0.5 };
    this.consts.fielders[2] = { x: this.consts.centerX, y: this.consts.centerY };
    this.consts.fielders[3] = { x: this.consts.centerX + this.consts.fieldEdge - this.consts.edge * 0.1, y: this.consts.centerY - this.consts.fieldEdge - this.consts.edge * 0.35 };
    this.consts.fielders[4] = { x: this.consts.centerX + this.consts.edge * 0.25, y: this.consts.centerY - this.consts.fieldEdge * 2 - this.consts.baseWidth * 0.5 };
    this.consts.fielders[5] = { x: this.consts.centerX - this.consts.fieldEdge, y: this.consts.centerY - this.consts.fieldEdge - this.consts.edge * 0.35 };
    this.consts.fielders[6] = { x: this.consts.centerX - this.consts.edge * 0.35, y: this.consts.centerY - this.consts.fieldEdge * 2 - this.consts.baseWidth * 0.5 };
    this.consts.fielders[7] = { x: this.consts.centerX - this.consts.edge, y: this.consts.centerY - this.consts.fieldEdge * 2.5 };
    this.consts.fielders[8] = { x: this.consts.centerX - 9, y: this.consts.centerY  - this.consts.fieldEdge * 3 };
    this.consts.fielders[9] = { x: this.consts.centerX + this.consts.edge - 9, y: this.consts.centerY - this.consts.fieldEdge * 2.5 };
  }

  handleDrag(e) { 
    if (this.dragTarget) {
      e.preventDefault();
      var { x: dragX, y: dragY } = this.getMousePosition(e);
      this.consts.fielders[this.dragTarget].x = dragX - this.dragOffset.x;
      this.consts.fielders[this.dragTarget].y = dragY - this.dragOffset.y;
    }
  }

  handleStartDrag(e) { 
    var target = e.currentTarget;
    this.dragTarget = parseInt(target.id.substring(8));
    this.dragOffset = this.getMousePosition(e);
    this.dragOffset.x -= this.consts.fielders[this.dragTarget].x;
    this.dragOffset.y -= this.consts.fielders[this.dragTarget].y;
  }

  handleEndDrag(e) { 
    if (this.dragTarget) {
      // TODO: add to fielding list
      this.dragTarget = 0;
    }
  }

  getMousePosition(e) {
    // FIXME
    var CTM = document.querySelector('svg').getScreenCTM();
    if (e.touches) {
      e = e.touches[0];
    }
    return {
      x: (e.clientX - CTM.e) / CTM.a,
      y: (e.clientY - CTM.f) / CTM.d
    };
  }

  render() {
    return (
<svg style={{ width: '100%', height: '100%' }}
  onMouseMove={this.handleDrag}
  onTouchMove={this.handleDrag}
  onMouseUp={this.handlEndDrag}
  onTouchEnd={this.handleEndDrag}
  onTouchCancel={this.handleEndDrag}
  onMouseLeave={this.handleEndDrag} >
  <GrassField 
    grassColor={this.props.color.grass}
    width={this.consts.graphWidth}
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
    runners={this.consts.runners}
    baseWidth={this.consts.baseWidth} />
  <Fielders
    fielders={this.consts.fielders}
    onStartDrag={this.handleStartDrag} />
</svg>);
  }
}
