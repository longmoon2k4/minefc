// Lightweight Three.js voxel-flavored scene
(function(){
  const canvas = document.getElementById('three-canvas');
  if(!canvas || !window.THREE) return;

  const THREE = window.THREE;
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio||1));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(3.2,2.2,4.2);

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, .6); scene.add(ambient);
  const dir = new THREE.DirectionalLight(0xffffff, .9); dir.position.set(3,4,2); scene.add(dir);

  // Materials
  const emerald = new THREE.MeshStandardMaterial({ color: 0x1ed3a0, roughness:.35, metalness:.2 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xffd166, roughness:.4, metalness:.25 });
  const base = new THREE.MeshStandardMaterial({ color: 0x1b2430, roughness:.8, metalness:0 });

  // Floor
  const floor = new THREE.Mesh(new THREE.BoxGeometry(6,0.2,6), base); floor.position.y=-1.1; floor.receiveShadow=true; scene.add(floor);

  // Voxel-like floating cubes/pillars
  const group = new THREE.Group(); scene.add(group);
  const rng = (a,b)=>a+Math.random()*(b-a);
  for(let i=0;i<24;i++){
    const s = rng(0.25,0.6);
    const geo = new THREE.BoxGeometry(s, s, s);
    const mat = i%5===0? gold : emerald;
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(rng(-2,2), rng(-0.3,1.6), rng(-2,2));
    mesh.rotation.set(rng(0,Math.PI), rng(0,Math.PI), 0);
    mesh.userData.vy = rng(0.2,0.6);
    group.add(mesh);
  }

  // Resize handler
  function resize(){
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w,h,false);
    camera.aspect = w/h; camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // Interaction: simple orbit-like rotation on pointer
  let targetRotY = 0, targetRotX = 0;
  canvas.addEventListener('pointermove', (e)=>{
    const rect = canvas.getBoundingClientRect();
    const nx = (e.clientX - rect.left)/rect.width - 0.5;
    const ny = (e.clientY - rect.top)/rect.height - 0.5;
    targetRotY = nx * 0.6;
    targetRotX = ny * 0.3;
  });

  // Animate
  let t0 = performance.now();
  function tick(t){
    const dt = Math.min(0.05, (t - t0)/1000); t0 = t;
    group.rotation.y += (targetRotY - group.rotation.y) * 0.06;
    group.rotation.x += (targetRotX - group.rotation.x) * 0.06;

    group.children.forEach((m,i)=>{
      m.position.y += Math.sin(t*0.001 + i) * 0.002 * m.userData.vy;
      m.rotation.y += 0.1 * dt;
    });

    camera.position.z += Math.sin(t*0.0006) * 0.002;
    camera.lookAt(0,0,0);

    renderer.render(scene,camera);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
