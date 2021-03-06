import * as THREE from './three.js-dev/build/three.module.js';
import { OrbitControls } from './three.js-dev/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from './three.js-dev/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from './three.js-dev/examples/jsm/geometries/TextGeometry.js';
import {
    exportAngle,
    exportAxis,
    exportMatrix,
    exportSquaresToTurn,
    getSquaresOnFace,
    solveCube,
    exportSolution,
    getCubeState,
    exportCubeState
} from './networking.js';

/*
=========================================================================================
Create the scene
=========================================================================================
*/

let camera, controls, scene, renderer;

let cubeSquares;
let counter;
let allFloats = [];

createScene();
setCameraControls();
setLighting();
animate();
cubeSquares = buildCube();

function createScene() {
    // create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfaebe3);
    // set renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // set camera
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(100, -200, -400);
    camera.up.set(0, -1, 0);

    window.addEventListener('resize', onWindowResize);
}

function buildCube(state = "wwwwwwwwwooooooooogggggggggrrrrrrrrrbbbbbbbbbyyyyyyyyy") {
    let allSquares = [];
    // constants of the cube dimensions
    let sideWidth = 20;
    let separation = 1.1;
    let floatDist = 80;

    // constants of the squares' geometry and colour
    const geometrySquare = new THREE.PlaneGeometry(sideWidth, sideWidth);
    const materialRed = new THREE.MeshPhongMaterial({ color: 0xde3421, flatShading: true });
    const materialOrange = new THREE.MeshPhongMaterial({ color: 0xc47806, flatShading: true });
    const materialYellow = new THREE.MeshPhongMaterial({ color: 0xeaed32, flatShading: true });
    const materialWhite = new THREE.MeshPhongMaterial({ color: 0xfffff7, flatShading: true });
    const materialGreen = new THREE.MeshPhongMaterial({ color: 0x2bcc2e, flatShading: true });
    const materialBlue = new THREE.MeshPhongMaterial({ color: 0x3e78d6, flatShading: true });

    const materialBlack = new THREE.MeshPhongMaterial({ color: 0x000000, flatShading: true });
    const geometryBlack = new THREE.PlaneGeometry(sideWidth * separation, sideWidth * separation);

    // define what material to use depending on the colour code
    let stateIndex = -1;
    let getColourFromCode = {
        "w": materialWhite,
        "o": materialOrange,
        "g": materialGreen,
        "r": materialRed,
        "b": materialBlue,
        "y": materialYellow,
    };

    // add the squares to the scene
    // top
    for (let i = -1; i < 2; i++) {
        for (let k = -1; k < 2; k++) {
            // find what coloured square to add
            stateIndex++;
            let colorCode = state[stateIndex];
            let color = getColourFromCode[colorCode];

            // create a new square
            const square = new THREE.Mesh(geometrySquare, color);
            // set its position
            square.position.x = k * sideWidth * separation;
            square.position.y = -sideWidth * separation * 1.5;
            square.position.z = -i * sideWidth * separation;
            // set its rotation
            square.rotation.x = Math.PI / 2;
            square.rotation.y = 0;
            square.rotation.z = 0;
            square.updateMatrix();
            // add to scene
            scene.add(square);
            // add to a list of all the squares
            allSquares.push(square);

            // build the floating face
            const floatingSquare = new THREE.Mesh(geometrySquare, color);
            floatingSquare.position.z = floatDist;
            floatingSquare.rotation.y = - Math.PI;
            floatingSquare.updateMatrix();
            // add to scene
            scene.add(floatingSquare);
            // add it as a child to its respective square on the cube
            // this makes sure the floating square rotates with its parent square
            square.add(floatingSquare);
            // add the square to a list of all floats
            // needed for when toggling the visibility of floating squares
            allFloats.push(floatingSquare);

            // adding a black square 
            // optional but makes it look neater
            const blackSquare = new THREE.Mesh(geometryBlack, materialBlack);
            blackSquare.rotation.y = - Math.PI;
            blackSquare.updateMatrix();
            scene.add(blackSquare);
            square.add(blackSquare);
        }
    }

    // left
    for (let j = -1; j < 2; j++) {
        for (let k = -1; k < 2; k++) {
            stateIndex++;
            let colorCode = state[stateIndex];
            let color = getColourFromCode[colorCode];

            const square = new THREE.Mesh(geometrySquare, color);
            square.position.x = -sideWidth * separation * 1.5;
            square.position.y = j * sideWidth * separation;
            square.position.z = -k * sideWidth * separation;
            square.rotation.x = 0;
            square.rotation.y = -Math.PI / 2;
            square.rotation.z = 0;
            square.updateMatrix();
            scene.add(square);
            allSquares.push(square);

            const floatingSquare = new THREE.Mesh(geometrySquare, color);
            floatingSquare.position.z = floatDist;
            floatingSquare.rotation.y = - Math.PI;
            floatingSquare.updateMatrix();
            scene.add(floatingSquare);
            square.add(floatingSquare);
            allFloats.push(floatingSquare);

            const blackSquare = new THREE.Mesh(geometryBlack, materialBlack);
            blackSquare.rotation.y = - Math.PI;
            blackSquare.updateMatrix();
            scene.add(blackSquare);
            square.add(blackSquare);
        }
    }

    // front
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            stateIndex++;
            let colorCode = state[stateIndex];
            let color = getColourFromCode[colorCode];

            const square = new THREE.Mesh(geometrySquare, color);
            square.position.x = j * sideWidth * separation;
            square.position.y = i * sideWidth * separation;
            square.position.z = -sideWidth * separation * 1.5;
            square.rotation.x = 0;
            square.rotation.y = Math.PI;
            square.rotation.z = 0;
            square.updateMatrix();
            scene.add(square);
            allSquares.push(square);

            const floatingSquare = new THREE.Mesh(geometrySquare, color);
            floatingSquare.position.z = floatDist;
            floatingSquare.rotation.y = - Math.PI;
            floatingSquare.updateMatrix();
            scene.add(floatingSquare);
            square.add(floatingSquare);
            allFloats.push(floatingSquare);

            const blackSquare = new THREE.Mesh(geometryBlack, materialBlack);
            blackSquare.rotation.y = - Math.PI;
            blackSquare.updateMatrix();
            scene.add(blackSquare);
            square.add(blackSquare);
        }
    }

    // right
    for (let j = -1; j < 2; j++) {
        for (let k = -1; k < 2; k++) {
            stateIndex++;
            let colorCode = state[stateIndex];
            let color = getColourFromCode[colorCode];

            const square = new THREE.Mesh(geometrySquare, color);
            square.position.x = sideWidth * separation * 1.5;
            square.position.y = j * sideWidth * separation;
            square.position.z = k * sideWidth * separation;
            square.rotation.x = 0;
            square.rotation.y = Math.PI / 2;
            square.rotation.z = 0;
            square.updateMatrix();
            scene.add(square);
            allSquares.push(square);

            const floatingSquare = new THREE.Mesh(geometrySquare, color);
            floatingSquare.position.z = floatDist;
            floatingSquare.rotation.y = - Math.PI;
            floatingSquare.updateMatrix();
            scene.add(floatingSquare);
            square.add(floatingSquare);
            allFloats.push(floatingSquare);

            const blackSquare = new THREE.Mesh(geometryBlack, materialBlack);
            blackSquare.rotation.y = - Math.PI;
            blackSquare.updateMatrix();
            scene.add(blackSquare);
            square.add(blackSquare);
        }
    }

    // back
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            stateIndex++;
            let colorCode = state[stateIndex];
            let color = getColourFromCode[colorCode];

            const square = new THREE.Mesh(geometrySquare, color);
            square.position.x = -j * sideWidth * separation;
            square.position.y = i * sideWidth * separation;
            square.position.z = sideWidth * separation * 1.5;
            square.rotation.x = 0;
            square.rotation.y = 0;
            square.rotation.z = 0;
            square.updateMatrix();
            scene.add(square);
            allSquares.push(square);

            const floatingSquare = new THREE.Mesh(geometrySquare, color);
            floatingSquare.position.z = floatDist;
            floatingSquare.rotation.y = - Math.PI;
            floatingSquare.updateMatrix();
            scene.add(floatingSquare);
            square.add(floatingSquare);
            allFloats.push(floatingSquare);

            const blackSquare = new THREE.Mesh(geometryBlack, materialBlack);
            blackSquare.rotation.y = - Math.PI;
            blackSquare.updateMatrix();
            scene.add(blackSquare);
            square.add(blackSquare);
        }
    }

    // bottom
    for (let i = -1; i < 2; i++) {
        for (let k = -1; k < 2; k++) {
            stateIndex++;
            let colorCode = state[stateIndex];
            let color = getColourFromCode[colorCode];

            const square = new THREE.Mesh(geometrySquare, color);
            square.position.x = k * sideWidth * separation;
            square.position.y = sideWidth * separation * 1.5;
            square.position.z = i * sideWidth * separation;
            square.rotation.x = -Math.PI / 2;
            square.rotation.y = 0;
            square.rotation.z = 0;
            square.updateMatrix();
            scene.add(square);
            allSquares.push(square);

            const floatingSquare = new THREE.Mesh(geometrySquare, color);
            floatingSquare.position.z = floatDist;
            floatingSquare.rotation.y = - Math.PI;
            floatingSquare.updateMatrix();
            scene.add(floatingSquare);
            square.add(floatingSquare);
            allFloats.push(floatingSquare);

            const blackSquare = new THREE.Mesh(geometryBlack, materialBlack);
            blackSquare.rotation.y = - Math.PI;
            blackSquare.updateMatrix();
            scene.add(blackSquare);
            square.add(blackSquare);
        }
    }

    // initialise all the floating squares as hidden
    for (var square in allFloats) {
        allFloats[square].visible = false;
    }

    // adding labels to the cube faces
    var loader = new FontLoader();
    var textMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    // the text, position and rotation of each label
    let labelText = ["U", "L", "F", "R", "B", "D"];
    let labelPosition = [[-5, -34, -5], [-34, 5, 5], [-5, 5, -34], [34, 5, -5], [5, 5, 34], [-5, 34, 5]];
    let labelRotation = [[1, 0, 0], [2, 3, 0], [2, 0, 0], [2, 1, 0], [2, 2, 0], [3, 0, 0]];
    loader.load('./three.js-dev/examples/fonts/helvetiker_bold.typeface.json', function (font) {
        // for each label
        for (var i in labelText) {
            // create the geometry using the labelText
            var textGeometry = new TextGeometry(labelText[i], {
                font: font,
                size: 10,
                height: 0.01,
                curveSegments: 12,
            });
            var label = new THREE.Mesh(textGeometry, textMaterial);
            // set the position
            label.position.x = labelPosition[i][0];
            label.position.y = labelPosition[i][1];
            label.position.z = labelPosition[i][2];
            // set the rotation
            label.rotation.x = labelRotation[i][0] * Math.PI / 2;
            label.rotation.y = labelRotation[i][1] * Math.PI / 2;
            label.rotation.z = labelRotation[i][2] * Math.PI / 2;
            // add to scene
            scene.add(label);
        };
    })
    // return the list of all squares for use later
    return allSquares;
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
}

