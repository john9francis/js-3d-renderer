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

// add a cube
const cubeGeom = new THREE.BoxGeometry(1,1,1);
const cubeMat = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
const cubeMesh = new THREE.Mesh(cubeGeom, cubeMat);
scene.add(cubeMesh)

// Main rendering loop
renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
})

// more DOM elements
// Add a button to toggle movemode
const moveModeToggle = document.createElement("input");
moveModeToggle.type = "checkbox"
moveModeToggle.id = "toggle"

const toggleLabel = document.createElement("label");
toggleLabel.textContent = "Move mode";
toggleLabel.setAttribute("for", "toggle");

document.body.appendChild(moveModeToggle);
document.body.appendChild(toggleLabel);



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
}

function zoom(event) {
  event.preventDefault();

  cameraClass.shiftRadius(event.deltaY / 10);
}


// event listeners
renderer.domElement.addEventListener("mousedown", (event) => {
  mousedown();
});

renderer.domElement.addEventListener("mouseup", (event) => {
  resetMouse();
});

renderer.domElement.addEventListener("mouseleave", (event) => {
  resetMouse();
});

document.addEventListener("mousemove", (event) => {
  mouseMove(event);
});

renderer.domElement.addEventListener("wheel", (event) =>{
  zoom(event);
})
