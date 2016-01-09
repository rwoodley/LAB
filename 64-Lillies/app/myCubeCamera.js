BOB = {};
BOB.CubeCamera = function ( near, far, cubeResolution ) {

	THREE.Object3D.call( this );

	this.type = 'CubeCamera';

	var fov = 90, aspect = 1;

	this.cameraPX = new THREE.PerspectiveCamera( fov, aspect, near, far );
	this.cameraPX.up.set( 0, - 1, 0 );
	this.cameraPX.lookAt( new THREE.Vector3( 1, 0, 0 ) );
	this.add( this.cameraPX );

	this.cameraNX = new THREE.PerspectiveCamera( fov, aspect, near, far );
	this.cameraNX.up.set( 0, - 1, 0 );
	this.cameraNX.lookAt( new THREE.Vector3( - 1, 0, 0 ) );
	this.add( this.cameraNX );

	this.cameraPY = new THREE.PerspectiveCamera( fov, aspect, near, far );
	this.cameraPY.up.set( 0, 0, 1 );
	this.cameraPY.lookAt( new THREE.Vector3( 0, 1, 0 ) );
	this.add( this.cameraPY );

	this.cameraNY = new THREE.PerspectiveCamera( fov, aspect, near, far );
	this.cameraNY.up.set( 0, 0, - 1 );
	this.cameraNY.lookAt( new THREE.Vector3( 0, - 1, 0 ) );
	this.add( this.cameraNY );

	this.cameraPZ = new THREE.PerspectiveCamera( fov, aspect, near, far );
	this.cameraPZ.up.set( 0, - 1, 0 );
	this.cameraPZ.lookAt( new THREE.Vector3( 0, 0, 1 ) );
	this.add( this.cameraPZ );

	this.cameraNZ = new THREE.PerspectiveCamera( fov, aspect, near, far );
	this.cameraNZ.up.set( 0, - 1, 0 );
	this.cameraNZ.lookAt( new THREE.Vector3( 0, 0, - 1 ) );
	this.add( this.cameraNZ );

	this.renderTarget = new THREE.WebGLRenderTargetCube( cubeResolution, cubeResolution, { format: THREE.RGBFormat, magFilter: THREE.LinearFilter, minFilter: THREE.LinearFilter } );

	this.updateCubeMap = function ( renderer, scene, renderTarget ) {

		if ( this.parent === null ) this.updateMatrixWorld();

		var renderTarget = this.renderTarget;
		var generateMipmaps = renderTarget.texture.generateMipmaps;

		renderTarget.texture.generateMipmaps = false;

		renderTarget.activeCubeFace = 0;
		renderer.render( scene, this.cameraPX, renderTarget, true );

		renderTarget.activeCubeFace = 1;
		renderer.render( scene, this.cameraNX, renderTarget, true );

		renderTarget.activeCubeFace = 2;
		renderer.render( scene, this.cameraPY, renderTarget, true );

		renderTarget.activeCubeFace = 3;
		renderer.render( scene, this.cameraNY, renderTarget, true );

		renderTarget.activeCubeFace = 4;
		renderer.render( scene, this.cameraPZ, renderTarget, true );

		renderTarget.texture.generateMipmaps = generateMipmaps;

		renderTarget.activeCubeFace = 5;
		renderer.render( scene, this.cameraNZ, renderTarget, true );

		renderer.setRenderTarget( null );

	};

};

BOB.CubeCamera.prototype = Object.create( THREE.Object3D.prototype );
BOB.CubeCamera.prototype.constructor = BOB.CubeCamera;
