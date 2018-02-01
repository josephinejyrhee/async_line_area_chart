console.log('hello')

var margin = { top: 20, right: 20, bottom: 50, left: 50};
var width = 600 - margin.left - margin.right;
var height = 320 - margin.top - margin.bottom;

var svg = d3.select('body').append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)

// main svg group
var g = svg.append('g')
	.attr('transform', `translate(${margin.left}, ${margin.right})`); // another way of doing string concatenation (use back ticks)

var xScale = d3.scaleTime().range([0, width]);
var yScale = d3.scaleLinear().range([height, 0]);

var valueLine = d3.line()
	.x(function(d) { return xScale(d.t); })
	.y(function(d) { return yScale(d.v); })
	.curve(d3.curveBasis);

// set domain with API
// API expects some query parameters
// query parameters = ?..., but gets tedious, so use params
var baseURL = 'https://tidesandcurrents.noaa.gov/api/datagetter';

var params = {
	begin_date: '20171010', 	// hardcoded the begin and end date
	end_date: '20171011',
	interval: 'h',
	station: 9414290,
	product: 'predictions',
	datum: 'MSL',
	units: 'english',
	time_zone: 'lst',
	application: 'd3-tidal-chart',
	format: 'json',
};

// making params into query parameters
// concatenate params into one big string 'key=value&key2=value2& etc...'
var queryString = Object.keys(params) // just returns keys
	.reduce(function(str, key, idx, array) { //string, accumulator, interval, array
		str += key + '=' + params[key];
		if (idx !== array.length - 1){
			str += '&'
		}
		return str;
	}, '');

// ? indicates that we're using parameters
var queryURL = baseURL + '?' + queryString;

// parse time to correct format
var parseTime = d3.timeParse('%Y-%m-%d %H:%M');


// d3.csv is almost identical. the file is just in different formats
// csv is separated by commas, json is like an array of dictionaries
d3.json(queryURL, function(error, res) {
	if (error) throw error;
	console.log(res);
	var data = res.predictions.map(function(d){
		return {
			// v: +d.v,
			// shortcut to parse things typed as a string to thing it would be without strings
			v: parseFloat(d.v, 10), 	// or you could use java's parseInt
			t: parseTime(d.t),
		};

	});
	console.log(data);

	xScale.domain(d3.extent(data, function(d){ return d.t; }));
	yScale.domain(d3.extent(data, function(d){ return d.v; }));

	// drawing on svg
	g.append('path')
		.datum(data) 	// .datum takes entire array of data and binds it to a single thing 
						// .data will take each value in your array and bind it to things
		.attr('class', 'line')
		.attr('fill', 'none')
		.attr('stroke', 'steelblue')
		.attr('stroke-width', 2)
		.attr('d', valueLine);	// d = how to get your path


	// add x axis
	g.append('g')
		.attr('transform', `translate(0, ${height})`)
		.call(d3.axisBottom(xScale));

	// add y axis
	g.append('g')
		.call(d3.axisLeft(yScale));

	// how to make gridlines
	g.append('g')
		.attr('class', 'grid') // we have to add a class because we're using axes again
		.attr('transform', `translate(0, ${height})`)
		.call(
			d3.axisBottom(xScale)
			.tickSize(-height)
			.tickFormat('')	// pass in empty string because we don't want ticks to be formatted
 		);


 	g.append('g')
 		.attr('class', 'grid')
 		.call(
 			d3.axisLeft(yScale)
 			.ticks(5)
 			.tickSize(-width)
 			.tickFormat('')
 		);

});

// this is because of the async/event loop (refer to video in week 1)
console.log('this will finish before d3.json callback!')