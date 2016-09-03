/**
	expects 
		mediaList div id
		video with id 'video'
		videoPanel
		controlPanel
**/ 
function mediaUtils(scene, camera, stills, videos, 
	   mediaListContainerId, cameraControlsContainerId, videoControlsContainerId) {
	var that = this;
	this.stills = stills;
	this.videos = videos;
	this.mediaListContainerId = mediaListContainerId;
	this.cameraControlsContainerId = cameraControlsContainerId;
	this.videoControlsContainerId = videoControlsContainerId;

	this.camera = camera;
	this.scene = scene;

	this.video = document.getElementById("video");
	this.videoTexture = undefined; 
	this.videoSource = "";
    this.videoDisplayed = false;
    this.rotateYAmount = 0;
    this.controlPanelVisible = true;
	document.body.onkeyup = function(e){
	    if(e.keyCode == 32)
	    	that.toggleControlPanel();
	}

    this.initMediaUtils = function() {
	    that.initSkyBox();
	    that.initVideo();
	    that.toggleControlPanel();
	    that.setupMediaIcons();
	    that.setupCameraControlIcons();
	    that.setupVideoControlIcons();
	}

    this.setupMediaIcons = function() {
        var textureListHTML = '';
        for (var i = 0; i < myTextures.length; i++)
            textureListHTML += "<span id=textureSelector_xxx class='tselector'>xxx</span>".replace(/xxx/g, myTextures[i]);

        for (var i = 0; i < myVideos.length; i++)
            textureListHTML += "<span id=textureSelector_xxx class='vselector'>xxx</span>".replace(/xxx/g, myVideos[i]);
        
        document.getElementById(that.mediaListContainerId).innerHTML = textureListHTML;

        $('.tselector').mouseover(that.updateSkyDome);
        $('.vselector').mouseover(that.updateVideo);
    }
    this.setupVideoControlIcons = function() {
    	var container = document.getElementById(that.videoControlsContainerId);
    	appendSingleCameraIcon(container, 'videoControlIcon', 'rewind', 'Video Back', that.video_rewind);
    	appendSingleCameraIcon(container, 'videoControlIcon', 'play', 'Video Play', that.video_play);
    	appendSingleCameraIcon(container, 'videoControlIcon', 'stop', 'Video Stop', that.video_stop);
    	appendSingleCameraIcon(container, 'videoControlIcon', 'ff', 'Video Forward', that.video_ff);
    	appendSingleCameraIcon(container, 'videoControlIcon', 'replay', 'Video Restart', that.video_restart);
    }
    this.setupCameraControlIcons = function() {
    	var container = document.getElementById(that.cameraControlsContainerId);
    	appendSingleCameraIcon(container, 'cselector', 'left', 'Camera Left', that.cameraLeft);
    	appendSingleCameraIcon(container, 'cselector', 'up', 'Camera Up', that.cameraUp);
    	appendSingleCameraIcon(container, 'cselector', 'down', 'Camera Down', that.cameraDown);
    	appendSingleCameraIcon(container, 'cselector', 'right', 'Camera Right', that.cameraRight);
    	appendSingleCameraIcon(container, 'cselector', 'stop', 'Camera Stop', that.cameraStop);
    	appendSingleCameraIcon(container, 'cselector', 'flipCamera', 'Flip Camera', that.flipCamera);
    }
    function appendSingleCameraIcon(containerEl, style, png, title, callback) {
    	var el;
    	el = document.createElement('span');
    	el.innerHTML = "<img src='icons/xxx.png' title=\"yyyy\" class='zzz'></img>"
    		.replace('xxx', png).replace('yyy', title).replace('zzz', style);
    	$(el).click(callback);
    	containerEl.appendChild(el);
    }
	this.toggleControlPanel = function() {
    	that.controlPanelVisible = !that.controlPanelVisible;
    	if (that.controlPanelVisible) {
			$('.controlPanel').hide();
			$('.videoPanel').hide();
		}
		else {
			$('.controlPanel').show();
			$('.videoPanel').show();
		}
	}

	this.animate = function() {
		var unitVector = (new THREE.Vector3()).copy(that.camera.position).normalize();
        that.camera.position.set(unitVector.x, unitVector.y, unitVector.z);
        that.camera.lookAt(new THREE.Vector3(0,0,0));
        that.skyBox.rotateY(that.rotateYAmount);
		if (that.videoDisplayed &&  that.video.readyState === that.video.HAVE_ENOUGH_DATA ) {
		  if (that.videoTexture) that.videoTexture.needsUpdate = true;
		}		
	}
    this.updateSkyDome = function(event) {
    	var pid = event.target.id.replace('textureSelector_','');
        that.videoDisplayed = false;
        that.video.pause();
        var pathToTexture = 'textures/' + pid + '.jpg';
		(new THREE.TextureLoader()).load(pathToTexture, function ( texture ) {
		    var skyMaterial = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide });

			that.skyBox.material = skyMaterial;

		});
    }
    this.initSkyBox = function() {
        var segment = 256.;
        var sphereRadius = 10;
        var skyGeometry = new THREE.SphereGeometry(sphereRadius,segment,segment);
		var newMaterial = new THREE.MeshNormalMaterial();
        that.skyBox = new THREE.Mesh( skyGeometry, newMaterial);
        that.scene.add( that.skyBox );
        that.skyBox.position.set(0,0,0);
        that.skyBox.scale.set(1,1,-1);
    }
    this.initVideo = function() {
        that.video  = document.getElementById('video');
        that.videoSource = document.createElement('source');
        that.video.appendChild(that.videoSource);
    }
	this.updateVideo = function(event) {
    	var pid = event.target.id.replace('textureSelector_','');
        console.log('in video: ' + pid);
        var pathToTexture = 'textures/' + pid + '.mp4';

        that.videoSource.setAttribute('src', pathToTexture);
        that.video.load();

        that.videoTexture = new THREE.Texture(that.video);
        that.videoTexture.minFilter = THREE.LinearFilter;
        that.videoTexture.magFilter = THREE.LinearFilter;
        that.videoTexture.generateMipmaps = false;
        that.video.play();

        that.videoTexture.minFilter = THREE.LinearFilter;   // eliminates aliasing when tiling textures.
        var videoMaterial = new THREE.MeshBasicMaterial({
            map: that.videoTexture,
            overdraw: true,
            side: THREE.DoubleSide 
        });
        that.skyBox.material = videoMaterial;
        that.videoDisplayed = true;
	}
    this.video_play = function() {
		that.video.play();
    }
    this.video_stop = function() {
		that.video.pause();    	
    }
    this.video_restart = function() {
        that.video.currentTime = 0;
		that.video.play();
    }
    this.video_skip = function(value) {
        that.video.currentTime += value;
    }
    this.video_rewind = function() {
    	that.video_skip(-10);
    }
    this.video_ff = function() {
    	that.video_skip(10);
    }
    this.cameraLeft = function() {
        that.rotateYAmount -= 0.002;
    }  
    this.cameraRight = function() {
        that.rotateYAmount += 0.002;
    }  
    this.cameraStop = function() {
        that.rotateYAmount = 0.;
    }  
    this.flipCamera = function() {
    	that.camera.position.x = - that.camera.position.x;
    	that.camera.position.y = - that.camera.position.y;
    	that.camera.position.z = - that.camera.position.z;
    }
    this.initMediaUtils();
}