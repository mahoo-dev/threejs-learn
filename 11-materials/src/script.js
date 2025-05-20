import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import * as lil from 'lil-gui';


// Debug

const gui = new lil.GUI({ title: "Controls Panel" });



/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const colortTexture = textureLoader.load('/textures/door/color.jpg')
const minecraftTexture = textureLoader.load('/textures/minecraft.png')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')


const matcapsTexture = textureLoader.load('/textures/matcaps/1.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')


// const cubeTextureLoader = new THREE.CubeTextureLoader()
// const environmentTexture = cubeTextureLoader.load()

const hdrLoader = new RGBELoader()
hdrLoader.load(
  '/textures/environmentMap/2k.hdr',
  (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.environment = texture // 设置场景环境贴图
    scene.background = texture // 设置场景背景贴图
    // material.envMap = texture // 或直接设置到材质
  }
)

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()




// const material = new THREE.MeshBasicMaterial({
//     color: 0xff0000,
//     wireframe: true
// })

// const material = new THREE.MeshBasicMaterial({
//     map: colortTexture
// })

// adjusting the material
// material.opacity = 0.5
// material.transparent = true
// material.alphaMap = alphaTexture

// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true


// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapsTexture

// const material = new THREE.MeshDepthMaterial({
//     // depthPacking: THREE.RGBADepthPacking,
//     wireframe: false,
//     side: THREE.FrontSide,
// })

// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial()

// const material = new THREE.MeshToonMaterial()

// const material = new THREE.MeshStandardMaterial()
// material.map = colortTexture
// material.aoMap = ambientOcclusionTexture
// material.displacementMap = heightTexture
// material.displacementScale = 0.05

// material.metalnessMap = metalnessTexture
// material.roughnessMap = roughnessTexture
// material.normalMap = normalTexture
// material.alphaMap = alphaTexture
// material.transparent = true

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2

gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
gui.add(material, 'aoMapIntensity').min(1).max(10).step(0.1)
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001)

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
)

sphere.geometry.setAttribute(
    'uv2',
    sphere.geometry.attributes.uv.clone()
)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 128, 128),
    material
)

plane.geometry.setAttribute(
    'uv2',
    plane.geometry.attributes.uv.clone()
)
plane.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
)
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 32),
    material
)


plane.position.x = 2.5
torus.position.x = -2.5

scene.add(sphere, plane, torus)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 2
pointLight.position.z = 4
scene.add(pointLight)


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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // update objects
    sphere.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()