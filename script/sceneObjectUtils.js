// Add 3D Obejct
async function addObject3D(){
    // const gridHelper = new THREE.GridHelper( 20, 20 );
    // scene.add( gridHelper );

    const droneScene = (await loadGLTFModel('shader/asset/Drone.gltf')).scene;
    droneModel = droneScene.children[0];
    droneModel.scale.set(0.1,0.1,0.1);

    droneModel.traverse(child => {
        if(child.material){
            child.material.map.encoding = THREE.LinearEncoding;
        }
    });

    droneModel.position.set(5, 2.75, 0);
    droneModel.children[0].rotation.y = -0.5 * Math.PI;
    controls.target.copy(droneModel.position);
    controls.update();
    scene.add(droneModel);

    // Effect host

    const targetL = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 16, 16),
        new THREE.MeshBasicMaterial({color: 0x000077})
    );
    const targetR = targetL.clone();

    droneModel.add(targetL,targetR);
    targetL.position.set(-8.15,4.6,1.1);
    targetR.position.set(8.15,4.6,1.1);
    scene.attach(targetL);
    scene.attach(targetR);

    jet_mask_uniforms.u_effectorTex.value = await loadTexture('img/stain.jpg');
    jet_mask_uniforms.u_effectorTex.value.wrapS = THREE.ClampToEdgeWrapping;
    jet_mask_uniforms.u_effectorTex.value.wrapT = THREE.ClampToEdgeWrapping;

    const jetMaskShaderMat = new THREE.ShaderMaterial({
        uniforms: jet_mask_uniforms,
        vertexShader: await loadShader('shader/jet_mask.vert'),
        fragmentShader: await loadShader('shader/jet_mask.frag'),
        // side: THREE.DoubleSide,
        transparent: true
    });

    const jetConeLeft = new THREE.Mesh(
        new THREE.ConeGeometry( 5, 28, 64, 1, true),
        jetMaskShaderMat
    );
    const jetConeRight = jetConeLeft.clone()

    jetConeLeft.rotation.x = Math.PI * 0.5;
    jetConeRight.rotation.x = Math.PI * 0.5;

    const groupL = new THREE.Group();
    const groupR = new THREE.Group();
    droneModel.add(groupL, groupR);

    groupL.add(jetConeLeft);
    groupR.add(jetConeRight);
    groupL.position.set(-7.15,1.0,2.2);
    groupR.position.set(7.15,1.0,2.2);
    groupL.lookAt(targetL.position);
    groupR.lookAt(targetR.position);

    droneModel.attach(targetL);
    droneModel.attach(targetR);

    const diffL = new THREE.Vector3(
        groupL.position.x - targetL.position.x,
        groupL.position.y - targetL.position.y,
        groupL.position.z - targetL.position.z
    );
    groupL.position.set(
        groupL.position.x + diffL.x * 1.7,
        groupL.position.y + diffL.y * 1.7,
        groupL.position.z + diffL.z * 1.7
    );

    const diffR = new THREE.Vector3(
        groupR.position.x - targetR.position.x,
        groupR.position.y - targetR.position.y,
        groupR.position.z - targetR.position.z
    );
    groupR.position.set(
        groupR.position.x + diffR.x * 1.7,
        groupR.position.y + diffR.y * 1.7,
        groupR.position.z + diffR.z * 1.7
    );

    // land background
    const landScene = (await loadGLTFModel('shader/asset/mexican_hat.gltf')).scene;
    const landModel = landScene.children[0];
    landModel.traverse(child=>{
        if(child.material && child.material.type == 'MeshBasicMaterial'){
            const defaultTexture = child.material.map;
            defaultTexture.encoding = THREE.LinearEncoding;
            const replaceMat = new THREE.MeshStandardMaterial({
                map: defaultTexture,
            });
            child.material = replaceMat;
        }
    });
    scene.add(landModel);
}

// Toggle Jet Stream
function toggleJetStream( state ){
    jet_mask_uniforms.u_visibility.value = state ? state : false;
}
