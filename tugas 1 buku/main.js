function main(){
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");

    var leftVertices = [
        -0.9, -0.8, 1.0, 0.9922, 0.8157,      //titik 1.kiriBawah
        -0.2, -0.8, 1.0, 0.9922, 0.8157,      //titik 1.kananBawah
        -0.2, -0.7, 1.0, 0.9922, 0.8157,       //titik 1.kananTengah
        -0.9, -0.7, 1.0, 0.9922, 0.8157,      //titik 1.kiriTengah
        -0.8, 0.3, 1.0, 0.9922, 0.8157,      //titik 1.kiriAtas
        -0.3, 0.3, 1.0, 0.9922, 0.8157,      //titik 1.kananAtas
        -0.2, -0.7, 1.0, 0.9922, 0.8157,       //titik 1.kananTengah
        -0.9, -0.7, 1.0, 0.9922, 0.8157,      //titik 1.kiriTengah
    ];

    var rightVertices = [
        0.9, -0.8, 1.0, 0.9922, 0.8157,      //titik 2.kananBawah
        0.1, -0.8, 1.0, 0.9922, 0.8157,      //titik 2.kiriBawah
        0.0, -0.7, 1.0, 0.9922, 0.8157,       //titik 2.kiriTengah
        1, -0.7, 1.0, 0.9922, 0.8157,      //titik 2.kananTengah
        0.9, 0.3, 1.0, 0.9922, 0.8157,      //titik 2.kananAtas
        0.1, 0.3, 1.0, 0.9922, 0.8157,      //titik 2.kiriAtas
        0.0, -0.7, 1.0, 0.9922, 0.8157,       //titik 2.kiriTengah
        1, -0.7, 1.0, 0.9922, 0.8157,      //titik 2.kananTengah
    ];

    var vertices = [...leftVertices, ...rightVertices];

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var vertexShaderSource = `
        attribute vec2 aPosition;
        attribute vec3 aColor;
        varying  vec3 vColor;
        uniform mat4 uTranslate;
        void main(){
            gl_Position = uTranslate * vec4(aPosition, 0.0, 1.0);
            vColor = aColor;
        }
    `;

    var fragmentShaderSource = `
        precision mediump float;
        varying vec3 vColor;
        void main(){
            gl_FragColor = vec4(vColor, 1.0);
        }
    `;

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fragmentShaderSource);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5*Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(aPosition);

    var aColor = gl.getAttribLocation(shaderProgram, "aColor");
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 5*Float32Array.BYTES_PER_ELEMENT, 2*Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aColor);

    var speed = 0.0181;
    var change = 0;
    var uTranslate = gl.getUniformLocation(shaderProgram, "uTranslate");
    function render() {
        if(change >= 0.7 || change <=-0.2) speed = -speed;
        change += speed;

        var left = [
        	1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0, 0.0, 0.0, 1.0,
        ]

        var right = [
            	1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0, change, 0.0, 1.0,
        ]

        gl.clearColor(0.588, 0.294, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.uniformMatrix4fv(uTranslate, false, left);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, leftVertices.length/5);

        gl.uniformMatrix4fv(uTranslate, false, right);
        gl.drawArrays(gl.TRIANGLE_FAN, leftVertices.length/5, rightVertices.length/5);
        requestAnimationFrame(render);
    }
    render();
    
}
