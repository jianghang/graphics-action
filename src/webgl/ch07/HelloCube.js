var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'varying vec4 v_Color;\n' +
    '\n' +
    'void main() {\n' +
    '    gl_Position = u_MvpMatrix * a_Position;\n' +
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
    gl.enable(gl.DEPTH_TEST);

    let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');

    let viewMatrix = new Matrix4();
    let projMatrix = new Matrix4();
    let modelMatrix = new Matrix4();
    let mvpMatrix = new Matrix4();

    viewMatrix.setLookAt(3.0, 3.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
    projMatrix.setPerspective(30.0, 1.0, 1.0, 100.0);

    mvpMatrix.set(projMatrix).multiply(viewMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffers(gl) {
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    let verticesColors = new Float32Array([
        // Vertex coordinates and color
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0,  // v0 White
        -1.0, 1.0, 1.0, 1.0, 0.0, 1.0,  // v1 Magenta
        -1.0, -1.0, 1.0, 1.0, 0.0, 0.0,  // v2 Red
        1.0, -1.0, 1.0, 1.0, 1.0, 0.0,  // v3 Yellow
        1.0, -1.0, -1.0, 0.0, 1.0, 0.0,  // v4 Green
        1.0, 1.0, -1.0, 0.0, 1.0, 1.0,  // v5 Cyan
        -1.0, 1.0, -1.0, 0.0, 0.0, 1.0,  // v6 Blue
        -1.0, -1.0, -1.0, 0.0, 0.0, 0.0   // v7 Black
    ]);
    let indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,    // front
        0, 3, 4, 0, 4, 5,    // right
        0, 5, 6, 0, 6, 1,    // up
        1, 6, 7, 1, 7, 2,    // left
        7, 4, 3, 7, 3, 2,    // down
        4, 7, 6, 4, 6, 5     // back
    ]);

    //1. 创建缓冲区对象
    let vertexBuffer = gl.createBuffer();
    let indexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object!');
        return -1;
    }
    //2. 绑定缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //3. 将数据写入缓存区对象
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    let FSIZE = verticesColors.BYTES_PER_ELEMENT;

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    //4. 将缓冲区对象分配给一个attribute变量
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);

    //5. 开启attribute变量
    gl.enableVertexAttribArray(a_Position);

    let a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}