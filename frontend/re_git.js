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

/*
=========================================================================================
Functionality
=========================================================================================
*/

function findSquaresToTurn() {
    let resultSquaresToTurn = []
    let positionList = exportSquaresToTurn['positionList']
    let rotationList = exportSquaresToTurn['rotationList']
    let sideR = [], sideL = [], sideD = [], sideU = [], sideB = [], sideF = []

    // for each position 
    for (var i in positionList) {
        let aPosition = positionList[i]
        let aRotation = rotationList[i]
        // find the corresponding square
        for (let i = 0; i < 54; i++) {
            let square = cubeSquares[i]
            if (
                aPosition[0] == square.position.x
                && aPosition[1] == square.position.y
                && aPosition[2] == square.position.z
            ) {
                // and add that to an array
                resultSquaresToTurn.push(square)

                // and also add it to an array corresponding to its rotation
                if (aRotation[0] == 1) { sideR.push(square) }
                if (aRotation[0] == -1) { sideL.push(square) }
                if (aRotation[1] == 1) { sideD.push(square) }
                if (aRotation[1] == -1) { sideU.push(square) }
                if (aRotation[2] == 1) { sideB.push(square) }
                if (aRotation[2] == -1) { sideF.push(square) }
            }
        }
    }

    // find which face has 9 squares. that will be the face we're rotating
    let resultSquaresOnOtherSide
    if (sideR.length == 9) { resultSquaresOnOtherSide = sideL.concat(sideD, sideU, sideB, sideF) }
    if (sideL.length == 9) { resultSquaresOnOtherSide = sideR.concat(sideD, sideU, sideB, sideF) }
    if (sideD.length == 9) { resultSquaresOnOtherSide = sideR.concat(sideL, sideU, sideB, sideF) }
    if (sideU.length == 9) { resultSquaresOnOtherSide = sideR.concat(sideL, sideD, sideB, sideF) }
    if (sideB.length == 9) { resultSquaresOnOtherSide = sideR.concat(sideL, sideD, sideU, sideF) }
    if (sideF.length == 9) { resultSquaresOnOtherSide = sideR.concat(sideL, sideD, sideU, sideB) }

    console.log("resultSquaresOnOtherSide", resultSquaresOnOtherSide)

    console.log("resultSquaresToTurn", resultSquaresToTurn)

    let result = {
        "resultSquaresOnOtherSide": resultSquaresOnOtherSide,
        "resultSquaresToTurn": resultSquaresToTurn
    }
    return result
}


function turnSquares() {
    //define the axis and angle of rotation
    let axis = new THREE.Vector3(0, 0, 0);
    if (exportAxis == "X") {
        axis.set(1, 0, 0);
    } else if (exportAxis == "Y") {
        axis.set(0, 1, 0);
    } else if (exportAxis == "Z") {
        axis.set(0, 0, 1);
    }
    let angle = exportAngle * Math.PI / 2

    let m = exportMatrix
    const rotationMatrix = new THREE.Matrix4();
    rotationMatrix.set(m[0][0], m[0][1], m[0][2], 0,
        m[1][0], m[1][1], m[1][2], 0,
        m[2][0], m[2][1], m[2][2], 0,
        0, 0, 0, 0);




    const quaternion = new THREE.Quaternion();
    //quaternion.setFromRotationMatrix(rotationMatrix)
    quaternion.setFromAxisAngle(axis, angle)

    let resultSquares = findSquaresToTurn()
    let squaresToTurn = resultSquares['resultSquaresToTurn']

    for (var square in squaresToTurn) { // rotate the position of the squares
        let position = squaresToTurn[square].position
        const vector = new THREE.Vector3(position.x, position.y, position.z);
        vector.applyQuaternion(quaternion);
        squaresToTurn[square].position.x = Math.round(vector.x)
        squaresToTurn[square].position.y = Math.round(vector.y)
        squaresToTurn[square].position.z = Math.round(vector.z)
    }

    for (var square in squaresOnOtherSide) {
        squaresOnOtherSide[square].rotateOnAxis(axis, angle)
    }
}


function test() {
    let sideWidth = 20;
    let separation = 1.1;

    const geometrySquare = new THREE.PlaneGeometry(sideWidth, sideWidth);
    const materialRed = new THREE.MeshPhongMaterial({ color: 0xde3421, flatShading: true });
    const materialOrange = new THREE.MeshPhongMaterial({ color: 0xc47806, flatShading: true })
    const materialYellow = new THREE.MeshPhongMaterial({ color: 0xeaed32, flatShading: true })
    const materialWhite = new THREE.MeshPhongMaterial({ color: 0xfffff7, flatShading: true })
    const materialGreen = new THREE.MeshPhongMaterial({ color: 0x2bcc2e, flatShading: true })
    const materialBlue = new THREE.MeshPhongMaterial({ color: 0x3e78d6, flatShading: true })

    // front
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            const square = new THREE.Mesh(geometrySquare, materialGreen)
            square.position.x = i * sideWidth * separation;
            square.position.y = j * sideWidth * separation;
            square.position.z = -sideWidth * separation * 1.5;
            square.rotation.x = 0;
            square.rotation.y = Math.PI;
            square.rotation.z = 0;
            square.updateMatrix();
            scene.add(square);

        }
    }

}

export function test2() {
    alert("hi")
}

function test3() {
    turnSquares()
}

document.getElementById("test3").addEventListener("click", test3);