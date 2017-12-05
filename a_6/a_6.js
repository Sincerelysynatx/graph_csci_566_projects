/**
 * Assignment 6: Create a virtual landscape that the user can wander around on.
 *      Place a rotating windmill on the ground, along with some buildings.
 *
 * @author Sean Pimentel
 * @date 12-05-17
 */

// Vertex shader for solid drawing
var SOLID_VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Normal;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'uniform mat4 u_NormalMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '   vec3 lightDirection = vec3(1.0, 1.0, 1.0);\n' +
    '   vec4 color = vec4(0.7, 0.4, 1.0, 1.0);\n' +
    '   gl_Position = u_MvpMatrix * a_Position;\n' +
    '   vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
    '   float nDotL = max(dot(normal, lightDirection), 0.0);\n' +
    '   vec3 ambient = vec3(0.2, 0.2, 0.2) + color.rgb * nDotL;\n' +
    '   v_Color = vec4(ambient , color.a);\n' +
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

var shouldRotate = false;
var spin = false;

function main(){
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    var solidProgram = createProgram(gl, SOLID_VSHADER_SOURCE,
        SOLID_FSHADER_SOURCE);
    var texProgram = createProgram(gl, TEXTURE_VSHADER_SOURCE,
        TEXTURE_FSHADER_SOURCE);
    if (!solidProgram || !texProgram) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Get storage locations of attribute and uniform variables in
    // program object for single color drawing
    solidProgram.a_Position = gl.getAttribLocation(solidProgram, 'a_Position');
    solidProgram.a_Normal = gl.getAttribLocation(solidProgram, 'a_Normal');
    solidProgram.a_Color = gl.getAttribLocation(solidProgram, 'a_Color');
    solidProgram.u_MvpMatrix = gl.getUniformLocation(solidProgram,
        'u_MvpMatrix');
    solidProgram.u_NormalMatrix = gl.getUniformLocation(solidProgram,
        'u_NormalMatrix');

    // Get storage locations of attribute and uniform variables
    // in program object for texture drawing
    texProgram.a_Position = gl.getAttribLocation(texProgram, 'a_Position');
    texProgram.a_TexCoord = gl.getAttribLocation(texProgram, 'a_TexCoord');
    texProgram.u_MvpMatrix = gl.getUniformLocation(texProgram, 'u_MvpMatrix');
    texProgram.u_Sampler = gl.getUniformLocation(texProgram, 'u_Sampler');

    if (solidProgram.a_Position < 0 || solidProgram.a_Normal < 0 ||
        !solidProgram.u_MvpMatrix ||
        !solidProgram.a_Color ||
        texProgram.a_Position < 0 || texProgram.a_TexCoord < 0 ||
        !texProgram.u_MvpMatrix || !texProgram.u_Sampler) {
        console.log('Failed to get the storage location of ' +
            'attribute or uniform variable');
        return;
    }

    var ground_block = initVertexBuffers(gl, 100.0);

    var block = initVertexBuffers(gl, 1.0);

    if (!ground_block){
        console.log('Failed to set the vertex information');
        return;
    }

    if (!block){
        console.log('Failed to set teh vertex information');
        return;
    }

    var texture = initTextures(gl, texProgram);
    if (!texture){
        console.log('Failed to intialize the texture.');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.019, 0.603, 0.956, 1.0);

    var camera = {
        dir: {
            x: 0.0
            ,z: -1.0
        }
        ,pos: {
            x: 0.0
            ,z: 1.0
        }
        ,angle: 270
    };

    var mvp = {
        viewMat: new Matrix4()
        ,projMat: new Matrix4()
        ,both: new Matrix4()
    };

    mvp.projMat.setPerspective(60.0, canvas.width/canvas.height, 1.0, 200.0);
    mvp.viewMat.setLookAt(camera.pos.x, 0.0, camera.pos.z, camera.pos.x +
        camera.dir.x, 0.0, camera.pos.z + camera.dir.z, 0.0, 1.0, 0.0);

    mvp.both.set(mvp.projMat);
    mvp.both.multiply(mvp.viewMat);

    document.onkeydown = function(e){ moveCamera(e, camera, mvp)};

    var ground = {
        scale: new Vector3([100.0, 0.2, 100.0])
        ,trans: new Vector3([0.0, -3.0, 0.0])
    };

    var building1 = {
        location: new Vector3([0.0, -2.0, -5.0])
        ,scale: new Vector3([0.5, 0.5, 0.5])
        ,trans: new Vector3([0.0, 0.0, 0.0])
        ,rot: new Vector3([0.0, 1.0, 0.0])
    };


    var rotation = 0.0;
    var tick = function () {
        // rotation = animate(rotation);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Draw ground
        drawTexCube(gl, texProgram, ground_block, texture, ground.trans,
            ground.scale, 0, mvp.both);

        for (var y = 0; y < 10; y++){
            for (var x = 0; x < 10; x++){
                var loc = {
                    location: new Vector3([0.0 + x, -2.0 + y, -5.0])
                }
                drawSolidCube(gl, solidProgram, block, loc.location,
                    building1.trans, building1.scale, building1.rot, 0, 0,
                    mvp.both, 0, 0);
            }
        }

        window.requestAnimationFrame(tick, canvas);
    };

    tick();
}

