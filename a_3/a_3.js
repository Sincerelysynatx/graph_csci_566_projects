/**
 * a_3.js
 * @fileoverview Demonstrates different kinds of rendering while having user
 * inputs. Not that creative, looking forward to the next project.
 * @author Sean Pimentel
 */

"use strict";

var game_over = false;
var score = 1;
var should_add = true;

var rope = {
    verticies: new Float32Array([
        0.05, 0.05
        ,-0.05, 0.05
        ,-0.05, -0.05
        ,0.05, -0.05
    ]),
    n: 4,
    buffer: 0,
    speed: 1,
    currentAngle: 0.0,
    modelMatrix: new Matrix4()
};

var player = {
    verticies: new Float32Array([
        0.1, 0.1
        ,-0.1, 0.1
        ,-0.1, -0.1
        ,0.1, -0.1
    ])
    ,n: 4
    ,buffer: 0
    ,jumping: false
    ,velocity: 0
    ,gravity: -0.0015
    ,jump_height: 0
    ,modelMatrix : new Matrix4()
};
// RotatingTranslatedTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'void main() {\n' +
    '   gl_Position = u_ModelMatrix * a_Position;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = u_Color;\n' +
    '}\n';

// Rotation angle (degrees/second)
var ANGLE_STEP = 60.0;

function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    window.onkeydown = function(e) {
        return !(e.keyCode == 32);
    };

    document.onkeyup = checkKey;
    function checkKey(e){
        e = e || window.event;
        if (e.keyCode == 32){
            jump();
        }
    }

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    var u_Color = gl.getUniformLocation(gl.program, 'u_Color');
    if (u_Color < 0) {
        console.log('Failed to get the storage location of u_Color');
        return -1;
    }

    // Create a buffer object
    rope.buffer = gl.createBuffer();
    if (!rope.buffer) {
        console.log('Failed to create the buffer object');
        return;
    }
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, rope.buffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, rope.verticies, gl.STATIC_DRAW);
    gl.vertexAttribPointer(
        a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);


    player.buffer = gl.createBuffer();
    if (!player.buffer){
        console.log('Failed to create the buffer object');
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, player.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, player.verticies, gl.STATIC_DRAW);
    gl.vertexAttribPointer(
        a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Specify the color for clearing <canvas>
    gl.clearColor(0, 0, 0, 1);

    // Get storage location of u_ModelMatrix
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    // Start drawing
    var tick = function() {
        if (!game_over){
            checkGameOver(rope, player);

            rope.currentAngle = animateRope(rope.currentAngle);  // Update the rotation angle

            if (player.jumping)
                animateJump(player);

            draw(gl, rope, player, u_ModelMatrix, u_Color, a_Position);   // Draw the triangle
            requestAnimationFrame(tick, canvas); // Request that the browser ?calls tick
        }
    };
    tick();
}

function draw(gl, rope, player, u_ModelMatrix, u_Color, a_Position) {
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);


    // Set the rotation matrix
    rope.modelMatrix.setRotate(rope.currentAngle, 0, 0, 1);
    rope.modelMatrix.translate(0.7, 0, 0);

    // Pass the rotation matrix to the vertex shader
    gl.uniformMatrix4fv(u_ModelMatrix, false, rope.modelMatrix.elements);
    gl.uniform4f(u_Color, 0, .3, .7, 1);
    gl.bindBuffer(gl.ARRAY_BUFFER, rope.buffer);
    gl.vertexAttribPointer(
        a_Position, 2, gl.FLOAT, false, 0, 0);

    // Draw the rope
    gl.drawArrays(gl.TRIANGLE_FAN, 0, rope.n);


    player.modelMatrix.setTranslate(0, -0.6 + player.jump_height, 0);

    gl.uniformMatrix4fv(u_ModelMatrix, false, player.modelMatrix.elements);
    gl.uniform4f(u_Color, 0, .6, .4, 1);
    gl.bindBuffer(gl.ARRAY_BUFFER, player.buffer);
    gl.vertexAttribPointer(
        a_Position, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, player.n);
}

// Last time that this function was called
var g_last = Date.now();
function animateRope(angle) {
    // Calculate the elapsed time
    var now = Date.now();
    var elapsed = now - g_last;
    g_last = now;
    // Update the current rotation angle (adjusted by the elapsed time)
    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    newAngle %= 360;
    ANGLE_STEP += 0.15;

    if (newAngle < 10 && newAngle > 0)
        should_add = true;

    if (!game_over && should_add && newAngle > 270) {
        $('#score').html(score++);
        should_add = false;
    }
    return newAngle;
}

function animateJump(player) {
    // Calculate the elapsed time
    var now = Date.now();
    g_last = now;

    var new_jump;
    if (player.jump_height >= 0){
        new_jump = player.jump_height + player.velocity;
        player.velocity += player.gravity;
        console.log(new_jump);
    } else {
        player.jumping = false;
        return 0;
    }

    player.jump_height = new_jump;
}

function checkGameOver(rope, player){
    if (rope.currentAngle > 255 && rope.currentAngle < 285 && player.jump_height < 0.05){
        game_over = true;
    }
}

function jump(){
    if (!player.jumping){
        player.jumping = true;
        player.velocity = .03;
        player.jump_height += player.velocity;
    }
}
