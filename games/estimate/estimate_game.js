/*
    Estimate Game
    Javscript functionality for running and displaying the game
    Made by: Ethan Dirkes

    Created 10/26/2024
    Edited 10/27/2024:
        Added comments
    Preconditions:
        Player must input a string as their guess for how many objects are present,
        which is parsed as an int (non-int characters are ignored).
    Postconditions:
        Game objects are drawn from this file. Accuracy of player guess is displayed
        after an estimate has been submitted.
    Errors/exceptions:
        None
    Side effects:
        None
    Invariants:
        gl: WebGL graphics context
    Known faults:
        None

    Shader/WebGL components borrowed from
    https://xem.github.io/articles/webgl-guide.html#2
*/

// Get document elements of the submission text field, the submit button, and the results
var submission_field = document.getElementById("est_submission");
var submission_btn = document.getElementById("est_submit_btn");
var results = document.getElementById("results");

// WebGL canvas context
var gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });

/*
    Vertex shader, draws for each vertex of the instance.
    vec4 position: position to draw the point for the current object
    float size: size of the point to draw
*/
var vshader = `
attribute vec4 position;
attribute float size;
void main() {
  gl_Position = position;
  gl_PointSize = size;
}`;

/*
    Fragment shader, draws for each pixel of the object.
    mediump float: float precision
    vec4 color: color of the object to draw
*/
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

// Set the clear color (background color)
gl.clearColor(0.0, 0.0, 0.0, 0.2);

// Clear the window
gl.clear(gl.COLOR_BUFFER_BIT);

// Number of objects to generate for game
var num_objects;

// Function to generate objects, called on every "play" button click
function generateObjects() {
    // Clear the window
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Show submission field/button, enable button, make sub field empty
    submission_field.style.visibility="visible";
    submission_btn.style.visibility="visible";
    submission_btn.classList.remove("btn-d");
    submission_btn.classList.add("btn");
    results.style.visibility="hidden";
    submission_field.value = "";

    // Generate number of objects for game
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
      
    // Call function to clear board after 10 seconds
    setTimeout(()=>{gl.clear(gl.COLOR_BUFFER_BIT);}, 10000);
}

function answerSubmitted() {
    // Disable submit button and make results visible
    submission_btn.classList.remove("btn");
    submission_btn.classList.add("btn-d");
    results.style.visibility="visible";

    // Read int from guess and display accuracy
    var guess = parseInt(submission_field.value, 10);
    // Over estimation
    if (guess > num_objects) {
        results.innerHTML = "You're guess was " + (guess - num_objects) + " over.";
    }
    // Under estimation
    else if (guess < num_objects) {
        results.innerHTML = "You're guess was " + (num_objects - guess) + " under."
    }
    // Correct estimation
    else {
        results.innerHTML = "You're guess was correct!";
    }
}