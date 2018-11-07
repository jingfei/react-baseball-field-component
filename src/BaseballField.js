import React from 'react';
import PropTypes from 'prop-types';
import { Field } from './Field';

export class BaseballField extends React.Component {
  static defaultProps = {
    isShowFielders: true,
    isShowRunners: true,
    isShowBatter: true
  };

  static propTypes = {
    isShowFielders: PropTypes.bool,
    isShowRunners: PropTypes.bool,
    isShowBatter: PropTypes.bool,
    /* runners: type size 4 array object 
     * each object stands for each base from home to third
     * object is composed by { pos: RUNNER_POSITION (0~4), runto: FINAL_POSITION (1~x) } */
    runners: PropTypes.array,
    width: PropTypes.number,
    height: PropTypes.number,
    // TODO: haven't started implement
    /* onFielderMove: callback function after fielder dragged */
    onFieldersMove: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      isReRendered: this.props.width && this.props.height,
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

  setFieldRef(element) {
    if (element) {
      this.fieldRef = element;
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
    this.setState({ isReRendered: false });
  }

  handleDrag(e) { 
    if (this.fielder) {
      e.preventDefault();
      var { x: dragX, y: dragY } = this.getMousePosition(e);
      this.fielder.x = dragX - this.dragOffset.x;
      this.fielder.y = dragY - this.dragOffset.y;
      this.setState({fielderUpdate: this.fielder});
    }
  }

  handleStartDrag(e) { 
    var target = e.currentTarget;
    var idArray = target.id ? target.id.split('-') : [];
    if (idArray.length !== 2) {
      return;
    }
    var pos = parseInt(idArray[1]);
    this.fielder = this.fieldRef.getFielder(pos);
    this.dragOffset = this.getMousePosition(e);
    this.dragOffset.x -= this.fielder.x;
    this.dragOffset.y -= this.fielder.y;
  }

  handleEndDrag(e) { 
    if (this.fielder) {
      // TODO: add to fielding list
      this.fielder = null;
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
        style={{ width: '100%', height: '100%' }}
        onMouseMove={this.handleDrag}
        onMouseUp={this.handleEndDrag}
        onMouseLeave={this.handleEndDrag}
        onTouchMove={this.handleDrag}
        onTouchEnd={this.handleEndDrag}
        onTouchCancel={this.handleEndDrag} >
        <Field 
          ref={this.setFieldRef}
          onStartDrag={this.handleStartDrag}
          isShowFielders={this.props.isShowFielders}
          fielderUpdate={this.state.fielderUpdate}
          runnersUpdate={this.props.runners}
          width={this.width}
          height={this.height} />
      </svg>);
    }
  }
}