/**
 * Handles input and adjusts camera accordingly. Also toggles windmill
 * @param e
 * @param camera
 * @param mvp
 */
function moveCamera(e, camera, mvp) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
        camera.pos.x += camera.dir.x;
        camera.pos.z += camera.dir.z;
    }
    else if (e.keyCode == '40') {
        camera.pos.x -= camera.dir.x;
        camera.pos.z -= camera.dir.z;
        // down arrow
    }
    else if (e.keyCode == '37') {
        camera.angle -= 2;
        camera.angle %= 360;
        // left arrow
    }
    else if (e.keyCode == '39') {
        camera.angle += 2;
        camera.angle %= 360;
        // right arrow
    }
    else if (e.keyCode == '87') {
        shouldRotate = !shouldRotate;
    }
    else if (e.keyCode == '89') {
        spin = !spin;
    }

    camera.dir.x = Math.cos(camera.angle * Math.PI / 180);
    camera.dir.z = Math.sin(camera.angle * Math.PI / 180);

    mvp.viewMat.setLookAt(camera.pos.x, 0.0, camera.pos.z,
        camera.pos.x + camera.dir.x, 0.0, camera.pos.z + camera.dir.z,
        0.0, 1.0, 0.0);

    mvp.both.set(mvp.projMat);
    mvp.both.multiply(mvp.viewMat);
}

/**
 * Initializes cube buffers
 * @param gl
 * @param scale
 * @returns {*} cube object
 */
function initVertexBuffers(gl, scale){

    var verticies = new Float32Array([   // Vertex coordinates
        1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,
        1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
        1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,
        1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
        1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,
        -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,
        -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
        -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,
        -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
        1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,
        1.0, 1.0,-1.0     // v4-v7-v6-v5 back
    ]);

    var normals = new Float32Array([   // Normal
        0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,     // v0-v1-v2-v3 front
        1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,     // v0-v3-v4-v5 right
        0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,     // v0-v5-v6-v1 up
        -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,     // v1-v6-v7-v2 left
        0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,     // v7-v4-v3-v2 down
        0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0      // v4-v7-v6-v5 back
    ]);

    var texCoords = new Float32Array([   // Texture coordinates
        scale, scale,   0.0, scale,
        0.0, 0.0,   scale, 0.0,    // v0-v1-v2-v3 front
        0.0, scale,   0.0, 0.0,
        scale, 0.0,   scale, scale,    // v0-v3-v4-v5 right
        scale, 0.0,   scale, scale,
        0.0, scale,   0.0, 0.0,    // v0-v5-v6-v1 up
        scale, scale,   0.0, scale,
        0.0, 0.0,   scale, 0.0,    // v1-v6-v7-v2 left
        0.0, 0.0,   scale, 0.0,
        scale, scale,   0.0, scale,    // v7-v4-v3-v2 down
        0.0, 0.0,   scale, 0.0,
        scale, scale,   0.0, scale     // v4-v7-v6-v5 back
    ]);

    var colors = new Float32Array([     // Colors
        0.4, 0.4, 1.0,  0.4, 0.4, 1.0,
        0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
        0.4, 1.0, 0.4,  0.4, 1.0, 0.4,
        0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
        1.0, 0.4, 0.4,  1.0, 0.4, 0.4,
        1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
        1.0, 1.0, 0.4,  1.0, 1.0, 0.4,
        1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
        1.0, 1.0, 1.0,  1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
        0.4, 1.0, 1.0,  0.4, 1.0, 1.0,
        0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
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
    o.normalBuffer = initArrayBufferForLaterUse(gl, normals, 3, gl.FLOAT);
    o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
    o.colorBuffer = initArrayBufferForLaterUse(gl, colors, 3, gl.FLOAT);
    o.indexBuffer = initElementArrayBufferForLaterUse(gl,
        indices, gl.UNSIGNED_BYTE);
    if (!o.vertexBuffer || !o.normalBuffer || !o.texCoordBuffer ||
        !o.indexBuffer || !o.colorBuffer)
        return null;

    o.numIndices = indices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return o;
}

/**
 * Initializes textures
 * @param gl
 * @param program which program to initialize textures to
 * @returns {*} returns gl texture
 */
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
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
            gl.RGBA, gl.UNSIGNED_BYTE, image);

        // Pass the texure unit 0 to u_Sampler
        gl.useProgram(program);
        gl.uniform1i(program.u_Sampler, 0);

        gl.bindTexture(gl.TEXTURE_2D, null); // Unbind texture
    };

    image.src = 'resources/cobblestone.png';

    return texture;
}

