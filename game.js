import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

const canvas=document.querySelector('#game');
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x18251d);
scene.fog=new THREE.FogExp2(0x18251d,.022);
const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,140);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
scene.add(new THREE.HemisphereLight(0xb9d8bd,0x283224,1.55));
const moon=new THREE.DirectionalLight(0xe5d6a8,2.1);moon.position.set(-7,13,5);moon.castShadow=true;moon.shadow.mapSize.set(1024,1024);moon.shadow.camera.left=-22;moon.shadow.camera.right=22;moon.shadow.camera.top=22;moon.shadow.camera.bottom=-22;scene.add(moon);
const ambientGlow=new THREE.PointLight(0x8db69a,24,28,2);ambientGlow.position.set(-4,4,-3);scene.add(ambientGlow);
const groundMat=new THREE.MeshStandardMaterial({color:0x344735,roughness:.98});
const ground=new THREE.Mesh(new THREE.PlaneGeometry(150,150),groundMat);ground.rotation.x=-Math.PI/2;ground.position.y=-.09;ground.receiveShadow=true;scene.add(ground);
const grid=new THREE.GridHelper(100,50,0x71815b,0x52654b);grid.position.y=-.075;grid.material.transparent=true;grid.material.opacity=.13;scene.add(grid);

const mat=(color,roughness=.8,metalness=0,emissive=0,emissiveIntensity=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness,emissive,emissiveIntensity});
const mats={bark:mat(0x453b2b),bark2:mat(0x564633),leaf:mat(0x263c2d),leaf2:mat(0x334a34),moss:mat(0x71804d),rock:mat(0x51564a),gold:mat(0xcaaa62,.3,.7,0x6e4815,.5),steel:mat(0x9ca99b,.24,.8),cloth:mat(0x354c43),cloak:mat(0x242f2b),skin:mat(0xd0a47c),dark:mat(0x161b18),glow:mat(0xc6f4ce,.2,.1,0x83ffb2,3),purple:mat(0x55395b,.45,.2,0x48204d,.8),eye:mat(0xff643f,.2,.1,0xff2808,3)};
function mesh(geo,material,parent,x=0,y=0,z=0){const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
const sphereGeo=new THREE.SphereGeometry(1,14,10),cylGeo=new THREE.CylinderGeometry(1,1,1,10),boxGeo=new THREE.BoxGeometry(1,1,1);
function addTree(x,z,scale=1){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);scene.add(g);let trunk=mesh(new THREE.CylinderGeometry(.28,.48,4.7,9),mats.bark,g,0,2.25,0);trunk.rotation.z=(Math.random()-.5)*.12;for(let i=0;i<4;i++){const y=3.0+i*.52,r=1.9-i*.26;const crown=mesh(new THREE.IcosahedronGeometry(r,1),i%2?mats.leaf:mats.leaf2,g,(Math.random()-.5)*.45,y,0);crown.scale.set(1,.77,1);crown.rotation.y=Math.random()*6;}for(let i=0;i<3;i++){const root=mesh(new THREE.CylinderGeometry(.12,.25,1.5,7),mats.bark,g,Math.cos(i*2.1)*.52,.38,Math.sin(i*2.1)*.52);root.rotation.z=Math.cos(i*2.1)*.55;root.rotation.x=Math.sin(i*2.1)*.55}return g}
function addRock(x,z,s=1){let r=mesh(new THREE.DodecahedronGeometry(.8,0),mats.rock,scene,x,.34*s,z);r.scale.set(s*1.1,s*.6,s*.8);r.rotation.set(Math.random(),Math.random()*4,Math.random());return r}
const rnd=(a,b)=>a+Math.random()*(b-a);
for(let i=0;i<44;i++){const a=Math.random()*Math.PI*2,r=rnd(12,34);addTree(Math.cos(a)*r,Math.sin(a)*r,rnd(.75,1.35))}
for(let i=0;i<34;i++){const a=Math.random()*Math.PI*2,r=rnd(5,25);addRock(Math.cos(a)*r,Math.sin(a)*r,rnd(.3,.85))}
// ancient standing stones ring the playable clearing
for(let i=0;i<9;i++){const a=(i/9)*Math.PI*2,r=14;const stone=mesh(new THREE.CylinderGeometry(.38,.57,rnd(2,3.8),6),mat(0x68705b,.95,0,0x293526,.16),scene,Math.cos(a)*r,1.5,Math.sin(a)*r);stone.rotation.z=rnd(-.1,.1);const rune=mesh(new THREE.TorusGeometry(.45,.035,6,24),mats.glow,scene,Math.cos(a)*r,2.35,Math.sin(a)*r);rune.rotation.x=Math.PI/2;}
// firefly-like motes and luminous mushrooms
const motes=[];for(let i=0;i<60;i++){let p=mesh(new THREE.SphereGeometry(.035,6,5),mat(0xafffc0,.2,0,0x6dff9d,3),scene,rnd(-18,18),rnd(.4,3.2),rnd(-18,18));motes.push({mesh:p,phase:Math.random()*6,base:p.position.y})}
for(let i=0;i<32;i++){const a=Math.random()*Math.PI*2,r=rnd(4,17),x=Math.cos(a)*r,z=Math.sin(a)*r;const cap=mesh(new THREE.SphereGeometry(.22,8,7),mat(0xc680a0,.35,0,0x992d73,1.4),scene,x,.22,z);cap.scale.y=.5;mesh(new THREE.CylinderGeometry(.055,.075,.22,7),mat(0xd5d1b3),scene,x,.1,z)}

