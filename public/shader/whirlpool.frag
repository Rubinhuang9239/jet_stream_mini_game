#ifdef GL_ES
precision mediump float;
#endif

uniform bool u_useDistort;
uniform float u_distortLevel;
uniform float u_time;
uniform sampler2D u_speedTex;

varying vec2 v_uv;

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                        vec2(12.9898,78.233)))
                * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float circleShape(vec2 position, float radius){
    return smoothstep(radius, radius-0.15, length(position - vec2(0.5)));
}

void main(){
    if(!u_useDistort){
        discard;
    }

    vec4 color;

    vec4 speedTex = texture2D(u_speedTex, v_uv);
    vec4 speedTexTrans = vec4(speedTex.rgb, speedTex.r);

    float noiseVal = noise(v_uv * 3.2 + u_time * 1.6) * u_distortLevel; 
    float dist = distance(v_uv, vec2(0.5));
    dist += noiseVal*(1.25-dist);
    color += speedTexTrans * sin(dist * 36.0 - u_time * 26.0) + 0.2;

    float circle = circleShape(v_uv, 0.5);

    gl_FragColor = vec4(color.rgb, color.a * circle * 0.18); // color.a * 0.12
}