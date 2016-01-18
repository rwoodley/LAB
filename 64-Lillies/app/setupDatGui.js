function setupDatGui(material1, material2, material3) {
	var gui = new dat.GUI();
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.top = "20px";
    gui.domElement.style.left = "20px";
 	setupDatGuiMaterial(gui, material1, '1');
	setupDatGuiMaterial(gui, material2, '2');
	setupDatGuiMaterial(gui, material3, '3');
	gui.open();

}
function setupDatGuiMaterial(gui, material1, name) {
	var _params = {
		Diffuse: '#0f3',
		Specular: '#0f3',
		Shininess: 30,
		Opacity: 1
	}

	    
    var folderAppearance1 = gui.addFolder(name);
	var sphereColor = folderAppearance1.addColor( _params, 'Diffuse' ).name('Color (Diffuse)').listen();
	sphereColor.onChange(function(value) // onFinishChange
	{   material1.color.setHex( value.replace("#", "0x") );   });
	
    _sphereColorS = folderAppearance1.addColor( _params, 'Specular' ).name('Color (Specular)').listen();
	_sphereColorS.onChange(function(value) // onFinishChange
	{   material1.specular.setHex( value.replace("#", "0x") );   });
	var sphereShininess = folderAppearance1.add( _params, 'Shininess' ).min(0).max(60).step(1).name('Shininess').listen();
	sphereShininess.onChange(function(value)
	{   material1.shininess = value;   });
	var sphereOpacity = folderAppearance1.add( _params, 'Opacity' ).min(0).max(1).step(0.01).name('Opacity').listen();
	sphereOpacity.onChange(function(value)
	{   material1.opacity = value;   });
	folderAppearance1.open();
	
 //    var folderAppearance2 = gui.addFolder('Material2');
	// var sphereColor = folderAppearance2.addColor( _params, 'Diffuse' ).name('Color (Diffuse)').listen();
	// sphereColor.onChange(function(value) // onFinishChange
	// {   material2.color.setHex( value.replace("#", "0x") );   });
	
 //    _sphereColorS = folderAppearance2.addColor( _params, 'Specular' ).name('Color (Specular)').listen();
	// _sphereColorS.onChange(function(value) // onFinishChange
	// {   material2.specular.setHex( value.replace("#", "0x") );   });
	// var sphereShininess = folderAppearance2.add( _params, 'Shininess' ).min(0).max(60).step(1).name('Shininess').listen();
	// sphereShininess.onChange(function(value)
	// {   material2.shininess = value;   });
	// var sphereOpacity = folderAppearance2.add( _params, 'Opacity' ).min(0).max(1).step(0.01).name('Opacity').listen();
	// sphereOpacity.onChange(function(value)
	// {   material2.opacity = value;   });
	// folderAppearance2.open();
	
 //    var folderAppearance3 = gui.addFolder('Material3');
	// var sphereColor = folderAppearance3.addColor( _params, 'Diffuse' ).name('Color (Diffuse)').listen();
	// sphereColor.onChange(function(value) // onFinishChange
	// {   material3.color.setHex( value.replace("#", "0x") );   });
	
 //    _sphereColorS = folderAppearance3.addColor( _params, 'Specular' ).name('Color (Specular)').listen();
	// _sphereColorS.onChange(function(value) // onFinishChange
	// {   material3.specular.setHex( value.replace("#", "0x") );   });
	// var sphereShininess = folderAppearance3.add( _params, 'Shininess' ).min(0).max(60).step(1).name('Shininess').listen();
	// sphereShininess.onChange(function(value)
	// {   material3.shininess = value;   });
	// var sphereOpacity = folderAppearance3.add( _params, 'Opacity' ).min(0).max(1).step(0.01).name('Opacity').listen();
	// sphereOpacity.onChange(function(value)
	// {   material3.opacity = value;   });
	// folderAppearance3.open();		
    	
}