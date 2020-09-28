// Add light
function addLight(){
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const dirLight_0 = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight_0.position.set(5.0,10.0,10.0);
    dirLight_0.lookAt(0,0,0);
    scene.add(dirLight_0);

    lightGroup.dir = dirLight_0;
    lightGroup.ambient = ambientLight;
}

// Toggle Lighting
function toggleLighting( state ){
    lightGroup.dir.intensity = state ? 0.9 : 0.0;
    lightGroup.ambient.intensity = state ? 0.8 : 0.0;
}