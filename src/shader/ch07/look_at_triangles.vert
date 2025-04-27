#version 100

attribute vec4 a_Position;
attribute vec4 a_Color;
uniform mat4 v_ViewMatrix;
varying vec4 v_Color;

void main() {
    gl_Position = v_ViewMatrix * a_Position;
    v_Color = a_Color;
}