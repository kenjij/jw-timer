//
// Global resources
//
var shared;


//
// Main: Timer
//
var Timer = React.createClass({

	getInitialState: function() {
  	return({ms: 0, endtime: 0, mode: 0, running: false});
  },

  start: function(min) {
    document.body.style.WebkitAnimation = null;
  	this.setState({
    	ms: 60000 * min,
    	endtime: Date.now() + 60000 * min,
      mode: min
    });
    if (min == 0) {
      this.stopClock();
    } else {
      this.runClock();
    };
  },

  stop: function(running = true) {
  	if (running) {
	  	this.stopClock();
    } else {
    	this.resume();
    }
  },

  resume: function() {
  	this.setState({endtime: Date.now() + this.state.ms});
  	this.runClock();
  },

  timeup: function() {
    document.body.style.WebkitAnimation = 'timeup 1s linear 0s 10 normal';
    this.stopClock();
  },

  runClock: function() {
  	if (!this.interval) {
	  	this.interval = setInterval(this.tick, 100);
      this.setState({running: true});
    }
  },

  stopClock: function() {
  	if (this.interval) {
	  	clearInterval(this.interval);
      this.interval = null;
      this.setState({running: false});
    }
  },

	tick: function() {
    var nowt = Date.now();
    var ms = this.state.endtime - Date.now();
    if (ms < 0) {
      ms = 0;
      this.timeup();
    }
    this.setState({ms: ms});
  },

	render: function() {
  	return(
    	<div>
    	  <p>
      	  <Clock ms={this.state.ms} />
        	<PBar ms={this.state.ms} mode={this.state.mode} running={this.state.running} />
      	</p>
        <p id="ctrlbtns">
        	<TButtons start={this.start} mode={this.state.mode} /><br />
          <SButton stop={this.stop} mode={this.state.mode} running={this.state.running} />
        </p>
      </div>
    );
  }
});


//
// Clock
//
var Clock = React.createClass({
  render: function() {
    var d = new Date(this.props.ms);
    var time = d.getUTCMinutes() + ':' + ('0' + d.getUTCSeconds()).slice(-2);
    var ds = ('.' + (d.getUTCMilliseconds() * 0.01)).slice(0, 2);
    return(
      <div id="clock">
        <span id="clocktime">{time}</span>
        <span id="clockds">{ds}</span>
      </div>
    );
  }
});


//
// Timer Buttons
//
var TButtons = React.createClass({
	render: function() {
  	var cn = 'btn btn-info btn-lg';
    var st = this.props.start;
    var mode = this.props.mode;
    var buttons = [];
    var mins;
    if (typeof timers === 'undefined') {
      mins = [0, 2, 4, 6, 8, 10, 30];
    } else {
      mins = timers;
    }
    mins.forEach(function(min) {
    	var a = '';
      var t;
      if (min > 0 && min == mode) { a = ' active' };
      if (min == 0) { t = 'Reset' } else { t = min };
      var bt = (
        <div className="btn-group" role="group">
        	<button className={cn + a} onClick={st.bind(this, min)}>
          	{t}
        	</button>
      	</div>
      );
	    buttons.push(bt);
	  });
  	return(
    	<div className="btn-group btn-group-justified" role="group">
      	{buttons}
      </div>
    );
  }
});


//
// Stop/Pause Button
//
var SButton = React.createClass({
	render: function() {
  	var attr = {
    	className: 'btn btn-warning btn-lg btn-block',
      onClick: this.props.stop.bind(this, this.props.running),
      disabled: this.props.mode == 0
    };
    var act = 'play';
    if (this.props.running) { act = 'pause' };
    var icon = <span className={'glyphicon glyphicon-' + act}></span>;
  	return(React.createElement('button', attr, icon));
  }
});


//
// Progress Bar
//
var PBar = React.createClass({
	render: function() {
    var p;
  	if (this.props.mode > 0) {
    	var m = this.props.mode * 60000;
      var n = m - this.props.ms;
      p = n / m;
    } else {
    	p = 0;
    }
    var w = (p * 100).toString().slice(0, 6) + '%';
    var s, t;
    switch (true) {
    	case p >= 1:
    	case p > 0.90:
      	s = 'danger';
      	break;
    	case p > 0.75:
      	s = 'warning';
      	break;
    	default:
      	s = 'success';
      	break;
    }
    if (this.props.running) {
    	s = s + ' progress-bar-striped active';
    };
    var attr = {
			c: 'progress-bar progress-bar-' + s,
      r: 'progressbar',
      s: {width: w}
		};
		return(
  		<div className='progress'>
    		<div className={attr.c} role={attr.r} style={attr.s}>
        	{t}
        </div>
      </div>
    );
  }
});


//
// React Root
//
ReactDOM.render(
	<Timer />,
  document.getElementById('timer')
);