/**
 * Sets up necessary attribute variables for drawing a solid colored cube
 * @param gl                webgl context
 * @param program           which shader program
 * @param o                 cube object
 * @param loc               target's location
 * @param trans             target's translation at location
 * @param scale             target's scale
 * @param rot               target's axis to rotate on
 * @param angle             target's angle to rotate by
 * @param zrot              windmill rotation around z
 * @param viewProjMatrix    View Projection Matrix
 * @param fanBlade          bool if cube is windmill blade
 * @param windmill          bool if cube is part of windmill
 */
function drawSolidCube(gl, program, o, loc, trans, scale, rot,
                       angle, zrot, viewProjMatrix, fanBlade, windmill){
    gl.useProgram(program);   // Tell that this program object is used

    if (!loc)
    {
        console.log('location not defined!');
    }


    // Assign the buffer objects and enable the assignment
    initAttributeVariable(gl, program.a_Position,
        o.vertexBuffer); // Vertex coordinates
    // initAttributeVariable(gl, program.a_Color, o.colorBuffer);
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);  // Bind indices
    initAttributeVariable(gl, program.a_Normal, o.normalBuffer);   // Normal
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);  // Bind indices

    if (windmill)
        drawCube2(gl, program, o, loc, trans, scale, rot,
            angle, zrot, viewProjMatrix, fanBlade);   // Draw
    else
        drawCubeBasic(gl, program, o, loc, trans,
            scale, rot, angle, viewProjMatrix);
}

/**
 * Used for drawing the ground or a textured cube
 * @param gl                web gl context
 * @param program           shader program
 * @param o                 cube object
 * @param texture           texture to apply
 * @param trans             target's translation at location
 * @param scale             target's scale
 * @param angle             target's angle to rotate by
 * @param viewProjMatrix    View Projection Matrix
 */
function drawTexCube(gl, program, o, texture, trans,
                     scale, angle, viewProjMatrix) {
    gl.useProgram(program);   // Tell that this program object is used

    // Assign the buffer objects and enable the assignment
    initAttributeVariable(gl, program.a_Position,
        o.vertexBuffer);  // Vertex coordinates
    initAttributeVariable(gl, program.a_TexCoord,
        o.texCoordBuffer);// Texture coordinates
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

/**
 * Used for drawing basic cubes not part of the windmill
 * @param gl                web gl context
 * @param program           shader program
 * @param o                 cube object
 * @param trans             target's translation at location
 * @param scale             target's scale
 * @param angle             target's angle to rotate by
 * @param viewProjMatrix    View Projection Matrix
 */
function drawCube(gl, program, o, trans, scale, angle, viewProjMatrix) {
    // Calculate a model matrix
    g_modelMatrix.setTranslate(trans.elements[0],
        trans.elements[1], trans.elements[2]);
    g_modelMatrix.rotate(angle, 0.0, 1.0, 0.0);
    g_modelMatrix.scale(scale.elements[0],
        scale.elements[1], scale.elements[2]);

    // Calculate model view projection matrix and pass it to u_MvpMatrix
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

    gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);  // Draw
}

