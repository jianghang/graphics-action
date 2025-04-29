var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec2 a_TexCoord;\n' +
    'varying vec2 v_TexCoord;\n' +
    '\n' +
    'void main() {\n' +
    '    gl_Position = a_Position;\n' +
    '    v_TexCoord = a_TexCoord;\n' +
    '}';

var FSHADER_SOURCE =
    'precision mediump float;\n' +
    '\n' +
    'uniform sampler2D u_Sampler0;\n' +
    'uniform sampler2D u_Sampler1;\n' +
    'varying vec2 v_TexCoord;\n' +
    '\n' +
    'void main() {\n' +
    '    vec4 color0 = texture2D(u_Sampler0,v_TexCoord);\n' +
    '    vec4 color1 = texture2D(u_Sampler1,v_TexCoord);\n' +
    '    gl_FragColor = color0 * color1;\n' +
    '}';

function initVertexBuffers(gl) {
    let verticesTexCoords = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0
    ]);
    let n = 4;

    //1. 创建缓冲区对象
    let vertexTexCoordBuffer = gl.createBuffer();
    if (!vertexTexCoordBuffer) {
        console.log('Failed to create the buffer object!');
        return -1;
    }
    //2. 绑定缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    //3. 将数据写入缓存区对象
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    let FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    //4. 将缓冲区对象分配给一个attribute变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    //5. 开启attribute变量
    gl.enableVertexAttribArray(a_Position);

    let a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');

    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
}

let g_texUnit0 = false, gl_texUnit1 = false;

function loadTexture(gl, n, texture, u_Sampler, image, texUnit) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    if (texUnit === 0) {
        gl.activeTexture(gl.TEXTURE0);
        g_texUnit0 = true;
    } else {
        gl.activeTexture(gl.TEXTURE1);
        gl_texUnit1 = true
    }
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(u_Sampler, texUnit);

    gl.clear(gl.COLOR_BUFFER_BIT);

    if (g_texUnit0 && gl_texUnit1) {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    }
}

function initTextures(gl, n) {
    let texture0 = gl.createTexture();
    let texture1 = gl.createTexture();
    let u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    let u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');

    let image0 = new Image();
    let image1 = new Image();
    image0.onload = function () {
        loadTexture(gl, n, texture0, u_Sampler0, image0, 0);
    };
    image1.onload = function () {
        loadTexture(gl, n, texture1, u_Sampler1, image1, 1);
    }
    image0.src = '../../resources/redflower.jpg';
    image1.src = '../../resources/circle.gif';

    return true;
}

function main() {
    var canvas = document.getElementById("webgl");

    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }
    let n = initVertexBuffers(gl);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    if (!initTextures(gl, n)) {
        console.log('Failed to initialize texture.');
        return;
    }
}