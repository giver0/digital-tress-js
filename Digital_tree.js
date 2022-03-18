let isDebugActive = true

let isAnyFreeCells = true   
let isGamePaused = false      
let isExitMainCycle = false 
let isCanChangeColor = true

let timeRange = 50
let timeRangeEnd = 200
let cycleCounter = 0
let fullCycleCounter = 0

const fieldWidth = 11
const fieldHeight = 5
const blockSize = 50

let blocksFields = document.getElementById("space-for-blocks");
let speedElement = document.getElementById("counter-speed")
speedElement.value = timeRange
let counterTreesCell = document.getElementById("counter-trees-cell")
let playButton = document.getElementById("field-left-control-pause")
let restartButton = document.getElementById("field-left-control-restart")
let fullCycleCounterElement = document.getElementById("counter-fullCircle-count")
let cycleCounterElement = document.getElementById("counter-count")
let counterTrees = document.getElementById("counter-tree")
let logbox = document.getElementById("left-logbox")
let stopChangeColor = document.getElementById("field-left-control-color")

let blockClass = "block"
let grayString = "rgb(128, 128, 128)"

const fieldCells = []
const digitalTrees = []

class treeObject {
    constructor(){
        this.cells = []
        this.lastCell = null
        this.headColor = null
        this.bodyColor = null
        this.counterBox = null
        this.counterCellBlock = null
        this.isFreeCellsAround = true
        this.setRandomColor()
        this.id = digitalTrees.length
        digitalTrees.push(this)
    }
    refreshLastCell() {
        this.lastCell = this.cells[this.cells.length-1]
    }
    createCellTree() {
        createCell(this.lastCell)  
    }
    addFirstCell() {
        try {
            let firstCell = chooseRandomStartCell (fieldHeight, fieldWidth) 
            this.cells.push(firstCell)
            this.cells[0].elementById.style.background = this.headColor
            this.cells[0].parentTree = this
            this.refreshLastCell()
            
        } catch (error) {
            console.log("===== Some Error ==========")
        }
    }       
    createCell() {
        let freeCellsArray = FreeCellsAround(this.lastCell)
        if (freeCellsArray.length === 0) {
            isAnyFreeCells = false   
            this.isFreeCellsAround = false    
        } else {
            let FreeCellCoordinate = chooseRandomPoint (freeCellsArray)
            let j = FreeCellCoordinate[0]
            let i = FreeCellCoordinate[1]        
            this.addNextCell(j, i)             
            
        }            
    }
    addNextCell(j, i) {
        this.lastCell.elementById.style.background = this.bodyColor
        let nextCell = fieldCells[j][i]
        nextCell.elementById.style.background = this.headColor
        nextCell.previousCell = this.lastCell
        nextCell.parentTree = this
        this.cells.push(nextCell)
        nextCell.parentTree.refreshLastCell()
        this.nextCell = nextCell

        let counterCellText = document.getElementById(`counter-trees-cell-box-text${this.id}`)
        counterCellText.innerText = this.cells.length
        this.logInLogbox()
        console.log([this.lastCell.i,this.lastCell.j]+": thisCell "+[i,j]+": NextCell, "+"TreeID: "+this.id)
    }
    logInLogbox() {
        let log = document.createElement("div")
        log.className = "digital-tree__field-left-logbox-text"
        let logText = `TreeID: ${this.id}; i: ${this.lastCell.i}; j:${this.lastCell.j};`
        // counterBox.id = `TreeIndex${treeIndex}`
        log.innerText = logText
        logbox.appendChild(log)
        logbox.scrollTop = logbox.scrollHeight;
    }
    setRandomColor() {
        this.headColor = generateRandomColor()
        this.bodyColor = generateRandomColor()
    }
    changeRandomColor() {
        this.setRandomColor()
        this.counterCellBlock.style.background = this.bodyColor
    }
    addCounterTreeCell() {
        let counterBox = document.createElement("div")
        counterBox.className = "digital-tree__counter-trees-cell-box"
        counterBox.id = `TreeIndex${this.id}`
        counterTreesCell.appendChild(counterBox)
        this.counterBox = document.getElementById(`TreeIndex${this.id}`)
    
        let newDiv = document.createElement("div")
        newDiv.className = blockClass
        newDiv.style.background = this.bodyColor
        newDiv.id = `counter-trees-cell-box${this.id}`
        this.counterBox.appendChild(newDiv)
        this.counterCellBlock = document.getElementById(`counter-trees-cell-box${this.id}`)
    
        let newDivText = document.createElement("div")
        newDivText.className = "digital-tree__counter-trees-cell-box-text"
        newDivText.id = `counter-trees-cell-box-text${this.id}`
        newDivText.innerText = 0
        newDivText.style.background = "none"
        this.counterBox.appendChild(newDivText)
    }
    deleteCounterTreeCell() {
        this.counterBox.parentNode.removeChild(this.counterBox);
    }
}

