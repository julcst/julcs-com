// Render 2d point grid with mxn points in WEBGL
const canvas = document.getElementById("sketch");
canvas.width = 2 * document.body.clientWidth;
canvas.height = 2 * document.body.clientHeight;
const gl = canvas.getContext("webgl2", {
    alpha: true,
    antialias: true,
    depth: false,
  });
//gl.enable(gl.BLEND);
//gl.disable(gl.DEPTH_TEST);
//gl.enable(0x8642);
//gl.enable(0x0B10);
gl.getExtension("OES_standard_derivatives");
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
    attribute vec2 pos;
    uniform float scale;
    uniform float t;
    float slerp(float x) {
        float t = clamp(x, 0.0, 1.0);
        return t * t * (3.0 - 2.0 * t);
    }
    void main() {
        vec2 grid = (pos - 0.5) * 2.0;
        float x = t + pos.x * 10.0;
        vec2 a = vec2(sin(x * 0.3) * 0.5 + sin(x * 0.8) * 0.5, sin(x * 0.7) * 0.5 + sin(x * 0.1) * 0.5);
        vec2 b = vec2(sin(x * 0.5) * 0.5 + sin(x * 0.4) * 0.5, sin(x * 0.2) * 0.5 + sin(x * 0.9) * 0.5);
        vec2 p = mix(a, b, pos.y);
        gl_PointSize = mix(0.05, 1.0, pos.y * pos.x) * scale;
        gl_Position = vec4(mix(grid, p, slerp((t - 2.0) / 7.0)), 0, 1);
    }`);
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(vertexShader));
}
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
//https://www.desultoryquest.com/blog/drawing-anti-aliased-circular-points-using-opengl-slash-webgl/
gl.shaderSource(fragmentShader, `
    #ifdef GL_OES_standard_derivatives
    #extension GL_OES_standard_derivatives : enable
    #endif
    precision mediump float;
    float slerp(float x) {
        float t = clamp(x, 0.0, 1.0);
        return t * t * (3.0 - 2.0 * t);
    }
    void main() {
        float r = 0.0, delta = 0.0, alpha = 1.0;
        vec2 cxy = 2.0 * (gl_PointCoord - 0.5);
        r = dot(cxy, cxy);
        //if (r > 1.0) discard;
    #ifdef GL_OES_standard_derivatives
        delta = fwidth(r);
        alpha = 1.0 - slerp(1.0 - delta, 1.0 + delta, r);
    #endif
        gl_FragColor = alpha * vec4(0, 0, 0, 1);
    }`);
gl.compileShader(fragmentShader);
if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(fragmentShader));
}
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);
const uT = gl.getUniformLocation(program, "t");
const uScale = gl.getUniformLocation(program, "scale");
const positionLocation = gl.getAttribLocation(program, "pos");
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const positions = [];
const s = 20;
for (let i = 0; i <= canvas.width; i+=s) {
    for (let j = 0; j <= canvas.height; j+=s) {
        positions.push(i / canvas.width, j / canvas.height);
    }
}
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// Render loop
const start = Date.now();
requestAnimationFrame(render);
function render() {
    const time = (Date.now() - start) / 1000;
    gl.uniform1f(uT, time);
    gl.uniform1f(uScale, s);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, positions.length / 2);
    requestAnimationFrame(render);
}