import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2
const objectToTest = [object1, object2, object3]
scene.add(...objectToTest)

/**
 * Racaster
 */
const raycaster = new THREE.Raycaster()
const rayOrigin = new THREE.Vector3(-3, 0, 0)
const rayDirection = new THREE.Vector3(10, 0, 0)
const arrowHelper = new THREE.ArrowHelper(
    rayDirection, // 方向（必须单位向量）
    rayOrigin,    // 起点
    10,    // 可视长度
    0xff0000   // 颜色
);
scene.add(arrowHelper);

// normalize
rayDirection.normalize()
raycaster.set(rayOrigin, rayDirection)
// const intersect = raycaster.intersectObject(object2)
// console.log(intersect)
// const intersects = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersects)


const loader = new GLTFLoader();



let duck = null
loader.load(
    '/models/Duck/glTF/Duck.gltf', // 路径指向 .gltf 文件
    (gltf) => {
        duck = gltf.scene
        gltf.scene.position.y = 3;
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


const cameraRacaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    // 1. 将鼠标坐标从屏幕坐标转换为 -1 ~ 1（NDC）
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // // 2. 生成射线（相机发出，穿过鼠标点）
    // cameraRacaster.setFromCamera(mouse, camera);

    // // 3. 检测相交物体
    // const intersects = cameraRacaster.intersectObjects(objectToTest, true);

    // if (intersects.length > 0) {
    //     const first = intersects[0];
    //     console.log('你点击了：', first);
    //     first.object.material.color.set(Math.random() * 0xffffff);
    //     first.object.userData.clicked = true;
    // }
});

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    cameraRacaster.setFromCamera(mouse, camera);
});


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Animate objects
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5
    const intersects = raycaster.intersectObjects(objectToTest)

    for (const intersect of objectToTest) {
        if (!intersect.userData.clicked) {
            intersect.material.color.set(0xff0000)
        }
    }

    for (const intersect of intersects) {
        intersect.object.material.color.set(0x00ff00)
    }

    if (duck) {
        const intersects = cameraRacaster.intersectObjects([duck], true)
        console.log('intersects', intersects);
        if (intersects.length > 0) {
            const intersect = intersects[0].object
            // intersect.scale.set(2, 2, 2)
            duck.scale.set(2, 2, 2)
        } else {
            duck.scale.set(1, 1, 1)
        }
    }
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()