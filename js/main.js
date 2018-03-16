var bgCanvas = null;
var width = 0;
var height = 0;
var hlfSize = 0;
var qrtSize = 0;
var ctxBG = null;

var topBars=["projects","games","blog","contact"];
var topBarWidth = 0;
var leftHidden=true;

function start() {
	width = window.innerWidth || document.documentElement.clientWidth / 1 || document.body.clientWidth
	height = window.innerHeight || document.documentElement.clientHeight / 1 || document.body.clientHeight / 1;
	width = Math.floor(width);
	height = Math.floor(height);
	$("body").css("width", width);
	$("body").css("height", height);

	$("#main").css("height",height+"px");
	$("#main").css("top",0+"px");

	

	topBarWidth = width/7;
	let lf =  topBarWidth * 1.5;
	
	
	

	hlfSize = Math.floor(Math.min(width, height) / 2) + 0.5;
	qrtSize = Math.floor(hlfSize / 2) + 0.5;


	//initHome();
	FreeDrawCanvas.init($("#main"));
	//MandelBrotRender.init(document.getElementById("main"));

	

	tick();
}
var checkScrollBars = function(){
    var b = $('#mainCanvas');
    var normalw = 0;
    var scrollw = 0;
    if(b.prop('scrollHeight')>b.height()){
        
        scrollw = width - b.width();
        $('#mainCanvas').css({marginRight:'-'+scrollw+'px'});
    }
}


function tick() {
	
		FreeDrawCanvas.draw();//FreeDraw();
	
	window.requestAnimationFrame(tick);
}
var mouseX = 0;
var mouseY = 0;
var selectedCursor = "WobblyEggs1";

var mousePulseGoingBack = false;
var mousePulse = 0;
var currentEasing = "Linear";
var easingTypes = 2;
var cMouseX=0;
var cMouseY=0;
var currentSite = "home";





var mouseDown=false;
function handleMouseMove(e) {
	let rect = e.target.getBoundingClientRect();
	cMouseX = e.clientX - rect.left;
	cMouseY = e.clientY - rect.top;
	mouseX = e.clientX;
	mouseY = e.clientY;

	if (currentSite == "cursors") {
		let spl = e.target.id.split("sorCanv");
		if (spl.length > 1) {
			if (selectedCursor && selectedCursor != spl[1]) {
				let cnv = document.getElementById("cursorCanv" + selectedCursor);
				let ctx = cnv.getContext("2d");
				ctx.clearRect(0, 0, cnv.width, cnv.height);

			}
			selectedCursor = spl[1];
		} else {
			if (selectedCursor) {
				let cnv = document.getElementById("cursorCanv" + selectedCursor);
				let ctx = cnv.getContext("2d");
				ctx.clearRect(0, 0, cnv.width, cnv.height);

			}
			selectedCursor = null;
		}
	} else if (currentSite == "freeDraw") {
		
	}

	
	//let mid = 100-Math.floor((width - mouseX)/width * 100);
	
	
	//$("#topBar").css("background-image","linear-gradient(90deg,black "+0+"%, rgba(255,255,255,0.1) "+(mid)+"%, black "+100+"%)");
}
function doTransitionAnimation() {
	let el = document.getElementById("loadTrans");
	//el.style.top = height*1.5+"px";
	el.style.bottom = "0px";
	$(el).stop().animate({
		height:height*1.5,
	},0.1 ,function() {
		$(el).stop().animate({
			height:"0px",
			bottom:height+"px"
		}, function() {
			document.getElementById("loadTrans").style.bottom = "0px";
			//document.getElementById("loadTrans").style.top = "fuckyou";
			/*$("#loadTrans").css("bottom","0px");*/

		})
	})
	

}
function createCanvas(w, h, mL, mT, id, className, L, T, abs) {

	let tmpCnv = document.createElement("canvas");
	tmpCnv.id = id;
	tmpCnv.className = className;
	tmpCnv.width = w;
	tmpCnv.height = h;
	tmpCnv.style.marginTop = mT + "px";
	tmpCnv.style.marginLeft = mL + "px";
	tmpCnv.style.left = L + "px";
	tmpCnv.style.top = T + "px";
	if (abs) {
		tmpCnv.style.position = "absolute";
	}
	return tmpCnv;
}

function createDiv(id, className) {
	let but = document.createElement("div");
	but.id = id;
	but.className = className;


	return but;
}

