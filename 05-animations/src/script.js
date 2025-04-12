import * as THREE from 'three'
import gsap from 'gsap';
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 1200,
    height: 800
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)



const tick = () => {
    mesh.position.y += 0.01
    renderer.render(scene, camera)
    requestAnimationFrame(tick)
}

let time =  new Date().getTime()

const tick2 = () => {
    const now = new Date().getTime()
    const deltaTime = now - time
    time = now
    mesh.rotation.y += deltaTime * 0.001
    renderer.render(scene, camera)
    requestAnimationFrame(tick2)
}

const clock = new THREE.Clock()
const tick3 = () => {   
    const elapsedTime = clock.getElapsedTime()
    mesh.position.x += elapsedTime * 0.001

    mesh.position.y = Math.sin(elapsedTime)

    // camera.position.x = elapsedTime * 0.001
    camera.lookAt(mesh.position)

    renderer.render(scene, camera)
    requestAnimationFrame(tick3)
}


gsap.to(mesh.position, {duration: 1, delay: 3, x: 2})
gsap.to(mesh.position, {duration: 1, delay: 4, x: 0})

const tick4 = () => {   

    renderer.render(scene, camera)
    requestAnimationFrame(tick4)
}

setTimeout(() => {
    // tick()
    // tick2()
    // tick3()
    tick4()
}, 2000)
