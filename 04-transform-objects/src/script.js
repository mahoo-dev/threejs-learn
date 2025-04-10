import * as THREE from 'three'

console.log("hello threejs");
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const material3 = new THREE.MeshBasicMaterial({ color: 0x0000ff })

const mesh = new THREE.Mesh(geometry, material)
const mesh2 = new THREE.Mesh(geometry, material2)
const mesh3 = new THREE.Mesh(geometry, material3)


mesh2.position.x = -2
mesh3.position.x = 2


const group = new THREE.Group()

group.add(mesh)
group.add(mesh2)
group.add(mesh3)

// Position 
// mesh.position.x = 0.7
// mesh.position.y = -0.6
// mesh.position.z = 1
mesh.position.set(0.8, 0.5, 0.5)

// Scale
// mesh.scale.x = 2
// mesh.scale.y = 0.5
// mesh.scale.z = 0.5
mesh.scale.set(1.2, 0.5, 0.5)


// Rotation
// mesh.rotation.x = Math.PI * 0.5
// mesh.rotation.y = Math.PI * 0.25
// mesh.rotation.z = Math.PI * 0.25
// mesh.rotation.reorder('ZYX')
// mesh.rotation.set(Math.PI * 0.25, Math.PI * 0.25, Math.PI * 0.25)


// Quaternion
mesh.quaternion.set(0.5, 0.5, 0.5, 0.5)
mesh.quaternion.normalize()

scene.add(group)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
camera.position.x = 1.8;
camera.position.y = 1;

camera.lookAt(mesh.position)

scene.add(camera)

// AxisHelper

const axesHelper = new THREE.AxesHelper(3);

scene.add(axesHelper);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)