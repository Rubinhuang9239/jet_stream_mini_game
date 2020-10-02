// let arrowHelper;
// Add 3D Obejct
async function addObject3D(){

    const droneScene = (await loadGLTFModel('shader/asset/Drone.gltf')).scene;
    droneModel = droneScene.children[0];
    droneModel.scale.set(0.1,0.1,0.1);

    droneModel.traverse(child => {
        if(child.material){
            child.material.map.encoding = THREE.LinearEncoding;
            child.castShadow = true;
        }
    });
    // rotation correction
    droneModel.children[0].rotation.y = -0.5 * Math.PI;

    droneRoot = new THREE.Group();
    droneRotGroup = new THREE.Group();
    droneRoot.add(droneRotGroup);
    droneModel.rotation.x = Math.PI * 0.5;
    droneRotGroup.up = new THREE.Vector3(0,0,-1);
    droneRotGroup.add(droneModel);
    // raise
    droneRoot.position.set(0, 4.75, 0);
    scene.add(droneRoot);

    // gunPos = new THREE.Mesh(
    //     new THREE.BoxGeometry(0.1,0.1,0.5),
    //     new THREE.MeshBasicMaterial({color: 0x00FF77})
    // );

    gunPos = new THREE.Object3D();

    droneModel.attach(gunPos);
    gunPos.position.set(0,-1.9,-14);
    gunPos.rotation.x = Math.PI * -1.145;

    // arrowHelper = new THREE.ArrowHelper(
    //     new THREE.Vector3(),
    //     new THREE.Vector3(),
    //     2,
    //     0x00FFAA
    // );

    // scene.add( arrowHelper );

    // rotation target
    rotTarget = new THREE.Object3D();
    droneRoot.add(rotTarget);
    rotTarget.position.y = 2;

    // turbine
    const turboFanL = new THREE.Mesh(
        new THREE.PlaneGeometry(2.4,2.4,1.0),
        new THREE.MeshStandardMaterial({
            map: await loadTexture('img/turbine_fan.png'),
            transparent: true
        })
    );
    const turboFanR = turboFanL.clone();

    droneModel.add(turboFanL, turboFanR);
    turboFanL.rotation.x = Math.PI * -0.6;
    turboFanR.rotation.x = Math.PI * -0.6;
    turboFanL.rotation.y = Math.PI * -0.1;
    turboFanR.rotation.y = Math.PI * 0.1;
    turboFanL.position.set(-8.57,6.12,0.6);
    turboFanR.position.set(8.57,6.12,0.6);
    turboFans.push(turboFanL, turboFanR);

    // Effect host
    const targetL = new THREE.PointLight(0x5522FF, 10, 0.4);
    const targetR = targetL.clone();

    droneModel.add(targetL,targetR);
    targetL.position.set(-7.8,3.9,1.32);
    targetR.position.set(7.8,3.9,1.32);
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
        new THREE.ConeGeometry( 6, 34, 80, 32, true),
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
        groupL.position.x + diffL.x * 2.47,
        groupL.position.y + diffL.y * 2.47,
        groupL.position.z + diffL.z * 2.47
    );

    const diffR = new THREE.Vector3(
        groupR.position.x - targetR.position.x,
        groupR.position.y - targetR.position.y,
        groupR.position.z - targetR.position.z
    );
    groupR.position.set(
        groupR.position.x + diffR.x * 2.47,
        groupR.position.y + diffR.y * 2.47,
        groupR.position.z + diffR.z * 2.47
    );

    whirlpool_uniforms.u_speedTex.value = await loadTexture('img/radical.jpg');
    whirlpoolMat = new THREE.ShaderMaterial({
        uniforms: whirlpool_uniforms,
        vertexShader: await loadShader('shader/whirlpool.vert'),
        fragmentShader: await loadShader('shader/whirlpool.frag'),
        transparent: true
    });

    whirlpoolBase = new THREE.Mesh(
        new THREE.PlaneGeometry(6.4, 6.4, 1),
        whirlpoolMat
    );
    whirlpoolBase.rotation.x = Math.PI * -0.5;

    droneRoot.add(whirlpoolBase);
    whirlpoolBase.position.set(0,-2.55,1.3);

    // return;

    // land background
    const landScene = (await loadGLTFModel('shader/asset/airport.gltf')).scene;
    const landModel = landScene.children[0];
    landModel.traverse(child=>{
        if(child.material){
            const defaultTexture = child.material.map;
            defaultTexture.encoding = THREE.LinearEncoding;
            const replaceMat = new THREE.MeshStandardMaterial({
                map: defaultTexture,
                color: 0xCCDDFF
            });
            child.material = replaceMat;
            child.receiveShadow = true;
       }
    });
    landModel.rotateY(Math.PI * 0.5);
    scene.add(landModel);
}

// Toggle Jet Stream
function toggleJetStream( state ){
    jet_mask_uniforms.u_visibility.value = state ? state : false;
}

async function addSkySphere(){
    const sphereTexture = await loadTexture('img/sky_sphere.jpg');
    skySphere = new THREE.Mesh(
        new THREE.SphereGeometry(320,32,32),
        new THREE.MeshBasicMaterial({
            map: sphereTexture,
            side: THREE.BackSide,
            // color: 0x000000
        }),
    );
    scene.add(skySphere);
}

function fire() {
    const initWorldPos = new THREE.Vector3();
    const initWorldDir = new THREE.Vector3();
    gunPos.getWorldPosition(initWorldPos);
    gunPos.getWorldDirection(initWorldDir);

    const bullet = new Bullet(initWorldPos, initWorldDir);
    bullets.push(bullet);
    scene.add(bullet.mesh);
}
