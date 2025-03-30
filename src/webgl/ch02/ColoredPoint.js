var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    '\n' +
    'void main() {\n' +
    '    gl_Position = a_Position;\n' +
    '    gl_PointSize = a_PointSize;\n' +
    '}';

var FSHADER_SOURCE =
    'void main() {\n' +
    '    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
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
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');

    canvas.onmousedown = function (ev) {
        click(ev, gl, canvas, a_Position);
    }
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
    // var position = new Float32Array([0.0, 0.0, 0.0, 1.0]);
    // gl.vertexAttrib4fv(a_Position, position);
    gl.vertexAttrib1f(a_PointSize, 10.0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // gl.drawArrays(gl.POINTS, 0, 1);
}

const g_points = [];

function click(ev, gl, canvas, a_Position) {
    let x = ev.clientX;
    let y = ev.clientY;
    let rect = ev.target.getBoundingClientRect();
    console.log("rect.left: " + rect.left + " ,rect.top: " + rect.top);
    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
    g_points.push([x, y]);

    gl.clear(gl.COLOR_BUFFER_BIT);

    let len = g_points.length;
    for (let i = 0; i < len; i += 1) {
        let xy = g_points[i];
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}