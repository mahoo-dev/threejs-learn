import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png')

// Geometry
const geometry = new THREE.BufferGeometry()

const count = 50000
const positionsArray = new Float32Array(count * 3)
const colorsArray = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
    positionsArray[i] = (Math.random() - 0.5) * 10
    colorsArray[i] = Math.random()
}

geometry.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3))
geometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3))

// Material
const material = new THREE.PointsMaterial({
    // map: particleTexture,
    transparent: true,
    alphaMap: particleTexture,
    // alphaTest: 0.001,
    // depthTest:false,
    depthWrite: false,
    // color: 'pink',
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    size: 0.05,
    sizeAttenuation: true
})


const points = new THREE.Points(geometry, material)

scene.add(points)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Points animation
    // points.rotation.y += 0.001
    // points.rotation.z += 0.001

    // Update points
    for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const x = positionsArray[i3]
        // positionsArray[i3 + 1] = Math.sin(elapsedTime + x)
        positionsArray[i3 + 2] = Math.cos(elapsedTime + x) * 0.5
        geometry.attributes.position.needsUpdate = true
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()