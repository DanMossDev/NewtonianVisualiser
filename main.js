import './style.css';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const mass = document.getElementById("mass")
const trajectoryX = document.getElementById("inputX")
const trajectoryY = document.getElementById("inputY")
const trajectoryZ = document.getElementById("inputZ")
const rotationX =  document.getElementById("inputXR")
const rotationZ =  document.getElementById("inputZR")

trajectoryX.addEventListener("input", () => {
  console.log(trajectoryX.value)
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

const ringGeometry = new THREE.SphereGeometry(1);
const ringMaterial = new THREE.MeshStandardMaterial( {color: 0x800080});
const ring = new THREE.Mesh( ringGeometry, ringMaterial );
scene.add(ring)

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


  controls.update();
  renderer.render(scene, camera);
}

animate();