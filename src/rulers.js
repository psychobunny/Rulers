var Ruler;

(function () {
	"use strict";

	var MAJOR_INTERVAL_RATIO = 0.5,
		MINOR_INTERVAL_RATIO = 0.2,
		TICKS_PER_MAJOR_INTERVAL = 10,
		CURSOR_FPS = 48,
		GUTTER_SIZE = 15;

	Ruler = function (canvas) {
		/*global document, window, Blob, setInterval*/

		this.canvas = (canvas.getContext) ? canvas : document.getElementById(canvas);
		this.ctx = this.canvas.getContext('2d');

		this.cursor = document.createElement('canvas');
		this.cursor_ctx = this.cursor.getContext('2d');

		document.body.appendChild(this.cursor);
		this.cursor.width = this.canvas.width;
		this.cursor.height = this.canvas.height;

		this.cursor.className = this.canvas.className;

		this.cursor.style.zIndex = (this.canvas.style.zIndex + 1) || 1;
		this.cursor.x = this.cursor.currentX = 0;
		this.cursor.y = this.cursor.currentY = 0;

		var refreshCursor = setInterval(function () {
			if (this.cursor.y !== this.cursor.currentY) {
				this.cursor_ctx.clearRect(0, 0, GUTTER_SIZE, window.innerHeight);
				this.cursor_ctx.beginPath();
			    this.cursor_ctx.moveTo(0, this.cursor.y);
			    this.cursor_ctx.lineTo(GUTTER_SIZE, this.cursor.y);
			    this.cursor_ctx.stroke();
			    this.cursor.currentY = this.cursor.y;
			}

			if (this.cursor.x !== this.cursor.currentX) {
				this.cursor_ctx.clearRect(0, 0, window.innerWidth, GUTTER_SIZE);
				this.cursor_ctx.beginPath();
			    this.cursor_ctx.moveTo(this.cursor.x, 0);
			    this.cursor_ctx.lineTo(this.cursor.x, GUTTER_SIZE);
			    this.cursor_ctx.stroke();
			    this.cursor.currentX = this.cursor.x;
			}
		}.bind(this), 1000 / CURSOR_FPS);

		this.cursor.onmousemove = function (ev) {
			if (ev.clientX > GUTTER_SIZE) {
				this.cursor.x = ev.clientX;
			}
			if (ev.clientY > GUTTER_SIZE) {
				this.cursor.y = ev.clientY;
			}
		}.bind(this);

		function fillContextWithRuler(context, ruler, width, height) {
			var pattern_holder = document.createElement('canvas'),
				pattern_ctx = pattern_holder.getContext('2d');

			context.fillStyle = context.createPattern(ruler, 'repeat-x');
			context.fillRect(GUTTER_SIZE, 0, width, height);

			pattern_holder.width = width;
			pattern_holder.height = 100;

			pattern_ctx.translate(0, 0);
			pattern_ctx.scale(-1, 1);
			pattern_ctx.rotate(Math.PI / 4 * 2);
			pattern_ctx.drawImage(ruler, 0, 0);

			context.fillStyle = context.createPattern(pattern_holder, 'repeat-y');
			context.fillRect(0, GUTTER_SIZE, width, width);
		}

		function constructSVGData(color, units, major) {
			var majorHeight = parseInt(GUTTER_SIZE * MAJOR_INTERVAL_RATIO, 10),
				minorHeight = parseInt(GUTTER_SIZE * MINOR_INTERVAL_RATIO, 10),
				tickWidth = parseInt(major / 10, 10),
				html = "",
				i;

			for (i = 0; i < TICKS_PER_MAJOR_INTERVAL; i += 1) {
				html += "<div xmlns='http://www.w3.org/1999/xhtml' style='position: absolute; bottom: 0px; width: " + tickWidth + "px; border-bottom: 1px solid #555; border-left: 1px solid #999;  height: " + ((i % 5 === 0) ? majorHeight : minorHeight)  + "px; left: "  + i * tickWidth + "px'></div>";
			}

			// https://developer.mozilla.org/en-US/docs/HTML/Canvas/Drawing_DOM_objects_into_a_canvas
			return "<svg xmlns='http://www.w3.org/2000/svg' width='" + major + "' height='" + GUTTER_SIZE + "'><foreignObject width='100%' height='100%'>" + html + "</foreignObject></svg>";
		}

		this.render = function (color, units, major, width, height, options) {
			var svg, svgdata, ruler, url, DOMURL;

			options = options || {};

			this.ctx.fillStyle = options.backgroundColor || "#474747";
			this.ctx.strokeStyle = "#ffffff";
			this.cursor_ctx.strokeStyle = options.cursorColor || '#ffffff';

			this.ctx.fillRect(0, 0, this.canvas.width, GUTTER_SIZE);
			this.ctx.fillRect(0, 0, GUTTER_SIZE, this.canvas.height);

			svgdata = constructSVGData.apply(this, arguments);

			ruler = document.createElement('img');

			DOMURL = window.URL || window.webkitURL || window;

			ruler.onload = function () {
			    DOMURL.revokeObjectURL(url);
			    fillContextWithRuler(this.ctx, ruler, this.canvas.width, this.canvas.height);
			}.bind(this);

			svg = new Blob([svgdata], {
				type: "image/svg+xml;charset=utf-8"
			});

			url = DOMURL.createObjectURL(svg);
			ruler.src = url;
		};

		//window.onresize = this.render;
	};

}());
