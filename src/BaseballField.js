import React from 'react';
import PropTypes from 'prop-types';
import { Field } from './Field';

export class BaseballField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isReRendered: this.props.width && this.props.height,
      showRunnersOption: 0,
      runnerUpdate: {},
      fielderUpdate: {}
    };

    this.handleDrag = this.handleDrag.bind(this);
    this.handleStartDrag = this.handleStartDrag.bind(this);
    this.handleEndDrag = this.handleEndDrag.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.setSize = this.setSize.bind(this);
    this.setElementRef = this.setElementRef.bind(this);
    this.setFieldRef = this.setFieldRef.bind(this);
  }

  resetFielders() {
    this.setState({fielderUpdate: {}});
    this.fieldRef.resetFielders();
  }

  setFieldRef(element) {
    if (element) {
      this.fieldRef = element;
      if (this.props.resetFieldersBtn) {
        this.props.resetFieldersBtn.onclick = this.resetFielders.bind(this);
      }
    }
  }

  setElementRef(element) {
    if (element) {
      this.elementRef = element;
    }
  }

  setSize(element) {
    if (element && !this.state.isReRendered) {
      var { width, height } = element.getBoundingClientRect();
      this.width = this.props.width || width;
      this.height = this.props.height || height;
      window.addEventListener("resize", this.handleResize);
      this.setState({ isReRendered: true });
    }
  }

  handleResize() {
    // FIXME: resize doesn't keep fielders & runners status
    this.setState({ isReRendered: false });
  }

  noscroll() {
    window.scrollTo(0,0);
  }

  handleDrag(e) { 
    if (this.fielder) {
      e.preventDefault();
      var { x: dragX, y: dragY } = this.getMousePosition(e);
      this.fielder.x = dragX - this.dragOffset.x;
      this.fielder.y = dragY - this.dragOffset.y;
      this.setState({fielderUpdate: this.fielder});
    } else if (this.runner) {
      e.preventDefault();
      var { x: dragX, y: dragY } = this.getMousePosition(e);
      this.runner.x = dragX - this.dragOffset.x;
      this.runner.y = dragY - this.dragOffset.y;
      this.setState({runnerUpdate: this.runner});
    }
  }

  handleStartDrag(e) { 
    var target = e.currentTarget;
    var idArray = target.id ? target.id.split('-') : [];
    if (idArray.length !== 2) {
      return;
    }
    var pos = parseInt(idArray[1]);
    this.dragOffset = this.getMousePosition(e);
    if (idArray[0] === 'runner') {
      this.runner = this.fieldRef.getRunnersXY[pos];
      this.dragOffset.x -= this.runner.x;
      this.dragOffset.y -= this.runner.y;
      this.setState({ showRunnersOption: pos });
    } else if (idArray[0] === 'fielder') {
      this.fielder = this.fieldRef.getFielder(pos);
      this.dragOffset.x -= this.fielder.x;
      this.dragOffset.y -= this.fielder.y;
    }
  }

  handleEndDrag(e) { 
    if (this.fielder) {
      // TODO: current fielder's position is relative to screen size
      if (this.props.onFieldersMove) {
        this.props.onFieldersMove(this.fielder);
      }
      this.fielder = null;
    } else if (this.runner) {
      this.runner = this.fieldRef.getRunnersXY[this.runner.pos];
      this.setState({ showRunnersOption: 0 });
      this.runner = null;
    }
  }

  getMousePosition(e) {
    var CTM = this.elementRef.getScreenCTM();
    if (e.touches) {
      e = e.touches[0];
    }
    return {
      x: (e.clientX - CTM.e) / CTM.a,
      y: (e.clientY - CTM.f) / CTM.d
    };
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  render() {
    if (!this.state.isReRendered) {
      return <div 
        style={{ width: '100%', height: '100%' }}
        ref={this.setSize} />;
    } else {
      return (<svg
        ref={this.setElementRef}
        style={{ width: '100%', height: '100%', touchAction: 'none' }}
        onMouseMove={this.handleDrag}
        onMouseUp={this.handleEndDrag}
        onMouseLeave={this.handleEndDrag}
        onTouchMove={this.handleDrag}
        onTouchEnd={this.handleEndDrag}
        onTouchCancel={this.handleEndDrag} >
        <Field 
          ref={this.setFieldRef}
          onStartDrag={this.handleStartDrag}
          onFieldersMove={this.props.onFieldersMove}
          isShowFielders={this.props.isShowFielders}
          resetFieldersBtn={this.props.resetFieldersBtn}
          fielderUpdate={this.state.fielderUpdate}
          setRunner={this.props.setRunner}
          runnerUpdate={this.state.runnerUpdate}
          showRunnersOption={this.state.showRunnersOption}
          fieldersNameList={this.props.fieldersNameList}
          width={this.width}
          height={this.height} />
      </svg>);
    }
  }
}

BaseballField.defaultProps = {
  isShowFielders: true,
  isShowRunners: true,
  isShowBatter: true
};

BaseballField.propTypes = {
  isShowFielders: PropTypes.bool,
  isShowRunners: PropTypes.bool,
  isShowBatter: PropTypes.bool,
  /* setRunner object is composed by { pos: RUNNER_POSITION (0~4), runto (optional): FINAL_POSITION (1~x), name (optional): string } */
  setRunner: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  /* fieldersNameList: string array with length 9, runnersNameList: string array with max length 4 */
  fieldersNameList: PropTypes.array,
  runnersNameList: PropTypes.array,
  /* onFieldersMove: 
   *   callback function after fielder dragged 
   *   argument will be passed as a object 
   *    { pos: FIELDER_POSITION (1~9), x: X_AXIS, y: Y_AXIS }
   */
  onFieldersMove: PropTypes.func,
  resetFieldersBtn: PropTypes.object
};
