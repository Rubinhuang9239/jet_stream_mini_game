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
    if(mask.r > 0.08){
        color = texture2D(
            u_diffuseTex, 
            vec2(
                v_uv.x + mask.r * 0.036,
                v_uv.y - mask.r * 0.052
            )
        ).rgb + vec3(pow(mask.r * 0.4, 2.5)*2.8, mask.r * 0.32, pow(mask.r * 0.55, 1.5) * 3.2);
    }
    else{
        color = texture2D(u_diffuseTex, v_uv).rgb;
    }

    // float brightness = (color.r + color.g + color.b)/3.0;
    float bloomThresh = 0.32;
    float divideLevel = 0.001;
    int sampleLevel = 16;
    float avgSampleBrightness = 0.0;

    for(int i = 0; i < sampleLevel; i++){
        for(int j = 0; j < sampleLevel; j++){
            vec2 samplePos = v_uv + (
                vec2(float(i),float(j)) - vec2(float(sampleLevel)*0.5)
            ) * divideLevel;

            vec4 sampledColor = texture2D(u_diffuseTex, samplePos);
            avgSampleBrightness += (sampledColor.r + sampledColor.g + sampledColor.b)/3.0;
        }
    }
    avgSampleBrightness /= pow(float(sampleLevel), 2.0);
    float bloom = clamp( pow(avgSampleBrightness * 1.32, 2.0) - bloomThresh, 0.0, 1.0 ) * 0.9;
    
    color.rgb += vec3( bloom );
    
    gl_FragColor = vec4(color,1.0);
}