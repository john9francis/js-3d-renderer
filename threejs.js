import * as THREE from 'three';
import Camera from './camera.js';

// Create scene
const scene = new THREE.Scene();
const cameraClass = new Camera();
const camera = cameraClass.getTheCamera();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth/1.5, window.innerHeight/1.5);
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

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
})


// controls for the camera
let mouseClicked = false;

renderer.domElement.addEventListener("mousedown", (event) => {
  mouseClicked = true;
});

let lastX = 0;
let lastY = 0;

function resetMouse(){
  mouseClicked = false;
  lastX = 0;
  lastY = 0;
}

renderer.domElement.addEventListener("mouseup", (event) => {
  resetMouse();
});

renderer.domElement.addEventListener("mouseleave", (event) => {
  resetMouse();
});


document.addEventListener("mousemove", (event) => {
  if (!mouseClicked) return;

  if (lastX > 0 && lastY > 0){
    const dx = (event.clientX - lastX) / 100;
    const dy = (event.clientY - lastY) / 100;

    if (event.shiftKey) {
      cameraClass.shiftLookPositionY(dy);
      cameraClass.shiftLookPositionX(dx);
    } else {
      // note: this is confusing but if the user moves along the
    // x axis (side to side), it rotates AROUND the camera's y,
    // (up vector) 
      cameraClass.rotateAroundY(dx);
      cameraClass.rotateAroundX(dy);
    }
  }

  lastX = event.clientX
  lastY = event.clientY
});


// zoom capability
renderer.domElement.addEventListener("wheel", (event) =>{
  event.preventDefault();

  cameraClass.shiftRadius(event.deltaY / 10);
})