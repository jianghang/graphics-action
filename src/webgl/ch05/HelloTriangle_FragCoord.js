var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    '\n' +
    'void main() {\n' +
    '    gl_Position = a_Position;\n' +
    '}';

var FSHADER_SOURCE =
    'precision mediump float;\n' +
    '\n' +
    'uniform float u_Width;\n' +
    'uniform float u_Height;\n' +
    '\n' +
    'void main() {\n' +
    '    gl_FragColor = vec4(gl_FragCoord.x / u_Width, 0.0, gl_FragCoord.y / u_Height, 1.0);\n' +
    '}';

function initVertexBuffers(gl) {
    let vertices = new Float32Array([
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ]);
    let n = 3;

    //1. 创建缓冲区对象
    let vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object!');
        return -1;
    }
    //2. 绑定缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //3. 将数据写入缓存区对象
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    //4. 将缓冲区对象分配给一个attribute变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    var u_Width = gl.getUniformLocation(gl.program, 'u_Width');
    if (!u_Width) {
        console.log('Failed to get the storage location of u_Width');
        return;
    }

    var u_Height = gl.getUniformLocation(gl.program, 'u_Height');
    if (!u_Height) {
        console.log('Failed to get the storage location of u_Height');
        return;
    }

    // Pass the width and hight of the <canvas>
    gl.uniform1f(u_Width, gl.drawingBufferWidth);
    gl.uniform1f(u_Height, gl.drawingBufferHeight);

    //5. 开启attribute变量
    gl.enableVertexAttribArray(a_Position);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return n;
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
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    var position = new Float32Array([0.0, 0.0, 0.0, 1.0]);
    gl.vertexAttrib4fv(a_Position, position);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
    // gl.drawArrays(gl.LINE_LOOP, 0, n);
}