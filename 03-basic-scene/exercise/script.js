console.log('hello threejs');


// create a scene
const scene = new THREE.Scene();

// create a cube
const geometry = new THREE.BoxGeometry(1, 1, 1);

// create a material
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  // make it wireframe so we can see the cude clearly
  wireframe: true,
});

// create a mesh
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// create a camera 
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

// move the camera backward before doing the render so we can see the cube
camera.position.z = 3;
camera.position.x = 1;

scene.add(camera);

const canvas = document.querySelector('#canvas');
console.log('canvas', canvas);

// create a renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);

// render the scene
renderer.render(scene, camera);