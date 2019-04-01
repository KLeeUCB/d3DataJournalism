// YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 700;

// Define the chart's margins as an object
var chartMargin = {
  top: 70,
  right: 70,
  bottom: 70,
  left: 70
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load & retrieve data from data.csv
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

d3.csv("./assets/data/data.csv").then(function(data, err) {
  if (err) throw err;
  console.log(data);
  
  // parse data
  data.forEach(function(d) {
      d.poverty = +d.poverty;
      d.healthcare = +d.healthcare;
    });

    // Create x scale function
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.poverty)*.8, d3.max(data, d => d.poverty)*1.2])
    .range([0, svgWidth]);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare)])
    .range([chartHeight, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);

  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);
  
  // append y axis
    chartGroup.append("g")
    .call(leftAxis);

    chartGroup.append("g")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - (chartMargin.left/2))
    .attr("x", 0- (chartHeight/2) )
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lacks Healthcare (%)");

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "lightblue")
    .attr("opacity", ".5")
    .classed("stateCircle", true);

  // Define the data for the circles + text
  var circleState = chartGroup.selectAll(".stateCircle text")
    .data(data)
    .enter()
    .append("text")
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    .attr("dy", d => yLinearScale(d[chosenYAxis]))
    .classed("stateText", true)
    .attr("font-size", parseInt(10*0.8))
    .text(d => d.abbr);
});