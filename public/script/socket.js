const socket = io();
socket.on('input',data=>{
    reciveJoyStickData(
        mapData(data)
    );
});

function mapData(data){
    const mappedData = {
        roll: (data.roll / 1023) * 2.0 - 1.0,
        pitch: (data.pitch / 1023) * 2.0 - 1.0,
        yaw: (data.yaw / 255) * 2.0 - 1.0,
        throttle: (data.throttle / 255),
        trigger: data.trigger,
        view: data.view
    }
    return mappedData;
}