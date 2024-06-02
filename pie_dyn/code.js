document.addEventListener("DOMContentLoaded", function() {
    // Fetch recall data
    fetch('https://api.fda.gov/food/enforcement.json?search=&limit=100')
        .then(response => response.json())
        .then(data => {
            const recalls = data.results;

            // Create dropdown menu options
            const productTypes = Array.from(new Set(recalls.map(recall => recall.product_type))).sort();
            const select = d3.select("#product-type-select");
            select.selectAll("option")
                .data(productTypes)
                .enter().append("option")
                .text(d => d);

            // Initial product type
            const initialProductType = productTypes[0];

            // Update chart function
            const updateChart = (selectedProductType) => {
                const filteredRecalls = recalls.filter(recall => recall.product_type === selectedProductType);

                const classificationCounts = filteredRecalls.reduce((acc, recall) => {
                    acc[recall.classification] = (acc[recall.classification] || 0) + 1;
                    return acc;
                }, {});

                const chartData = Object.keys(classificationCounts).map(classification => ({
                    classification,
                    count: classificationCounts[classification]
                }));

                const svg = d3.select("#pie-chart");
                const width = +svg.attr("width");
                const height = +svg.attr("height");
                const radius = Math.min(width, height) / 2;
                const color = d3.scaleOrdinal(d3.schemeCategory10);

                // Clear previous chart
                svg.selectAll("*").remove();

                const g = svg.append("g")
                             .attr("transform", `translate(${width / 2},${height / 2})`);

                const pie = d3.pie()
                              .value(d => d.count);

                const path = d3.arc()
                               .outerRadius(radius - 10)
                               .innerRadius(0);

                const label = d3.arc()
                                .outerRadius(radius - 40)
                                .innerRadius(radius - 40);

                const arc = g.selectAll(".arc")
                             .data(pie(chartData))
                             .enter().append("g")
                             .attr("class", "arc");

                arc.append("path")
                   .attr("d", path)
                   .attr("fill", d => color(d.data.classification));

                arc.append("text")
                   .attr("transform", d => `translate(${label.centroid(d)})`)
                   .attr("dy", "0.35em")
                   .attr("class", "label")
                   .text(d => `${d.data.classification}: ${d.data.count}`);
            };

            // Initial chart
            updateChart(initialProductType);

            // Event listener for product type selection change
            select.on("change", function() {
                const selectedProductType = d3.select(this).property("value");
                updateChart(selectedProductType);
            });
        })
        .catch(error => {
            console.error('Error fetching or parsing data:', error);
        });
});
