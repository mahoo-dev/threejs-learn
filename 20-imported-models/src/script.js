import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
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
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)


/**
 * Models
 */

const loader = new GLTFLoader();
// loader.load(
//   '/models/Duck/glTF/Duck.gltf', // 路径指向 .gltf 文件
//   (gltf) => {
//     console.log('gltf loaded', gltf, gltf.scene.children[0]);
//     // scene.add(gltf.scene); // 将模型添加到场景中
//     scene.add(gltf.scene.children[0].children[0]);
//   },
//   (event) => {
//     console.error('模型加载中:', event);
//   },
//   (error) => {
//     console.error('加载模型失败:', error);
//   }
// );

const dracoLoder = new DRACOLoader();
dracoLoder.setDecoderPath('/draco/');
dracoLoder.setDecoderConfig({ type: 'js' });

loader.setDRACOLoader(dracoLoder);
// loader.load(
//     '/models/Duck/glTF-Draco/Duck.gltf', // 路径指向 .gltf 文件
//     (gltf) => {
//         scene.add(gltf.scene);
//     },
//     undefined,
//     (error) => {
//         console.log('error', error);
//     }
// );

let mixer = null;

loader.load(
    '/models/Fox/glTF/Fox.gltf', // 路径指向 .gltf 文件
    (gltf) => {
        console.log('gltf', gltf.scene);
        mixer = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();

        gltf.scene.scale.set(0.021, 0.021, 0.021);
        scene.add(gltf.scene);
    },
    undefined,
    (error) => {
        console.log('error', error);
    }
);
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
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //Update mixer
    mixer?.update(deltaTime)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()