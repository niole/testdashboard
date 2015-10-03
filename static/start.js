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
  console.log(big);
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
  {i:6,date: "9/8/2015", inches: 5.4},
  {i:7,date: "9/3/2015",inches: 2.7},
  {i:8,date: "9/4/2015", inches: 1.1},
  {i:9,date: "9/5/2015", inches: 0.9},
  {i:10,date: "9/6/2015", inches: 2.7},
  {i:11,date: "9/7/2015", inches:4.0},
  {i:12,date: "9/8/2015", inches: 5.4},
  {i:13,date: "9/3/2015",inches: 2.7},
  {i:14,date: "9/4/2015", inches: 1.1}];



  var bisectx = d3.bisector(function(d) { return d.i; }).right;
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


  var yscalexis= d3.scale.linear()
            .domain([0,Max(data, 'inches')])
            .range([0,height]);

  var xAxis = d3.svg.axis().scale(xscale)
      .orient("bottom").ticks(data.length);

  var yAxis = d3.svg.axis().scale(yscalexis)
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

  focus.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");

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
          .on("mouseover", function(d) {
            mousemove
            focus.style("display", null)
                  .append('text',d.i);
            })
          .on("mouseout", function() { focus.style("display", "none"); })
          .on("mousemove", mousemove);

  //The line SVG Path we draw
  var lineGraph = svgContainer.append("path")
                              .attr("d", lineFunction(data))
                              .attr("stroke", "blue")
                              .attr("stroke-width", 1)
                              .attr("transform",
                                  "translate(" + margin.left + "," + margin.top + ")")
                              .attr("fill", "none");


    function mousemove() {
        var x0 = xscale.invert(d3.mouse(this)[0]);
        console.log(x0);
        var i = bisectx(data, x0, 1);
        var d0 = data[i - 1];
        var d1 = data[i];
        var d = x0 - d0.i > d1.i - x0 ? d1 : d0;
        focus
            .attr("transform",
                  "translate(" + (margin.left+xscale(d.i)) + "," +
                                 (yscale(d.inches)+margin.top) + ")");        // **********
        focus.select("text").text(d.inches);
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

        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("rainfall per day (in)");
}
