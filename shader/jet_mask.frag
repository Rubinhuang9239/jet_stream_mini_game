#ifdef GL_ES
precision mediump float;
#endif

uniform bool u_visibility;
uniform float u_time;
uniform sampler2D u_effectorTex;

varying vec2 v_uv;
varying vec3 v_normal;

void main(){
    if(!u_visibility){
        discard;
    }
    if(v_uv.y > 0.9){
        discard;
    }
    
    vec3 camDir = vec3(0.0, 0.0, 1.0);

    vec2 tile = floor( (v_uv + vec2(u_time * 0.3, u_time * 0.5) ) * vec2(0.5));
    vec2 tileCoord = (v_uv + vec2(u_time * 0.3, u_time * 0.5)) * vec2(0.5) - tile;
    vec4 effectorTex = texture2D(u_effectorTex, tileCoord);
    float effectorVal = effectorTex.r * 1.5;

    vec4 color = vec4(0.0);

    // volumetric stream
    float thickness = pow(clamp(dot(camDir, v_normal) * 10.0, 0.0, 1.0), 2.0);
    color = vec4(
        thickness, 
        0.0,
        0.0,
        v_uv.y * thickness * effectorVal
    );

    gl_FragColor = color;
}