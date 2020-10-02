#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
varying vec2 v_uv;
varying vec3 v_normal;

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

void main() {
    v_uv = uv;
    v_normal = (modelViewMatrix * vec4(normal, 0.0)).xyz;

    vec3 distortion = normal * 6.4 * pow(1.0-uv.y,2.9) * noise(vec2(0.0, uv.y * 36.0 + u_time * 12.0));
    vec3 p_position = position + distortion;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p_position, 1.0);
}