function createButton(w, h, t, l, mT, mL, pos, bR, bgCol, bgColHov, id, className, clickEv, innerHTML) {
	let but = document.createElement("div");
	but.style.width = w;
	but.style.height = h;
	but.style.top = t;
	but.style.left = l;
	but.style.marginTop = mT;
	but.style.marginLeft = mL;
	but.style.position = pos;
	but.style.borderRadius = bR;
	but.style.backgroundColor = bgCol;
	but.id = id;
	but.className = className;
	but.innerHTML = innerHTML;

	but.addEventListener("mouseenter", function() {
		but.style.backgroundColor = bgColHov;
	})
	but.addEventListener("mouseleave", function() {
		but.style.backgroundColor = bgCol;
	})
	but.addEventListener("click", function() {
		console.log(id + " clicked");

		clickEv();
	})
	return but;
}
function angle(p1x, p1y, p2x, p2y) {

	return Math.atan2(p2y - p1y, p2x - p1x);

}
function fillCircle(ct,x,y,rad) {
	ct.beginPath();
	ct.arc(x,y,rad,0,Math.PI*2,0);
	ct.fill();
	ct.closePath();
}
function drawSpiral(ct,x,y,rad,iter,turn,lineWidth,stroke) {
		let stepSize = rad / (iter+1);
		let i = 0;
		let ang = stepSize/Math.PI*2 * i;

		ct.lineWidth = lineWidth;
		
		ct.strokeStyle = stroke;
		let midx = (x) ;
		let midy = (y) ;
		x = (x) + ang * Math.cos(ang - turn);
		y = (y) + ang * Math.sin(ang - turn);
		ct.beginPath();

		while (i < iter) {
			i++;
			ang = stepSize/Math.PI*2 * i;

			ct.moveTo(x, y);
			x = midx + ang * Math.cos(ang - turn);
			y = midy + ang * Math.sin(ang - turn);


			ct.lineTo(x, y);
		}

		ct.stroke();
		ct.closePath();
}
function drawCrazySpiral(ct,x,y,rad,turns,iter,turn,lineWidth,stroke) {
		let stepSize = Math.log(rad) / (iter);
		let angStep = turns*Math.PI*2 / iter;
		let i = 1;
		let ang = angStep * i;

		ct.lineWidth = lineWidth;
		
		ct.strokeStyle = stroke;
		x = (x) + stepSize * Math.cos(ang - turn);
		y = (y) + stepSize * Math.sin(ang - turn);

		ct.beginPath();

		while (i < iter) {
			i++;
			ang = angStep * i ;

			ct.moveTo(x, y);
			x = (x) + stepSize*i * Math.cos(ang - turn);
			y = (y) + stepSize*i * Math.sin(ang - turn);


			ct.lineTo(x, y);
		}

		ct.stroke();
		ct.closePath();
}
function drawCoolRing(ct,x,y,rad,iter,turn,lineWidth,stroke) {
		let stepSize = rad / iter;
		let i = 0;
		let ang = stepSize * i;

		ct.lineWidth = lineWidth;
		
		ct.strokeStyle = stroke;
		x = (x) + stepSize*10 * Math.cos(ang - turn);
		y = (y) + stepSize*10 * Math.sin(ang - turn);

		ct.beginPath();

		while (i < iter) {
			i++;
			ang = stepSize * i;

			ct.moveTo(x, y);
			x = (x) + stepSize*10 * Math.cos(ang - turn);
			y = (y) + stepSize*10 * Math.sin(ang - turn);


			ct.lineTo(x, y);
		}

		ct.stroke();
		ct.closePath();
}
function drawEvenTriangle(ct,x,y,rad,turn) {
	//triangles - even
            let ang1 = Math.PI*2 / 3;
            ct.beginPath();
            ct.moveTo(x + Math.cos(turn 			) 	* rad, 	y + Math.sin(turn 			) 	* rad);
            ct.lineTo(x + Math.cos(turn + ang1		) 	* rad, 	y + Math.sin(turn + ang1	) 	* rad);
            ct.lineTo(x + Math.cos(turn + ang1 * 2 	) 	* rad, 	y + Math.sin(turn + ang1 * 2) 	* rad);
            ct.closePath();
            
}
function drawTriangle(x1,y1,x2,y2,x3,y3) {
			ct.beginPath();
            ct.moveTo(x1,y1);
            ct.lineTo(x2,y2);
            ct.lineTo(x3,y3);
            ct.closePath();
}
function Distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}