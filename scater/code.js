document.addEventListener("DOMContentLoaded", function() {
    fetch('https://api.fda.gov/food/enforcement.json?search=classification.exact:Class%20II&limit=100')
        .then(response => response.json())
        .then(data => {
            const recalls = data.results;

            const stateCounts = recalls.reduce((acc, recall) => {
                acc[recall.state] = (acc[recall.state] || 0) + 1;
                return acc;
            }, {});

            const chartData = Object.keys(stateCounts).map(state => ({
                state,
                count: stateCounts[state]
            }));

            const margin = {top: 20, right: 30, bottom: 40, left: 40},
                  width = 960 - margin.left - margin.right,
                  height = 500 - margin.top - margin.bottom;

            const x = d3.scaleBand()
                        .domain(chartData.map(d => d.state))
                        .range([0, width])
                        .padding(0.1);

            const y = d3.scaleLinear()
                        .domain([0, d3.max(chartData, d => d.count)])
                        .nice()
                        .range([height, 0]);

            const svg = d3.select("#scatter-plot")
                          .attr("width", width + margin.left + margin.right)
                          .attr("height", height + margin.top + margin.bottom)
                          .append("g")
                          .attr("transform", `translate(${margin.left},${margin.top})`);

            svg.selectAll(".dot")
               .data(chartData)
               .enter().append("circle")
               .attr("class", "dot")
               .attr("cx", d => x(d.state) + x.bandwidth() / 2)
               .attr("cy", d => y(d.count))
               .attr("r", 5)
               .style("fill", "steelblue");

            svg.append("g")
               .attr("class", "x axis")
               .attr("transform", `translate(0,${height})`)
               .call(d3.axisBottom(x))
               .append("text")
               .attr("class", "axis-label")
               .attr("x", width / 2)
               .attr("y", margin.bottom - 10)
               .style("text-anchor", "middle")
               .text("State");

            svg.append("g")
               .attr("class", "y axis")
               .call(d3.axisLeft(y))
               .append("text")
               .attr("class", "axis-label")
               .attr("transform", "rotate(-90)")
               .attr("x", -height / 2)
               .attr("y", -margin.left + 10)
               .style("text-anchor", "middle")
               .text("Number of Recalls");
        })
        .catch(error => {
            console.error('Error fetching or parsing data:', error);
        });
});
