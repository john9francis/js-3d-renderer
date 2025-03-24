import * as THREE from 'three';
import Camera from './camera.js';

// Create scene
const scene = new THREE.Scene();
const cameraClass = new Camera();
const camera = cameraClass.getTheCamera();

const renderer = new THREE.WebGLRenderer();

const container = document.getElementById("rendererContainer");
container.appendChild(renderer.domElement);

function resizeRenderer(){
  const newWidth = container.clientWidth
  const newHeight = container.clientHeight
  renderer.setSize(newWidth, newHeight);
  cameraClass.theCamera.aspect = newWidth / newHeight;
  cameraClass.theCamera.updateProjectionMatrix();
}

// screen resize events
document.addEventListener("DOMContentLoaded", resizeRenderer);
window.addEventListener("resize", resizeRenderer);


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

xLine.frustumCulled = false;
yLine.frustumCulled = false;
zLine.frustumCulled = false;

scene.add(xLine);
scene.add(yLine);
scene.add(zLine);

cameraClass.setAxisLines(xLine, yLine, zLine);

// add a cube
const cubeGeom = new THREE.BoxGeometry(3,3,3);
const cubeMat = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
const cubeMesh = new THREE.Mesh(cubeGeom, cubeMat);
scene.add(cubeMesh)

// Main rendering loop
renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
})

// more DOM elements
// Add a dropdown to toggle movemode
const moveModeToggle = document.createElement("select");

const movementOpts = ["Rotate", "Move", "Zoom"]

movementOpts.forEach((text) => {
  const option = document.createElement("option");
  option.textContent = text;
  option.value = text;
  moveModeToggle.appendChild(option);
});

moveModeToggle.id = "moveMode"
moveModeToggle.style.margin = "5px"

const toggleLabel = document.createElement("label");
toggleLabel.textContent = "Mode:";
toggleLabel.setAttribute("for", moveModeToggle.id);

document.querySelector("main").appendChild(toggleLabel);
document.querySelector("main").appendChild(moveModeToggle);



// controls for the camera
let mouseClicked = false;

function mousedown(){
  mouseClicked = true;
}

let lastX = 0;
let lastY = 0;

function resetMouse(){
  mouseClicked = false;
  lastX = 0;
  lastY = 0;
}

function mouseMove(event){
  if (!mouseClicked) return;

  if (lastX > 0 && lastY > 0){
    const dx = (event.clientX - lastX) / 100;
    const dy = (event.clientY - lastY) / 100;

    if (
      event.shiftKey ||
      moveModeToggle.value === "Move"
    ) {
      // move mode
      cameraClass.shiftLookPositionY(dy);
      cameraClass.shiftLookPositionX(dx);
    } 
    else if (
      moveModeToggle.value === "Zoom"
    ) {
      // zoom mode
      cameraClass.shiftRadius(dy * 10);
    }
    else {
      // default = rotate mode
      // note: this is confusing but if the user moves along the
      // x axis (side to side), it rotates AROUND the camera's y,
      // (up vector) 
      cameraClass.rotateAroundY(dx);
      cameraClass.rotateAroundX(dy);
    }
  }

  lastX = event.clientX
  lastY = event.clientY
}

function zoom(event) {
  event.preventDefault();

  cameraClass.shiftRadius(event.deltaY / 10);
}


// event listeners

// Mouse events
renderer.domElement.addEventListener("mousedown", mousedown);
document.addEventListener("mouseup", resetMouse);
document.addEventListener("mousemove", mouseMove);
renderer.domElement.addEventListener("wheel", zoom);

// Touch events (mobile support)
renderer.domElement.addEventListener("touchstart", (event) => {
  event.preventDefault(); // Prevent scrolling while interacting
  mousedown(event.touches[0]); // Use the first touch point
});

renderer.domElement.addEventListener("touchend", resetMouse);
renderer.domElement.addEventListener("touchcancel", resetMouse);

renderer.domElement.addEventListener("touchmove", (event) => {
  event.preventDefault();
  mouseMove(event.touches[0]); // Track the first touch point like a mouse
});