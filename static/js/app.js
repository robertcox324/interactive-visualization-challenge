//initialize the selector for the test subjects and create charts/metadata defaulting to the first one
var selector = d3.select("#selDataset");
d3.json("samples.json").then((myData) => {
	// console.log(myData)
	myData.names.forEach((sample) => { //sample here is just the id basically, it will be different depending on which list other than names is selected
			selector.append("option")
			.text(sample)
			.property("value", sample);
		});
	createChart(myData.names[0])//pass in the id number to use
	getMetadata(myData.names[0]); //pass in the id number to use
});

function optionChanged(currentId){ //create a new chart/fill out metadata again whenever the option selector changes 
//the check for changing is in the html, which is why this function is named optionChanged specifically
	console.log("ID CHANGED TO "+ currentId)
	getMetadata(currentId);
	createChart(currentId)
}
	
function createChart(currentId){
d3.json("samples.json").then((myData) => { //have to be accessing the json to use it
		myData.samples.forEach((sample) => {
			if(sample.id === currentId){ //goes through the json and finds the right id
				console.log(sample.id + " is equivalent to " + currentId + " my dude!")
				
				var otuIdBar = []; //this is the y axis (for bar)
				var otuIdBubble = []; //different array for having the numbers as ints and not strings
				var sampleValue = []; //this is the x axis (for bar)
				var otuLabel = []; //these are the text value labels
				//have to check for the length of the array too so we don't try to access stuff that doesn't exist + scale the graph to the correct size
				for(i = 0; (i < 10)&&(i < sample.otu_ids.length); i++){ 
					otuIdBar.push("OTU " + sample.otu_ids[i].toString())
					otuIdBubble.push(sample.otu_ids[i])
					sampleValue.push(sample.sample_values[i])
					otuLabel.push(sample.otu_labels[i])
				}
				console.log(otuIdBar)
				var createBar = [{ //information to create the bar chart
					type: "bar",
					x: sampleValue.reverse(), //reverse to place the largest value at the top
					y: otuIdBar.reverse(),
					text: otuLabel,
					orientation: "h",
  				}];

				var createBubble = [{
					x: otuIdBubble,
					y: sampleValue,
					mode: 'markers',
					marker:{
						size: sampleValue,
						color: otuIdBubble,
					}
				}]
				var bubbleLayout = {
					title: 'Bubble Chart',
					height: 650,
					width: 650
				}
				Plotly.newPlot("bar", createBar); 
				Plotly.newPlot("bubble", createBubble, bubbleLayout);
			}	
		});
	});
}
function getMetadata(currentId){
	d3.json("samples.json").then((myData) => {
		myData.metadata.forEach((sample) => { //we want to go through metadata here
			if(sample.id.toString() === currentId){ //have to change sample.id to a string here, since every other location it is one but not here!
				//alternatively could have changed currentId to an int instead
				var metadataDiv = d3.select("#sample-metadata");
				metadataDiv.html("");//have to clear the html each time, or we'll just keep appending the metadata of every patient instead of switching
				Object.entries(sample).forEach(([key,value])=>{ //object.entries is used to return the key value pairs, what we want here
					var newRow = metadataDiv.append("p");
					newRow.text(`${key}: ${value}`);
				});
			}
		});
	});
}