// Hero, assembled from low-poly forms; the emissive blade is the signature artifact.
const hero=new THREE.Group();scene.add(hero);hero.position.set(0,0,3);
const body=new THREE.Group();hero.add(body);
const torso=mesh(new THREE.CapsuleGeometry(.36,.65,4,8),mats.cloth,body,0,1.05,0);torso.scale.set(1,.9,.72);
mesh(new THREE.SphereGeometry(.37,10,8),mats.cloak,body,0,1.12,.16).scale.set(1,.95,.55);
mesh(new THREE.SphereGeometry(.23,10,8),mats.skin,body,0,1.9,-.03);
const hood=mesh(new THREE.ConeGeometry(.27,.58,7),mats.cloak,body,0,2.18,.02);hood.rotation.x=-.14;
mesh(new THREE.BoxGeometry(.3,.08,.28),mats.gold,body,0,.61,-.015);
const leftArm=new THREE.Group();leftArm.position.set(-.37,1.43,0);body.add(leftArm);mesh(new THREE.CapsuleGeometry(.12,.48,3,7),mats.cloth,leftArm,0,-.25,0).rotation.z=-.13;
const rightArm=new THREE.Group();rightArm.position.set(.37,1.45,0);body.add(rightArm);mesh(new THREE.CapsuleGeometry(.12,.48,3,7),mats.cloth,rightArm,0,-.25,0);
const legs=[];for(const x of [-.18,.18]){const leg=new THREE.Group();leg.position.set(x,.54,0);body.add(leg);mesh(new THREE.CapsuleGeometry(.13,.43,3,7),mats.dark,leg,0,-.23,0);legs.push(leg)}
const bladeRig=new THREE.Group();bladeRig.position.set(.03,-.52,-.08);rightArm.add(bladeRig);
mesh(new THREE.BoxGeometry(.11,.72,.07),mats.gold,bladeRig,0,-.42,0);
const blade=mesh(new THREE.BoxGeometry(.095,1.38,.1),mat(0xcfe8d2,.2,.7,0x7dffae,2.3),bladeRig,0,.58,0);blade.rotation.z=-.18;
const bladeTip=mesh(new THREE.ConeGeometry(.07,.22,4),mats.glow,bladeRig,-.13,1.37,0);bladeTip.rotation.z=-.18;
const crossguard=mesh(new THREE.BoxGeometry(.57,.09,.13),mats.gold,bladeRig,0,-.03,0);crossguard.rotation.z=-.18;
const pommel=mesh(new THREE.SphereGeometry(.11,8,7),mats.glow,bladeRig,0,-.86,0);
const swordAura=new THREE.PointLight(0x84ffb3,1.9,3);swordAura.position.set(0,.15,0);bladeRig.add(swordAura);

