let TETRIS = [ {block: [[0,5],[1,5],[1,4],[1,6]],
								type : 'A'},
							 {block: [[0,3],[0,4],[0,5],[0,6]],
							  type : 'I'},
							 {block: [[0,5],[0,6],[1,5],[1,6]],
							  type : 'O'},
							 {block: [[1,4],[1,5],[1,6],[0,6]],
							  type : 'L'},
							 {block: [[1,4],[1,5],[1,6],[0,4]],
							  type : 'J'}  ]
let stage
let unit = 20
let type = {}
let b1, b2
let gameboardWidth = 10
let gameboardHeight = 20
let emptyRow
let curBlock
let gameboard, blocks
var KEYCODE_LEFT = 37,
		KEYCODE_RIGHT = 39,
		KEYCODE_UP = 38,
		KEYCODE_DOWN = 40;


function init(){
  stage = new createjs.Stage("gameboard")
	let border = new createjs.Shape()
	border.graphics.beginStroke('black').drawRect(0,0,unit*gameboardWidth,unit*gameboardHeight)
	stage.addChild(border)

	let typea = new createjs.Shape()
	typea.graphics.beginFill('DeepSkyBlue').drawRect(0,0,unit,unit)
	type.A = typea

	let typei = new createjs.Shape()
	typei.graphics.beginFill('red').drawRect(0,0,unit,unit)
	type.I = typei

	let typeo = new createjs.Shape()
	typeo.graphics.beginFill('green').drawRect(0,0,unit,unit)
	type.O = typeo

	let typej = new createjs.Shape()
	typej.graphics.beginFill('orange').drawRect(0,0,unit,unit)
	type.J = typej

	let typel = new createjs.Shape()
	typel.graphics.beginFill('purple').drawRect(0,0,unit,unit)
	type.L = typel

	gameboard = []
	for (let i = 0; i < gameboardHeight; i++) {
		let row = []
		for (let j = 0; j < gameboardWidth; j++) {
			row.push(0)
		}
		gameboard.push(row)
	}
	blocks = []
	for (let i = 0; i < gameboardHeight; i++) {
		let row = []
		for (let j = 0; j < gameboardWidth; j++) {
			row.push(0)
		}
		blocks.push(row)
	}
	emptyRow = []
	for (let i = 0; i < gameboardWidth; i++) {
		emptyRow.push(0)
	}
	newCurBlock()
	setCurBlock()

	createjs.Ticker.setFPS(24);
  createjs.Ticker.addEventListener("tick", () => {
    stage.update()
  });
	document.addEventListener('keydown', keyPressed)
	setInterval(moveCurBlock, 1000)
}

function gameLogic(){
	// moveCurBlock()
}

/**
 * Sync blocks with gameboard.
 */
function updateBlocks(){
	cleanFullRows()
	for (let i = 0; i < gameboardHeight; i++) {
			for (let j = 0; j < gameboardWidth; j++) {
				if (gameboard[i][j]!=0) {
					if (blocks[i][j]==0) {
						let b = type[gameboard[i][j]].clone(false)
						b.x = j*unit
						b.y = i*unit
						blocks[i][j] = b
						stage.addChild(b)
					}
				} else {
					if (blocks[i][j]){
						stage.removeChild(blocks[i][j])
						blocks[i][j] = 0
					}
				}
			}
		}
}

function moveCurBlock(d, isReverse){
	let reverse

	// remove curBlock from gameboard
	if (!isReverse)
		cleanCurBlock()

	// move curBlock
	switch (d) {
		case 'left':
			for (let i = 0; i < curBlock.block.length; i++) {
				curBlock.block[i][1]--
			}
			reverse = 'right'
			break
		case 'right':
			for (let i = 0; i < curBlock.block.length; i++) {
				curBlock.block[i][1]++
			}
			reverse = 'left'
			break
		case 'up':
			for (let i = 0; i < curBlock.block.length; i++) {
				curBlock.block[i][0]--
			}
			reverse = 'down'
			break
		default: // move down
			for (let i = 0; i < curBlock.block.length; i++) {
				curBlock.block[i][0]++
			}
			reverse = 'up'
	}

	// detect collision
	for (let i = 0; i < curBlock.block.length; i++) {
		let r = curBlock.block[i][0]
		let c = curBlock.block[i][1]
		if ((r<0)||(r>=gameboardHeight)||(c<0)||(c>=gameboardWidth)||(gameboard[r][c] != 0)){
			moveCurBlock(reverse, 1)
			if (!d){
				setCurBlock()
				newCurBlock()
			}
			break
		}
	}

	// add curBlock to gameboard
	if (!isReverse){
		setCurBlock()
		updateBlocks()
	}
}


function setCurBlock(){
	for (let i = 0; i < curBlock.block.length; i++) {
		gameboard[curBlock.block[i][0]][curBlock.block[i][1]] = curBlock.type
	}
}

function cleanCurBlock(){
	for (let i = 0; i < curBlock.block.length; i++) {
		gameboard[curBlock.block[i][0]][curBlock.block[i][1]] = 0
	}
}

function newCurBlock(){
	let r = Math.floor(Math.random()*TETRIS.length);
	console.log(r)
	curBlock = clone(TETRIS[r])
}

function cleanFullRows(){
	let c = []
	for (let i = gameboardHeight-1; i >= 0; i--) {
		let p = 0
		for (let j = 0; j < gameboardWidth; j++){
			if(gameboard[i][j]!=0)
				p++
		}
		for (let k = 0; k < curBlock.block.length; k++) {
			if (curBlock.block[k][0] == i)
				p--
		}
		if (p == gameboardWidth){
			console.log(i,'full')
			c.push(i)
			cleanRow(i)
		}
	}
	if (c.length > 0) clpRows(c)
}

function cleanRow(r){
	cleanCurBlock()
	gameboard[r] = emptyRow.slice(0)
	setCurBlock()
}

function clpRows(c){
	cleanCurBlock()
	for (var i = 0; i < c.length; i++) {
		for (var j = c[i]; j > 0; j--) {
			gameboard[j] = gameboard[j-1].slice(0)
		}
		gameboard[0] = emptyRow.slice(0)
		for (var k = 0; k < c.length; k++) c[k]++
	}
	setCurBlock()
}

function clone(obj){
	return JSON.parse(JSON.stringify(obj))
}

function keyPressed(event) {
	switch(event.keyCode) {
		case KEYCODE_LEFT:
			moveCurBlock('left')
			break;
		case KEYCODE_RIGHT:
			moveCurBlock('right')
			break;
		case KEYCODE_UP:
			moveCurBlock('up')
			break;
		case KEYCODE_DOWN:
			moveCurBlock()
			break;
	}
}
