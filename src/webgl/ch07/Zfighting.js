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

    let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');

    let viewMatrix = new Matrix4();
    let projMatrix = new Matrix4();
    let modelMatrix = new Matrix4();
    let mvpMatrix = new Matrix4();

    viewMatrix.setLookAt(0.0, 0.0, 5.0, 0.0, 0.0, -100.0, 0.0, 1.0, 0.0);
    projMatrix.setPerspective(30.0, canvas.width / canvas.height, 1.0, 100.0);
    // modelMatrix.setTranslate(0.75, 0.0, 0.0);

    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);

    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.POLYGON_OFFSET_FILL);

    gl.drawArrays(gl.TRIANGLES, 0, n / 2);

    // modelMatrix.setTranslate(-0.75, 0.0, 0.0);
    // mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    gl.polygonOffset(1.0, 1.0);
    gl.drawArrays(gl.TRIANGLES, n / 2, n / 2);
}

function initVertexBuffers(gl) {
    let vertices = new Float32Array([
        0.0,  2.5,  -5.0,  0.4,  1.0,  0.4, // The green triangle
        -2.5, -2.5,  -5.0,  0.4,  1.0,  0.4,
        2.5, -2.5,  -5.0,  1.0,  0.4,  0.4,

        0.0,  3.0,  -5.0,  1.0,  0.4,  0.4, // The yellow triagle
        -3.0, -3.0,  -5.0,  1.0,  1.0,  0.4,
        3.0, -3.0,  -5.0,  1.0,  1.0,  0.4,
    ]);
    let n = 6;

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