function makeWolf(x,z,index){const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);const fur=mat(index%2?0x493d48:0x3e4c43,.9,0,index%2?0x281333:0x121f17,.35);const under=mat(0x78615c,.9);const torso=mesh(new THREE.SphereGeometry(1,12,9),fur,g,0,.78,0);torso.scale.set(.65,.48,.95);
const head=new THREE.Group();head.position.set(0,1.08,-.72);g.add(head);mesh(new THREE.SphereGeometry(.4,12,9),fur,head,0,.05,-.2).scale.set(.8,.8,1.05);const muzzle=mesh(new THREE.ConeGeometry(.25,.55,7),under,head,0,-.08,-.57);muzzle.rotation.x=-Math.PI/2;
for(const ex of [-.2,.2]){const eye=mesh(new THREE.SphereGeometry(.07,8,6),mats.eye,head,ex,.15,-.48);const gl=new THREE.PointLight(0xff3f29,.38,1.2);gl.position.copy(eye.position);head.add(gl);const ear=mesh(new THREE.ConeGeometry(.13,.38,5),fur,head,ex*1.45,.42,-.08);ear.rotation.z=ex<0?.3:-.3;}
for(let i=0;i<3;i++){const spike=mesh(new THREE.ConeGeometry(.16,.42,5),fur,g,0,1.24,.15+i*.3);spike.rotation.x=Math.PI/2;}
const limbs=[];for(const sx of [-.4,.4])for(const sz of [-.58,.56]){const leg=new THREE.Group();leg.position.set(sx,.57,sz);g.add(leg);mesh(new THREE.CapsuleGeometry(.12,.4,3,7),fur,leg,0,-.23,0);mesh(new THREE.SphereGeometry(.13,8,6),under,leg,0,-.44,-.06).scale.set(1,.65,1.2);limbs.push(leg)}
const tail=mesh(new THREE.ConeGeometry(.13,.72,6),fur,g,0,.87,.94);tail.rotation.x=Math.PI*.7;const ring=mesh(new THREE.RingGeometry(.48,.57,24),mat(0xe88162,.3,.1,0x9f3426,1),scene,x,.05,z);ring.rotation.x=-Math.PI/2;ring.material.transparent=true;ring.material.opacity=.38;
const barGroup=new THREE.Group();barGroup.position.set(0,2.15,0);g.add(barGroup);mesh(new THREE.PlaneGeometry(1.05,.08),mat(0x180f10),barGroup,0,0,0);const fill=mesh(new THREE.PlaneGeometry(1,.05),mat(0xc25247),barGroup,0,0,.006);fill.position.x=0;fill.scale.x=1;
return {group:g,torso,head,limbs,tail,hp:65,maxHp:65,attack:0,walk:Math.random()*5,alive:true,fill,ring,index}}
const enemies=[];const spawnPoints=[[-5,-4],[5,-7],[-7,3],[7,4],[1,-10],[-10,-2],[10,-3],[0,9]];
let kills=0,active=false,ended=false,elapsed=0,health=100,mana=60,potions=2,attackTimer=0,spellTimer=0,rollTimer=0,invuln=0,animTime=0,walkBlend=0,toastTimer=0,combo=0,comboWindow=0;
const ui={healthFill:document.querySelector('#health-fill'),healthText:document.querySelector('#health-text'),manaFill:document.querySelector('#mana-fill'),manaText:document.querySelector('#mana-text'),xp:document.querySelector('#xp-fill'),kill:document.querySelector('#kill-count'),enemy:document.querySelector('#enemy-count'),objective:document.querySelector('#objective-text'),toast:document.querySelector('#toast'),start:document.querySelector('#start-screen'),death:document.querySelector('#death-screen'),victory:document.querySelector('#victory-screen'),crosshair:document.querySelector('#crosshair'),spell:document.querySelector('#spell-btn'),roll:document.querySelector('#roll-btn')};
function showToast(text){ui.toast.textContent=text;ui.toast.classList.add('show');toastTimer=2.2}
function setHealth(v){health=Math.max(0,Math.min(100,v));ui.healthFill.style.width=health+'%';ui.healthText.textContent=`${Math.ceil(health)} / 100`;if(health<=0)die()}
function setMana(v){mana=Math.max(0,Math.min(60,v));ui.manaFill.style.width=(mana/60*100)+'%';ui.manaText.textContent=`${Math.floor(mana)} / 60`}
function updateCounts(){ui.kill.textContent=`${kills} / 5`;ui.enemy.textContent=`${enemies.filter(e=>e.alive).length} THREATS`;ui.xp.style.width=Math.min(100,kills*20)+'%';if(kills>=5&&!ended){ended=true;ui.objective.textContent='The blight has been cleansed';ui.victory.classList.remove('hidden');}}
function die(){if(ended)return;ended=true;active=false;ui.death.classList.remove('hidden')}
function spawnEnemy(){if(kills>=5)return;const pos=spawnPoints[(kills+enemies.length)%spawnPoints.length];const e=makeWolf(pos[0],pos[1],kills);enemies.push(e);updateCounts()}
for(let i=0;i<3;i++)spawnEnemy();