class cellObject {
    constructor(i, j){
        this.id = `i${i}j${j}`
        this.i = i
        this.j = j
        this.nextCell = null
        this.previousCell = null
        this.parentTree = null   

        this.newDiv = document.createElement("div");
        this.newDiv.className = blockClass
        this.newDiv.id = `i${i}j${j}`
        this.elementById = document.getElementById(`i${i}j${j}`);
        fieldCells[j].push(this)
        blocksFields.appendChild(this.newDiv)
        fieldCells[j][i].elementById = document.getElementById(`i${i}j${j}`);
    }     
}

makeFieldCells2d ()
changeFieldSize(fieldHeight, fieldWidth)
logSomeText("change Field Size")
createField();


//CRETE TREE


// createDigitalTree ("yellow", "green")
// createDigitalTree ("red","blue")
// createDigitalTree ("pink", "purple")

for (let treeCount = 0; treeCount < 3; treeCount++) {
    new treeObject()  
}

console.log(digitalTrees[0])

addCounterTreesCell()

console.log(generateRandomColor())

// console.log(window.getComputedStyle(fieldCells[0][0].elementById,null).getPropertyValue("background-color"))
// console.log(typeof window.getComputedStyle(fieldCells[0][0].elementById,null).getPropertyValue("background-color"))


// logFieldCell()

function addCounterTreesCell() {
    for (const tree of digitalTrees) {
        tree.addCounterTreeCell()        
    }    
}

configBeforeStart()

mainCycle()

//LISTENER

playButton.onclick = function () {
    isGamePaused = !isGamePaused
    if (isGamePaused === true) {
        playButton.src = "https://img.icons8.com/external-bearicons-glyph-bearicons/64/000000/external-Play-essential-collection-bearicons-glyph-bearicons.png"
    } else {
        playButton.src = "https://img.icons8.com/external-bearicons-glyph-bearicons/64/000000/external-Pause-essential-collection-bearicons-glyph-bearicons.png"
        mainCycle()
    }
}

restartButton.onclick = function () {
    location.reload()
}

counterTrees.addEventListener('change', (event) => {
    if (event.target.value > digitalTrees.length) {
        console.log("Increase")
        restartWitOutStart()
        new treeObject()  
        digitalTrees[digitalTrees.length-1].addCounterTreeCell()  
        configBeforeStart()
        toTrueAllIsFree() 
        console.log("ToTrue")

    } else if(event.target.value < digitalTrees.length) {
        console.log("Reduce")
        restartWitOutStart()
        digitalTrees[digitalTrees.length-1].deleteCounterTreeCell()
        digitalTrees.pop()
        configBeforeStart()
        toTrueAllIsFree() 
        console.log("ToTrue")

        
    }    
});

stopChangeColor.onclick = function () {
    if (isCanChangeColor===true) {
        stopChangeColor.style.filter = "invert(0.6)"
  

        isCanChangeColor = false
        
    } else {
        stopChangeColor.style.filter = "invert(0)"
        isCanChangeColor = true

    }
}  

//FUNCTION


// function createDigitalTree(headColor, bodyColor) {
    
// }


//MAIN CYCLE
function configBeforeStart() {
    addFirstCellTrees()
}

function addFirstCellTrees() {
    for (const tree of digitalTrees) {
        tree.addFirstCell()
    }
}

async function mainCycle() {   
    await sleep(timeRange);
    
    while (isAnyTreesCanMove()) {   
        createCellAtAllTree()  
        increaseCycleCount()
        await sleep(timeRange);
        if(isGamePaused) {
            return
        }
    }
    increaseFullCycleCount()
    await sleep(timeRangeEnd);
    logNewFullCycle()
    console.log("============= New cycle =============")
    restart ()
}

function logNewFullCycle() {
    let log = document.createElement("div")
    log.className = "digital-tree__field-left-logbox-text"
    logText = `=== Star new full cycle ${fullCycleCounter} ===`
    // counterBox.id = `TreeIndex${treeIndex}`
    log.innerText = logText
    logbox.appendChild(log)
    logbox.scrollTop = logbox.scrollHeight
}

function logSomeText(text) {
    let log = document.createElement("div")
    log.className = "digital-tree__field-left-logbox-text"
    log.innerText = text
    logbox.appendChild(log)
    logbox.scrollTop = logbox.scrollHeight
}

function restart () {
    cleanField ()
    console.log("CleanField")
    toTrueAllIsFree() 
    console.log("ToTrue")

    cleanTreesCells()
    console.log("CleanCells")

    nullTreesLastCell()
    console.log("null")

    if (isCanChangeColor) {
        changeTreesColor()
    }

    // logFieldCell()

    configBeforeStart()
    console.log("config")

    mainCycle()
}

function changeTreesColor() {
    for (const tree of digitalTrees) {
        tree.changeRandomColor()
    }
}

function restartWitOutStart () {

    toFalseAllIsFree()
    cleanField ()
    console.log("CleanField")
    cleanTreesCells()
    console.log("CleanCells")
    nullTreesLastCell()
    console.log("null")
    

}

