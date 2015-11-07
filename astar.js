// Start Point, 
// End Point, 
	// Set of all nodes (implictly defined by size of grid)
	// Set of all edges, (implicity defined by lack of obstacle or wall edge)
// Set of all obstacle nodes
// Cost function to jump between neighbor nodes
// 

function _pq_enqueue(q, node, priority)
{
	q.push([node, priority]);
}

function _pq_dequeue(q)
{
	q.sort(function(a, b){
		return b[1] - a[1];
	});

	return q.shift()[0];
}


// node: [int, int]
function _adjacentNodes(node)
{
	var range = [-1, 0, 1];
	var adjList = [];

	for (var i=0; i<range.length; i++) {
		for (var j=0; j<range.length; j++) {
			if (range[i]==0 && range[j]==0) {
				continue;
			}

			adjList.push([node[0] + range[i], node[1] + range[j]])
		}
	}

	return adjList;
}

// node: [int, int]
// obstacles: [[int, int], ...]
// gridSize: int
function _accessibleNeighbors(node, obstacles, gridSize)
{
	var adjNodes = _adjacentNodes(node);
	
	var nodesInGrid = adjNodes.filter(function(element, index, array){
		if (element[0] < 0 || element[1] < 0) {
			return false;
		} else if (element[0] >= gridSize || element[1] >= gridSize) {
			return false;
		} else {
			return true;
		}
	});

	var obstacleTable = {};
	for (var i=0; i<obstacles.length; i++)
	{
		obstacleTable[obstacles[i]] = true;
	}

	var accessibleNodes = nodesInGrid.filter(function(element, index, array){
		// If node is not an obstacle the following will return true
		return !obstacleTable[element];
	});

	console.log(node, accessibleNodes);

	return accessibleNodes;
}


function _cost(a, b)
{
	return Math.sqrt(Math.pow((a[0]-b[0]), 2) + Math.pow((a[1]-b[1]), 2)) * 0.1;
}

function _heuristic(a, b)
{
	return Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]);
}


// start: [int, int]
// end: [int, int]
// obstacles: [[int, int], ...]
// gridSize: int
function astar(start, end, obstacles, gridSize, visited_callback)
{
	var frontier = [];
	_pq_enqueue(frontier, start, 0);
	
	var cameFrom = {};
	cameFrom[start] = null;

	var costSoFar = {};
	costSoFar[start] = 0;

	while (frontier.length > 0)
	{
		// unshift dequeue's element from array
		var curr = _pq_dequeue(frontier);
		
		if (visited_callback)
		{
			visited_callback(curr);
		}

		// console.log(curr.toString());

		if (curr.toString() == end.toString())
		{
			break;
		}

		var neighbors = _accessibleNeighbors(curr, obstacles, gridSize);
		for (var i=0; i<neighbors.length; i++)
		{
			var next = neighbors[i];
			var newCost = costSoFar[curr] + _cost(curr, next);
			if (!costSoFar[next] || newCost < costSoFar[next])
			{
				costSoFar[next] = newCost;
				var priority = newCost + _heuristic(end, next);
				_pq_enqueue(frontier, next, priority);
				cameFrom[next] = curr;
			}
		}
	}

	return ({
		'cameFrom': cameFrom,
		'costSoFar': costSoFar
	});
}

function graphicalAstar(start, end, obstacles, gridSize)
{
	// Draw Nodes
	drawGridNodes(0, 0);

	// Draw Start/End
	drawBigNode(0, 0, start[0], start[1], 10, '#00f');
	drawBigNode(0, 0, end[0], end[1], 10, '#0f0');

	// Draw Obstacles
	for (var i = 0; i < obstacles.length; i++) {
		var o = obstacles[i];
		drawBigNode(0, 0, o[0], o[1], 15, '#f00');		
	};

	var output = astar(start, end, obstacles, gridSize, function(n)
	{
		//drawBigNode(0, 0, n[0], n[1], 2, '#555');
	});
	console.log(output);

	var pathArr = [];
	var curr = end;

	while (curr != start)
	{
		pathArr.push(curr);
		curr = output['cameFrom'][curr];
	}
	pathArr.push(start);

	drawMovement(0, 0, pathArr);
}