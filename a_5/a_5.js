// Vertex shader for solid drawing
var SOLID_VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '   gl_Position = u_MvpMatrix * a_Position;\n' +
    '}\n';

// Fragment shader for solid drawing
var SOLID_FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '   gl_FragColor = v_Color;\n' +
    '}\n';

// Vertex shader for texture drawing
var TEXTURE_VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec2 a_TexCoord;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    '   gl_Position = u_MvpMatrix * a_Position;\n' +
    '   v_TexCoord = a_TexCoord;\n' +
    '}\n';

// Fragment shader for texture drawing
var TEXTURE_FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'uniform sampler2D u_Sampler;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    '   vec4 color = texture2D(u_Sampler, v_TexCoord);\n' +
    '   gl_FragColor = vec4(color.rgba);\n' +
    '}\n';


function main(){
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    var solidProgram = createProgram(gl, SOLID_VSHADER_SOURCE, SOLID_FSHADER_SOURCE);
    var texProgram = createProgram(gl, TEXTURE_VSHADER_SOURCE, TEXTURE_FSHADER_SOURCE);
    if (!solidProgram || !texProgram) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Get storage locations of attribute and uniform variables in program object for single color drawing
    solidProgram.a_Position = gl.getAttribLocation(solidProgram, 'a_Position');
    solidProgram.u_MvpMatrix = gl.getUniformLocation(solidProgram, 'u_MvpMatrix');

    // Get storage locations of attribute and uniform variables in program object for texture drawing
    texProgram.a_Position = gl.getAttribLocation(texProgram, 'a_Position');
    texProgram.a_TexCoord = gl.getAttribLocation(texProgram, 'a_TexCoord');
    texProgram.u_MvpMatrix = gl.getUniformLocation(texProgram, 'u_MvpMatrix');
    texProgram.u_Sampler = gl.getUniformLocation(texProgram, 'u_Sampler');

    if (solidProgram.a_Position < 0 || !solidProgram.u_MvpMatrix ||
        texProgram.a_Position < 0 || texProgram.a_TexCoord < 0 ||
        !texProgram.u_MvpMatrix || !texProgram.u_Sampler) {
        console.log('Failed to get the storage location of attribute or uniform variable');
        return;
    }

    var ground_block = initVertexBuffers(gl, 100.0);

    if (!ground_block){
        console.log('Failed to set the vertex information');
        return;
    }

    var texture = initTextures(gl, texProgram);
    if (!texture){
        console.log('Failed to intialize the texture.');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(60.0, canvas.width/canvas.height, 1.0, 100.0);
    viewProjMatrix.lookAt(0.0, 0.0, 10.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    var cube1 = {
         scale: new Vector3([2.0, 1.0, 1.0])
        ,trans: new Vector3([-2.0, 0.0, 0.0])
    };

    var ground = {
         scale: new Vector3([100.0, 0.2, 100.0])
        ,trans: new Vector3([0.0, -3.0, 0.0])
    };

    // var ground = {
    //     scale: new Vector3([10.0, 10.0, 1.0])
    //     ,trans: new Vector3([0.0, 0.0, 5.0])
    // };

    var windmillRotation = 0.0;
    var tick = function () {
        windmillRotation = animate(windmillRotation);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // console.log(cube1.trans);

        // drawSolidCube(gl, solidProgram, cube, cube1.trans, cube1.scale, windmillRotation, viewProjMatrix);
        drawTexCube(gl, texProgram, ground_block, texture, ground.trans, ground.scale, 0, viewProjMatrix);
        // drawSolidCube(gl, solidProgram, cube, -2.0, windmillRotation, viewProjMatrix);
        // drawTexCube(gl, texProgram, cube, texture, 2.0, windmillRotation, viewProjMatrix);

        window.requestAnimationFrame(tick, canvas);
    };

    tick();
}

function initVertexBuffers(gl, scale){
    // var verticies = new Float32Array ([
    //     -0.5, 0.5, 0.5,
    //     -0.5, -0.5, 0.5,
    //     0.5, -0.5, 0.5,
    //     -0.5, 0.5, 0.5,
    //     0.5, -0.5, 0.5,
    //     0.5, 0.5, 0.5,
    //     0.5, 0.5, 0.5,
    //     0.5, -0.5, 0.5,
    //     0.5, -0.5, -0.5,
    //     0.5, 0.5, 0.5,
    //     0.5, -0.5, -0.5,
    //     0.5, 0.5, -0.5,
    //     0.5, -0.5, 0.5,
    //     -0.5, -0.5, 0.5,
    //     -0.5, -0.5, -0.5,
    //     0.5, -0.5, 0.5,
    //     -0.5, -0.5, -0.5,
    //     0.5, -0.5, -0.5,
    //     0.5, 0.5, -0.5,
    //     -0.5, 0.5, -0.5,
    //     -0.5, 0.5, 0.5,
    //     0.5, 0.5, -0.5,
    //     -0.5, 0.5, 0.5,
    //     0.5, 0.5, 0.5,
    //     -0.5, -0.5, -0.5,
    //     -0.5, 0.5, -0.5,
    //     0.5, 0.5, -0.5,
    //     -0.5, -0.5, -0.5,
    //     0.5, 0.5, -0.5,
    //     0.5, -0.5, -0.5,
    //     -0.5, 0.5, -0.5,
    //     -0.5, -0.5, -0.5,
    //     -0.5, -0.5, 0.5,
    //     -0.5, 0.5, -0.5,
    //     -0.5, -0.5, 0.5,
    //     -0.5, 0.5, 0.5
    // ]);

    var verticies = new Float32Array([   // Vertex coordinates
        1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
        1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
        1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
        -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
        1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
    ]);

    var texCoords = new Float32Array([   // Texture coordinates
        scale, scale,   0.0, scale,   0.0, 0.0,   scale, 0.0,    // v0-v1-v2-v3 front
        0.0, scale,   0.0, 0.0,   scale, 0.0,   scale, scale,    // v0-v3-v4-v5 right
        scale, 0.0,   scale, scale,   0.0, scale,   0.0, 0.0,    // v0-v5-v6-v1 up
        scale, scale,   0.0, scale,   0.0, 0.0,   scale, 0.0,    // v1-v6-v7-v2 left
        0.0, 0.0,   scale, 0.0,   scale, scale,   0.0, scale,    // v7-v4-v3-v2 down
        0.0, 0.0,   scale, 0.0,   scale, scale,   0.0, scale     // v4-v7-v6-v5 back
    ]);

    var indices = new Uint8Array([        // Indices of the vertices
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
        12,13,14,  12,14,15,    // left
        16,17,18,  16,18,19,    // down
        20,21,22,  20,22,23     // back
    ]);

    // Utilize Object to to return multiple buffer objects together
    var o = new Object();
    o.vertexBuffer = initArrayBufferForLaterUse(gl, verticies, 3, gl.FLOAT);
    o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
    o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
    if (!o.vertexBuffer || !o.texCoordBuffer || !o.indexBuffer)
        return null;

    o.numIndices = indices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return o;
}

function initTextures(gl, program){
    var texture = gl.createTexture();
    if (!texture){
        console.log('Failed to create the texture object');
        return null;
    }

    var image = new Image();
    if (!image){
        console.log('Failed to create the image object');
        return null;
    }

    image.onload = function(){
        // Write the image data to texture object
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image Y coordinate
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        // Pass the texure unit 0 to u_Sampler
        gl.useProgram(program);
        gl.uniform1i(program.u_Sampler, 0);

        gl.bindTexture(gl.TEXTURE_2D, null); // Unbind texture
    };

    image.src = 'resources/cobblestone.png';

    return texture;
}

function drawSolidCube(gl, program, o, trans, scale, angle, viewProjMatrix){
    gl.useProgram(program);   // Tell that this program object is used

    // Assign the buffer objects and enable the assignment
    initAttributeVariable(gl, program.a_Position, o.vertexBuffer); // Vertex coordinates
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);  // Bind indices

    drawCube(gl, program, o, trans, scale, angle, viewProjMatrix);   // Draw
}

function drawTexCube(gl, program, o, texture, trans, scale, angle, viewProjMatrix) {
    gl.useProgram(program);   // Tell that this program object is used

    // Assign the buffer objects and enable the assignment
    initAttributeVariable(gl, program.a_Position, o.vertexBuffer);  // Vertex coordinates
    initAttributeVariable(gl, program.a_TexCoord, o.texCoordBuffer);// Texture coordinates
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer); // Bind indices

    // Bind texture object to texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    drawCube(gl, program, o, trans, scale, angle, viewProjMatrix); // Draw
}

