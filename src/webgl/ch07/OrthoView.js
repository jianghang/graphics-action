var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_ProjMatrix;\n' +
    'varying vec4 v_Color;\n' +
    '\n' +
    'void main() {\n' +
    '    gl_Position = u_ProjMatrix * a_Position;\n' +
    // '    gl_Position = a_Position;\n' +
    '    v_Color = a_Color;\n' +
    '}';

var FSHADER_SOURCE =
    'precision mediump float;\n' +
    '\n' +
    'varying vec4 v_Color;\n' +
    '\n' +
    'void main() {\n' +
    '    gl_FragColor = v_Color;\n' +
    '}';

function main() {
    var canvas = document.getElementById("webgl");
    let nf = document.getElementById("nearFar");

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

    let u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
    let projMatrix = new Matrix4();

    document.onkeydown = function (ev) {
        keydown(ev, gl, n, u_ProjMatrix, projMatrix, nf);
    };
    draw(gl, n, u_ProjMatrix, projMatrix, nf);
}

let g_near = 0.0, g_far = 0.5;

function keydown(ev, gl, n, u_ProjMatrix, projMatrix, nf) {
    switch (ev.keyCode) {
        case 39:
            g_near += 0.01;
            break;
        case 37:
            g_near -= 0.01;
            break;
        case 38:
            g_far += 0.01;
            break;
        case 40:
            g_far -= 0.01;
            break;
        default:
            return;
    }
    draw(gl, n, u_ProjMatrix, projMatrix, nf);
}

function draw(gl, n, u_ProjMatrix, projMatrix, nf) {
    projMatrix.setOrtho(-1, 1, -1, 1, g_near, g_far);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    nf.innerHTML = 'near: ' + Math.round(g_near * 100) / 100 + ', far: ' + Math.round(g_far * 100) / 100;
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    let vertices = new Float32Array([
        0.0, 0.6, -0.4, 0.4, 1.0, 0.4,
        -0.6, -0.6, -0.4, 0.4, 1.0, 0.4,
        0.6, -0.6, -0.4, 1.0, 0.4, 0.4,

        0.5, 0.4, -0.2, 1.0, 0.4, 0.4,
        -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
        0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

        0.0, 0.5, 0.0, 0.4, 0.4, 1.0,
        -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
        0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
    ]);
    let n = 9;

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

    let FSIZE = vertices.BYTES_PER_ELEMENT;

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    //4. 将缓冲区对象分配给一个attribute变量
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);

    //5. 开启attribute变量
    gl.enableVertexAttribArray(a_Position);

    let a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    return n;
}