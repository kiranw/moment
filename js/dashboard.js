// breathingTargets.push({"time":time, "value":lastTime});
// breathingLatencies.push({"time":time, "value":timeDifference});
// breathingActuals.push({"time":time, "value":time});
// breathingType.push({"time":time, "value":lastType});
//

var latencies_data = [
    {"time": 1511192267452, "value": 3955},
    {"time": 1511192269637, "value": 4049},
    {"time": 1511192271581, "value": 4129},
    {"time": 1511192273785, "value": 4148},
    {"time": 1511192276000, "value": 4419},
    {"time": 1511192278417, "value": 4631},
    {"time": 1511192280586, "value": 4586},
    {"time": 1511192283013, "value": 4596},
    {"time": 1511192285264, "value": 4677},
    {"time": 1511192287807, "value": 4793},
    {"time": 1511192290031, "value": 4767},
    {"time": 1511192292419, "value": 4612},
    {"time": 1511192294748, "value": 4717},
    {"time": 1511192297272, "value": 4853},
    {"time": 1511192299638, "value": 4890},
    {"time": 1511192302234, "value": 4961},
    {"time": 1511192304789, "value": 5151},
    {"time": 1511192307006, "value": 4772},
    {"time": 1511192308503, "value": 3714},
    {"time": 1511192310979, "value": 3972}];

var inout = [{"time": 1511192259361, "value": "contract"},
    {"time": 1511192261624, "value": "expand"},
    {"time": 1511192263497, "value": "contract"},
    {"time": 1511192265587, "value": "expand"},
    {"time": 1511192267452, "value": "contract"},
    {"time": 1511192269637, "value": "expand"},
    {"time": 1511192271581, "value": "contract"},
    {"time": 1511192273785, "value": "expand"},
    {"time": 1511192276000, "value": "contract"},
    {"time": 1511192278417, "value": "expand"},
    {"time": 1511192280586, "value": "contract"},
    {"time": 1511192283013, "value": "expand"},
    {"time": 1511192285264, "value": "contract"},
    {"time": 1511192287807, "value": "expand"},
    {"time": 1511192290031, "value": "contract"},
    {"time": 1511192292419, "value": "expand"},
    {"time": 1511192294748, "value": "contract"},
    {"time": 1511192297272, "value": "expand"},
    {"time": 1511192299638, "value": "contract"},
    {"time": 1511192302234, "value": "expand"},
    {"time": 1511192304789, "value": "contract"},
    {"time": 1511192307006, "value": "expand"},
    {"time": 1511192308503, "value": "contract"},
    {"time": 1511192310979, "value": "expand"},
    {"time": 1511192313304, "value": "contract"}];

function startReview(){
    console.log("starting review");
    $("#todo-container").attr("class", "animate fadeOutLeft").hide();
    $("#environment-container").attr("class", "animate fadeInUp").hide();
    $("#therapy-container").attr("class", "animate fadeInUp").hide();
    $("#dashboard-container").show().attr("class", "animate fadeInUp");

    breathingChart(breathingType);
    latencyChart(breathingLatencies, breathingActuals);

}


function breathingChart(inout){
    inout.shift();
    inout.shift();
    var breathingData = [];
    inout.forEach(function(d){
        breathingData.push({"time":+d["time"], "value": d["value"] == "expand" ? 10 : 0});
    });

    var width = 1000;
    var height = 80;
    var marginLeft = 50;
    var marginBottom = 20;
    var breaths_svg = d3.select("#inout").append("svg").attr("height", height+marginBottom).attr("width", width).append("g").attr("transform","translate(50,50)");
    var formatTime = d3.timeFormat("%X");

    var minTime = d3.min(breathingData.map(function(d){ return +d["time"]; }));
    var maxTime = d3.max(breathingData.map(function(d){ return +d["time"]; }));


    var radialGradient = breaths_svg.append("defs")
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


    var xScale = d3.scaleLinear()
        .domain([minTime, maxTime])
        .range([0, width-50]);

    var yScale = d3.scaleLinear()
        .domain([0, 30]) // input
        .range([height-50, 0]); // output

    var line = d3.line()
        .x(function(d, i) { return xScale(d["time"]); }) // set the x values for the line generator
        .y(function(d) { return yScale(d["value"]); }) // set the y values for the line generator
        .curve(d3.curveMonotoneX);
    //
    // breaths_svg.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(0," + (height-marginBottom) + ")")
    //     .call(d3.axisBottom(xScale)
    //         .tickFormat(function(d){return formatTime(new Date(d)); })); // Create an axis component with d3.axisBottom

    // breaths_svg.append("g")
    //     .attr("class", "y axis")
    //     .attr("transform", "translate(" + 0 + ",0)")
    //     .call(d3.axisLeft(yScale)
    //         .ticks(0)); // Create an axis component with d3.axisLeft

    breaths_svg.append("path")
        .datum(breathingData) // 10. Binds data to the line
        .attr("class", "line") // Assign a class for styling
        .attr("d", line)
        .attr("stroke", "#b6c1aa")
        .attr("stroke-width", 1); // 11. Calls the line generator

    breaths_svg.selectAll(".dot")
        .data(breathingData)
        .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d, i) { return xScale(d["time"]) })
        .attr("cy", function(d) { return yScale(d["value"]) })
        .attr("r",  function(d, i){ return inout[i].value == "expand" ? 20 : 5; })
        .attr("fill", "#87ead4")
        .attr("opacity", 0.6);
}

