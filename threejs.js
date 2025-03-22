import * as THREE from 'three';

// Create scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth/2, window.innerHeight/2);
document.body.appendChild(renderer.domElement);

// Create cube
const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);


// Create a line
const points = [
  new THREE.Vector3(-1, 0, 0),
  new THREE.Vector3(0, 2, 0),
  new THREE.Vector3(3, 0, 0)
]
const lineGeom = new THREE.BufferGeometry().setFromPoints(points);

const lineMat = new THREE.LineBasicMaterial({color: 0x0000ff});

const line = new THREE.Line(lineGeom, lineMat);
scene.add(line);

camera.position.y = 2;

let angle = 0;
function rotateCameraAround() {
  const radius = 5;
  camera.position.x = radius * Math.cos(angle);
  camera.position.z = radius * Math.sin(angle);

  camera.lookAt(cube.position)
}

renderer.setAnimationLoop(() => {
  rotateCameraAround();
  renderer.render(scene, camera);
})


// controls for the camera
let mouseClicked = false;

renderer.domElement.addEventListener("mousedown", (event) => {
  console.log("cli");
  mouseClicked = true;
});

function resetMouse(){
  mouseClicked = false;
  lastX = 0;
}

renderer.domElement.addEventListener("mouseup", (event) => {
  resetMouse();
});

renderer.domElement.addEventListener("mouseleave", (event) => {
  resetMouse();
});


let lastX = 0;
document.addEventListener("mousemove", (event) => {
  if (!mouseClicked) return;

  // get the x velocity and add it to the angle from earlier

  if (lastX > 0){
    const dx = (event.clientX - lastX)/100;
    angle += dx
  }

  lastX = event.clientX
});