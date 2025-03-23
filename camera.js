import * as THREE from 'three'

// camera class that moves and rotates

class Camera {

  theCamera;

  lookPoint;
  radius;

  worldYAngle;
  cameraXAngle;

  constructor(){
    this.theCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    
    this.lookPoint = new THREE.Vector3(0,0,0);
    this.radius = 5;

    this.worldYAngle = 0;
    this.cameraXAngle = 0;

    this.update();
  }

  getTheCamera() {
    return this.theCamera;
  }

  rotateAroundY(dAngle){
    this.worldYAngle += dAngle;

    this.update();
  }

  rotateAroundX(dAngle){
    this.cameraXAngle += dAngle;

    // set max angle
    if (this.cameraXAngle > Math.PI / 2) {
      this.cameraXAngle = Math.PI / 2;
    }
    if (this.cameraXAngle < - Math.PI / 2) {
      this.cameraXAngle = - Math.PI / 2;
    }

    this.update();
  }

  shiftRadius(dr) {
    this.radius += dr;

    if (this.radius < 2) this.radius = 2;
    if (this.radius > 20) this.radius = 20;

    this.update();
  }

  update(){
    // x,y plane first
    this.theCamera.position.x = this.radius * Math.cos(this.cameraXAngle) * Math.cos(this.worldYAngle);
    this.theCamera.position.y = this.radius * Math.sin(this.cameraXAngle);
    
    // then z
    this.theCamera.position.z = this.radius * Math.cos(this.cameraXAngle) * Math.sin(this.worldYAngle);

    // todo: figure out how to rotate around y
    // this.theCamera.position.y = this.radius / 2;

    this.theCamera.lookAt(this.lookPoint);
  }
}


export default Camera;