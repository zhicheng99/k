# 3/clickpoints 点击绘点

```
/**
 * Create a program object and make current
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return true, if the program object was created and successfully made current 
 */
function initShaders(gl, vshader, fshader) {
  var program = createProgram(gl, vshader, fshader);
  if (!program) {
    console.log('Failed to create program');
    return false;
  }

  gl.useProgram(program);
  gl.program = program;

  return true;
}

/**
 * Create the linked program object
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return created program object, or null if the creation has failed
 */
function createProgram(gl, vshader, fshader) {
  // Create shader object
  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  // Create a program object
  var program = gl.createProgram();
  if (!program) {
    return null;
  }

  // Attach the shader objects
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // Link the program object
  gl.linkProgram(program);

  // Check the result of linking
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    var error = gl.getProgramInfoLog(program);
    console.log('Failed to link program: ' + error);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }
  return program;
}

/**
 * Create a shader object
 * @param gl GL context
 * @param type the type of the shader object to be created
 * @param source shader program (string)
 * @return created shader object, or null if the creation has failed.
 */
function loadShader(gl, type, source) {
  // Create shader object
  var shader = gl.createShader(type);
  if (shader == null) {
    console.log('unable to create shader');
    return null;
  }

  // Set the shader program
  gl.shaderSource(shader, source);

  // Compile the shader
  gl.compileShader(shader);

  // Check the result of compilation
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    var error = gl.getShaderInfoLog(shader);
    console.log('Failed to compile shader: ' + error);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
function initWebGL(canvas) {
  const dpr = window.devicePixelRatio || 1;
  console.log(dpr);
  canvas.width = 400 * dpr;
  canvas.height = 300 * dpr;
  canvas.style.width = '400px';
  canvas.style.height = '300px'

  const gl = canvas.getContext('webgl');
  if (!gl) {
    console.error('Failed to get WebGL context');
    return null;
  }
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 1);
  return gl;
}
window.onload = function(){

    /*
        着色器是申明attribute变量
        attribute变量赋值给gl_Position
        向attribute变量传递变量
     */
    //顶点着色器程序
    var VSHADER_SOURCE = 
    'attribute vec4 a_Position;\n'+ 
    'void main(){\n'+
    ' gl_Position = a_Position;\n'+
    ' gl_PointSize = 10.0;\n'+
    '}\n';

    // //片元着色器
    var FSHADER_SOURCE = 
    'void main(){\n'+
    ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n'+
    '}\n';
 

    var canvas = document.getElementById('webgl')
    var gl = initWebGL(canvas)
    if(!gl){
        console.log('Failed to get thd rendering context for webgl')
        return;
    }

    //初始着色器
    if(!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)){
        console.log('failed to initialize shaders')
        return;
    }

    //获取变量attribute的存储位置
    var a_Position = gl.getAttribLocation(gl.program,'a_Position');
    
    if(a_Position < 0){
        console.log('failed to get the storage location of a_Position')
    }  


   canvas.onmousedown = function(ev){click(ev,gl,canvas,a_Position);}

    //将顶点位置传输给attribute变量
    //gl.vertexAttrib3f(a_Position,0.0,0.0,0.0); 


    var g_points = [];  //鼠标点击位置数组
    function click(ev,gl,canvas,a_Position){
        var x = ev.clientX;
        var y = ev.clientY;
        var rect = ev.target.getBoundingClientRect();
        x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
        y = (canvas.height/2 - (y-rect.top))/(canvas.height/2);
        console.log(x,y);
        g_points.push([x,y]);

        // //清空<canvas>
        //gl.clear(gl.COLOR_BUFFER_BIT)
        var len = g_points.length;
        for(var i=0;i<len;i++){
            //将点的位置传递到变量中
            gl.vertexAttrib3f(a_Position,g_points[i][0],g_points[i][1],0.0)

            //绘制点
            gl.drawArrays(gl.POINTS,0,1)
        }
        
    }

    


    //设置<canvas>背景色
    // gl.clearColor(0.0,0.0,0.0,1.0);

    // //清空<canvas>
    // gl.clear(gl.COLOR_BUFFER_BIT)

    // //绘制一个点
    // gl.drawArrays(gl.POINTS,0,1)
    

}
```

