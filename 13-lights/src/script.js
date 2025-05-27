import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';


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
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
gui.add(ambientLight, 'intensity').min(0).max(10).step(0.1).name('Ambient')
scene.add(ambientLight)


const pointLight = new THREE.PointLight(0x00ff00, 50)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
gui.add(pointLight, 'intensity').min(0).max(10).step(0.1).name('Point');
scene.add(pointLight)
const helper = new THREE.PointLightHelper(pointLight, 1, 0x00ff00);
scene.add(helper);


const light = new THREE.DirectionalLight(0xff0000, 1);
light.position.set(10, 10, 10); // 光线来自的位置（方向决定照射方向）
gui.add(light, 'intensity').min(0).max(10).step(0.1).name('Directional');
scene.add(light);
scene.add(new THREE.DirectionalLightHelper(light, 1, 0xff0000)); // 可视化方向光


light.castShadow = true;
gui.add(light, 'castShadow').name('Directional Cast Shadow')

// 可选调参：设置阴影范围、分辨率
light.shadow.mapSize.set(2048, 2048);
light.shadow.camera.near = 1;
light.shadow.camera.far = 50;
light.shadow.camera.left = -10;
light.shadow.camera.right = 10;
light.shadow.camera.top = 10;
light.shadow.camera.bottom = -10;



// 阴影摄像头
const shadowCameraHelper = new THREE.CameraHelper(light.shadow.camera);
let showShadowCameraHelper = false;
gui.add({ showHelper: showShadowCameraHelper }, 'showHelper')
    .name('Directional Shadow Helper')
    .onChange((value) => {
        showShadowCameraHelper = value;
        if (value) {
            scene.add(shadowCameraHelper);
        } else {
            scene.remove(shadowCameraHelper);
        }
    });


const hemisphereLight = new THREE.HemisphereLight(0xfff000, 0x000fff, 1);
scene.add(hemisphereLight);
gui.add(hemisphereLight, 'intensity').min(0).max(10).step(0.1).name('Hemisphere');

const hemisphereHelper = new THREE.HemisphereLightHelper(hemisphereLight, 5, 0xfff000);
scene.add(hemisphereHelper);



const rectAreaLight = new THREE.RectAreaLight(0xee9ece, 2, 4, 2); 
rectAreaLight.position.set(0, 5, 0);
rectAreaLight.lookAt(0, 0, 0); // 指向目标方向

gui.add(rectAreaLight, 'intensity').min(0).max(10).step(0.1).name('Rect Area');
scene.add(rectAreaLight);
const rectAreaHelper = new RectAreaLightHelper(rectAreaLight);
rectAreaLight.add(rectAreaHelper);



const spotLight = new THREE.SpotLight(0xff0000, 1, 100, Math.PI / 6, 0.3, 2);

gui.add(spotLight, 'intensity').min(0).max(10).step(0.1).name('Spot');

spotLight.position.set(5, 10, 5);
spotLight.target.position.set(0, 0, 0); // 照射目标
scene.add(spotLight);
scene.add(spotLight.target);

const spotHelper = new THREE.SpotLightHelper(spotLight, '#0000ff');
scene.add(spotHelper);
/**
 * Objects
 */
// Material
const material = new THREE.MeshPhysicalMaterial()
material.roughness = 0.4


// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material,
)
sphere.castShadow = true;
sphere.receiveShadow = true;
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)
cube.castShadow = true;
cube.receiveShadow = true;

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.castShadow = true;
torus.receiveShadow = true;
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65
plane.receiveShadow = true;

scene.add(sphere, cube, torus, plane)

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
renderer.shadowMap.enabled = true;
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()