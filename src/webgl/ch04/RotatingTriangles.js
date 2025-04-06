var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    '\n' +
    'void main() {\n' +
    '    gl_Position = u_ModelMatrix * a_Position;\n' +
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
        0.0, 0.3,
        -0.3, -0.3,
        0.3, -0.3
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

const ANGLE_STEP = 45.0;
let g_last = Date.now();

function animate(angle) {
    let now = Date.now();
    let elapsed = now - g_last;
    g_last = now;
    let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    newAngle %= 360;
    return newAngle;
}

function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
    modelMatrix.setRotate(currentAngle, 0, 0, 1);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
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

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    let u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');

    let u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

    var position = new Float32Array([0.0, 0.0, 0.0, 1.0]);
    gl.vertexAttrib4fv(a_Position, position);

    gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);

    // canvas.onmousedown = function (ev) {
    //     click(ev, gl, canvas, a_Position, u_FragColor);
    // }
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    let currentAngle = 0.0;
    let modelMatrix = new Matrix4();

    let tick = function () {
        currentAngle = animate(currentAngle);
        draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
        requestAnimationFrame(tick);
    }
    tick();
}