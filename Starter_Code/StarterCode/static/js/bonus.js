var data;
var selectedSubject;

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

// Gauge Chart
let selectedDataGauge = data.metadata.filter(metadata => metadata.id == selectedSubject)[0];
let washFrequency = selectedDataGauge.wfreq; // Assuming wfreq is the key for wash frequency

let traceGauge = {
    type: 'indicator',
    mode: 'gauge+number',
    value: washFrequency,
    title: { text: 'Belly Button Washing Frequency<br>Scrubs per Week' },
    gauge: {
        axis: { range: [0, 10],tickmode: "linear", tick0: 1, dtick: 1 },
        steps: [
            {range: [0, 1], color: "rgba(255, 255, 255, 0)"},
            {range: [1, 2], color: "rgba(232, 226, 202, .5)"},
            {range: [2, 3], color: "rgba(210, 206, 145, .5)"},
            {range: [3, 4], color:  "rgba(202, 209, 95, .5)"},
            {range: [4, 5], color:  "rgba(184, 205, 68, .5)"},
            {range: [5, 6], color: "rgba(170, 202, 42, .5)"},
            {range: [6, 7], color: "rgba(142, 178, 35 , .5)"},
            {range: [7, 8], color:  "rgba(110, 154, 22, .5)"},
            {range: [8, 9], color: "rgba(50, 143, 10, 0.5)"},
            {range: [9, 10], color: "rgba(14, 127, 0, .5)"}
],
        threshold: {
            line: { color: 'red', width: 4 },
            thickness: 0.75,
            value: washFrequency
}}};

let layoutGauge = { width: 400, height: 300, margin: { t: 0, b: 0 } };
Plotly.newPlot('gauge', [traceGauge], layoutGauge);

// Display Sample Metadata
displayMetadata(selectedDataGauge);
}
// Display Sample Metadata
let selectedMetadata = data.metadata.filter(metadata => metadata.id == selectedSubject)[0];
displayMetadata(selectedMetadata);

function displayMetadata(metadata) {
// Clear previous metadata
let metadataPanel = d3.select("#sample-metadata");
metadataPanel.html("");

// Display each key-value pair
Object.entries(metadata).forEach(([key, value]) => {
    metadataPanel.append("p").text(`${key}: ${value}`);
});
}