const keys={};let joy={x:0,y:0},rollBoost=0,rollVector=new THREE.Vector3();
addEventListener('keydown',e=>{const k=e.key.toLowerCase();keys[k]=true;if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(k))e.preventDefault();if(!active||ended)return;if(k===' '||k==='j')attack();if(k==='q'||k==='k')castSpell();if(k==='shift')dodge();if(k==='e')usePotion()});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
document.querySelector('#begin-btn').onclick=()=>{active=true;ui.start.classList.add('hidden');ui.crosshair.style.opacity='1';showToast('THE HOLLOWWOOD STIRS')};
document.querySelector('#sword-btn').onclick=attack;document.querySelector('#mobile-attack').onclick=attack;document.querySelector('#spell-btn').onclick=castSpell;document.querySelector('#mobile-spell').onclick=castSpell;document.querySelector('#roll-btn').onclick=dodge;document.querySelector('#mobile-roll').onclick=dodge;
document.querySelector('#retry-btn').onclick=resetGame;document.querySelector('#continue-btn').onclick=()=>{ui.victory.classList.add('hidden');active=true;ended=false;ui.objective.textContent='Explore the Sundered Grove';showToast('THE GROVE REMEMBERS YOUR KINDNESS')};
document.querySelector('#sound-toggle').onclick=e=>{e.currentTarget.classList.toggle('muted');showToast(e.currentTarget.classList.contains('muted')?'SOUND OFF':'SOUND ON')};
function doDamage(enemy,amount){if(!enemy?.alive)return;enemy.hp-=amount;enemy.group.scale.set(1.13,.88,1.08);setTimeout(()=>{if(enemy.group)enemy.group.scale.set(1,1,1)},100);if(enemy.hp<=0){enemy.alive=false;scene.remove(enemy.group);scene.remove(enemy.ring);kills++;setMana(mana+8);showToast(kills>=5?'THE LAST HOLLOWFANG FALLS':'HOLLOWFANG DEFEATED  ·  +8 FOCUS');updateCounts();if(kills<5&&enemies.filter(e=>e.alive).length<3)setTimeout(spawnEnemy,1100)}}
function closestEnemy(max=99){let best=null,dist=max;for(const e of enemies){if(!e.alive)continue;const d=hero.position.distanceTo(e.group.position);if(d<dist){dist=d;best=e}}return best}
function attack(){if(!active||ended||attackTimer>0)return;attackTimer=.48;combo=comboWindow>0?(combo%3)+1:1;comboWindow=.9;rightArm.rotation.x=-1.05;rightArm.rotation.z=-.55;bladeRig.rotation.z=-1.1;setTimeout(()=>{rightArm.rotation.x=0;rightArm.rotation.z=0},190);const target=closestEnemy(3.35);if(target){const dir=target.group.position.clone().sub(hero.position).normalize();const facing=new THREE.Vector3(Math.sin(hero.rotation.y),0,-Math.cos(hero.rotation.y));if(dir.dot(facing)>.05||hero.position.distanceTo(target.group.position)<1.9){doDamage(target,combo===3?42:30);showToast(combo===3?'EMBERBLADE · HEAVY STRIKE':'EMBERBLADE · '+(combo===2?'SECOND CUT':'FIRST CUT'))}}}
function castSpell(){if(!active||ended||spellTimer>0)return;if(mana<12){showToast('NOT ENOUGH FOCUS');return}setMana(mana-12);spellTimer=2.2;ui.spell.classList.add('on-cooldown');const target=closestEnemy(9);const orb=mesh(new THREE.SphereGeometry(.22,12,10),mat(0xbaffd4,.12,.1,0x6fffba,5),scene,hero.position.x,hero.position.y+1.35,hero.position.z);const light=new THREE.PointLight(0x75ffb5,4,5);orb.add(light);let t=0;const start=orb.position.clone(),end=target?target.group.position.clone().add(new THREE.Vector3(0,1,0)):new THREE.Vector3(start.x+Math.sin(hero.rotation.y)*6,1,start.z-Math.cos(hero.rotation.y)*6);function travel(){if(!active&&ended){scene.remove(orb);return}t+=.08;orb.position.lerpVectors(start,end,Math.min(t,1));orb.scale.setScalar(1+Math.sin(t*22)*.18);if(t<1)requestAnimationFrame(travel);else{scene.remove(orb);const burst=mesh(new THREE.SphereGeometry(.35,12,8),mat(0x9affd1,.2,0,0x61ffad,5),scene,end.x,.8,end.z);burst.material.transparent=true;let fade=0;function fadeBurst(){fade+=.1;burst.scale.setScalar(1+fade*3);burst.material.opacity=1-fade;if(fade<1)requestAnimationFrame(fadeBurst);else scene.remove(burst)}fadeBurst();if(target&&target.alive&&target.group.position.distanceTo(end)<2.4){doDamage(target,60);showToast('ARCANE BURST · 60 DAMAGE')}else showToast('ARCANE BURST') }}travel()}
function dodge(){if(!active||ended||rollTimer>0)return;rollTimer=.95;invuln=.48;rollBoost=.32;const ix=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+joy.x,iz=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0)-joy.y;rollVector.set(ix,0,iz);if(rollVector.lengthSq()<.05)rollVector.set(Math.sin(hero.rotation.y),0,-Math.cos(hero.rotation.y));rollVector.normalize();showToast('PHASE STEP')}
function usePotion(){if(!active||ended)return;if(potions<=0){showToast('NO TONICS LEFT');return}if(health>=100){showToast('VITALITY IS FULL');return}potions--;setHealth(health+38);document.querySelector('#potion-count').textContent=potions+' LEFT';showToast('WARMTH RETURNS · +38 VITALITY')}
function resetGame(){for(const e of enemies){scene.remove(e.group);scene.remove(e.ring)}enemies.length=0;kills=0;health=100;mana=60;potions=2;ended=false;active=true;hero.position.set(0,0,3);ui.death.classList.add('hidden');ui.victory.classList.add('hidden');ui.objective.textContent='Defeat the Hollowfangs';document.querySelector('#potion-count').textContent='2 LEFT';setHealth(100);setMana(60);for(let i=0;i<3;i++)spawnEnemy();ui.crosshair.style.opacity='1';updateCounts()}

