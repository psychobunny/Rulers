Rulers JS is an HTML5 (canvas) based script that renders rulers on your canvas, similar to that found on PhotoShop or other drawing programs. A cursor is rendered on the gutter as well.

All code is MIT licensed: http://opensource.org/licenses/mit-license.php

Created by Andrew Rodrigues (psychobunny).


Usage
------

Include the script in your HTML document:

  <script src="rulers.js"></script>

Pass in a reference or ID (string) of the target canvas into the Rulers constructor:

  var rulers = new Rulers('myCanvas');

Render the canvas with the desired options:

  rulers.render('#aaa', 'pixels', 100);