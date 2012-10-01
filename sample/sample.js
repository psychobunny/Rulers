
var grid;

function init() {
	"use strict";
	/*global Ruler, document, window*/

	var canvas = document.getElementById('ruler'),
		ruler = new Ruler('ruler');

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	ruler.render('#aaa', 'pixels', 100);
}

window.onload = init;