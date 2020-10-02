const bulletGeo = new THREE.BoxGeometry(0.1,0.1,3.4);
const bulletMat = new THREE.MeshBasicMaterial({color: 0x00AAFF});

class Bullet{
    dir = undefined;
    pos = undefined;
    speedVal = 3.0;
    mesh = new THREE.Mesh(bulletGeo, bulletMat);

    constructor(initPos, initDir){
        this.mesh.position.copy(initPos ? initPos : new THREE.Vector3(0.0,0.0,0.0));
        this.dir = initDir ? initDir : new THREE.Vector3(0.0,0.0,-1.0);

        const matix = new THREE.Matrix4().lookAt(
            this.dir,
            new THREE.Vector3(0,0,0),
            new THREE.Vector3(0,1,0)
        );
        const quaternion = new THREE.Quaternion().setFromRotationMatrix(matix);
        this.mesh.applyQuaternion(quaternion);
    }

    update(){
        // move
        this.mesh.position.add(
            this.dir.clone().multiplyScalar(this.speedVal)
        );

        // dist
        const dist = this.mesh.position.distanceTo(cCamera.position);

        // return if need to be removed
        if(dist >= cCamera.far * 0.15){
            return true;
        }
        return false;
    }
}