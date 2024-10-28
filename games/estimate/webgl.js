/*
  Estimation Game
  Compiles the the WebGL program from the vertex and fragment shaders
  Made by: Ethan Dirkes

  Created 10/26/2024
  Edited 10/27/2024:
    Added comments
  
    Preconditions:
      gl context, vertex shader, fragment shader
    Postconditions:
      Returns the compiled program
    Errors/exceptions:
      None
    Side effects:
      None
    Invariants:
      None
    Known faults:
      None

  Compile function borrowed from
  https://xem.github.io/articles/webgl-guide.html#2
*/

// Compile a WebGL program from a vertex shader and a fragment shader
compile = (gl, vshader, fshader) => {
  
    // Compile vertex shader
    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vshader);
    gl.compileShader(vs);
    
    // Compile fragment shader
    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fshader);
    gl.compileShader(fs);
    
    // Create and launch the WebGL program
    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);
    
    return program;
  }