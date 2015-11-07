var SIZE = 500;
var MARGIN = 50;
var GRID_SIZE = 6;
var SPACING = (SIZE - 2 * MARGIN) / (GRID_SIZE - 1);

function clearStack(num)
{
	artisan.addToHistory(num, 0, 0, 'rectangle', [0, 0, SIZE, SIZE, '#fff']); 
	artisan.drawStack('scene', num, 0);
}

function clearLayer(snum, lnum)
{
	artisan.addToHistory(snum, lnum, 0, 'rectangle', [0, 0, SIZE, SIZE, '#fff']); 
	artisan.drawLayer('scene', snum, lnum, 0);
}

function drawGridNodes(stackNum, layerNum, _color)
{
	_color =  _color || '#ccc';

	for (var i=0; i<GRID_SIZE; i++) {
		for (var j=0; j<GRID_SIZE; j++) {
			artisan.addToHistory(stackNum, layerNum, 0, 'circle', [
				_gridToPixel(i), 
				_gridToPixel(j), 
				5, 
				_color]);
		}
	}

	artisan.drawLayer('scene', stackNum, layerNum, 0);
}

function drawBigNode(stackNum, layerNum, i, j, _radius, _color)
{
	var spacing = (SIZE - 2 * MARGIN) / (GRID_SIZE - 1)

	_radius = _radius || 10;
	_color =  _color || '#f00';

	artisan.addToHistory(stackNum, layerNum, 0, 'circle', [
		_gridToPixel(i), 
		_gridToPixel(j), 
		_radius, 
		_color]);
	artisan.drawLayer('scene', stackNum, layerNum, 0);
}

// points are in terms of grid
function drawMovement(stackNum, layerNum, pathArray)
{
	var pathArrInPixels = pathArray.map(function(x, i, arr){
		return [_gridToPixel(x[0]), _gridToPixel(x[1])];
	})

	artisan.addToHistory(stackNum, layerNum, 0, 'path', [pathArrInPixels, 2.0, '#aaaaaa', null]);
	artisan.drawLayer('scene', stackNum, layerNum, 0);
}

function _gridToPixel(i)
{
	return MARGIN + SPACING * i;
}
