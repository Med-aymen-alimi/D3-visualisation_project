document.addEventListener("DOMContentLoaded", function() {
    const fetchDataAndRenderChart = (classification) => {
        fetch(`https://api.fda.gov/food/enforcement.json?search=classification.exact:${classification}&limit=100`)
            .then(response => response.json())
            .then(data => {
                const recalls = data.results;

                // Count recalls by state
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

                const svg = d3.select("#bar-chart")
                              .attr("width", width + margin.left + margin.right)
                              .attr("height", height + margin.top + margin.bottom)
                              .append("g")
                              .attr("transform", `translate(${margin.left},${margin.top})`);

                svg.selectAll(".bar")
                   .data(chartData)
                   .enter().append("rect")
                   .attr("class", "bar")
                   .attr("x", d => x(d.state))
                   .attr("y", d => y(d.count))
                   .attr("width", x.bandwidth())
                   .attr("height", d => height - y(d.count));

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
    };

    // Initial chart with default classification
    fetchDataAndRenderChart('Class II');

    // Event listener for classification selection change
    d3.select("#classification-select").on("change", function() {
        const selectedClassification = d3.select(this).property("value");
        d3.select("#bar-chart").selectAll("*").remove(); // Clear previous chart
        fetchDataAndRenderChart(selectedClassification);
    });
});
