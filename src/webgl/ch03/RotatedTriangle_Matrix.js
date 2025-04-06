var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_xformMatrix;\n' +
    '\n' +
    'void main() {\n' +
    '    gl_Position = u_xformMatrix * a_Position;\n' +
    '}';

var FSHADER_SOURCE =
    'precision mediump float;\n' +
    '\n' +
    'uniform vec4 u_FragColor;\n' +
    '\n' +
    'void main() {\n' +
    '    gl_FragColor = u_FragColor;\n' +
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
    //5. 开启attribute变量
    gl.enableVertexAttribArray(a_Position);

    return n;
}

const ANGLE = 70.0;

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

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    let u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
    // var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    let u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

    // canvas.onmousedown = function (ev) {
    //     click(ev, gl, canvas, a_Position, u_FragColor);
    // }
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    let radian = Math.PI * ANGLE / 180.0;
    let cosB = Math.cos(radian);
    let sinB = Math.sin(radian);

    let xformMatrix = new Float32Array([
        cosB, sinB, 0.0, 0.0,
        -sinB, cosB, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0,
    ]);

    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);
    // gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
    var position = new Float32Array([0.0, 0.0, 0.0, 1.0]);
    gl.vertexAttrib4fv(a_Position, position);
    // gl.vertexAttrib1f(a_PointSize, 10.0);

    gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
    // gl.drawArrays(gl.LINE_LOOP, 0, n);
}