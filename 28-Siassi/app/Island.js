function getHeightData(img, worldWidth, worldDepth) {

    var canvas = document.createElement( 'canvas' );
    canvas.width = worldWidth;
    canvas.height = worldDepth;
    var context = canvas.getContext( '2d' );

    var size = worldWidth * worldDepth, data = new Float32Array( size );

    context.drawImage(img,0,0);

    var mindata = 9999999, maxdata = -9999999;
    for ( var i = 0; i < size; i ++ ) {
        data[i] = 0
    }

    var imgd = context.getImageData(0, 0, worldWidth, worldDepth);
    var pix = imgd.data;

    var j=0;
    for (var i = 0, n = pix.length; i < n; i += (4)) {
        var all = pix[i]+pix[i+1]+pix[i+2];
        data[j] = 50 * all/30;	// 50 is the z resolution.
        if (pix[j] < mindata) mindata = data[j];
        if (data[j] > maxdata)
            maxdata = data[j];
        j++;
    }
    console.log(mindata + "," + maxdata);
    return data;
}

function generateTexture( indata, width, height ) {
    var data = new Uint8Array( indata.length );
	var canvas, canvasScaled, context, image, imageData,
	level, diff, vector3, sun, shade;

	vector3 = new THREE.Vector3( 0, 0, 0 );

	sun = new THREE.Vector3( 1, 1, 1 );
	sun.normalize();

	canvas = document.createElement( 'canvas' );
    //container.appendChild( canvas );
	canvas.width = width;
	canvas.height = height;

	context = canvas.getContext( '2d' );
	context.fillStyle = '#000';
	context.fillRect( 0, 0, width, height );

	image = context.getImageData( 0, 0, canvas.width, canvas.height );
	imageData = image.data;

	for ( var i = 0; i < indata.length; i++ ) data[i] = indata[i] * 128.0/1050.0;

	for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

		vector3.x = data[ j - 2 ] - data[ j + 2 ];
		vector3.y = 2;
		vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
		vector3.normalize();

		shade = vector3.dot( sun );

		imageData[ i ] = ( 0 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
		imageData[ i + 1 ] = ( 4 + shade * 5 ) * ( 0.5 + data[ j ] * 0.007 );
		imageData[ i + 2 ] = ( shade * 5 ) * ( 0.5 + data[ j ] * 0.007 );
		// imageData[ i ] = ( .8 + shade * 0 ) * ( 0.8 + data[ j ] * 0.007 );
		// imageData[ i + 1 ] = .9*( 16 + shade * 24 ) * ( 0.8 + data[ j ] * 0.007 );
		// imageData[ i + 2 ] = .9*( shade * 24 ) * ( 0.8 + data[ j ] * 0.007 );
	}

	context.putImageData( image, 0, 0 );

	// Scaled 4x

	canvasScaled = document.createElement( 'canvas' );
	canvasScaled.width = width * 4;
	canvasScaled.height = height * 4;

	context = canvasScaled.getContext( '2d' );
	context.scale( 4, 4 );
	context.drawImage( canvas, 0, 0 );

	image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
	imageData = image.data;

	for ( var i = 0, l = imageData.length; i < l; i += 4 ) {

		var v = ~~ ( Math.random() * 5 );

		imageData[ i ] += v;
		imageData[ i + 1 ] += v;
		imageData[ i + 2 ] += v;

	}

	context.putImageData( image, 0, 0 );

	return canvasScaled;

}

