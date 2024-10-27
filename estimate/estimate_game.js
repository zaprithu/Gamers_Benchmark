/*
    Shader/WebGL components borrowed from
    https://xem.github.io/articles/webgl-guide.html#2
*/

var submission_field = document.getElementById("est_submission");
var submission_btn = document.getElementById("est_submit_btn");
var results = document.getElementById("results");

// WebGL canvas context
var gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });

// Vertex shader
var vshader = `
attribute vec4 position;
attribute float size;
void main() {
  gl_Position = position;
  gl_PointSize = size;
}`;

// Fragment shader
var fshader = `
precision mediump float;
uniform vec4 color;
void main() {
  gl_FragColor = color;
}`;

// Compile program
var program = compile(gl, vshader, fshader);

// Get shaders attributes and uniforms
var position = gl.getAttribLocation(program, 'position');
var size = gl.getAttribLocation(program, 'size');
var color = gl.getUniformLocation(program, 'color');

// Set the clear color
gl.clearColor(0.0, 0.0, 0.0, 0.2);

// Clear
gl.clear(gl.COLOR_BUFFER_BIT);

// Number of objects to generate for game
var num_objects;

// Function to generate objects, called on every "play" button click
function generateObjects() {
    // Clear
    gl.clear(gl.COLOR_BUFFER_BIT);
    submission_field.style.visibility="visible";
    submission_btn.style.visibility="visible";
    submission_btn.classList.remove("btn-d");
    submission_btn.classList.add("btn");
    results.style.visibility="hidden";
    submission_field.value = "";

    // Generate number of objects
    num_objects = Math.floor(Math.random() * 150 + 50);
    
    // Draw num_objects amount of objects
    for (let i = 0; i < num_objects; i++) {

        /*
            Get random position to draw object at. Shader bounds are
            [-1,1] and Math.random is [0,1). Random * 1.9 - 0.95
            generates objects within 95% of game window, as drawing at
            edge can lead object to be half out of the window.
        */
        var x = Math.random() * 1.9 - 0.95;
        var y = Math.random() * 1.9 - 0.95;

        // Slight variation in size
        var rand_size = Math.floor(Math.random() * 5 + 10);
        
        // Generate random RGB colors
        var r = Math.random();
        var g = Math.random();
        var b = Math.random();
        
        /*
            Set attributes/uniforms in shaders to generated values
            and draw the objects
        */
        gl.vertexAttrib3f(position, x, y, 0);
        gl.vertexAttrib1f(size, rand_size);
        gl.uniform4f(color, r, g, b, 1);
        gl.drawArrays(gl.POINTS, 0, 1);
      }
}

function answerSubmitted() {
    submission_btn.classList.remove("btn");
    submission_btn.classList.add("btn-d");
    results.style.visibility="visible";

    var guess = parseInt(submission_field.value, 10);
    if (guess > num_objects) {
        results.innerHTML = "You're guess was " + (guess - num_objects) + " over.";
    }
    else if (guess < num_objects) {
        results.innerHTML = "You're guess was " + (num_objects - guess) + " under."
    }
    else {
        results.innerHTML = "You're guess was correct!";
    }
}