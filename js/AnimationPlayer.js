	AnimationPlayer = function(name, rotation)
	{
	  var meshes = [], mixers = [], hemisphereLight, camera, scene, renderer, controls;
      var clock = new THREE.Clock;
      var clips = [];
      var play;
      var group;
      var animspeed =.1;

	  init();
	  animate();


      function init()
      {
      container = document.createElement('div');
      document.body.appendChild(container);
      scene = new THREE.Scene();
      scene.background = new THREE.Color( 0xffffff );


      //hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x222222, 0.9); //( skyColor, groundColor, intensity )
      //hemisphereLight.position.set(0, 10000, 0);
      //scene.add(hemisphereLight);

      scene.add(new THREE.AmbientLight(0x161616, 1));

      renderer = new THREE.WebGLRenderer( { antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      window.addEventListener('resize', onWindowResize, false);

      var loader = new THREE.JDLoader();
      loader.load("../model/" + name + ".jd",
      function (data)
      {

      group = new THREE.Object3D();
      var multiMaterial = new THREE.MultiMaterial(data.materials);
      for (var i = 0; i < data.geometries.length; ++i)
                            {
                                var mesh = new THREE.SkinnedMesh(data.geometries[i], multiMaterial);
                                //mesh.position.y -= 50;
                                meshes.push(mesh);
								group.add(mesh);
                                //scene.add(mesh);
								//mesh.rotation.y += 180;
                                if (mesh.geometry.animations)
                                {
                                    var mixer = new THREE.AnimationMixer(mesh);
                                    mixers.push(mixer);
									clips.push(mesh.geometry.animations[0]);
                                    var action = mixer.clipAction(mesh.geometry.animations[0]);
									//action.setLoop(THREE.LoopOnce); 
									
									action.play(false);
									action.clampWhenFinished = true;
									play = false;
									
									//mixers[i].existingAction (clips[i]).time = 3;
                                }
                            }
							scene.add(group);
							mixers[0].addEventListener( 'loop', Finished);
                            camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10 * data.boundingSphere.radius);
                            camera.position.z = group.position.z + 2.5 * data.boundingSphere.radius;//data.boundingSphere.center.z + 2.5 * data.boundingSphere.radius;
							
              
                            camera.lookAt(group.position);      
                            
                            scene.add(camera);  //mainLight.position.copy(camera.position);
                            camera.add(new THREE.DirectionalLight(0xFFFFFF, 1));                            
                            if (!controls)
                               controls = new THREE.TrackballControls( camera, renderer.domElement );
							   //controls = new THREE.OrbitControls(camera, renderer.domElement);
                            //controls.target.copy(data.boundingSphere.center);
                            controls.target.copy(group.position);
							//console.log(controls.minDistance + "  " + controls.maxDistance );
              
							controls.minDistance = 300;
							controls.maxDistance = 400;

							controls.enableDamping = true;
							controls.dampingFactor = 0.10;
							controls.enableZoom = true;
							controls.rotateSpeed = 4;
							controls.zoomSpeed = 0.5;
							controls.panSpeed = 1;
							//•unlock the polar angle limits (for the contoller)
              
                            InitRot(group);
                              
                        });

        }

        function InitRot(temp)
        {
          temp.rotation.x += rotation.x / 180 * Math.PI;
          temp.rotation.y -= rotation.y / 180 * Math.PI;
          temp.rotation.z += rotation.z / 180 * Math.PI;
          
        }                      
       function animate()
        {
            var delta = clock.getDelta();
			//if(mixers[0])
			
            for (var i = 0; i < mixers.length; ++i)
            {
				    //console.log((mixers[i].existingAction (clips[i]).time / clips[i].duration) * 100);
					    if(play && (mixers[i].existingAction(clips[i]).time / clips[i].duration  ) * 100 < 90)
					        {
					          mixers[i].update(delta * animspeed);
					          var percent = (mixers[i].existingAction (clips[i]).time / clips[i].duration);
					          document.getElementById("range").value = percent * 100;
					        }
					    else if(lastVal != document.getElementById("range").value &&  (mixers[i].existingAction(clips[i]).time / clips[i].duration  ) < 90 )
                  {

                    mixers[i].existingAction(clips[i]).time = document.getElementById("range").value / 100 * clips[i].duration;
                    mixers[i].update(delta);
                  }
              }

              lastVal = document.getElementById("range").value ;
              if (controls) controls.update();

              if (camera)  renderer.render(scene, camera);

              requestAnimationFrame(animate);
              }

              function onWindowResize()
              {
              if (camera)
              {
              camera.aspect = window.innerWidth / window.innerHeight;
              camera.updateProjectionMatrix();
              }
              renderer.setSize(window.innerWidth, window.innerHeight);
              }

              function Seek(value)
              {
              if(play)
              PlayButton();
              }

              function RotateSpeed(s)
              {
              contols.rotateSpeed = s;

              }

              function AnimateSpeed(s)
              {
              animspeed = s;

              }
              function PlayButton()
              {
              
              if(play)
              {
              play = false;
              document.getElementById("Button").innerHTML = "Play";

              }
              else
              {
              play = true;
              document.getElementById("Button").innerHTML = "Pause";

              }
              }

              function Finished(e )
              {
              if(play)
              {
              console.log("finished");
              PlayButton()
              }
              }
	}
