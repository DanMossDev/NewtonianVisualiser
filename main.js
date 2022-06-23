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

//Add event listeners
//for (let i = 0; i < inputters.length; i++) 
inputters[4].addEventListener('input', () => {
  calculateTrajectory()
}) //Can add something here to invoke on update to variables




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

const lineMat = new THREE.LineBasicMaterial({ color: 0x0000ff })

const points = [];
points.push( new THREE.Vector3(-10, 0, 0))
points.push( new THREE.Vector3( 0, 10, 0 ) );
points.push( new THREE.Vector3( 10, 0, 0 ) );

const geometry = new THREE.BufferGeometry().setFromPoints( points );

const line = new THREE.Line( geometry, lineMat )
scene.add(line);

const controls = new OrbitControls(camera, renderer.domElement);


function animate() {
  requestAnimationFrame(animate);

  console.log()

  controls.update();
  renderer.render(scene, camera);
}

function oneTick() {
  if (particle.position.y > 0) particle.position.y -= mass.value * 9.81;

  
  setTimeout(() => {
    oneTick()
  }, 100)
}

function calculateTrajectory() {
  let xSpeed = parseInt(speedX.value);
  let ySpeed = parseInt(speedY.value);
  let zSpeed = parseInt(speedZ.value);

  const initialVelocity = new THREE.Vector2(xSpeed, ySpeed)
  const initialAngle = Math.atan(ySpeed/xSpeed)

  console.log(initialVelocity, THREE.MathUtils.radToDeg(initialAngle))
}

oneTick();
animate();