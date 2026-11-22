import*as f from'node:fs'
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output'
const A='01146abf2222222299999995999599929992222222222222044002222222222258222222222222224414'
const F=[(a,b)=>a+b,(a,b)=>a-b,Math.imul,(a,b)=>a==-2147483648&&b==-1?a:a/b,(a,b)=>b==-1?0:a%b,(a,b)=>(a>>>0)/(b>>>0),(a,b)=>(a>>>0)%(b>>>0),(a)=>-a,(a,b)=>a&b,(a,b)=>a|b,(a,b)=>a^b,(a)=>~a,(a,b)=>a<<(b&31),(a,b)=>a>>(b&31),(a,b)=>a>>>(b&31),0,(a,b)=>a==b?1:0,(a,b)=>a<b?1:0,(a,b)=>(a>>>0)<(b>>>0)?1:0]
for(const d of f.readdirSync(I).sort()){
const P=f.readFileSync(I+'/'+d+'/program.bin'),Q=f.readFileSync(I+'/'+d+'/input.bin'),n=P.length
const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),B=new Uint8Array(65536)
let s=0,c=0,p=0,t=0,o=0,q=0,e=0
for(;;){
if(t==1e6){e=10;break}
if(p<0||p>=n){e=9;break}
const x=P[p],v=parseInt(A[x],16)
if(v!=v||v==2){e=5;break}
const i=x==1?1:x==2?4:x>47&&x<52?2:0
if(p+i>=n){e=9;break}
t++
const y=p+1+i,po=v>>2,pu=v&3
if(s<po){e=2;break}
if(s-po+pu>256){e=3;break}
p=y
if(x<8){
if(x==0)break
else if(x==1)D[s++]=P.readInt8(y-1)
else if(x==2)D[s++]=P.readInt32LE(y-4)
else if(x==3)s--
else if(x==4)D[s++]=D[s-2]
else if(x==5)[D[s-1],D[s-2]]=[D[s-2],D[s-1]]
else if(x==6)D[s++]=D[s-3]
else[D[s-3],D[s-2],D[s-1]]=[D[s-2],D[s-1],D[s-3]]
}else if(x<35){
if(x==23||x==27)D[s-1]=F[x-16](D[s-1])
else{const b=D[s-1],a=D[s-2];if(x>18&&x<23&&!b){e=4;break}s-=2;D[s++]=F[x-16](a,b)}
}else if(x<53){
if(x<51){const r=P.readInt16LE(y-2);if(x==48||(x==49?D[--s]==0:D[--s]!=0))p=y+r}
else if(x==51){if(c==64){e=7;break}C[c++]=y;p=P[y-2]|P[y-1]<<8}
else{if(c==0){e=8;break}p=C[--c]}
}else if(x<66){
if(x==64){const a=D[s-1];if(a>>>0>255){e=6;break}D[s-1]=M[a]}
else{const a=D[s-1],v=D[s-2];if(a>>>0>255){e=6;break}s-=2;M[a]=v}
}else{
if(x==80){const z=Buffer.from(''+D[--s]);if(o+z.length>65536){e=11;break}B.set(z,o);o+=z.length}
else if(x==81){if(o>65535){e=11;break}B[o++]=D[--s]&255}
else if(x==82)D[s++]=q<Q.length?Q[q++]:-1
else{e=D[--s]&255;break}
}
}
f.mkdirSync(O+'/'+d,{recursive:true})
f.writeFileSync(O+'/'+d+'/stdout.bin',B.subarray(0,o))
f.writeFileSync(O+'/'+d+'/exit.txt',e+'\n')
}
