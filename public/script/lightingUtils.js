// Add light
let dirLight_0;

function addLight(){
    const ambientLight = new THREE.AmbientLight(0xFFBE9F, 0.69);
    scene.add(ambientLight);
    dirLight_0 = new THREE.DirectionalLight(0xFFDDCC, 0.72);
    dirLight_0.position.set(10.0,6.9,-7.5);
    scene.add(dirLight_0);
    scene.add(dirLight_0.target);

    lightGroup.dir = dirLight_0;
    lightGroup.ambient = ambientLight;

    // config shadow
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    dirLight_0.castShadow = true;

    dirLight_0.shadow.mapSize.width = 256;
    dirLight_0.shadow.mapSize.height = 256;

    dirLight_0.shadow.camera.left = -5;
    dirLight_0.shadow.camera.right = 5;
    dirLight_0.shadow.camera.top = 5;
    dirLight_0.shadow.camera.bottom = -5;

    // const helper = new THREE.CameraHelper( dirLight_0.shadow.camera );
    // scene.add( helper );
}

// Toggle Lighting
function toggleLighting( state ){
    lightGroup.dir.intensity = state ? 0.9 : 0.0;
    lightGroup.ambient.intensity = state ? 0.8 : 0.0;
}

function updateDirLightPos(pos){
    dirLight_0.position.copy(
        pos.clone().add(new THREE.Vector3(10.0,6.9,-7.5))
    );
    dirLight_0.target.position.copy(pos);
}