/**
 * Used for drawing cube that's a part of windmill
 * @param gl                webgl context
 * @param program           which shader program
 * @param o                 cube object
 * @param loc               target's location
 * @param trans             target's translation at location
 * @param scale             target's scale
 * @param rot               target's axis to rotate on
 * @param angle             target's angle to rotate by
 * @param zrot              windmill rotation around z
 * @param viewProjMatrix    View Projection Matrix
 * @param fanBlade          bool if cube is windmill blade
 */
function drawCube2(gl, program, o, loc, trans, scale,
                   rot, angle, zrot, viewProjMatrix, fanBlade) {
    // Calculate a model matrix
    g_modelMatrix.setTranslate(loc.elements[0],
        loc.elements[1], loc.elements[2]);
    if (spin){
        g_modelMatrix.rotate(angle, rot.elements[0],
            rot.elements[1], rot.elements[2]);
    }
    g_modelMatrix.translate(trans.elements[0],
        trans.elements[1], trans.elements[2]);
    if (fanBlade){
        g_modelMatrix.translate(-trans.elements[0],
            -trans.elements[1] + 1.5, -trans.elements[2] );
        if(shouldRotate)
            g_modelMatrix.rotate(angle + zrot, 0.0, 0.0, 1.0);
        else
            g_modelMatrix.rotate(zrot, 0.0, 0.0, 1.0);
        g_modelMatrix.translate(trans.elements[0],
            trans.elements[1] - 2.125, trans.elements[2]);
    }
    g_modelMatrix.scale(scale.elements[0],
        scale.elements[1], scale.elements[2]);

    // Calculate model view projection matrix and pass it to u_MvpMatrix
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

    gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);  // Draw
}

/**
 * Used for drawing basic cubes ie buildings
 * @param gl                webgl context
 * @param program           which shader program
 * @param o                 cube object
 * @param loc               target's location
 * @param trans             target's translation at location
 * @param scale             target's scale
 * @param rot               target's axis to rotate on
 * @param angle             target's angle to rotate by
 * @param viewProjMatrix    View Projection Matrix
 */
function drawCubeBasic(gl, program, o, loc, trans,
                       scale, rot, angle, viewProjMatrix) {
    // Calculate a model matrix
    g_modelMatrix.setTranslate(loc.elements[0],
        loc.elements[1], loc.elements[2]);
    g_modelMatrix.rotate(angle, rot.elements[0],
        rot.elements[1], rot.elements[2]);
    g_modelMatrix.translate(trans.elements[0],
        trans.elements[1], trans.elements[2]);
    g_modelMatrix.scale(scale.elements[0],
        scale.elements[1], scale.elements[2]);

    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);

    // Calculate model view projection matrix and pass it to u_MvpMatrix
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

    gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);  // Draw
}

/**
 *
 * @param gl            Web gl context
 * @param a_attribute   shader attribute
 * @param buffer        buffer to apply attribute to
 */
function initAttributeVariable(gl, a_attribute, buffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);
}

/**
 * Initializing and creating array buffer
 * @param gl        Web gl context
 * @param data      data to buffer
 * @param num       buffer number
 * @param type      type used for later use
 * @returns {*}     buffer that was created
 */
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

/**
 * Initializing and creating an element buffer like for the indices
 * @param gl        webgl context
 * @param data      data to buffer
 * @param type      type used for later use
 * @returns {*}     buffer that was created
 */
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

/**
 * Caculate new angle for animation
 * @param angle angle used for animating
 */
var ANGLE_STEP = 30;
var last = Date.now();
function animate(angle){
    var now = Date.now();
    var elapsed = now - last;
    last = now;
    var newAngle = angle - (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle % 360;
}