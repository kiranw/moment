var breathsInit = 30; // breaths per minute
var breathsFinal = 7;

var rateInit = 60*1000/breathsInit;
var rateFinal = 60*1000/breathsFinal;

var currentRate = 2500;
var expandRadius = 220;
var contractRadius = 100;
var expandY = 300;
var contractY = 500;
var x = 700;
var lastExpandTime = new Date().getTime();
var lastContractTime = new Date().getTime();
var breathingOnTrack = 0;
var opacity = 1;

var startTime = 0;

var breathingLatencies = [];
var breathingTargets = [];
var breathingActuals = [];
var breathingType = [];


function setCurrentRate(){
    currentRate = startTime/300000 * rateFinal + (300000 - startTime)/300000 * rateInit;
    var rateDelay = 100;
    startTime = startTime + rateDelay;
    setTimeout(setCurrentRate, rateDelay);
}

var svg;
var radialGradient;
var radialGradient2;
var glowGradient;
var orbGlow;

// expandOrb();

function expandOrb(){
    lastExpandTime = new Date().getTime();

    orb.transition()
        .duration(currentRate)
        // .ease()
        .attr('r', expandRadius + Math.floor((Math.random() * 40) - 20 + 1))
        .attr("cy", expandY + Math.floor((Math.random() * 100) - 50 + 1))
        .attr("cx", x + Math.floor((Math.random() * 100) - 50 + 1))
        .attr("opacity", opacity)
        .transition()
        .duration(300)
        .attr("fill", "green")
        // .transition()
        // .duration(300)
        // .attr("fill", "url(#radial-gradient-2");
        // .on('end',contractOrb);
};

function contractOrb(){
    lastContractTime = new Date().getTime();

    orb.transition()
        .duration(currentRate)
        .attr('r', contractRadius + Math.floor((Math.random() * 40) - 20 + 1))
        .attr("cy", contractY + Math.floor((Math.random() * 100) - 50 + 1))
        .attr("cx", x + Math.floor((Math.random() * 100) - 50 + 1))
        .attr("opacity", opacity)
        // .on('end',expandOrb);
};


var expand = false;
// expandOrb();

function manageBreathing(){
    var timeDifference;
    var lastTime = 0;
    var lastType = "expand";
    var time = new Date().getTime();
    if (expand){
        timeDifference = time - lastExpandTime;
        lastTime = lastExpandTime;
    }
    else {
        timeDifference = time - lastContractTime;
        lastTime = lastContractTime;
        lastType = "contract";
    }
    breathingOnTrack = Math.abs(timeDifference - currentRate)/currentRate;

    breathingTargets.push({"time":time, "value":lastTime});
    breathingLatencies.push({"time":time, "value":Math.abs(timeDifference-currentRate)});
    breathingActuals.push({"time":time, "value":currentRate});
    breathingType.push({"time":time, "value":lastType});

    opacity = (1 - breathingOnTrack) < 0.2 ? 0.2 : 1 - breathingOnTrack;
    // console.log(breathingOnTrack);

    expand = !expand;
    $("#indicator").html(!expand ? "breathe in" : "breathe out");
    if (expand){
        contractOrb();
    }
    else{
        expandOrb();
    }
}

function startTherapy() {
    $("#todo-container").attr("class", "animate fadeOutLeft").hide();
    $("#environment-container").attr("class", "animate fadeOutLeft").hide();
    $("#therapy-container").attr("class", "animate fadeInUp").show();
    console.log("starting the therapy");

    var svg = d3.select("#orb").append("svg").attr("width",2000).attr("height",1000);

    var radialGradient = svg.append("defs")
        .append("radialGradient")
        .attr("id", "radial-gradient");

    radialGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "rgba(255,255,255,0.0)");

    radialGradient.append("stop")
        .attr("offset", "70%")
        .attr("stop-color", "rgba(255,255,255,0.35)");

    radialGradient.append("stop")
        .attr("offset", "90%")
        .attr("stop-color", "rgba(255,255,255,0.7)");

    radialGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "rgba(255,255,255,1)");


    var radialGradient2 = svg.append("defs2")
        .append("radialGradient2")
        .attr("id", "radial-gradient2");

    radialGradient2.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "rgba(70,140,20,0.0)");

    radialGradient2.append("stop")
        .attr("offset", "70%")
        .attr("stop-color", "rgba(70,140,20,0.35)");

    radialGradient2.append("stop")
        .attr("offset", "90%")
        .attr("stop-color", "rgba(70,140,20,0.7)");

    radialGradient2.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "rgba(70,140,20,1)");



    var glowGradient = svg.append("defs")
        .append("glowGradient")
        .attr("id", "glow-gradient");

    glowGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "rgba(255,255,255,1)");

    glowGradient.append("stop")
        .attr("offset", "70%")
        .attr("stop-color", "rgba(255,255,255,0.35)");

    glowGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "rgba(255,255,255,0.7)");

    orb = svg.append('circle')
        .attr("id", "orbsvg")
        .attr('cx', x)
        .attr('cy',250)
        .attr('r',150)
        .style("fill", "url(#radial-gradient)");

    orbGlow = svg.append('circle')
        .attr("id", "orbsvg2")
        .attr('cx', x)
        .attr('cy',250)
        .attr('r',400)
        .style("fill", "url(#glow-gradient)");


    setCurrentRate();
    document.body.onkeyup = function(e) {
        if (e.keyCode == 32) {
            manageBreathing();
            if (!started) {
                setBackground();
                started = true;
            }
        }

        if (e.keycode == 13){
        // Save data
        // Make visualization summary
            startReview();
        }
    };
}