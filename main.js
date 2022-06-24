import './style.css';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

//DOM cache
const mass = document.getElementById("mass")
const speedX = document.getElementById("inputX")
const speedY = document.getElementById("inputY")
const speedZ = document.getElementById("inputZ")
const rotationX =  document.getElementById("inputXR")
const rotationY =  document.getElementById("inputYR")
const inputters = document.getElementsByClassName("inputter")
const calculate = document.getElementsByClassName("calculate")

//CONSTANTS
const PI = Math.PI;
const radToDeg = 180/PI;
//Variables
const tickRate = 1000 //ticks per second

//Add event listeners
for (let i = 0; i < inputters.length; i++) {
  inputters[i].addEventListener('input', () => {drawArrow()})
}

calculate[0].addEventListener('click', () => {
  if (particle.position.y !== 0) return;
  calculateTrajectory()
})



const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 10, 30);

renderer.render(scene, camera);

const particleGeometry = new THREE.SphereGeometry(1);
const particleMaterial = new THREE.MeshStandardMaterial( {color: 0x800080});
const particle = new THREE.Mesh( particleGeometry, particleMaterial );
scene.add(particle)

const ambientLight = new THREE.AmbientLight(0xFFFFFF)
scene.add(ambientLight)

const grid = new THREE.GridHelper(1000, 100, 0xFF0000, 0x00FFFF)
scene.add(grid)

const axesHelper = new THREE.AxesHelper( 50 );
scene.add( axesHelper );

const controls = new OrbitControls(camera, renderer.domElement);


function animate() {
  requestAnimationFrame(animate);

  console.log()

  controls.update();
  renderer.render(scene, camera);
}

const arrowMat = new THREE.LineBasicMaterial({ color: 0x00ffff })
const arrowPoints = [];
arrowPoints.push( new THREE.Vector3(0, 0, 0))
let currentUUID = ''
function drawArrow() {
  if (currentUUID) {
    const oldArrow = scene.getObjectByProperty('uuid', currentUUID);
    oldArrow.geometry.dispose();
    oldArrow.material.dispose();
    scene.remove(oldArrow);
  }
  const xSpeed = speedX.value ? parseInt(speedX.value): 0;
  const ySpeed = speedY.value ? parseInt(speedY.value) : 0;
  const zSpeed = speedZ.value ? parseInt(speedZ.value): 0;

  const initialVelocityXY = new THREE.Vector2(xSpeed, ySpeed);
  const initialAngleXY = Math.atan(ySpeed/xSpeed) * radToDeg;
  const initialVelocityXZ = new THREE.Vector2(xSpeed, zSpeed);
  const initialAngleXZ = Math.atan(zSpeed/xSpeed) * radToDeg;

  console.log('Y: ' + initialAngleXY)
  console.log('Z: ' + initialAngleXZ)

  arrowPoints[1] = new THREE.Vector3(xSpeed, ySpeed, zSpeed);
  let geometry = new THREE.BufferGeometry().setFromPoints( arrowPoints );
  const arrow = new THREE.Line( geometry, arrowMat );



  scene.add(arrow);
  currentUUID = arrow.uuid;
  console.log(arrow)
}

drawArrow()

function calculateTrajectory() {
  let objectMass = mass.value ? parseInt(mass.value) : 1; 
  let xSpeed = speedX.value ? parseInt(speedX.value): 0;
  let ySpeed = speedY.value ? parseInt(speedY.value) : 0;
  let zSpeed = speedZ.value ? parseInt(speedZ.value): 0;
  let maxHeight = [0, 0, 0];

  const lineMat = new THREE.LineBasicMaterial({ color: 0x0000ff })
  const points = [];
  points.push( new THREE.Vector3(0, 0, 0))
  let geometry = new THREE.BufferGeometry().setFromPoints( points );

  function oneTick() {
    particle.position.y += ySpeed / (tickRate / 10);
    particle.position.x += xSpeed / (tickRate / 10);
    particle.position.z += zSpeed / (tickRate / 10);
    //Draw trajectory line
    points.push( new THREE.Vector3( particle.position.x, particle.position.y, particle.position.z) );
    geometry = new THREE.BufferGeometry().setFromPoints( points );
    const line = new THREE.Line( geometry, lineMat );
    scene.add(line);

    ySpeed -= 9.81 * objectMass / (tickRate);

    if (particle.position.y > maxHeight[1]) {
      maxHeight[0] = particle.position.x;
      maxHeight[1] = particle.position.y;
      maxHeight[2] = particle.position.z;
    }

    if (particle.position.y > 0) {
      setTimeout(() => {
      oneTick();
    }, 1000 / tickRate)}
    else {
      particle.position.y = 0;
      returnStats();
    }
  }
  oneTick();

  
}

animate();