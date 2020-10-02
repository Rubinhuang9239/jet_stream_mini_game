// Handle input

const moveDir = {
    w: 0.0,
    s: 0.0,
    a: 0.0,
    d: 0.0
};

let rotateArc = {
    pitch: 0.0,
    yaw: 0.0,
    roll: 0.0
};

let lastView = 0;

let gunCoolDown = 0.0;

function reciveJoyStickData(data){
    moveDir.w = data.pitch * 0.1;
    moveDir.d = data.roll * 0.1;
    rotateArc.yaw = data.yaw * -0.05;

    if(lastView == 0 && data.view == 1){
        toggleCamera();
    }
    lastView = data.view;

    const cTime = (new Date()).getTime();
    const timePassed = cTime - gunCoolDown;
    if(data.trigger == 1 && timePassed > 200){
        gunCoolDown = cTime;
        fire();
    }
}

function calcuInput(){
    const localDirFactor = new THREE.Vector3(
        moveDir.a + moveDir.d,
        0.0,
        moveDir.w + moveDir.s
    );

    const localToWorldForward = new THREE.Vector3(
        0,
        0,
        1 * localDirFactor.z
    ).transformDirection( droneRoot.matrixWorld )
    .multiplyScalar(Math.abs(localDirFactor.z));

    const localToWorldRight = new THREE.Vector3(
        1 * localDirFactor.x,
        0,
        0
    ).transformDirection( droneRoot.matrixWorld )
    .multiplyScalar(Math.abs(localDirFactor.x));

    rotTarget.position.set(
        10 * localDirFactor.x,
        2,
        6 * localDirFactor.z
    );

    const worldRotTarget = new THREE.Vector3();
    rotTarget.getWorldPosition(worldRotTarget);
    droneRotGroup.lookAt(
        worldRotTarget
    );

    return {
        translate: new THREE.Vector3().addVectors(
            localToWorldForward,
            localToWorldRight
        ),
        rotate: rotateArc
    }
}