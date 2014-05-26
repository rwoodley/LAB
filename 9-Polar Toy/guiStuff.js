// Just putting this in a separate file so it doesn't clutter Main.js
// but it is in the Main.js namespace.
// maintains the global _params
function updateMeshAppearance()
{
    var value = _params.material;
	var newMaterial;
	if (value == "Basic") {
		newMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } );
        _sphereColorS.domElement.parentNode.style.display = 'none';
    }
	else if (value == "Lambert") {
		newMaterial = new THREE.MeshLambertMaterial( { color: 0x000000, side: THREE.DoubleSide } );
        _sphereColorS.domElement.parentNode.style.display = 'none';
    }
	else if (value == "Phong") {
		newMaterial = new THREE.MeshPhongMaterial( { color: 0x000000, side: THREE.DoubleSide } );
        _sphereColorS.domElement.parentNode.style.display = 'block';
    }
	else { // (value == "Wireframe")
		newMaterial = new THREE.MeshBasicMaterial( { wireframe: true } );
        _sphereColorS.domElement.parentNode.style.display = 'none';
    }
	_lastMesh.material = newMaterial;
	
	_lastMesh.material.color.setHex( _params.color.replace("#", "0x") );
//	if (_lastMesh.material.ambient)
//		_lastMesh.material.ambient.setHex( _params.colorA.replace("#", "0x") );
//    if (_lastMesh.material.emissive)
//		_lastMesh.material.emissive.setHex( _params.colorE.replace("#", "0x") ); 
	if (_lastMesh.material.specular)
		_lastMesh.material.specular.setHex( _params.colorS.replace("#", "0x") ); 
    if (_lastMesh.material.shininess)
		_lastMesh.material.shininess = _params.shininess;
	_lastMesh.material.opacity = _params.opacity;  
	_lastMesh.material.transparent = true;

}
function updateCoordinateSystem() {
    var updateFormula = !_drawClicked && getParameterByName('formula') == '';
    var textArea = document.getElementById('myTextArea');
    if (_params.system == 'cartesian') {
        //alert('Z is a function of X & Y which both go from -1 to 1');
        if (updateFormula) _params.formula = 'z = x*x - y*y';
    }
    if (_params.system == 'spherical') {
        //alert('radius is a function of theta (0 to PI) and phi (0 to 2xPI)');
        if (updateFormula) _params.formula = 'radius = 1.0';
    }
    if (_params.system == 'cylindrical') {
        //alert('Z is a function of radius (0 to 1) and phi (0 to 2xPI)');
        if (updateFormula) _params.formula = 'z = radius*(Math.cos(4*phi) + Math.sin(4*phi))';
    }
    draw();
}
var _sphereColorS;
function setupDatGui() {

	var gui1 = new dat.GUI({autoPlace: false, width: 400});
    gui1.domElement.style.position = 'absolute';
    gui1.domElement.style.top = "20px";
    gui1.domElement.style.left = "20px";
    document.body.appendChild(gui1.domElement );
    var coordSystem = gui1.add(_params, 'system', [ 'cartesian', 'spherical', 'cylindrical' ] ).listen();
    coordSystem.onChange(function(value) { updateCoordinateSystem(); } );
    var formula = gui1.add(_params, 'formula').listen();
	gui1.add( _params, 'draw' ).name("Click to draw formula.");
	gui1.add( _params, 'help' ).name("Click for help, tips.");

	var gui = new dat.GUI();
	    
    var folderAppearance = gui.addFolder('Appearance');
	var sphereColor = folderAppearance.addColor( _params, 'color' ).name('Color (Diffuse)').listen();
	sphereColor.onChange(function(value) // onFinishChange
	{   _lastMesh.material.color.setHex( value.replace("#", "0x") );   });
	//var sphereColorA = folderAppearance.addColor( _params, 'colorA' ).name('Color (Ambient)').listen();
	//sphereColorA.onChange(function(value) // onFinishChange
	//{   _lastMesh.material.ambient.setHex( value.replace("#", "0x") );   });
	//var sphereColorE = folderAppearance.addColor( _params, 'colorE' ).name('Color (Emissive)').listen();
	//sphereColorE.onChange(function(value) // onFinishChange
	//{   _lastMesh.material.emissive.setHex( value.replace("#", "0x") );   });
	
    _sphereColorS = folderAppearance.addColor( _params, 'colorS' ).name('Color (Specular)').listen();
	_sphereColorS.onChange(function(value) // onFinishChange
	{   _lastMesh.material.specular.setHex( value.replace("#", "0x") );   });
	var sphereShininess = folderAppearance.add( _params, 'shininess' ).min(0).max(60).step(1).name('Shininess').listen();
	sphereShininess.onChange(function(value)
	{   _lastMesh.material.shininess = value;   });
	var sphereOpacity = folderAppearance.add( _params, 'opacity' ).min(0).max(1).step(0.01).name('Opacity').listen();
	sphereOpacity.onChange(function(value)
	{   _lastMesh.material.opacity = value;   });
	
	var sphereMaterial = folderAppearance.add( _params, 'material', [ "Basic", "Lambert", "Phong", "Wireframe" ] ).name('Material Type').listen();
	sphereMaterial.onChange(function(value) 
	{   updateMeshAppearance();   });
	folderAppearance.close();
    
	var folder1 = gui.addFolder('Camera Focus');
	folder1.add(_params, 'X', -10, 10);
	folder1.add(_params, 'Y', -10, 10);
	folder1.add(_params, 'Z', -10, 10);
	folder1.close();

	gui.add(_params, 'spin');
	gui.add(_params, 'spinSpeed',-Math.PI/32,Math.PI/32);

	
	gui.open();
    updateCoordinateSystem();
}
