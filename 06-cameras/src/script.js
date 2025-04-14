import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Canvas
const canvas1 = document.querySelector('canvas.webgl1')
const canvas2 = document.querySelector('canvas.webgl2')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene1 = new THREE.Scene()
const scene2 = new THREE.Scene()

// Object
const mesh1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
const mesh2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene1.add(mesh1)
scene2.add(mesh2)



// Camera
const camera1 = new THREE.PerspectiveCamera(85, sizes.width / sizes.height, 0.01, 10000)
camera1.position.x = 2
camera1.position.y = 2
camera1.position.z = 2
// camera1.lookAt(mesh1.position)

// const camera2 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
// const camera2 = new THREE.OrthographicCamera(-2, 2, 3, -3, 0.1, 100)

const aspectRatio = sizes.width / sizes.height
const camera2 = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100)


camera2.position.x = 2
camera2.position.y = 2
camera2.position.z = 2
camera2.lookAt(mesh2.position)


scene1.add(camera1)
scene2.add(camera2)



// Controls
const orbitControls = new OrbitControls(camera1, canvas1)
orbitControls.enableDamping = true

// Renderer
const renderer1 = new THREE.WebGLRenderer({
    canvas: canvas1
})

const renderer2 = new THREE.WebGLRenderer({
    canvas: canvas2
})
renderer1.setSize(sizes.width, sizes.height)
renderer2.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const cursor = {}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5

    // camera1.position.y = cursor.y * 3
})

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // mesh1.rotation.y = elapsedTime;

    mesh2.rotation.y = elapsedTime;


    // camera1.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
    // camera1.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
    // camera1.position.y = cursor.y * 5

    // camera1.lookAt(mesh1.position)

    // Update Controls
    orbitControls.update()

    // Render
    renderer1.render(scene1, camera1)
    renderer2.render(scene2, camera2)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()