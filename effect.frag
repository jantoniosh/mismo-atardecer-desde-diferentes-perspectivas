#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

uniform sampler2D u_tex0;
uniform sampler2D u_tex1;
uniform sampler2D u_tex2;
uniform sampler2D u_tex3;

uniform float factor;

#define M_PI 3.14159265358979323846

vec3 colormap(float v){
	float r=(.5+.5*sin(M_PI*v));
	float g=(.5+.5*sin(M_PI*v+2.*M_PI/3.));
	float b=(.5+.5*sin(M_PI*v+4.*M_PI/3.));
	return vec3(r,g,b);
}

float calc(float x,float y,float t,float cost3,float sint5,float sint2){
	float ar=u_resolution.x/u_resolution.y;
	float v=0.;
	float xx=ar*x/(u_resolution.x)-ar/2.;
	float yy=y/u_resolution.y-.5;
	float cx=xx+.5*sint5;
	float cy=yy+.5*cost3;
	float v0=sin((xx*10.)+t);
	float v1=sin(10.*(xx*sint2+yy*cost3));
	float v2=sin(sqrt(100.*((cx*cx)+(cy*cy)))+1.+t);
	
	v=(sin(v0+v1+v2)+cos(v2+yy+t))/factor;
	
	return v;
}

void main(){
	float t=u_time;
	vec2 st=gl_FragCoord.xy;
	vec2 uv=gl_FragCoord.xy/u_resolution*.5;
	uv.y=1.-uv.y;
	float tt=t/1.;
	float cost3=cos(tt/3.);
	float sint5=sin(tt/5.);
	float sint2=sin(tt/2.);
	float v=calc(st.x,st.y,tt,cost3,sint5,sint2);
	vec3 f=colormap(v);
	
	vec4 tex0=texture2D(u_tex0,uv);
	vec4 tex1=texture2D(u_tex1,uv);
	vec4 tex2=texture2D(u_tex2,uv);
	vec4 tex3=texture2D(u_tex3,uv);
	
	vec4 miA=mix(tex0,tex1,f.r);
	vec4 miB=mix(tex2,tex3,f.b);

	vec4 mi = mix(miA,miB,f.g);
	
	gl_FragColor=mi;
}