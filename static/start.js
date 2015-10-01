$(document).ready(function() {
  window.onload = makevis();
});

function Max(array, key) {
  var big;
  for (var i=0; i<array.length; i++) {
    if (array[i][key] > big || !big) {
      big = array[i][key];
    }
  }
  return big;
}

function makevis() {
  console.log('make vis');
var data = [
  {i: 0, date: "9/2/2015",inches: 6.6},
  {i:1,date: "9/3/2015",inches: 2.7},
  {i:2,date: "9/4/2015", inches: 1.1},
  {i:3,date: "9/5/2015", inches: 0.9},
  {i:4,date: "9/6/2015", inches: 2.7},
  {i:5,date: "9/7/2015", inches:4.0},
  {i:6,date: "9/8/2015", inches: 5.4}];

  var bisectx = d3.bisector(function(d) { return d.i; }).left;
  var bisecty = d3.bisector(function(d) { return d.inches; }).left;

  var margin = {top: 30, right: 20, bottom: 30, left: 50},
      width = 600 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var xscale = d3.scale.linear()
            .domain([0, data.length])
            .range([0, width]);

  var yscale = d3.scale.linear()
            .domain([Max(data, 'inches'), 0])
            .range([height, 0]);

  var inverty = d3.scale.linear()
            .domain([height, 0])
            .range([Max(data, 'inches'), 0]);

  var invertx = d3.scale.linear()
            .domain([0, width])
            .range([0, data.length]);


  var xrange = d3.scale.linear()
              .range([0, width]);

  var yrange = d3.scale.linear()
                 .range([height, 0]);

  var xAxis = d3.svg.axis().scale(xrange)
      .orient("bottom").ticks(data.length);

  var yAxis = d3.svg.axis().scale(yrange)
      .orient("left").ticks(data.length);



  var svgContainer = d3.select('body').append('svg')
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

  var lineFunction = d3.svg.line()
                           .x(function(d) { 
                            console.log(d);
                            return xscale(d.i); })
                           .y(function(d) { return yscale(d.inches); })
                           .interpolate("linear");

  var focus = svgContainer.append("g")                                // **********
      .style("display", "none");

   focus.append("circle")                                 // **********
          .transition().duration(500)
          .attr("class", "tooltip")                                // **********
          .style("fill", "none")                             // **********
          .style("stroke", "blue")                           // **********
          .attr("r", 4);

    svgContainer.append("rect")
          .attr("width", width)
          .attr("height", height)
          .style("fill", "none")
          .style("pointer-events", "all")
          .on("mouseover", function() {
            mousemove
            focus.style("display", null); })
          .on("mouseout", function() { focus.style("display", "none"); })
          .on("mousemove", mousemove);

  //The line SVG Path we draw
  var lineGraph = svgContainer.append("path")
                              .attr("d", lineFunction(data))
                              .attr("stroke", "blue")
                              .attr("stroke-width", 2)
                              .attr("transform",
                                  "translate(" + margin.left + "," + margin.top + ")")
                              .attr("fill", "none");


    function mousemove() {
        var x1 = invertx(d3.mouse(this)[0]);
        var i = bisecty(data, x1, 1);
        var d1 = data[i];
        console.log('x1');
        console.log(x1);
        console.log('d1');
        console.log(d1);
        //find out if x is closer to i or i+1 and hightlight that data pt
        focus.select("circle.tooltip")
            .attr("transform",                             // **********
                  "translate(" + (margin.left+xscale(d1.i)) + "," +         // **********
                                 (yscale(d1.inches)+margin.top) + ")");        // **********
    }


   svgContainer.append("g")
        .attr("class", "x axis")
              .attr("transform",
              "translate(" + margin.left + "," + (height + margin.top) + ")")

        .call(xAxis);

    // Add the Y Axis
    svgContainer.append("g")
        .attr("class", "y axis")
              .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")")

        .call(yAxis);
}
