function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
 
    //#sample-metadata is the id for the html element.
    d3.json(`/metadata/${sample}`).then((data) => {
    

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var metad = d3.select("#sample-metadata");
    console.log(metad);

    // Use `.html("") to clear any existing metadata
    metad.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      metad.append("h6").text(`${key}: ${value}`);
    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((data) => {
    var ids = data.otu_ids;
    var labels = data.otu_labels;
    var values = data.sample_values;
    // @TODO: Build a Bubble Chart using the sample data
    var trace = [
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: values,
          colorscale: "YIOrRd"
        }
      }
    ];

  var layout = {
    height: 900,
    width: 1300,
    hovermode: "closest",
    xaxis: { title: "OTU IDs"}
  };
  Plotly.plot("scatter", trace, layout);


    // @TODO: Build a Pie Chart
  var tracepie = [
    {
      values: values.slice(0,10),
      labels: ids.slice(0,10),
      hovertext: labels.slice(0,10),
      hoverinfo: "hovertext",
      type: "pie"
    }
  ];

  var layoutpie = {
    height: 600,
    width: 600
  };

  Plotly.plot("pie", tracepie, layoutpie);
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
});
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
