var data;

// Use D3 to fetch the JSON data from the specified URL
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(response) {
    data = response;

// Populate dropdown with Test Subject IDs
let dropdown = d3.select("#selDataset");
data.names.forEach(function(name) {
    dropdown.append("option").text(name).property("value", name);
});

// Initialize the page with the first Test Subject ID
let initialSubject = data.names[0];
optionChanged(initialSubject);
});

function optionChanged(selectedSubject) {
// Bar Chart
let selectedDataBar = data.samples.filter(sample => sample.id === selectedSubject)[0];

let topValuesBar = selectedDataBar.sample_values.slice(0, 10).reverse();
let topLabelsBar = selectedDataBar.otu_ids.slice(0, 10).reverse().map(otu_id => `OTU ${otu_id}`);
let hoverTextBar = selectedDataBar.otu_labels.slice(0, 10).reverse();

let traceBar = {
    type: 'bar',
    x: topValuesBar,
    y: topLabelsBar,
    text: hoverTextBar,
    orientation: 'h'
};

let layoutBar = {
    title: `Top 10 OTUs for Subject ${selectedSubject}`,
    xaxis: { title: 'Sample Values' },
    yaxis: { title: 'OTU ID' }
};

Plotly.newPlot('bar', [traceBar], layoutBar);

// Bubble Chart
let selectedDataBubble = data.samples.filter(sample => sample.id === selectedSubject)[0];

let traceBubble = {
    type: 'scatter',
    mode: 'markers',
    x: selectedDataBubble.otu_ids,
    y: selectedDataBubble.sample_values,
    marker: {
        size: selectedDataBubble.sample_values,
        color: selectedDataBubble.otu_ids,
        colorscale: 'Viridis'
},
    text: selectedDataBubble.otu_labels
};

let layoutBubble = {
    title: `Bubble Chart for Subject ${selectedSubject}`,
    xaxis: { title: 'OTU ID' },
    yaxis: { title: 'Sample Values' }
};

    Plotly.newPlot('bubble', [traceBubble], layoutBubble);

// Display Sample Metadata
let selectedMetadata = data.metadata.filter(metadata => metadata.id == selectedSubject)[0];
displayMetadata(selectedMetadata);
}

function displayMetadata(metadata) {
// Clear previous metadata
let metadataPanel = d3.select("#sample-metadata");
metadataPanel.html("");

// Display each key-value pair
Object.entries(metadata).forEach(([key, value]) => {
    metadataPanel.append("p").text(`${key}: ${value}`);
});
}