// Coordinate transformation matrix
var g_modelMatrix = new Matrix4();
var g_mvpMatrix = new Matrix4();
var g_normalMatrix = new Matrix4();

function drawCube(gl, program, o, trans, scale, angle, viewProjMatrix) {
    // Calculate a model matrix
    g_modelMatrix.setTranslate(trans.elements[0], trans.elements[1], trans.elements[2]);
    // g_modelMatrix.setTranslate(x, 0.0, 0.0);
    // g_modelMatrix.rotate(20.0, 1.0, 0.0, 0.0);
    g_modelMatrix.rotate(angle, 0.0, 1.0, 0.0);
    g_modelMatrix.scale(scale.elements[0], scale.elements[1], scale.elements[2]);

    // Calculate transformation matrix for normals and pass it to u_NormalMatrix
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);

    // Calculate model view projection matrix and pass it to u_MvpMatrix
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

    gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);   // Draw
}

function initAttributeVariable(gl, a_attribute, buffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);
}

function initArrayBufferForLaterUse(gl, data, num, type){
    var buffer = gl.createBuffer();

    if (!buffer) {
        console.log('Failed to create the buffer object');
        return null;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    buffer.num = num;
    buffer.type = type;

    return buffer;
}

function initElementArrayBufferForLaterUse(gl, data, type){
    var buffer = gl.createBuffer();
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return null;
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

    buffer.type = type;

    return buffer;
}

var ANGLE_STEP = 30;
var last = Date.now();
function animate(angle){
    var now = Date.now();
    var elapsed = now - last;
    last = now;
    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle % 360;
}