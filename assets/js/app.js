//D3 Scatterplot
//Set graph size and margins
var svgWidth = 1160;
var svgHeight = 500;

var margin = {
    top: 40,
    bottom: 80,
    left: 50,
    right: 40
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Create the SVG wrapper, append an SVG group that will hold the chart, shift latter by left and top margins

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//Appending the group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Import and Parse the Data
d3.csv("assets/data/data.csv", function (d) {
    return {
        state: d.state,
        smokes: +d.smokes,
        income: +d.income,
        abbr: d.abbr
        
    };
}).then(function (allData) {

    //Parse data
    allData.forEach(function (data) {
        data.state = data.state;
        data.smokes = +data.smokes;
        data.income = +data.income;
        data.abbr = data.abbr;
                
    });

    //Create scale functions
    var xLinearScale = d3
        .scaleLinear()
        .domain([6, d3.max(allData, d => d.smokes)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([30000, d3.max(allData, d => d.income)])
        .range([height, 0]);

    //Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Append axes to chart
    // chartGroup.append("g")
    //     .attr("transform",`translate(0,${height})`)
    //     .call(bottomAxis)
    //     .call(leftAxis);
    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(leftAxis);
    svg.append("g")
        .attr(
            "transform",
            "translate(" + margin.left + "," + (height + margin.top) + ")"
        )
        .call(bottomAxis);


    //Create Circles
    var circleGroup = chartGroup
        .selectAll("circle")
        .data(allData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.smokes))
        .attr("cy", d => yLinearScale(d.income))
        .attr("r", "15")
        .attr('opacity', 'o.1')
        .style("fill", "blue");

    //Add state abbreviation
    chartGroup
        .selectAll('text.stateText')
        .data(allData)
        .enter()
        .append('text')
        .attr('class', 'stateText')
        .attr('x', d => xLinearScale(d.smokes))
        .attr('y', d => yLinearScale(d.income - .25))
        .text(d => d.abbr);
       

    //Create tooltip
    var toolTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([80, -60])
        .html(function (d) {
            return (`<b>${d.state}</b><br>Smokers: ${d.smokes} %<br>Income: $${d.income}`)
        });
    //add tooltip in chart
    circleGroup.call(toolTip)

    //Create event listens to display and hide the tooltip
    circleGroup
        .on("mouseover", function (d) {
            toolTip.show(d, this);
        })
        .on("mouseout", function (d) {
            toolTip.hide(d);
        });
               
    //Create axes labels
    chartGroup
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Income ($)")

    chartGroup
        .append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top - 10})`)
        .attr("class", "axisText")
        .text("Smokers (%)");
        
//open in vs code
//use  python -m http.server   to run
//run index.html with localhost:8000

});