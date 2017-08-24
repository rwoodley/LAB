SHADERCODE = {};
SHADERCODE.maskShader_fs = function() {
var x = `  
uniform sampler2D iChannel0;
varying vec2 vUv; 
void main() {
    vec2 uv = vUv;
    vec4 t1 = texture2D( iChannel0,  uv);
    float threshold = .01;
    if
        (
        (t1.x < threshold ) && 
        (t1.y < threshold ) && 
        (t1.z < threshold )
        )
        gl_FragColor = vec4(0.,0.,0.,0.);
    else
        gl_FragColor = t1;
}
`;
return x;
}

SHADERCODE.maskShader_vs = function() {
var x = `  
varying vec2 vUv; 
void main()
{
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
    vUv = uv;
}

`;
return x;
}