import * as THREE from 'three'

// camera class that moves and rotates

class Camera {

  theCamera;

  lookPoint;
  radius;

  worldYAngle;
  cameraXAngle;

  axisLine1;
  axisLine2;
  axisLine3;

  constructor(){
    this.theCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    
    this.lookPoint = new THREE.Vector3(0,0,0);
    this.radius = 5;

    this.worldYAngle = Math.PI / 4.5;
    this.cameraXAngle = Math.PI / 7;

    this.update();
  }

  setAxisLines(line1, line2, line3){
    // Note: these lines will always be at 0,0,0
    this.axisLine1 = line1
    this.axisLine2 = line2
    this.axisLine3 = line3

  }

  getTheCamera() {
    return this.theCamera;
  }

  rotateAroundY(dAngle){
    this.worldYAngle += dAngle;

    if (this.worldYAngle > 2 * Math.PI) {
      this.worldYAngle -= 2 * Math.PI;
    }
    if (this.worldYAngle < 0) {
      this.worldYAngle += 2 * Math.PI;
    }

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

  shiftLookPositionX(dx) {

    // TODO: Add sensitivity here
    dx *= this.radius / 5;

    // Depending on how the user is looking,
    // have the x or z position switch

    // this is just because sometimes it goes in the
    // opposite direction (idk why)
    if (
      this.worldYAngle > Math.PI / 4 &&
      this.worldYAngle < 5 * Math.PI / 4
    ) {
      dx *= -1;
    }

    // 0 to pi/4, 3pi/4 to 5pi/4, 7pi/4 to 2pi = z
    if (
      this.worldYAngle >= 0 &&
      this.worldYAngle < Math.PI / 4 ||
      this.worldYAngle > 3 * Math.PI / 4 &&
      this.worldYAngle < 5 * Math.PI / 4 ||
      this.worldYAngle > 7 * Math.PI / 4
    ){
      this.lookPoint.z += dx;

      // shift axis lines
      this.#shiftLine(this.axisLine1, 0, 0, dx);
      this.#shiftLine(this.axisLine2, 0, 0, dx);
      this.#shiftLine(this.axisLine3, 0, 0, dx);
    }
    else {
      this.lookPoint.x += dx;

      // shift axis lines
      this.#shiftLine(this.axisLine1, dx, 0, 0);
      this.#shiftLine(this.axisLine2, dx, 0, 0);
      this.#shiftLine(this.axisLine3, dx, 0, 0);
    }

    this.update();
  }

  #shiftLine(line, dx, dy, dz){
    const position = line.geometry.attributes.position;

    for (let i=0; i<position.count; i++){
      position.setXYZ(i,
        position.getX(i) + dx,
        position.getY(i) + dy,
        position.getZ(i) + dz,
      )
    }

    position.needsUpdate = true;
  }

  shiftLookPositionY(dy) {
    // TODO: Add sensitivity here
    dy *= this.radius / 5;

    this.lookPoint.y += dy;
    this.theCamera.position.y += dy;

    // shift axis lines
    this.#shiftLine(this.axisLine1, 0, dy, 0);
    this.#shiftLine(this.axisLine2, 0, dy, 0);
    this.#shiftLine(this.axisLine3, 0, dy, 0);

    this.update();
  }

  update(){
    // x,y plane first
    this.theCamera.position.x = this.lookPoint.x + this.radius * Math.cos(this.cameraXAngle) * Math.cos(this.worldYAngle);
    this.theCamera.position.y = this.lookPoint.y + this.radius * Math.sin(this.cameraXAngle);
    
    // then z
    this.theCamera.position.z = this.lookPoint.z + this.radius * Math.cos(this.cameraXAngle) * Math.sin(this.worldYAngle);

    // todo: figure out how to rotate around y
    // this.theCamera.position.y = this.radius / 2;

    this.theCamera.lookAt(this.lookPoint);
  }
}


export default Camera;