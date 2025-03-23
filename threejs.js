import * as THREE from 'three';
import Camera from './camera.js';

// Create scene
const scene = new THREE.Scene();
const cameraClass = new Camera();
const camera = cameraClass.getTheCamera();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth/1.5, window.innerHeight/1.5);
document.body.appendChild(renderer.domElement);

// Create axis lines
const xLineGeom = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(0,0,0),
  new THREE.Vector3(1,0,0)
])
const yLineGeom = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(0,0,0),
  new THREE.Vector3(0,1,0)
])
const zLineGeom = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(0,0,0),
  new THREE.Vector3(0,0,1)
])

const xLineMat = new THREE.LineBasicMaterial({color: 0xff0000});
const yLineMat = new THREE.LineBasicMaterial({color: 0x00ff00});
const zLineMat = new THREE.LineBasicMaterial({color: 0x0000ff});

const xLine = new THREE.Line(xLineGeom, xLineMat);
const yLine = new THREE.Line(yLineGeom, yLineMat);
const zLine = new THREE.Line(zLineGeom, zLineMat);
scene.add(xLine);
scene.add(yLine);
scene.add(zLine);

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

// Add a button to toggle movemode
const moveModeToggle = document.createElement("input");
moveModeToggle.type = "checkbox"
moveModeToggle.id = "toggle"

const toggleLabel = document.createElement("label");
toggleLabel.textContent = "Move mode";
toggleLabel.setAttribute("for", "toggle");

document.body.appendChild(moveModeToggle);
document.body.appendChild(toggleLabel);


document.addEventListener("mousemove", (event) => {
  if (!mouseClicked) return;

  if (lastX > 0 && lastY > 0){
    const dx = (event.clientX - lastX) / 100;
    const dy = (event.clientY - lastY) / 100;

    if (
      event.shiftKey ||
      document.getElementById("toggle").checked
    ) {
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