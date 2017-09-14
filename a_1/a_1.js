/*
 * @author: Sean Pimentel
 * @date: 08/7/2017
 * @description: This program is supposed to simulate interpolation as well as
 * demonstrate varying point sizes.
 *
 */

/*
 * Vertex Shader Code
 * creating a position attribute and a pointer size attribute per vertex
 */
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute float psize;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  gl_PointSize = psize;\n' +
    '}\n';

/*
 * Fragment Shader Code
 * Setting up a uniform fragment shader variable that does not change
 */
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main() {\n' +
    '  gl_FragColor = u_FragColor;\n' +
    '}\n';

/*
 * Main loop to get gl contex, attributes and uniforms from shaders, set mouse
 * down and mouse up events, and clearing the canvas
 */
function main() {
    var canvas = document.getElementById('webgl');

    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initializing the shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Getting all the uniforms and attribute locations from the gpu.

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    var psize = gl.getAttribLocation(gl.program, 'psize');
    if (psize < 0){
        console.log('Failed to get the storage location of psize');
        return;
    }

    var timer = { time:0 };

    // Registering click events and binding them to functions

    canvas.onmousedown = function(ev){ click(ev, canvas, timer) };

    canvas.onmouseup = function(){ clickUp(gl,
                                            a_Position,
                                            u_FragColor,
                                            psize,
                                            timer) };

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}

// Global arrays used for referencing in different locations

var g_points = [];
var g_colors = [];
var g_psize = [];

/*
 * Function call for a mouse down event
 *
 * This function adds to the g_points and g_colors array for adding a point
  * to be rendered. Determines the location of the point in our viewing area.
 *
 * @param ev for event from mouse click
 * @param canvas element
 * @param timer for starting the time on mouse down
 */
function click(ev, canvas, timer) {
    timer.time = Date.now();

    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    // Store the coordinates to g_points array
    console.log(x, y);
    g_points.push([x, y]);

    var r = (2.83 - Math.sqrt(((-1.0 - x)^2) + ((1.0 - y)^2)))/2.83;
    var g = (2.83 - Math.sqrt(((1.0 - x)^2)+ ((1.0 - y)^2)))/2.83;
    var b = (2.83 - Math.sqrt(((1.0 - x)^2) + ((-1.0 - y)^2)))/2.83;
    var a = (2.83 - Math.sqrt(((-1.0 - x)^2) + ((-1.0 - y)^2)))/2.83;

    // var r = ((-.62^x)-.62)/2 + ((.62^y)-.62)/2;
    // var g = ((.62^x)-.62)/2 + ((.62^y)-.62)/2;
    // var b = ((.62^x)-.62)/2 + ((-.62^y)-.62)/2;
    // var a = ((-.62^x)-.62)/2 + ((-.62^y)-.62)/2;

    console.log(r, g, b, a);

    g_colors.push([r, g, b, a]);
}


/*
 * Function call for mouse up event
 *
 * This function sets the ending time for the timer and uses a simple
  * algorithm to determine the size of the point. Also this function is
   * responsible for rendering out the points to the canvas through the gl
    * context.
 *
 * @param gl context
 * @param a_Position identifier for the space in hardware to set a vertex
  * position
 * @param u_FragColor identifier for the space in hardware to set a fragment
  * color
 * @param psize identifier for the space in hardware to set a pixel size
 * @param timer used to finish a time stamp and determine how large the
  * pixel should be
 */
function clickUp(gl, a_Position, u_FragColor, psize, timer) {
    var duration = Date.now() - timer.time;
    console.log(duration);

    g_psize.push(duration/8);
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_points.length;
    for(var i = 0; i < len; i++) {
        var xy = g_points[i];
        var rgba = g_colors[i];
        var point_size = g_psize[i];

        // Pass the position of a point to a_Position variable
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        // Pass the pixel size of a point to psize variable
        gl.vertexAttrib1f(psize, point_size);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Draw
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}