function configMainCamera(){
    mainCamera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    mainCamera.position.copy(new THREE.Vector3(9.0, 6.4, -1.0));

    // cCamera = mainCamera;

    // tool
    controls = new THREE.OrbitControls( mainCamera, renderer.domElement);
    controls.enableKeys = false;
}

function configSubCamera(){
    subCamera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 0.1, 1000
    );

    droneRoot.add(subCamera);
    subCamera.position.set(0.0, 3.5, 5.0);
    subCamera.lookAt(droneRoot.position);
    cCamera = subCamera;
}

function toggleCamera(){
    cCamera = (cCamera.uuid == mainCamera.uuid) ? subCamera : mainCamera;
}

function resizeCameras(){
    mainCamera.aspect = window.innerWidth / window.innerHeight;
    mainCamera.updateProjectionMatrix();

    subCamera.aspect = window.innerWidth / window.innerHeight;
    subCamera.updateProjectionMatrix();

    postCamera.left = postPanelDim.x / - 2;
    postCamera.right = postPanelDim.x / 2;
    postCamera.top = postPanelDim.y / 2;
    postCamera.bottom = postPanelDim.y / - 2;
    postCamera.updateProjectionMatrix();
}