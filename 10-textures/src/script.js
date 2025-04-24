import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'



/**
 * Textures
 * using a new image and a texture
 */
// const image = new Image()
// const texture = new THREE.Texture(image)
// image.src = '/textures/door/color.jpg'
// image.onload = () => {
//     texture.needsUpdate = true
// }
// image.crossOrigin = 'anonymous'

/**
 * Texture Loader
 */
// const textureLoader = new THREE.TextureLoader()
// const texture = textureLoader.load(
//     '/textures/door/color.jpg',
//     () =>
//     {
//         console.log('texture loaded')
//     },
//     () =>
//     {
//         console.log('progress')
//     },
//     () =>
//     {
//         console.log('error')
//     }
// )


/**
 * Texture LoadingManager
 */

const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () =>
{
    console.log('onStart')
}
loadingManager.onLoad = () =>
{
    console.log('onLoad')
}
loadingManager.onProgress = () =>
{
    console.log('onProgress')
}
loadingManager.onError = () =>
{
    console.log('onError')
}
const textureLoader = new THREE.TextureLoader(loadingManager)
// const colortTexture = textureLoader.load('/textures/door/color.jpg')
const colortTexture = textureLoader.load('/textures/minecraft.png')

const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg', () =>
{
    console.log('gradient texture loaded')
})
gradientTexture.wrapS = THREE.RepeatWrapping
gradientTexture.wrapT = THREE.RepeatWrapping

// texture.wrapS = THREE.RepeatWrapping
// texture.wrapT = THREE.RepeatWrapping
// texture.repeat.x = 2
// texture.repeat.y = 3
// texture.offset.x = 0.5
// texture.offset.y = 0.5
// texture.rotation = Math.PI / 4
// texture.center.x = 0.5
// texture.center.y = 0.5
// texture.magFilter = THREE.NearestFilter
colortTexture.minFilter = THREE.LinearFilter
colortTexture.magFilter = THREE.NearestFilter
// texture.generateMipmaps = false
// texture.anisotropy = 16
// texture.encoding = THREE.sRGBEncoding
// texture.anisotropy = 16
// texture.needsUpdate = true
// texture.flipY = false
// texture.colorSpace = THREE.SRGBColorSpace
// texture.premultipliedAlpha = false
// texture.premultipliedAlpha = true
// texture.premultipliedAlpha = false
// texture.premultipliedAlpha = true       

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ map: colortTexture })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
camera.position.z = 1
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

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()