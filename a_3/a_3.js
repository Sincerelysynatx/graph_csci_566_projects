// /**
//  * a_3.js
//  * @fileoverview Demonstrates different kinds of rendering while having user
//  * inputs. Not that creative, looking forward to the next project.
//  * @author Sean Pimentel
//  */
//
// "use strict";
//
// var scale = 1;
// /**
//  * main function
//  * @returns {number}
//  */
//
// function main() {
//     // vertex shader program
//     var VSHADER_SOURCE =
//         'attribute vec4 a_Position;\n' +
//         'uniform float u_xTranslate;\n' +
//         'uniform float u_yTranslate;\n' +
//         'void main() {\n' +
//         '  gl_Position = vec4(a_Position.x + u_xTranslate, a_Position.y + ' +
//         'u_yTranslate, a_Position.zw);\n' +
//         '}\n';
//
//     // fragment shader program
//     var FSHADER_SOURCE =
//         'precision mediump float;\n' +
//         'uniform vec4 u_Color;\n' +
//         'void main() {\n' +
//         '  gl_FragColor = u_Color;\n' +
//         '}\n';
//
//     // shader vars
//     var shaderVars = {
//         u_xTranslate:0,      // location of uniform for x translate in shader
//         u_yTranslate:0,      // location of uniform for y translate in shader
//         a_Position:0,        // location of attribute for position in shader
//         u_Color:0            // location of uniform for color in shader
//     };
//
//     // a triangle object
//     var quad_points = {
//         vertices:   new Float32Array([
//             -0.2,  0.2,
//             -0.2, -0.2,
//             0.2,  0.2,
//             0.2, -0.2
//         ]),
//         n: 4,
//         xTranslate: 0,
//         yTranslate: 0.7,
//         buffer: 0
//     };
//
//     // a quad object
//     var quad_line_strip = {
//         vertices:   new Float32Array([
//             -0.2,  0.2,
//             -0.2, -0.2,
//             0.2,  0.2,
//             0.2, -0.2
//         ]),
//         n: 4,
//         xTranslate: 0.5,
//         yTranslate: 0.5,
//         buffer: 0
//     };
//
//     var quad_line_loop = {
//         vertices:   new Float32Array([
//             -0.2,  0.2,
//             -0.2, -0.2,
//             0.2,  0.2,
//             0.2, -0.2
//         ]),
//         n: 4,
//         xTranslate: 0.5,
//         yTranslate: 0,
//         buffer: 0
//     };
//
//     var quad_lines = {
//         vertices:   new Float32Array([
//             -0.2,  0.2,
//             -0.2, -0.2,
//             0.2,  0.2,
//             0.2, -0.2
//         ]),
//         n: 4,
//         xTranslate: 0.5,
//         yTranslate: -0.5,
//         buffer: 0
//     };
//
//     var quad_triangle_strip = {
//         vertices:   new Float32Array([
//             -0.2,  0.2,
//             -0.2, -0.2,
//             0.2,  0.2,
//             0.2, -0.2
//         ]),
//         n: 4,
//         xTranslate: -0.5,
//         yTranslate: -0.5,
//         buffer: 0
//     };
//
//     var quad_triangle_fan = {
//         vertices:   new Float32Array([
//             -0.2,  0.2,
//             -0.2, -0.2,
//             0.2,  0.2,
//             0.2, -0.2
//         ]),
//         n: 4,
//         xTranslate: -0.5,
//         yTranslate: 0,
//         buffer: 0
//     };
//
//     var quad_triangles = {
//         vertices:   new Float32Array([
//             -0.2,  0.2,
//             -0.2, -0.2,
//             0.2,  0.2,
//             0.2, -0.2
//         ]),
//         n: 4,
//         xTranslate: -0.5,
//         yTranslate: 0.5,
//         buffer: 0
//     };
//
//     // get WebGL rendering context
//     var canvas = document.getElementById('webgl');
//     var gl = getWebGLContext(canvas);
//     if (!gl) {
//         console.log('Failed to get the rendering context for WebGL');
//         return;
//     }
//
//     // set up left button
//     var leftButton = document.getElementById('left');
//     var moveLeft = function(){
//         scale -= 0.1;
//         console.log(scale);
//         render(gl, shaderVars,  quad_points, quad_lines, quad_line_strip,
//             quad_line_loop, quad_triangles,
//             quad_triangle_fan, quad_triangle_strip);
//     }
//     leftButton.onclick = moveLeft;
//
//     // set up right button
//     var rightButton = document.getElementById('right');
//     var moveRight = function(){
//         scale += 0.1;
//         console.log(scale);
//         render(gl, shaderVars,  quad_points, quad_lines, quad_line_strip,
//             quad_line_loop, quad_triangles,
//             quad_triangle_fan, quad_triangle_strip);
//     }
//     rightButton.onclick = moveRight;
//
//     // set up shaders & locations of shader variables
//     if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
//         console.log('Failed to intialize shaders.');
//         return;
//     }
//     shaderVars.u_xTranslate = gl.getUniformLocation(gl.program, 'u_xTranslate');
//     if (!shaderVars.u_xTranslate) {
//         console.log('Failed to get the storage location of u_xformMatrix');
//         return;
//     }
//     shaderVars.u_yTranslate = gl.getUniformLocation(gl.program, 'u_yTranslate');
//     if (!shaderVars.u_yTranslate) {
//         console.log('Failed to get the storage location of u_yformMatrix');
//         return;
//     }
//     shaderVars.a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//     if (shaderVars.a_Position < 0) {
//         console.log('Failed to get the storage location of a_Position');
//         return -1;
//     }
//     shaderVars.u_Color = gl.getUniformLocation(gl.program, 'u_Color');
//     if (shaderVars.u_Color < 0) {
//         console.log('Failed to get the storage location of u_Color');
//         return -1;
//     }
//
//     // set up models
//     var n = initModels(gl, shaderVars, quad_points, quad_lines, quad_line_strip,
//         quad_line_loop, quad_triangles, quad_triangle_fan, quad_triangle_strip);
//     if (n < 0) {
//         console.log('Failed to initialize models');
//         return;
//     }
//
//     // draw first time - subsequent draws are event driven
//     render(gl, shaderVars,  quad_points, quad_lines, quad_line_strip,
//         quad_line_loop, quad_triangles, quad_triangle_fan, quad_triangle_strip);
// }
//
// /**
//  * render - renders the scene using WebGL
//  * @param {Object} gl - the WebGL rendering context
//  * @param {Object} shaderVars - the locations of shader variables
//  * @param {Object} quad_points - the triangle to be rendered
//  * @param {Object} quad_lines - the triangle to be rendered
//  * @param {Object} quad_line_strip - the triangle to be rendered
//  * @param {Object} quad_line_loop - the triangle to be rendered
//  * @param {Object} quad_triangles - the triangle to be rendered
//  * @param {Object} quad_triangle_fan - the triangle to be rendered
//  * @param {Object} quad_triangle_strip - the triangle to be rendered
//  */
// function render(gl, shaderVars, quad_points, quad_lines, quad_line_strip,
//                 quad_line_loop, quad_triangles,
//                 quad_triangle_fan, quad_triangle_strip) {
//
//     gl.clearColor(1, 1, 1, 1);
//
//     // clear the canvas
//     gl.clear(gl.COLOR_BUFFER_BIT);
//
//     // draw quad_points
//     gl.uniform4f(shaderVars.u_Color, 0, .3, .7, 1);
//     gl.uniform1f(shaderVars.u_xTranslate, quad_points.xTranslate * scale);
//     gl.uniform1f(shaderVars.u_yTranslate, quad_points.yTranslate * scale);
//     gl.bindBuffer(gl.ARRAY_BUFFER, quad_points.buffer);
//     gl.vertexAttribPointer(
//         shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
//     gl.drawArrays(gl.POINTS, 0, quad_points.n);
//
//     // draw quad_lines
//     gl.uniform4f(shaderVars.u_Color, 0, .4, .6, 1);
//     gl.uniform1f(shaderVars.u_xTranslate, quad_lines.xTranslate * scale);
//     gl.uniform1f(shaderVars.u_yTranslate, quad_lines.yTranslate * scale);
//     gl.bindBuffer(gl.ARRAY_BUFFER, quad_lines.buffer);
//     gl.vertexAttribPointer(
//         shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
//     gl.drawArrays(gl.LINES, 0, quad_lines.n);
//
//     // draw quad_line_strip
//     gl.uniform4f(shaderVars.u_Color, 0, .5, .5, 1);
//     gl.uniform1f(shaderVars.u_xTranslate, quad_line_strip.xTranslate * scale);
//     gl.uniform1f(shaderVars.u_yTranslate, quad_line_strip.yTranslate * scale);
//     gl.bindBuffer(gl.ARRAY_BUFFER, quad_line_strip.buffer);
//     gl.vertexAttribPointer(
//         shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
//     gl.drawArrays(gl.LINE_STRIP, 0, quad_line_strip.n);
//
//     // draw quad_line_loop
//     gl.uniform4f(shaderVars.u_Color, 0, .6, .4, 1);
//     gl.uniform1f(shaderVars.u_xTranslate, quad_line_loop.xTranslate * scale);
//     gl.uniform1f(shaderVars.u_yTranslate, quad_line_loop.yTranslate * scale);
//     gl.bindBuffer(gl.ARRAY_BUFFER, quad_line_loop.buffer);
//     gl.vertexAttribPointer(
//         shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
//     gl.drawArrays(gl.LINE_LOOP, 0, quad_line_loop.n);
//
//     // draw quad_triangles
//     gl.uniform4f(shaderVars.u_Color, 0, .7, .3, 1);
//     gl.uniform1f(shaderVars.u_xTranslate, quad_triangles.xTranslate * scale);
//     gl.uniform1f(shaderVars.u_yTranslate, quad_triangles.yTranslate * scale);
//     gl.bindBuffer(gl.ARRAY_BUFFER, z.buffer);
//     gl.vertexAttribPointer(
//         shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
//     gl.drawArrays(gl.TRIANGLES, 0, quad_triangles.n);
//
//     // draw quad_triangle_fan
//     gl.uniform4f(shaderVars.u_Color, 0, .8, .2, 1);
//     gl.uniform1f(shaderVars.u_xTranslate, quad_triangle_fan.xTranslate * scale);
//     gl.uniform1f(shaderVars.u_yTranslate, quad_triangle_fan.yTranslate * scale);
//     gl.bindBuffer(gl.ARRAY_BUFFER, quad_triangle_fan.buffer);
//     gl.vertexAttribPointer(
//         shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
//     gl.drawArrays(gl.TRIANGLE_FAN, 0, quad_triangle_fan.n);
//
//     // draw quad_triangle_strip
//     gl.uniform4f(shaderVars.u_Color, 0, .9, .1, 1);
//     gl.uniform1f(shaderVars.u_xTranslate,
//         quad_triangle_strip.xTranslate * scale);
//     gl.uniform1f(shaderVars.u_yTranslate,
//         quad_triangle_strip.yTranslate * scale);
//     gl.bindBuffer(gl.ARRAY_BUFFER, quad_triangle_strip.buffer);
//     gl.vertexAttribPointer(
//         shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
//     gl.drawArrays(gl.TRIANGLE_STRIP, 0, quad_triangle_strip.n);
//
// }
//
// /**
//  * initModels - initializes WebGL buffers for the the triangle & quad
//  * @param {Object} gl - the WebGL rendering context
//  * @param {Object} shaderVars - the locations of shader variables
//  * @param {Object} quad_points - the triangle to be rendered
//  * @param {Object} quad_lines - the quad to be rendered
//  * @param {Object} quad_line_strip - the quad to be rendered
//  * @param {Object} quad_line_loop - the quad to be rendered
//  * @param {Object} quad_triangles - the quad to be rendered
//  * @param {Object} quad_triangle_fan - the quad to be rendered
//  * @param {Object} quad_triangle_strip - the quad to be rendered
//  * @returns {Boolean}
//  */
// function initModels(gl, shaderVars, quad_points, quad_lines, quad_line_strip,
//                     quad_line_loop, quad_triangles,
//                     quad_triangle_fan, quad_triangle_strip) {
//
//     // set up the quad
//     quad_points.buffer = gl.createBuffer();
//     if (!quad_points.buffer) {
//         console.log('Failed to create buffer object for quad');
//         return false;
//     }
//     gl.bindBuffer(gl.ARRAY_BUFFER, quad_points.buffer);
//     gl.bufferData(gl.ARRAY_BUFFER, quad_points.vertices, gl.STATIC_DRAW);
//     gl.vertexAttribPointer(
//         shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttribArray(shaderVars.a_Position);
//
//     quad_lines.buffer = gl.createBuffer();
//     if (!quad_lines.buffer) {
//         console.log('Failed to create buffer object for quad');
//         return false;
//     }
//     gl.bindBuffer(gl.ARRAY_BUFFER, quad_lines.buffer);
//     gl.bufferData(gl.ARRAY_BUFFER, quad_lines.vertices, gl.STATIC_DRAW);
//     gl.vertexAttribPointer(
//         shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttribArray(shaderVars.a_Position);
//
//     quad_line_strip.buffer = gl.createBuffer();
//     if (!quad_line_strip.buffer) {
//         console.log('Failed to create buffer object for quad');
//         return false;
//     }
//     gl.bindBuffer(gl.ARRAY_BUFFER, quad_line_strip.buffer);
//     gl.bufferData(gl.ARRAY_BUFFER, quad_line_strip.vertices, gl.STATIC_DRAW);
//     gl.vertexAttribPointer(
//         shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttribArray(shaderVars.a_Position);
//
//     quad_line_loop.buffer = gl.createBuffer();
//     if (!quad_line_loop.buffer) {
//         console.log('Failed to create buffer object for quad');
//         return false;
//     }
//     gl.bindBuffer(gl.ARRAY_BUFFER, quad_line_loop.buffer);
//     gl.bufferData(gl.ARRAY_BUFFER, quad_line_loop.vertices, gl.STATIC_DRAW);
//     gl.vertexAttribPointer(
//         shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttribArray(shaderVars.a_Position);
//
//     quad_triangles.buffer = gl.createBuffer();
//     if (!quad_triangles.buffer) {
//         console.log('Failed to create buffer object for quad');
//         return false;
//     }
//     gl.bindBuffer(gl.ARRAY_BUFFER, quad_triangles.buffer);
//     gl.bufferData(gl.ARRAY_BUFFER, quad_triangles.vertices, gl.STATIC_DRAW);
//     gl.vertexAttribPointer(
//         shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttribArray(shaderVars.a_Position);
//
//     quad_triangle_fan.buffer = gl.createBuffer();
//     if (!quad_triangle_fan.buffer) {
//         console.log('Failed to create buffer object for quad');
//         return false;
//     }
//     gl.bindBuffer(gl.ARRAY_BUFFER, quad_triangle_fan.buffer);
//     gl.bufferData(gl.ARRAY_BUFFER, quad_triangle_fan.vertices, gl.STATIC_DRAW);
//     gl.vertexAttribPointer(
//         shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttribArray(shaderVars.a_Position);
//
//     quad_triangle_strip.buffer = gl.createBuffer();
//     if (!quad_triangle_strip.buffer) {
//         console.log('Failed to create buffer object for quad');
//         return false;
//     }
//     gl.bindBuffer(gl.ARRAY_BUFFER, quad_triangle_strip.buffer);
//     gl.bufferData(gl.ARRAY_BUFFER,
//         quad_triangle_strip.vertices, gl.STATIC_DRAW);
//     gl.vertexAttribPointer(
//         shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttribArray(shaderVars.a_Position);
//
//     return true;
// }