function toFalseAllIsFree() {
    for (const tree of digitalTrees) {
        tree.isFreeCellsAround = false
    }
}

function createCellAtAllTree() {
    for (const tree of digitalTrees) {
        if (tree.isFreeCellsAround){
            tree.createCell()
        }
    }    
}

function isAnyTreesCanMove() {
    let isFreeCellsArray = digitalTrees
    .map(Tree => Tree.isFreeCellsAround)
    let isCanMove = isFreeCellsArray.includes(true)
    console.log (isFreeCellsArray)
    
    return isCanMove
}     
    
function FreeCellsAround(cell) {
    let freeFields = []
    let i = cell.i-1
    let j = cell.j-1
    let iEnd = cell.i+2
    let jEnd = cell.j+2

    for (; j < jEnd; j++) {
        for (i = cell.i-1; i < iEnd; i++) {
            if (isCoordinateInField(i, j)) {
                    if(isCellGray(j, i)) {
                        freeFields.push([j,i])
                    }            
                }
            }
        }
        return freeFields
    }
    
function chooseRandomPoint (freeCells) {
    let randomValue = getRandomInt(0, freeCells.length)
    return freeCells[randomValue]        
}

function generateRandomColor() {
    let randomColor = "#"
    randomColor += Math.floor(Math.random() * 16777215).toString(16)
    return randomColor
}

function changeSpeed() {
    console.log("Change speed")
    timeRange = speedElement.value
}

function sleep(ms) {
    return new Promise(
        resolve => setTimeout(resolve, ms)
        );
}    

function increaseFullCycleCount() {
    fullCycleCounter++
    fullCycleCounterElement.innerText = fullCycleCounter
}

function increaseCycleCount() {
    cycleCounter++
    cycleCounterElement.innerText = cycleCounter
}
    
function makeFieldCells2d () {
    for (let i = 0; i < fieldHeight; i++) {
        fieldCells.push([])        
    }
}

function createField () {
    for (let j = 0; j < fieldHeight; j++) {
        for (let i = 0; i < fieldWidth; i++) {
            document.body.onload = new cellObject(i, j);  
        }  
    }
}


// function addElement (i, j) {

// }

function changeFieldSize(height, width) {
    newHeight = height*blockSize+blockSize-1
    newWidth = width*blockSize+blockSize-1
    blocksFields.style.width = `${newWidth}px`
    blocksFields.style.height = `${newHeight}px`    
}


function isCoordinateInField(i, j) {
    return i >= 0 && i < fieldWidth && j >= 0 && j < fieldHeight;
}

function isCellGray(j, i) {
    return getBackgroundColor(fieldCells[j][i].elementById) === grayString;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}



function nullTreesLastCell() {
    for (const tree of digitalTrees) {
        tree.lastCell = null
    }
}

function cleanTreesCells() {
    for (const tree of digitalTrees) {
        tree.cells = []
    }
}

function toTrueAllIsFree() {
    for (const tree of digitalTrees) {
        tree.isFreeCellsAround = true
    }   
}

function cleanField () {
    for (const raw of fieldCells) {
        for (const cell of raw) {
            cell.elementById.style.background = "gray"
        }
    }
}

function chooseRandomStartCell (height, width) {
    let whileCounter = 0
    let j
    let i 
    while (whileCounter < fieldHeight*fieldWidth) {
        j = getRandomInt(0, height)
        i = getRandomInt(0, width)
        // logSomeText("In chooseRandomStartCell()")
        console.log("In chooseRandomStartCell()")
        console.log(getBackgroundColor(fieldCells[j][i].elementById)+" i"+i+" j"+j)

       if (getBackgroundColor(fieldCells[j][i].elementById) === grayString) {
           return fieldCells[j][i]
       }  
       whileCounter++       
    }
}

function getBackgroundColor(elementById) {
    return window.getComputedStyle(elementById, null).getPropertyValue("background-color")
}


//DEBUG

function debug (debugType ,debugObject, debugText) {
    let activateIsFreeAround = false
    let activatecreateCell = false
    if(debugType==="isFreeAround"&&activateIsFreeAround===false){

    } else if(debugType==="createCell"&&activatecreateCell===false){

    } else {
        doDebug(debugText, debugObject);
    }
}

function doDebug(debugText, debugObject) {
    if (isDebugActive) {
        if (debugText === undefined) {
            console.log(debugObject);
        } else if (debugObject === null) {
            console.log(debugText);
        }
        else {
            console.log(debugObject + debugText);
        }
    }
}

//NOT USES

function logClassNameTrees() {
    for (const raw of fieldCells) {
        for (const cell of raw) {
            console.log(cell.elementById.className + "" + cell.i + "" + cell.j)
        }
    }
}

function logFieldCell() {
    for (const raw of fieldCells) {
        for (const cell of raw) {
            console.log(cell)
            console.log(cell.elementById.className + "" + cell.i + "" + cell.j+window.getComputedStyle(cell.elementById,null).getPropertyValue("background"))
        }
    }
}