function render() {
    renderer.render(scene, camera);
}

function setCameraControls() {
    // defining the camera movements
    controls = new OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents(window);

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

/*
=========================================================================================
Creating the ability for the cube to turn
=========================================================================================
*/

// speed of the animation
// turnSquares defines the number of intermediary turns
// doSolve sets the time between moves
let speed = 50;

function findSquaresToTurn() {
    let resultSquaresToTurn = []
    // get the list of all positions of the squares that need to be turned
    let positionList = exportSquaresToTurn['positionList'];

    // for each position 
    for (var i in positionList) {
        let aPosition = positionList[i];
        // find the corresponding square
        for (let i = 0; i < 54; i++) {
            let square = cubeSquares[i];
            if (
                aPosition[0] == square.position.x
                && aPosition[1] == square.position.y
                && aPosition[2] == square.position.z
            ) {
                // and add that to an array
                resultSquaresToTurn.push(square);
            }
        }
    }
    let result = {
        "resultSquaresToTurn": resultSquaresToTurn
    }
    return result;
}

function turnSquares() {
    //find the squares to turn
    let resultSquares = findSquaresToTurn();
    let squaresToTurn = resultSquares['resultSquaresToTurn'];

    // set the axis and angle of rotation to be local variables
    let targetAxis = exportAxis;
    let targetAngle = exportAngle;

    // divider is the number of segments the 90 degree turn is divided into
    // higher divider = more segments in a 90 degree turn = slower animation
    let divider = speed;
    //rotates the layer
    function rotator() {
        //define the axis and angle of rotation
        let axis = new THREE.Vector3(0, 0, 0);
        if (targetAxis == "X") {
            axis.set(1, 0, 0);
        } else if (targetAxis == "Y") {
            axis.set(0, 1, 0);
        } else if (targetAxis == "Z") {
            axis.set(0, 0, 1);
        }
        let angle = targetAngle * Math.PI / divider;
        // make the rotation matrix using axis and angle
        var matrix = new THREE.Matrix4();
        matrix.makeRotationAxis(axis, angle);

        // counter tracks how many incremental turns have been carried out
        // saying 'if counter < divider = 2' is equivalent to saying
        // if the turn has not reached 90 degrees yet
        if (counter < divider / 2) {
            requestAnimationFrame(rotator);
            // turn every square
            for (var square in squaresToTurn) {
                squaresToTurn[square].applyMatrix4(matrix);
            }
            counter += 1;
        }
        // once the turn has reached 90 degrees
        if (counter == divider / 2) {
            for (var square in squaresToTurn) {
                let xyz = ["x", "y", "z"]
                for (var i in xyz) {
                    // set the final position to be the the nearest integer
                    // this snaps the square into place (stops floating point maths errors)
                    squaresToTurn[square].position[xyz[i]]
                        = Math.round(squaresToTurn[square].position[xyz[i]]);
                }
            }
        }
        renderer.render(scene, camera);
    }
    rotator();
}

// function to carry out the move
function completeTurn(face) {
    // find all the squares that need to be turned
    getSquaresOnFace(face);
    // and after 500ms, do the turn
    setTimeout(() => { counter = 0; turnSquares() }, 500);
}

// all the move buttons' event listeners
document.getElementById("TurnR").addEventListener("click", function () { completeTurn("R") });
document.getElementById("TurnL").addEventListener("click", function () { completeTurn("L") });
document.getElementById("TurnD").addEventListener("click", function () { completeTurn("D") });
document.getElementById("TurnU").addEventListener("click", function () { completeTurn("U") });
document.getElementById("TurnB").addEventListener("click", function () { completeTurn("B") });
document.getElementById("TurnF").addEventListener("click", function () { completeTurn("F") });
document.getElementById("TurnR'").addEventListener("click", function () { completeTurn("R'") });
document.getElementById("TurnL'").addEventListener("click", function () { completeTurn("L'") });
document.getElementById("TurnD'").addEventListener("click", function () { completeTurn("D'") });
document.getElementById("TurnU'").addEventListener("click", function () { completeTurn("U'") });
document.getElementById("TurnB'").addEventListener("click", function () { completeTurn("B'") });
document.getElementById("TurnF'").addEventListener("click", function () { completeTurn("F'") });
document.getElementById("TurnR2").addEventListener("click", function () { completeTurn("R2") });
document.getElementById("TurnL2").addEventListener("click", function () { completeTurn("L2") });
document.getElementById("TurnD2").addEventListener("click", function () { completeTurn("D2") });
document.getElementById("TurnU2").addEventListener("click", function () { completeTurn("U2") });
document.getElementById("TurnB2").addEventListener("click", function () { completeTurn("B2") });
document.getElementById("TurnF2").addEventListener("click", function () { completeTurn("F2") });
document.getElementById("TurnM").addEventListener("click", function () { completeTurn("M") });
document.getElementById("TurnE").addEventListener("click", function () { completeTurn("E") });
document.getElementById("TurnS").addEventListener("click", function () { completeTurn("S") });
document.getElementById("TurnM'").addEventListener("click", function () { completeTurn("M'") });
document.getElementById("TurnE'").addEventListener("click", function () { completeTurn("E'") });
document.getElementById("TurnS'").addEventListener("click", function () { completeTurn("S'") });
document.getElementById("TurnM2").addEventListener("click", function () { completeTurn("M2") });
document.getElementById("TurnE2").addEventListener("click", function () { completeTurn("E2") });
document.getElementById("TurnS2").addEventListener("click", function () { completeTurn("S2") });
document.getElementById("TurnX").addEventListener("click", function () { completeTurn("X") });
document.getElementById("TurnY").addEventListener("click", function () { completeTurn("Y") });
document.getElementById("TurnZ").addEventListener("click", function () { completeTurn("Z") });
document.getElementById("TurnX'").addEventListener("click", function () { completeTurn("X'") });
document.getElementById("TurnY'").addEventListener("click", function () { completeTurn("Y'") });
document.getElementById("TurnZ'").addEventListener("click", function () { completeTurn("Z'") });
document.getElementById("TurnX2").addEventListener("click", function () { completeTurn("X2") });
document.getElementById("TurnY2").addEventListener("click", function () { completeTurn("Y2") });
document.getElementById("TurnZ2").addEventListener("click", function () { completeTurn("Z2") });
document.getElementById("Turnr").addEventListener("click", function () { completeTurn("r") });
document.getElementById("Turnl").addEventListener("click", function () { completeTurn("l") });
document.getElementById("Turnd").addEventListener("click", function () { completeTurn("d") });
document.getElementById("Turnu").addEventListener("click", function () { completeTurn("u") });
document.getElementById("Turnb").addEventListener("click", function () { completeTurn("b") });
document.getElementById("Turnf").addEventListener("click", function () { completeTurn("f") });
document.getElementById("Turnr'").addEventListener("click", function () { completeTurn("r'") });
document.getElementById("Turnl'").addEventListener("click", function () { completeTurn("l'") });
document.getElementById("Turnd'").addEventListener("click", function () { completeTurn("d'") });
document.getElementById("Turnu'").addEventListener("click", function () { completeTurn("u'") });
document.getElementById("Turnb'").addEventListener("click", function () { completeTurn("b'") });
document.getElementById("Turnf'").addEventListener("click", function () { completeTurn("f'") });
document.getElementById("Turnr2").addEventListener("click", function () { completeTurn("r2") });
document.getElementById("Turnl2").addEventListener("click", function () { completeTurn("l2") });
document.getElementById("Turnd2").addEventListener("click", function () { completeTurn("d2") });
document.getElementById("Turnu2").addEventListener("click", function () { completeTurn("u2") });
document.getElementById("Turnb2").addEventListener("click", function () { completeTurn("b2") });
document.getElementById("Turnf2").addEventListener("click", function () { completeTurn("f2") });

/*
=========================================================================================
Features of the UI
=========================================================================================
*/

let cubeState;
let solutionIndex = 0;
let solution;

/* ====== elements from the right hand side ====== */

/* expand and collapse the move button menu */
let moreMovesToggle = false; // false = hidden
document.getElementById("moreMoves").addEventListener("click", showMoreMoves);
function showMoreMoves() {
    moreMovesToggle = !moreMovesToggle;
    if (moreMovesToggle) {
        document.getElementById("bottomMoves").style.display = "block";
        document.getElementById("leftMoves").style.display = "block";
        document.getElementById("moveButtons").style.width = "320px";
        document.getElementById("moveButtons").style.height = "350px";
        document.getElementById("movesTitle").innerHTML = "All Moves";
        document.getElementById("moreMoves").style.top = "20px";
        document.getElementById("moreMoves").innerHTML = "Show Fewer Moves";
    } else {
        document.getElementById("bottomMoves").style.display = "none";
        document.getElementById("leftMoves").style.display = "none";
        document.getElementById("moveButtons").style.width = "160px";
        document.getElementById("moveButtons").style.height = "240px";
        document.getElementById("movesTitle").innerHTML = "Basic Moves";
        document.getElementById("moreMoves").style.top = "225px";
        document.getElementById("moreMoves").innerHTML = "Show More Moves";
    }
}

/* ====== elements from the bottom of the screen ====== */

/* get a random scramble */
document.getElementById("randomScramble").addEventListener("click", randomAndSubmit);
function randomAndSubmit() {
    // get a random scramble
    let scramble = randomScramble();
    // put the scramble text into the scramble input box
    document.getElementById("cubeScramble").value = scramble;
    // submit is to apply the scramble onto the cube visual 
    // (submit() is defined below under 'LHS elements')
    submit();
}

// generate and return a random scramble
function randomScramble() {
    var indexToMove = {
        0: "U",
        1: "U'",
        2: "U2",
        3: "D",
        4: "D'",
        5: "D2",
        6: "L",
        7: "L'",
        8: "L2",
        9: "R",
        10: "R'",
        11: "R2",
        12: "B",
        13: "B'",
        14: "B2",
        15: "F",
        16: "F'",
        17: "F2",
        18: "F2",
    };
    let scramble = '';
    for (var i = 0; i < 20; i++) {
        let index = Math.floor(Math.random() * 17);
        scramble = scramble.concat(indexToMove[index], " ");
    }
    scramble = scramble.slice(0, -1);

    return scramble;
}

/* calculate the solution of the scrambled cube */
document.getElementById("wholeSolve").addEventListener("click", overallSolve);
function overallSolve() {
    solveCube(exportCubeState["cubeState"]);
    setTimeout(() => {
        doSolve();
        solution = exportSolution["moves"];
        showSolution(solution);
        document.getElementById("solutionText").style.display = "inline";
        document.getElementById("wholeSolve").style.display = "none";
        document.getElementById("playPause").style.display = "inline";
    }, 2000);
}

// do the moves in the solution
function doSolve() {
    // do each move with a timeout between each
    (function loop(i) {
        setTimeout(function () {
            // if the solution is not completed and the startStop variable is true
            if (startStop && solutionIndex < solution.length) {
                // do the move
                completeTurn(solution[solutionIndex]);
                // update everything that needs to be updated
                updates();
                solutionIndex += 1;
                if (--i) loop(i);
                // if the solution is completed
            } else if (solutionIndex == solution.length) {
                // reset everything
                document.getElementById("wholeSolve").style.display = "inline";
                document.getElementById("playPause").style.display = "none";
                solutionIndex = 0;
                play();
                return;
            } else { loop(i) }
        }, speed * 20); // determines timeout between moves
    })(1000); // number of times to loop (arbitarily large because it is impossible
    // to determine the number of loops beforehand)
}

// display the solution to the user
function showSolution(solution) {
    // convert the solution from a list to a string
    let showSolution = "";
    for (var move in solution) {
        showSolution = showSolution.concat(solution[move], " ");
    }
    document.getElementById("solutionText").innerHTML = showSolution;
}

/* step through the solution */
document.getElementById("stepForward").addEventListener("click", forwardOneMove);
function forwardOneMove() {
    // do a move
    completeTurn(solution[solutionIndex]);
    // update everything
    updates();
    solutionIndex += 1;
    // if the solve is done, reset everything
    if (solutionIndex == solution.length) {
        document.getElementById("wholeSolve").style.display = "inline";
        document.getElementById("playPause").style.display = "none";
    }
}

document.getElementById("stepBackward").addEventListener("click", backwardOneMove);
function backwardOneMove() {
    solutionIndex -= 1;
    // find the inverse of the move that
    let move = solution[solutionIndex];
    let inverseMove = move[0];
    let direction;
    let inverse = {
        "1": "'",
        "'": "",
        "2": "2"
    };
    if (move.length == 2) {
        direction = move[1];
    } else { direction = 1; }
    let inverseDirection = inverse[direction];
    inverseMove = inverseMove + inverseDirection;
    // do the inverse
    completeTurn(inverseMove);
    // update everything
    updates();
}

// collection of all the updates that need to be done after every move
function updates() {
    updateNotationText(solution[solutionIndex]);
    updateHighlighting();
    updateProgressBar();
}

// highlight the current move being done
function updateHighlighting() {
    // mark the current move
    solution[solutionIndex] = '<mark>' + solution[solutionIndex] + "</mark>";
    // show it
    showSolution(solution);
    // unmark the current move
    solution[solutionIndex] = solution[solutionIndex].replace("<mark>", "");
    solution[solutionIndex] = solution[solutionIndex].replace("</mark>", "");
}

// change the progress bar length accordingly
function updateProgressBar() {
    // find the length of the 'bar'
    let progressBarWidth = document.getElementById('bar').offsetWidth;
    // the length of the 'progress' will be the proportion of solutionIndex / solution.length
    progressBarWidth = (progressBarWidth - 20) * solutionIndex / solution.length + 20;
    // set the width of the 'progress' 
    document.getElementById("progress").style.width = progressBarWidth + 'px';
}

// change the instruction text to reflect what the current move is
function updateNotationText(move) {
    let faceToText = {
        "R": "<b>right</b> face",
        "L": "<b>left</b> face",
        "U": "<b>top</b> face",
        "D": "<b>bottom</b> face",
        "F": "<b>front</b> face",
        "B": "<b>back</b> face",
        "M": "<b>middle</b> slice",
        "E": "<b>equatorial</b> slice",
        "S": "<b>standing</b> slice",
        "X": "<b>whole cube</b>",
        "Y": "<b>whole cube</b>",
        "Z": "<b>whole cube</b>",
        "r": "<b>two right</b> layers",
        "l": "<b>two left</b> layers",
        "u": "<b>two top</b> layers",
        "d": "<b>two bottom</b> layers",
        "f": "<b>two front</b> layers",
        "b": "<b>two back</b> layers",
    };
    let angleToText = {
        "1": "<b>90</b> degrees <b>clockwise</b>",
        "'": "<b>90</b> degrees <b>anticlockwise</b>",
        "2": "<b>180</b> degrees",
    };
    let face = move[0];
    let angle;
    if (move.length == 1) { angle = 1; }
    else { angle = move[1]; }
    let text = "Turn the " + faceToText[face] + " " + angleToText[angle];
    document.getElementById("solutionExplanation").innerHTML = text;
}

document.getElementById("speedSlider").addEventListener("input", updateSpeed);
function updateSpeed() {
    // set the speed of the animation depending on the slider
    speed = 100 - document.getElementById("speedSlider").value;
}

/* play and pause the animation */
let startStop = false
document.getElementById("playPause").addEventListener("click", play);
// this function doesn't actually call for the moves to be done
// it changes startStop to be true or false and this is what triggers the animation to play
// it changes the style of all the elements that need to be disabled while the animation is playing
function play() {
    startStop = !startStop;
    if (startStop) {
        // set the button to say 'pause'
        document.getElementById("playPause").innerHTML = "Pause";
        // disable every move button
        for (var i = 0; i < document.getElementById("basicMoves").children.length; i++) {
            document.getElementById("basicMoves").children[i].style.backgroundColor = "#e1e1e2";
            document.getElementById("basicMoves").children[i].disabled = true;
        };
        for (var i = 0; i < document.getElementById("leftMoves").children.length; i++) {
            document.getElementById("leftMoves").children[i].style.backgroundColor = "#e1e1e2";
            document.getElementById("leftMoves").children[i].disabled = true;
        };
        for (var i = 0; i < document.getElementById("bottomMoves").children.length; i++) {
            document.getElementById("bottomMoves").children[i].style.backgroundColor = "#e1e1e2";
            document.getElementById("bottomMoves").children[i].disabled = true;
        };
        // disable the other buttons in the bottom menu
        document.getElementById("stepForward").style.backgroundColor = "#e1e1e2";
        document.getElementById("stepForward").disabled = true;
        document.getElementById("stepBackward").style.backgroundColor = "#e1e1e2";
        document.getElementById("stepBackward").disabled = true;
        document.getElementById("randomScramble").style.backgroundColor = "#e1e1e2";
        document.getElementById("randomScramble").disabled = true;
    } else {
        // reset everything
        document.getElementById("playPause").innerHTML = "Play"
        for (var i = 0; i < document.getElementById("basicMoves").children.length; i++) {
            document.getElementById("basicMoves").children[i].style.backgroundColor = "#ffe8dc";
            document.getElementById("basicMoves").children[i].disabled = false;
        };
        for (var i = 0; i < document.getElementById("leftMoves").children.length; i++) {
            document.getElementById("leftMoves").children[i].style.backgroundColor = "#fcd1b8";
            document.getElementById("leftMoves").children[i].disabled = false;
        };
        for (var i = 0; i < document.getElementById("bottomMoves").children.length; i++) {
            document.getElementById("bottomMoves").children[i].style.backgroundColor = "#fcd1b8";
            document.getElementById("bottomMoves").children[i].disabled = false;
        };
        document.getElementById("stepForward").style.backgroundColor = "#fcd1b8";
        document.getElementById("stepForward").disabled = false;
        document.getElementById("stepBackward").style.backgroundColor = "#fcd1b8";
        document.getElementById("stepBackward").disabled = false;
        document.getElementById("randomScramble").style.backgroundColor = "#fcd1b8";
        document.getElementById("randomScramble").disabled = false;
    }
}

/* ====== elements from the left hand side ====== */
// all of these functions just toggle the visibility of an element

// show the long instruction / show the notation solution
let notationToggle = false;
document.getElementById("longInstruction").addEventListener("click", displayLong);
function displayLong() {
    notationToggle = !notationToggle;
    if (notationToggle) {
        document.getElementById("solutionExplanation").style.display = "block";
        document.getElementById("solutionText").style.display = "none";
    } else {
        document.getElementById("solutionExplanation").style.display = "none";
        document.getElementById("solutionText").style.display = "block";
    };
}

// show the floating back sides
let backToggle = false
document.getElementById("showBackSides").addEventListener("click", showBack);
function showBack() {
    backToggle = !backToggle;
    if (backToggle) {
        for (var square in allFloats) {
            allFloats[square].visible = true;
        };
    } else {
        for (var square in allFloats) {
            allFloats[square].visible = false;
        };
    };
}

// show the how to pop up
let howToToggle = false;
document.getElementById("showHowTo").addEventListener("click", showHowTo);
document.getElementById("closePopup").addEventListener("click", showHowTo);
function showHowTo() {
    howToToggle = !howToToggle;
    if (howToToggle) {
        document.getElementById("howTo").style.display = "block";
    } else {
        document.getElementById("howTo").style.display = "none";
    };
}

// show the notation definitions
let notationPopupToggle = false;
document.getElementById("closeNotation").addEventListener("click", showNotation);
document.getElementById("showNotation").addEventListener("click", showNotation);
function showNotation() {
    notationPopupToggle = !notationPopupToggle;
    if (notationPopupToggle) {
        document.getElementById("notationPopup").style.display = "block";
    } else {
        document.getElementById("notationPopup").style.display = "none";
    };
}

// show the scramble input form
let displayForm = false
document.getElementById("inputScr;amble").addEventListener("click", showForm);
function showForm() {
    displayForm = !displayForm;
    if (displayForm) {
        document.getElementById("scrambleForm").style.display = "inline";
    } else {
        document.getElementById("scrambleForm").style.display = "none";
    };
}

// submitting a scramble to be shown on the cube
document.getElementById("submitCubeScramble").addEventListener("click", submit);
function submit() {
    let cubeScramble = document.getElementById("cubeScramble").value;
    // validate the scramble
    if (validateScramble(cubeScramble)) {
        // get the cube state of the scrambled cube
        getCubeState(cubeScramble);
        setTimeout(() => {
            cubeState = exportCubeState["cubeState"];
            // remove all the old squares from the scene
            for (let i = scene.children.length - 1; i >= 0; i--) {
                if (scene.children[i].type === "Mesh")
                    scene.remove(scene.children[i]);
            }
            // build the new cube
            cubeSquares = buildCube(cubeState);
        }, 500);
        // return statement if the scramble is invalid
    } else { document.getElementById("cubeScramble").value = 'Invalid Scramble'; }
}

function validateScramble(scramble) {
    // convert the scramble string into a list where each element is separated by a space
    let scrambleList = scramble.split(" ");
    let result = true;
    let allowedFaces = ["R", "L", "D", "U", "B", "F", "M", "E", "S",
        "X", "Y", "Z", "r", "l", "d", "u", "b", "f"];
    let allowedAngles = ["'", "2"];
    // for each list item
    for (var i in scrambleList) {
        let temp = scrambleList[i];
        // it must meet these three criteria, otherwise it is invalid and false is returned
        if (allowedFaces.includes(temp[0]) == false) {
            result = false;
        } else if (temp.length > 2) {
            result = false;
        } else if (temp.length == 2 && allowedAngles.includes(temp[1]) == false) {
            result = false;
        }
    }
    return result;
}