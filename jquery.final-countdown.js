/*!
 * jQuery Final Countdown
 *
 * @author Pragmatic Mates, http://pragmaticmates.com
 * @version 1.1.1
 * @license GPL 2
 * @link https://github.com/PragmaticMates/jquery-final-countdown
 */

(function ($) {
    var settings;
    var timer;
    var circleSeconds;
    var layerSeconds;
    var element;
    var callbackFunction;
    var interval;
    var flagTimer;
    var flagPause;
    var flagBlic;
    var flagFirstStart;
    var time;
    var currentSecond;

    var val;
    var secval;
    var audio;

    $.fn.final_countdown = function(options, callback) {
        element = $(this);        

        time = 60;
        flagTimer = true;
        flagPause = false;
        flagBlic = false;
	    flagFirstStart = false;
        currentSecond = 0;
        audio = new Audio('tik.mp3');

        var defaults = $.extend({
            start: 0,
            end: 60,
            now: 0,
            selectors: {
                value_seconds: '.clock-seconds .val',
                canvas_seconds: 'canvas-seconds',
            },
            seconds: {
                borderColor: '#7995D5',
                borderWidth: '6'
            }
        }, options);

        val = $('#val');
        secval = $('#secval');
        settings = $.extend({}, defaults, options);

        $('#reset').click(function(){
            clearInterval(interval);
	    flagFirstStart = true;
            time = 60;
            flagBlic = false;
            currentSecond = 0;
	    val.css('color','white');
            secval.css('color','white');
            responsive();
            dispatchTimer();
            prepareCounters();
            startCounters();
            
        });
	$('#start').click(function(){
            console.log(timer.seconds);
            if(flagPause || !flagFirstStart) {
                responsive();
                dispatchTimer();
                prepareCounters();
                startCounters();
                flagPause = false;
		flagFirstStart = true;
            }
            if(flagBlic) {
	            clearInterval(interval);
    	            responsive();
	            dispatchTimer();
	            prepareCounters();
	            startCounters();
	            val.css('color','red');
	            secval.css('color','red');
	    }
	});
        $('#pause').click(function(){
            if(!flagPause) {
                currentSecond = timer.seconds;
                flagPause = true;
                startCounters();
                console.log('pause pressed');
            }
        });

        $('#blic').click(function(){
            clearInterval(interval);
            time = 20;
            flagBlic = true;
	    flagFirstStart = true;
            responsive();
            dispatchTimer();
            prepareCounters();
            startCounters();
            val.css('color','red');
            secval.css('color','red');	
        });

        if (element.data('border-color')) {
            settings.seconds.borderColor = element.data('border-color');
        }

        if (settings.now < settings.start ) {
            settings.start = settings.now;
            settings.end = settings.now;
        }

        if (settings.now > settings.end) {
            settings.start = settings.now;
            settings.end = settings.now;
        }

        if (typeof callback == 'function') { // make sure the callback is a function
            callbackFunction = callback;
        }
        responsive();
        dispatchTimer();
        prepareCounters();
        // startCounters();
    };

    function responsive() {
        $(window).load(updateCircles);
        $(window).on('redraw', function() {
            switched = false;
            updateCircles();
        });
        $(window).on('resize', updateCircles);
    }

    function updateCircles() {     
        layerSeconds.draw();
    }

    function convertToDeg(degree) {
        return (Math.PI/180)*degree - (Math.PI/180)*90
    }

    function dispatchTimer() {
        timer = {
            total: Math.floor((settings.end - settings.start) / 86400),
            seconds: currentSecond
        }
        // console.log(timer.seconds);
    }

    function prepareCounters() {
        // Seconds
        var seconds_width = $('#' + settings.selectors.canvas_seconds).width()
        var secondsStage = new Kinetic.Stage({
            container: settings.selectors.canvas_seconds,
            width: seconds_width,
            height: seconds_width
        });

        circleSeconds = new Kinetic.Shape({
            drawFunc: function(context) {
                var seconds_width = $('#' + settings.selectors.canvas_seconds).width()
                var radius = seconds_width / 2 - settings.seconds.borderWidth / 2;
                var x = seconds_width / 2;
                var y = seconds_width / 2;
                var k = (flagBlic) ? 18 : 6;
                context.beginPath();
                context.arc(x, y, radius, convertToDeg(0), convertToDeg(timer.seconds * k));
                context.fillStrokeShape(this);

                $(settings.selectors.value_seconds).html(time - timer.seconds);
            },
            stroke: settings.seconds.borderColor,
            strokeWidth: settings.seconds.borderWidth
        });

        layerSeconds = new Kinetic.Layer();
        layerSeconds.add(circleSeconds);
        secondsStage.add(layerSeconds);

    }

    function startCounters() { 
        if(flagPause) {
            clearInterval(interval);
            interval = null;
        }
        audio.play();
        interval = setInterval( function() {
            if (timer.seconds > time - 1) {
                var flagTimer = false;
		        clearTimeout(interval);
            } else {            
                timer.seconds++;
                if(flagBlic == false && timer.seconds > 50) {
		    val.css('color','red');
                    secval.css('color','red');
                }
            }
            if(!flagPause)
                audio.pause();
                layerSeconds.draw();
        }, 1000);
        // interval.pause();
    }

})(jQuery);
