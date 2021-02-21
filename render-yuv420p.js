/**
 * @author changyanlong
 * @email porschegt23@foxmail.com
 * @qq 531365872
 * @wechat numberwolf11
 * @github github.com/numberwolf
 */
function Texture(gl) {
    this.gl = gl;
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

Texture.prototype.bind = function(n, program, name) {
    var gl = this.gl;
    gl.activeTexture([gl.TEXTURE0, gl.TEXTURE1, gl.TEXTURE2][n]);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(gl.getUniformLocation(program, name), n);
}

Texture.prototype.fill = function(width, height, data) {
    var gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, width, height, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, data);
}

function setupCanvas(canvas, options) {
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl)
        return gl;

    var program = gl.createProgram();
    var vertexShaderSource = [
        "attribute highp vec4 aVertexPosition;",
        "attribute vec2 aTextureCoord;",
        "varying highp vec2 vTextureCoord;",
        "void main(void) {",
        " gl_Position = aVertexPosition;",
        " vTextureCoord = aTextureCoord;",
        "}"
    ].join("\n");
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    var fragmentShaderSource = [
        "precision highp float;",
        "varying lowp vec2 vTextureCoord;",
        "uniform sampler2D YTexture;",
        "uniform sampler2D UTexture;",
        "uniform sampler2D VTexture;",
        "const mat4 YUV2RGB = mat4",
        "(",
        " 1.1643828125, 0, 1.59602734375, -.87078515625,",
        " 1.1643828125, -.39176171875, -.81296875, .52959375,",
        " 1.1643828125, 2.017234375, 0, -1.081390625,",
        " 0, 0, 0, 1",
        ");",
        "void main(void) {",
        " gl_FragColor = vec4( texture2D(YTexture, vTextureCoord).x, texture2D(UTexture, vTextureCoord).x, texture2D(VTexture, vTextureCoord).x, 1) * YUV2RGB;",
        "}"
    ].join("\n");

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("Shader link failed.");
    }
    var vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);
    var textureCoordAttribute = gl.getAttribLocation(program, "aTextureCoord");
    gl.enableVertexAttribArray(textureCoordAttribute);

    var verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array([1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, -1.0, 0.0]),
        gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array([1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0]),
        gl.STATIC_DRAW);
    gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

    gl.y = new Texture(gl);
    gl.u = new Texture(gl);
    gl.v = new Texture(gl);
    gl.y.bind(0, program, "YTexture");
    gl.u.bind(1, program, "UTexture");
    gl.v.bind(2, program, "VTexture");

    return gl;
}

// function renderFrame(gl, videoFrame, width, height, uOffset, vOffset) {
//     gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
//     gl.clearColor(0.0, 0.0, 0.0, 0.0);
//     gl.clear(gl.COLOR_BUFFER_BIT);

//     gl.y.fill(width, height,
//         videoFrame.subarray(0, uOffset));
//     gl.u.fill(width >> 1, height >> 1,
//         videoFrame.subarray(uOffset, uOffset + vOffset));
//     gl.v.fill(width >> 1, height >> 1,
//         videoFrame.subarray(uOffset + vOffset, videoFrame.length));

//     gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
// }

function renderFrame(gl, 
    videoFrameY, videoFrameB, videoFrameR,
    width, height) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.y.fill(width, height, videoFrameY);
    gl.u.fill(width >> 1, height >> 1, videoFrameB);
    gl.v.fill(width >> 1, height >> 1, videoFrameR);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}


/* Player controls Start Here */

function fullscreen() {
    let node = document.getElementById('vidPlayerComp');
    let canvas = document.getElementById('canvas');
    let childrens = node.children;
    let fullScreen;

    if ((document.webkitIsFullScreen == false) || (document['isFullScreen'] == false) || (screen.height - 50 > window.innerHeight && screen.width == window.innerWidth)) {
        (node.webkitRequestFullScreen || node.requestFullScreen || node.mozRequestFullScreen || node.msRequestFullscreen).call(node);
        fullScreen = true;
    } else {
        //(document.webkitCancelFullScreen()||document.cancelFullScreen()||document.mozCancelFullScreen()||document.msExitFullscreen());
        (document.webkitCancelFullScreen || document['cancelFullScreen'] || document['mozCancelFullScreen'] || document['msExitFullscreen']).call(document);
        fullScreen = false;
    }

    let innerWidth = screen.width;
    let innerHeight = screen.height;
    if (fullScreen) {
        node.setAttribute('style', 'width:' + innerWidth + 'px;' + 'height:' + innerHeight + 'px;' + 'margin-top:0px;margin-left:0px;top:0px;left:0px;background-color:black;border:2px solid rgba(17, 48, 69, 0.9);max-width:' + innerWidth + 'px;');
    } else {
        node.setAttribute('style', '');
    }

    for (let i = 0, len = node.children.length; i < len; i++) {
        if (fullScreen) {
            node.children[i].setAttribute('style', 'width:' + innerWidth + 'px;' + 'height:25px;');
        } else {
            node.children[i].setAttribute('style', '');
        }

        if (i === 1) {
            if (fullScreen) {
                node.children[i].setAttribute('style', 'height:' + (innerHeight - 54) + 'px;' + 'width:' + innerWidth + 'px');
                canvas.style.width = (innerWidth) + 'px';
                canvas.style.height = (innerHeight - 54) + 'px';
            } else {
                node.children[i].setAttribute('style', '');
                canvas.setAttribute('style', '');
            }
        }

    }

}

module.exports = {
    renderFrame : renderFrame,
    setupCanvas : setupCanvas
};

/* Player controls Ends Here */