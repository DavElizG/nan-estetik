precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

varying vec2 vUv;

// Noise function from https://www.shadertoy.com/view/lsf3WH
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                       -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    st.x *= uResolution.x/uResolution.y;

    vec2 mouse = uMouse;
    mouse.x *= uResolution.x/uResolution.y;

    float waveA = snoise(st * 2.2 + vec2(uTime * 0.08, -uTime * 0.05));
    float waveB = snoise(st * 4.2 + vec2(-uTime * 0.12, uTime * 0.07));
    float wave = 0.6 * waveA + 0.4 * waveB;

    float dist = distance(st, mouse);
    float cursorInfluence = 1.0 - smoothstep(0.08, 0.45, dist);

    // Dark metallic base + controlled golden highlights (no white)
    vec3 baseColor = vec3(0.02, 0.018, 0.012);
    vec3 darkGold = vec3(0.38, 0.29, 0.08);
    vec3 richGold = vec3(0.83, 0.68, 0.21); // #d4af37

    float ribbons = smoothstep(0.2, 0.78, wave + cursorInfluence * 0.35);
    float sheen = smoothstep(0.55, 0.95, waveB + 0.25);

    vec3 color = mix(baseColor, darkGold, ribbons * 0.55);
    color = mix(color, richGold, sheen * 0.35);

    gl_FragColor = vec4(color, 1.0);
}