function latencyChart(latencyData, actualData){
    latencyData.shift();
    actualData.shift();
    latencyData.shift();
    actualData.shift();

    var width = 1000;
    var height = 200;
    var marginLeft = 50;
    var marginBottom = 50;
    var breaths_svg = d3.select("#latencies").append("svg").attr("height", height+marginBottom).attr("width", width).append("g").attr("transform","translate(50,50)");
    var formatTime = d3.timeFormat("%X");

    var minTime = d3.min(latencyData.map(function(d){ return +d["time"]; }));
    var maxTime = d3.max(latencyData.map(function(d){ return +d["time"]; }));
    var minVal2 = d3.min(actualData.map(function(d){ return +d["value"]; }));
    var maxVal2 = d3.max(actualData.map(function(d){ return +d["value"]; }));
    var minVal = d3.min(latencyData.map(function(d){ return +d["value"]; }));
    var maxVal = d3.max(latencyData.map(function(d){ return +d["value"]; }));

    var minVal1 = Math.min(minVal, minVal2);
    var maxVal1 = Math.max(maxVal, maxVal2);

    var xScale = d3.scaleLinear()
        .domain([minTime, maxTime])
        .range([0, width-50]);

    var yScale = d3.scaleLinear()
        .domain([minVal1, maxVal1]) // input
        .range([height-50, 0]); // output

    console.log(latencyData.map(function(d){ return d.value; }));
    console.log(actualData.map(function(d){ return d.value; }));
    console.log(minVal, maxVal);
    console.log(minVal2, maxVal2);
    console.log(minVal1, maxVal1);
    console.log(latencyData.map(function(d){ return yScale(d.value); }));
    console.log(actualData.map(function(d){ return yScale(d.value); }));


    var line = d3.line()
        .x(function(d, i) { return xScale(d["time"]); }) // set the x values for the line generator
        .y(function(d) { return yScale(d["value"]); }) // set the y values for the line generator
        .curve(d3.curveMonotoneX);

    breaths_svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height-marginBottom) + ")")
        .call(d3.axisBottom(xScale)
            .tickFormat(function(d){return formatTime(new Date(d)); })); // Create an axis component with d3.axisBottom

    breaths_svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + 0 + ",0)")
        .call(d3.axisLeft(yScale)
            .ticks(10)
            .tickFormat(function(d){ return (d/1000) + "ms"})); // Create an axis component with d3.axisLeft

    breaths_svg.append("path")
        .datum(latencyData) // 10. Binds data to the line
        .attr("class", "line") // Assign a class for styling
        .attr("d", line)
        .attr("stroke", "#b6c1aa")
        .attr("stroke-width", 2); // 11. Calls the line generator

    breaths_svg.append("path")
        .datum(actualData) // 10. Binds data to the line
        .attr("class", "line") // Assign a class for styling
        .attr("d", line)
        .attr("stroke", "#87ead4")
        .attr("stroke-width", 2); // 11. Calls the line generator

    breaths_svg.selectAll(".dot")
        .data(latencyData)
        .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d, i) { return xScale(+d["time"]) })
        .attr("cy", function(d) { return yScale(+d["value"]) })
        .attr("r",  3)
        .attr("fill", function(d,i){ return Math.abs(actualData[i].value - latencyData[i].value) > 1000 ? "red" : "#e3d8c5"; });

    breaths_svg.selectAll(".dot2")
        .data(actualData)
        .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot2") // Assign a class for styling
        .attr("cx", function(d, i) { return xScale(+d["time"]) })
        .attr("cy", function(d) { return yScale(+d["value"]) })
        .attr("r",  3)
        .attr("fill", "#62c7b0");
}