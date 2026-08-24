# 2/hellopoint2 给着色器传值

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
    // 将十六进制转为rgba值
    function hexToRgba(hex){
        // 首先使用正则表达式将十六进制字符串分解为 RGB 分量
        let result;
        if (hex.length === 4) {
            result = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
            // 将分解出的分量转换为十进制数，并将它们扩展为 6 位十六进制字符串
            let r = parseInt(result[1] + result[1], 16);
            let g = parseInt(result[2] + result[2], 16);
            let b = parseInt(result[3] + result[3], 16);
            return  "rgba(" + r + ", " + g + ", " + b + ", 1)";
        } else {
            result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            // 将分解出的分量转换为十进制数
            let r = parseInt(result[1], 16);
            let g = parseInt(result[2], 16);
            let b = parseInt(result[3], 16);
            return "rgba(" + r + ", " + g + ", " + b + ", 1)";
        }
    }
    // 将rgba值转为webGl色值
    function rgbaToWebGL(rgba) {
        // Split the RGBA string into its component parts
        const parts = rgba.match(/\d+/g);
        // Extract the values for each component (red, green, blue, alpha)
        const r = parseInt(parts[0], 10) / 255.0;
        const g = parseInt(parts[1], 10) / 255.0;
        const b = parseInt(parts[2], 10) / 255.0;
        const a = parseInt(parts[3], 10);
        // Return the WebGL color value
        return {r,g,b,a};
    }
 
    // 将css两种色值（十六进制、rgba）表达式转为webgl色值
    function cssToWebgl(cssColor){
        const hexadecimalRegex1 =  /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        const hexadecimalRegex2 =  /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
        const rgbaRegex = /rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d\.?\d*)\)/;
        // 如果是十六进制那么转为rgb
        if(hexadecimalRegex1.test(cssColor)||hexadecimalRegex2.test(cssColor)){
            const hexadecimalToRgba = hexToRgba(cssColor) // 十六进制那么转为rgba
            return rgbaToWebGL(hexadecimalToRgba) // 再将rgba值转为webGl色值
        }else if(rgbaRegex.test(cssColor)){
            return rgbaToWebGL(cssColor)
        }else{
            alert('请输入正确的十六进制、rgba表达式：（#f0f|#ff00ff|rgba(255,0,255,0.4)）')
        }
    }

    /*
        着色器是申明attribute变量
        attribute变量赋值给gl_Position
        向attribute变量传递变量
     */
    //顶点着色器程序
    var VSHADER_SOURCE = 
    'attribute vec4 a_Position;\n'+
    'attribute float a_PointSize;\n'+
    'void main(){\n'+
    ' gl_Position = a_Position;\n'+
    ' gl_PointSize = a_PointSize;\n'+
    '}\n';

    // //片元着色器
    var FSHADER_SOURCE = 
    'void main(){\n'+
    ' gl_FragColor = vec4(1.0, 0.0, 0.023529411764705882, 1.0);\n'+
    //' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n'+

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
    var a_PointSize = gl.getAttribLocation(gl.program,'a_PointSize');

    if(a_Position < 0){
        console.log('failed to get the storage location of a_Position')
    }  

    //将顶点位置传输给attribute变量
    gl.vertexAttrib3f(a_Position,0.0,0.0,0.0);
    gl.vertexAttrib1f(a_PointSize,5.0);


    //设置<canvas>背景色
    gl.clearColor(0.0,0.0,0.0,1.0);

    //清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT)

    //绘制一个点
    gl.drawArrays(gl.POINTS,0,1)
    

}
```