const joystick=document.querySelector('#joystick'),knob=document.querySelector('#joy-knob');let joyPointer=null;
joystick.addEventListener('pointerdown',e=>{joyPointer=e.pointerId;joystick.setPointerCapture(e.pointerId);updateJoy(e)});joystick.addEventListener('pointermove',e=>{if(e.pointerId===joyPointer)updateJoy(e)});joystick.addEventListener('pointerup',e=>{if(e.pointerId===joyPointer){joyPointer=null;joy.x=joy.y=0;knob.style.transform='translate(-50%,-50%)'}});joystick.addEventListener('pointercancel',()=>{joyPointer=null;joy.x=joy.y=0;knob.style.transform='translate(-50%,-50%)'});
function updateJoy(e){const r=joystick.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),len=Math.hypot(dx,dy),max=33,k=Math.min(1,max/Math.max(1,len));joy.x=dx*k/max;joy.y=-dy*k/max;knob.style.transform=`translate(calc(-50% + ${dx*k}px),calc(-50% + ${dy*k}px))`}

const clock=new THREE.Clock();const camOffset=new THREE.Vector3(0,7.2,9.3),camLook=new THREE.Vector3();
function frame(){requestAnimationFrame(frame);const dt=Math.min(clock.getDelta(),.05);animTime+=dt;if(active&&!ended){elapsed+=dt;document.querySelector('#clock').textContent=`${String(Math.floor(elapsed/60)).padStart(2,'0')}:${String(Math.floor(elapsed%60)).padStart(2,'0')}`;setMana(mana+dt*1.7);attackTimer=Math.max(0,attackTimer-dt);spellTimer=Math.max(0,spellTimer-dt);rollTimer=Math.max(0,rollTimer-dt);invuln=Math.max(0,invuln-dt);comboWindow=Math.max(0,comboWindow-dt);if(spellTimer===0)ui.spell.classList.remove('on-cooldown');
 const ix=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+joy.x,iz=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0)-joy.y;let moving=Math.abs(ix)+Math.abs(iz)>.08;let speed=rollBoost>0?13:4.7;const v=new THREE.Vector3(ix,0,iz);if(v.lengthSq()>1)v.normalize();if(rollBoost>0){v.copy(rollVector);rollBoost=Math.max(0,rollBoost-dt)}if(moving||rollBoost>0){hero.position.addScaledVector(v,speed*dt);hero.position.x=THREE.MathUtils.clamp(hero.position.x,-12,12);hero.position.z=THREE.MathUtils.clamp(hero.position.z,-13,13);hero.rotation.y=Math.atan2(v.x,-v.z)}walkBlend=THREE.MathUtils.damp(walkBlend,moving?1:0,9,dt);legs.forEach((l,i)=>l.rotation.x=Math.sin(animTime*11+i*Math.PI)*.52*walkBlend);body.position.y=Math.abs(Math.sin(animTime*11))*.06*walkBlend;
 if(attackTimer<=.24&&attackTimer>.18)bladeRig.rotation.z=0;
 enemies.forEach(e=>{if(!e.alive)return;e.attack-=dt;e.walk+=dt*6;const delta=hero.position.clone().sub(e.group.position);const d=delta.length();if(d>1.45){delta.normalize();e.group.position.addScaledVector(delta,dt*(d>2.3?1.55:.85));e.group.rotation.y=Math.atan2(-delta.x,delta.z);e.limbs.forEach((l,i)=>l.rotation.x=Math.sin(e.walk+i*Math.PI*.65)*.34);e.torso.position.y=.78+Math.sin(e.walk*2)*.045}else if(e.attack<=0&&invuln<=0){e.attack=1.35;setHealth(health-11);showToast('HOLLOWFANG STRIKES · −11 VITALITY');hero.position.addScaledVector(delta.clone().normalize(),-.45)}});
 if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)ui.toast.classList.remove('show')}
}
for(const m of motes)m.mesh.position.y=m.base+Math.sin(animTime*1.4+m.phase)*.24;
const targetCam=hero.position.clone().add(camOffset);camera.position.lerp(targetCam,1-Math.exp(-4*dt));camLook.copy(hero.position).add(new THREE.Vector3(0,1.05,-.2));camera.lookAt(camLook);renderer.render(scene,camera)}
frame();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7))});
