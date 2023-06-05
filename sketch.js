// Render 2d point grid with mxn points in WEBGL
const canvas = document.getElementById("sketch");
canvas.width = 2 * document.documentElement.clientWidth;
canvas.height = 2 * document.documentElement.clientHeight;
const gl = canvas.getContext("webgl2", {
    alpha: true,
    antialias: true,
    depth: false,
    stencil: false
});

// Compile Shaders
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
gl.shaderSource(fragmentShader, `
    precision mediump float;
    void main() {
        vec2 cxy = (gl_PointCoord - 0.5) * 2.0;
        float r = dot(cxy, cxy);
        if (r > 1.0) discard;
        gl_FragColor = vec4(0, 0, 0, 1);
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

// Bind unifoms
const uT = gl.getUniformLocation(program, "t");
const uScale = gl.getUniformLocation(program, "scale");

// Configuration
const s = 20;
const m = 115;
const n = 67;

// Bind points
const positionLocation = gl.getAttribLocation(program, "pos");
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const positions = [];
for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
        positions.push(i / m, j / n);
    }
}
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// Render loop
gl.uniform1f(uScale, s);
const start = Date.now();
requestAnimationFrame(render);
function render() {
    const time = (Date.now() - start) / 1000;
    gl.uniform1f(uT, time);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, positions.length / 2);
    requestAnimationFrame(render);
}