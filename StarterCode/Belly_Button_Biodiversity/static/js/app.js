function buildMetadata(sample) {
  // call and select
  var url = `/metadata/${sample}`
  d3.json(url).then(function(response) {
    console.log(response);
    var data = response;
    var metadata = d3.select("#sample-metadata");

    // clear html data from last call 
    metadata.html("");
    
    // create the list inside metadata table
    var row = metadata.append('ul');
    Object.entries(data).forEach(function([key,value]) {
      var cell = row.append('li');
      cell.text(`${key}: ${value}`);
    });
  });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}


function buildCharts(sample) {
  var url = `/samples/${sample}`
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(url).then((response) => {
    console.log(response)
    const otuIds = response.otu_ids;
    const sampleValues = response.sample_values;
    
    // Pie chart
    var pieChartData = [{
      values: sampleValues.slice(0,10),
      labels: otuIds.slice(0,10),
      type: 'pie'
    }]
    var pieLayout = {
      height: 600,
      width: 600
    };
    Plotly.newPlot("pie", pieChartData, pieLayout);

    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      mode: 'markers',
      marker: {
        color: otuIds,
        size: sampleValues
      }
    }]
    var layout = {
      showlegend: false,
      xaxis: {
        title: {
          text: "OTU IDs"
        }
      }
    }
    Plotly.newPlot("bubble", bubbleData, layout);
  })

  // @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).


  // @TODO: Build a Bubble Chart using the sample data
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
