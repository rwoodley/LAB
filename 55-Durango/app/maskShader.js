SHADERCODE = {};
SHADERCODE.maskShader_fs = function() {
var x = `  
uniform sampler2D iChannel0;
uniform sampler2D iChannelZ;
varying vec2 vUv; 
void main() {
    vec2 uv = vUv;
    vec4 t1 = texture2D( iChannel0,  uv);
    vec4 panel1 = vec4(0.491,0.506,0.415,0.445);
    float panel1XSize = abs(panel1.y - panel1.x);
    float panel1YSize = abs(panel1.z - panel1.a);
    float threshold = .01;
    if
        (
        (t1.x < threshold ) && 
        (t1.y < threshold ) && 
        (t1.z < threshold )
        )
        gl_FragColor = vec4(0.,0.,0.,0.);
    else {
        if (uv.x > panel1.x && uv.x < panel1.y && uv.y > panel1.z && uv.y < panel1.a) {
            // gl_FragColor = vec4(0., .2 ,0.,   1.);
            vec4 t2 = texture2D( iChannelZ,  
                vec2(
                    (uv.x-panel1.x)/panel1XSize,
                    (uv.y-panel1.z)/panel1YSize
                ));
                gl_FragColor = t2;
                
        }
        else
            gl_FragColor = t1;
    }
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