// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program

var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute float psize;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  gl_PointSize = psize;\n' +
    '}\n';


var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main() {\n' +
    '  gl_FragColor = u_FragColor;\n' +
    '}\n';

function main() {
    var canvas = document.getElementById('webgl');

    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

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

    canvas.onmousedown = function(ev){ click(ev, canvas, timer) };

    canvas.onmouseup = function(){ clickUp(gl, a_Position, u_FragColor, psize, timer) };

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = [];
var g_colors = [];
function click(ev, canvas, timer) {
    timer.time = Date.now();
    console.log(timer.time);

    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    // Store the coordinates to g_points array
    g_points.push([x, y]);
    console.log(x, y);

    var r = ((-.5*x)+.5)/2 + ((.5*y)+.5)/2;
    var g = ((.5*x)+.5)/2 + ((.5*y)+.5)/2;
    var b = ((.5*x)+.5)/2 + ((-.5*y)+.5)/2;
    var a = ((-.5*x)+.5)/2 + ((-.5*y)+.5)/2;

    // var r = ((-.62^x)-.62)/2 + ((.62^y)-.62)/2;
    // var g = ((.62^x)-.62)/2 + ((.62^y)-.62)/2;
    // var b = ((.62^x)-.62)/2 + ((-.62^y)-.62)/2;
    // var a = ((-.62^x)-.62)/2 + ((-.62^y)-.62)/2;

    console.log(r, g, b, a);

    g_colors.push([r, g, b, a]);
}

function clickUp(gl, a_Position, u_FragColor, psize, timer) {
    var duration = Date.now() - timer.time
    console.log(duration);
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_points.length;
    for(var i = 0; i < len; i++) {
        var xy = g_points[i];
        var rgba = g_colors[i];

        // Pass the position of a point to a_Position variable
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);

        gl.vertexAttrib1f(psize, duration/50.0);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Draw
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}