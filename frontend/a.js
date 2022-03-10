import * as THREE from './three.js-dev/build/three.module.js';
import { OrbitControls } from './three.js-dev/examples/jsm/controls/OrbitControls.js';
import { exportAngle, exportAxis, exportMatrix, exportSquaresToTurn } from './networking.js'

/*
=========================================================================================
World Building
=========================================================================================
*/

let camera, controls, scene, renderer;
createScene();
setCameraControls();
setLighting()
animate();

function createScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfaebe3);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(400, 200, -100);

    window.addEventListener('resize', onWindowResize);
}

function setCameraControls() {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents(window); // optional

    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    controls.screenSpacePanning = false;

    controls.minDistance = 200;
    controls.maxDistance = 400;

    controls.maxPolarAngle = Math.PI;
    controls.minPolarAngle = -Math.PI;
}

function setLighting() {

    const dirLight1 = new THREE.DirectionalLight(0xffffff);
    dirLight1.position.set(1, 1, 1);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff);
    dirLight2.position.set(- 1, - 1, - 1);
    scene.add(dirLight2);


    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    controls.update();

    render();

}

function render() {

    renderer.render(scene, camera);

}

/*
=========================================================================================
Building cube
=========================================================================================
*/


let scramble = "yybgwwogrorbroybbgyogogwoygyoogrgwbwwbgybwbbrwrrwyryor";
let cubeSquares = buildCube(scramble);
console.log(cubeSquares)

function buildCube(state = "wwwwwwwwwooooooooogggggggggrrrrrrrrrbbbbbbbbbyyyyyyyyy") {
    let allSquares = []
    let sideWidth = 20;
    let separation = 1.1;

    const geometrySquare = new THREE.PlaneGeometry(sideWidth, sideWidth);
    const materialRed = new THREE.MeshPhongMaterial({ color: 0xde3421, flatShading: true });
    const materialOrange = new THREE.MeshPhongMaterial({ color: 0xc47806, flatShading: true })
    const materialYellow = new THREE.MeshPhongMaterial({ color: 0xeaed32, flatShading: true })
    const materialWhite = new THREE.MeshPhongMaterial({ color: 0xfffff7, flatShading: true })
    const materialGreen = new THREE.MeshPhongMaterial({ color: 0x2bcc2e, flatShading: true })
    const materialBlue = new THREE.MeshPhongMaterial({ color: 0x3e78d6, flatShading: true })

    let stateIndex = -1
    let getColourFromCode = {
        "w": materialWhite,
        "o": materialOrange,
        "g": materialGreen,
        "r": materialRed,
        "b": materialBlue,
        "y": materialYellow,
    }

    // top
    for (let i = -1; i < 2; i++) {
        for (let k = -1; k < 2; k++) {
            stateIndex++
            let colorCode = state[stateIndex]
            let color = getColourFromCode[colorCode]

            const square = new THREE.Mesh(geometrySquare, color)
            square.position.x = k * sideWidth * separation;
            square.position.y = -sideWidth * separation * 1.5;
            square.position.z = -i * sideWidth * separation;
            square.rotation.x = Math.PI / 2;
            square.rotation.y = 0;
            square.rotation.z = 0;
            square.updateMatrix();
            scene.add(square);

            allSquares.push(square)
        }
    }

    // left
    for (let j = -1; j < 2; j++) {
        for (let k = -1; k < 2; k++) {
            stateIndex++
            let colorCode = state[stateIndex]
            let color = getColourFromCode[colorCode]

            const square = new THREE.Mesh(geometrySquare, color)
            square.position.x = -sideWidth * separation * 1.5;
            square.position.y = j * sideWidth * separation;
            square.position.z = -k * sideWidth * separation;
            square.rotation.x = 0;
            square.rotation.y = -Math.PI / 2;
            square.rotation.z = 0;
            square.updateMatrix();
            scene.add(square);

            allSquares.push(square)
        }
    }

    // front
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            stateIndex++
            let colorCode = state[stateIndex]
            let color = getColourFromCode[colorCode]

            const square = new THREE.Mesh(geometrySquare, color)
            square.position.x = j * sideWidth * separation;
            square.position.y = i * sideWidth * separation;
            square.position.z = -sideWidth * separation * 1.5;
            square.rotation.x = 0;
            square.rotation.y = Math.PI;
            square.rotation.z = 0;
            square.updateMatrix();
            scene.add(square);

            allSquares.push(square)
        }
    }

    // right
    for (let j = -1; j < 2; j++) {
        for (let k = -1; k < 2; k++) {
            stateIndex++
            let colorCode = state[stateIndex]
            let color = getColourFromCode[colorCode]

            const square = new THREE.Mesh(geometrySquare, color)
            square.position.x = sideWidth * separation * 1.5;
            square.position.y = j * sideWidth * separation;
            square.position.z = k * sideWidth * separation;
            square.rotation.x = 0;
            square.rotation.y = Math.PI / 2;
            square.rotation.z = 0;
            square.updateMatrix();
            scene.add(square);

            allSquares.push(square)
        }
    }

    // back
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            stateIndex++
            let colorCode = state[stateIndex]
            let color = getColourFromCode[colorCode]

            const square = new THREE.Mesh(geometrySquare, color)
            square.position.x = -j * sideWidth * separation;
            square.position.y = i * sideWidth * separation;
            square.position.z = sideWidth * separation * 1.5;
            square.rotation.x = 0;
            square.rotation.y = 0;
            square.rotation.z = 0;
            square.updateMatrix();
            scene.add(square);

            allSquares.push(square)
        }
    }

    // bottom
    for (let i = -1; i < 2; i++) {
        for (let k = -1; k < 2; k++) {
            stateIndex++
            let colorCode = state[stateIndex]
            let color = getColourFromCode[colorCode]

            const square = new THREE.Mesh(geometrySquare, color)
            square.position.x = k * sideWidth * separation;
            square.position.y = sideWidth * separation * 1.5;
            square.position.z = i * sideWidth * separation;
            square.rotation.x = -Math.PI / 2;
            square.rotation.y = 0;
            square.rotation.z = 0;
            square.updateMatrix();
            scene.add(square);

            allSquares.push(square)
        }
    }
    return allSquares
}
//=========== rotate about world axis ><



//Make an object 
var geometry = new THREE.BoxGeometry(10, 10, 10);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var object = new THREE.Mesh(geometry, material);
object.position.z = -70
scene.add(object);
//Create a matrix
var matrix = new THREE.Matrix4();
//Rotate the matrix
matrix.makeRotationY(Math.PI / 100);

//rotate the object using the matrix
object.position.applyMatrix4(matrix);

var render3 = function () {
    requestAnimationFrame(render3);

    object.position.applyMatrix4(matrix);

    renderer.render(scene, camera);
};

render3();

//=========== rotate around own axis
var geometry = new THREE.BoxGeometry(10, 10, 10);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
cube.position.z = 70



scene.add(cube);

var render2 = function () {
    requestAnimationFrame(render2);

    cube.rotation.y += 0.1;

    renderer.render(scene, camera);
};

render2();
