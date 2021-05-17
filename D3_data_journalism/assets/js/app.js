let svgWidth = 960;
let svgHeight = 500;

let margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// SVG
let svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let chosenXAxis = "poverty";

function xScale(csvFile, chosenXAxis) {

    let xLinearScale = d3.scaleLinear()
        .domain([d3.min(csvFile, d => d[chosenXAxis]) * 0.8,
        d3.max(csvFile, d => d[chosenXAxis]) * 1.2
    ])
        .range([0, width]);

        return xLinearScale;
}


d3.csv("assets/data/data.csv").then(function(csvFile, err){

    if (err) throw err;

    csvFile.forEach(d => {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
       
    });
    let xLinearScale = xScale(csvFile, chosenXAxis);

    let yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(csvFile, d => d.healthcare)])
        .range([height, 0]);

    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);
    
    
    let xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);

    let circlesGroup = chartGroup.selectAll("circle")
        .data(csvFile)
        .enter()
        .append("circle")
        .classed("circles", true)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 14)
        .attr("fill", "indigo")
        .attr("opacity", "0.5")
        
    circlesGroup.select("#text")
            .data(csvFile)
            .enter()
            .append("text")
            // .attr("dy", "0.35em")
            .attr("x", d => xLinearScale(d[chosenXAxis]) - 5)
            .attr("y", d => yLinearScale(d.healthcare))
            .attr("stroke", "white")
            .style("font-size", "0.60em")
            .text(d => `${d.abbr}`)
        
    chartGroup.append("text")
        .attr("transform", `translate(${width/2}, ${height + 20})`)
        .attr("x", 0)
        .attr("y", 20)
        .text("Poverty (%)")

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 50 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .text("Healthcare (%)");

    


     
    
}).catch(function(error) {
    console.log(error);
});
