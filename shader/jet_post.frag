#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform sampler2D u_diffuseTex;
uniform sampler2D u_maskTex;

varying vec2 v_uv;

void main(){
    vec3 mask = texture2D(u_maskTex, v_uv).rgb;

    vec3 color;
    if(mask.r > 0.1){
        color = texture2D(
            u_diffuseTex, 
            vec2(
                v_uv.x + mask.r * 0.02,
                v_uv.y - mask.r * 0.035
            )
        ).rgb + vec3(pow(mask.r * 0.2, 1.5)*1.6, mask.r * 0.05, pow(mask.r * 0.45, 2.2) * 4.0);
    }
    else{
        color = texture2D(u_diffuseTex, v_uv).rgb;
    }

    gl_FragColor = vec4(color,1.0);
}