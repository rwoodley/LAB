function setupShaderDotScreen(renderer, scene, camera)
{
	composer = new THREE.EffectComposer( renderer );
	composer.addPass( new THREE.RenderPass( scene, camera ) );
	
    var dotScreenAngle = 1.6;
    var dotScreeenScale = .5;
	var effectDotScreen = new THREE.DotScreenPass( new THREE.Vector2(0,0),
                                                  dotScreenAngle, dotScreeenScale ); 
	effectDotScreen.renderToScreen = true; 
	composer.addPass(effectDotScreen);
    return composer;
}
function getShaderMaterialByName(name) {
    if (name == 'Shader1') {
        var uniforms={
            baseTexture:{ type:"t", value:THREE.ImageUtils.loadTexture( 'textures/water.jpg') },
            baseSpeed:{  type:"f",  value:.6 },
            noiseTexture: { type:"t", value:THREE.ImageUtils.loadTexture( 'textures/noise.jpg') },
            noiseScale:{ type:"f", value:.1 },
            alpha:{ type:"f", value:.8 },
            time:{ type:"f", value:1},
            offsetX:{ type:"f", value:.9 },
            offsetY:{ type:"f", value:.85},
            tint:{type:"c", value:(new THREE.Color).setHex(16770000) }
        }
        
        return new THREE.ShaderMaterial(
            {
                uniforms: uniforms,
                vertexShader:document.getElementById("shader1Vertex").textContent,
                fragmentShader:document.getElementById("shader1Fragment").textContent,
                side: THREE.DoubleSide
            }
            );
            this.waterMaterial.depthTest=!0;
            var f=new THREE.PlaneGeometry(1000,1000);
            _that._watermesh=new THREE.Mesh(f,this.waterMaterial);
            _that._scene.add(_that._watermesh);
    }
    if (name == 'Shader2') {
        var uniforms={
            time:{ type:"f", value:1}
        }
        
        return new THREE.ShaderMaterial(
            {
                uniforms: uniforms,
                vertexShader:document.getElementById("shader2Vertex").textContent,
                fragmentShader:document.getElementById("shader2Fragment").textContent,
                side: THREE.DoubleSide
            }
            );
            this.waterMaterial.depthTest=!0;
            var f=new THREE.PlaneGeometry(1000,1000);
            _that._watermesh=new THREE.Mesh(f,this.waterMaterial);
            _that._scene.add(_that._watermesh);
    }
}
function renderByName(name) {
    if (name == 'Shader2') {
    }
}