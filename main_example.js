var dataset = [10, 20, 30, 40, 50];
var dataset2 = [50, 60, 70, 80, 90, 100];
// like selections, but behave a little differently
var t = d3.transition().duration(3000).ease(d3.easeLinear)

var svg = d3.select('svg');

//adds data to circle objects
var circle = svg.selectAll('circle')
	.data(dataset) // makes a new selection
	.enter()
	.append('circle')
	//.transition(t) // how you sink transitions across different parts of update process
	.attr('cx', function(d) { return d * 2; }) // every call to attribute returns the previous selection
	.attr('cy', 50)
	.attr('r', 5)
	.attr('fill', 'red');

// binds dataset2 to existing circle
// call to .data creates new properties like enter and exit
// but until we use .enter or .append, we're not doing anything
var circleNewData = circle.data(dataset2, function(d) { d });

// don't alter .exit() or .enter()
// just allows us access to those properities
var exited = circleNewData.exit();

// we removed circles from the dom
var removed = circleNewData
	.exit()
	.transition(t)
	.attr('fill' , 'rgba(0, 0, 0, 0)')
	.remove();

// makes circleNewData enter with empty list with length 3
// but our group has 3 circles
circleNewData
	.enter()
	.append('circle') // append('circle') doesn't do anything because we have less slots (3 vs. 5)
	//.merge(circleNewData)
	.transition(t)
	.delay(function(d, i) {
		return (i + 1) * 1000
	})
	.attr('cx', function(d) { return d * 2; })
	.attr('cy', 50)
	.attr('r', 5)
	.attr('fill', 'red');

// or use merge (commented out above)
var updated = circleNewData
	.transition(t)
	.delay(function(d, i) {
		return (i + 1) * 1000
	})
	.attr('cx', function(d) { return d * 2 });




