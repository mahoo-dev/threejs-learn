import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'


const textureLoader = new THREE.TextureLoader()
const bakedShadowTexture = textureLoader.load('/textures/bakedShadow.jpg')
const simpleShadowTexture = textureLoader.load('/textures/simpleShadow.jpg')



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
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(directionalLight)

directionalLight.castShadow = true
directionalLight.shadow.bias = -0.001;           // 修正“阴影浮空”
directionalLight.shadow.camera.near = 1;       // 阴影摄像机近裁剪面
directionalLight.shadow.camera.far = 6;
gui.add(directionalLight.shadow.camera, 'near').min(0).max(10).step(0.001).name('Near')
gui.add(directionalLight.shadow.camera, 'far').min(0).max(10).step(0.001).name('Far')
gui.add(directionalLight.shadow, 'bias').min(-0.01).max(0).step(0.001).name('Bias')
gui.add(directionalLight.shadow, 'radius').min(0).max(10).step(0.001).name('Radius')
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)

scene.add(directionalLightCameraHelper)
directionalLightCameraHelper.visible = false
gui.add(directionalLightCameraHelper, 'visible').name('Helper')



/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true

// const plane = new THREE.Mesh(
//     new THREE.PlaneGeometry(5, 5),
//     material
// )

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshBasicMaterial({
        map: bakedShadowTexture,
    })
)
plane.receiveShadow = true
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5

scene.add(sphere, plane)


const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadowTexture,
    })
)

scene.add(sphereShadow)
sphereShadow.rotation.x = - Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.01

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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
// renderer.shadowMap.enabled = true
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()
    directionalLight.shadow.camera.updateProjectionMatrix()


    // update the sphere position
    sphere.position.x = Math.sin(elapsedTime) * 1.5
    sphere.position.z = Math.cos(elapsedTime) * 1.5
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3)) * 0.5

    // Update sphere shadow position
    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z

    // Update sphere shadow opacity based on sphere height 
    sphereShadow.material.opacity = Math.max(0, 1 - sphere.position.y * 2)
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()