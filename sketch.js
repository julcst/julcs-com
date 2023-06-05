// Render 2d point grid with mxn points in WEBGL
const canvas = document.getElementById("sketch");
canvas.width = 2 * document.body.clientWidth;
canvas.height = 2 * document.body.clientHeight;
const gl = canvas.getContext("webgl2");
gl.enable(gl.BLEND);
gl.disable(gl.DEPTH_TEST);
gl.enable(0x8642);
gl.enable(0x0B10);
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
    attribute vec2 pos;
    uniform float t;
    void main() {
        vec2 grid = (pos - 0.5) * 2.0;
        float x = t + pos.x * 10.0;
        vec2 a = vec2(sin(x * 0.3) * 0.5 + sin(x * 0.8) * 0.5, sin(x * 0.7) * 0.5 + sin(x * 0.1) * 0.5);
        vec2 b = vec2(sin(x * 0.5) * 0.5 + sin(x * 0.4) * 0.5, sin(x * 0.2) * 0.5 + sin(x * 0.9) * 0.5);
        vec2 p = mix(a, b, pos.y);
        gl_PointSize = mix(0.0, 10.0, pos.y * pos.x);
        gl_Position = vec4(p, 0, 1);
    }`);
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(vertexShader));
}
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(0, 0, 1, 1);
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
const positionLocation = gl.getAttribLocation(program, "pos");
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const positions = [];
for (let i = 0; i <= 100; i++) {
    for (let j = 0; j <= 100; j++) {
        positions.push(i / 100, j / 100);
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
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, positions.length / 2);
    requestAnimationFrame(render);
}