var homeDivW = 0;
var homeDivH = 0;
var hoverCanvas = false;
function initHome() {
	currentSite = "home";
	//Clear Main Window
	document.getElementById("mainWindow").innerHTML = "";

	doTransitionAnimation();
	let amInRow = Math.floor(width/250);
	//let s = Math.min(Math.floor(width/4),Math.floor(height/3));
	homeDivW =  Math.floor(Math.min(height,width) / 4);
	homeDivH =  Math.floor(Math.min(height,width) / 4);
	let wrap = createDiv("outerWrapper","outerWrapper homeWrapper");


	//Create Intro Text.
	let welc = createDiv("welcText","welcText");
	welc.innerHTML = "</br> Welcome, </br> I'm a CS & Business Student from Germany.</br></br>";
	document.getElementById("mainWindow").appendChild(welc);
	document.getElementById("mainWindow").appendChild(wrap);
	for (let key in homeDivs) {
		createHomeDiv(key);
	}
}

function createHomeDiv(i) {
	let outerDiv = createDiv("outerHomeDiv" + i, "outerHomeDiv");
	/*outerDiv.innerHTML = i;*/
	outerDiv.style.height=homeDivH+"px";
	//$(outerDiv).css("background-image","url("+homeDivs[i].bgImg+")");
	let tmpCanv = createCanvas(homeDivW, homeDivH, 0, 0, "homeCanvas" + i, "homeCanvas",0,0,false);
	tmpCanv.addEventListener("click", homeCanvClick);
	tmpCanv.addEventListener("mouseenter", homeCanvHover);
	tmpCanv.addEventListener("mouseleave", homeCanvHoverOut);

	outerDiv.appendChild(tmpCanv);
	outerDiv.addEventListener("click",homeDivs[i].onclick);

	$("#outerWrapper").append(outerDiv);
}
function homeCanvClick(e) {

}

function homeCanvHover(e) {
	
	if (hoverCanvas) {
		homeDivs[hoverCanvas].hover=false;
	}
	let id = e.target.id;
	hoverCanvas = e.target.id.split("homeCanvas")[1];
	homeDivs[hoverCanvas].hover=true
}
function homeCanvHoverOut(e) {
	let id = e.target.id;
	hoverCanvas = e.target.id.split("homeCanvas")[1];
	homeDivs[hoverCanvas].hover=false
}

function drawHome() {
	ctxBG.clearRect(0,0,width,height);
	let el2 = document.getElementById("homeCanvasProjects");
	let w = el2.width;
	let w2 = Math.ceil(w/2);
	let h = el2.height;
	for (let key in homeDivs) {
		let el = document.getElementById("homeCanvas"+key);
		let tmpCtx = el.getContext("2d");

		
		tmpCtx.clearRect(0,0,w,h);

		let xOff = 0;
		let yOff = 0;
		let x = $(el).offset().left;
		let y = $(el).offset().top;
		let dis = Distance(x+w2,y+h/2,mouseX,mouseY);
		let ang = angle(x+w2,y+h/2,mouseX,mouseY);

		
		let ratio = 1;
		if (homeDivs[key].hover) {
			if (homeDivs[key].hoverCount<20) {
				//homeDivs[key].hoverCount= Math.min(40,homeDivs[key].hoverCount + Math.ceil(0.5 * (homeDivs[key].hoverCount+1)));			
				if (homeDivs[key].hoverCount==0) {
					homeDivs[key].hoverCount+=5;
				}
				homeDivs[key].hoverCount+=2;
			}
			ratio = 1-Math.max(0,(homeDivs[key].hoverCount)/20);
		} else {
			if (homeDivs[key].hoverCount>0) {
				//homeDivs[key].hoverCount= Math.max(0,homeDivs[key].hoverCount - Math.ceil(0.5 * (homeDivs[key].hoverCount+1)));			
				homeDivs[key].hoverCount--;
				ratio = 1-Math.max(0,(homeDivs[key].hoverCount)/20);

			} else {
				ratio = 1;
			}
		}
		//fill first blue circ (useless)
		/*tmpCtx.lineWidth=5;
		tmpCtx.fillStyle="#0086c3";
		fillCircle(tmpCtx,w/2,h/2,w2);*/
		
		/*tmpCtx.save();
		tmpCtx.clip();
		//tmpCtx.fillRect(0,0,w,h);
		//fill grey rect at mouse
		tmpCtx.fillStyle="rgba(250,250,250,0.3)";
		fillCircle(tmpCtx,dis*ratio*Math.cos(ang)+w2,dis*ratio*Math.sin(ang)+w2,Math.max(0.5,(ratio)*w2*0.5));
		tmpCtx.restore();*/
		//tmpCtx.fillRect(dis*ratio*Math.cos(ang),dis*ratio*Math.sin(ang),w,h);


		/*//draw mouse on BG
		ctxBG.lineWidth=5;
		
		for (let i = dis%1;i<dis;i++) {
			ctxBG.fillStyle="rgba(0,0,0,"+Math.max(0,0.5-i/dis*0.5)+")";
			fillCircle(ctxBG,Math.floor(mouseX-Math.cos(ang)*(dis))+0.5,Math.floor(mouseY-Math.min(0,Math.sin(ang))*(i/dis*dis+5))+0.5,w2);
		}*/
		/*let panelSize = Math.min(w2*4,height - 40 - w2*2 - w2*2);
		for (let p = 0;p < panelSize; p+=10) {
			ctxBG.fillStyle="rgba(0,0,0,0.5)";
			fillCircle(ctxBG,Math.floor(x+w2)+0.5,Math.floor(y+w2)+p-w2/6,w2+w2/6);
			
		}*/

		/*//fill white font there too at mouse
		tmpCtx.font = "4vw Karma black";
		tmpCtx.fillStyle="rgba(255,255,255,1)";
		if (homeDivs[key].hoverCount > 25) {
			tmpCtx.font=Math.floor(4+(homeDivs[key].hoverCount-25)/10)+"vw Karma black";
			tmpCtx.fillStyle="rgba(50,"+Math.floor(100+20*(homeDivs[key].hoverCount-25))+",0,0.8)"
		}
		let txWd = tmpCtx.measureText(homeDivs[key].name).width;
		tmpCtx.fillText(homeDivs[key].name,homeDivW/2-txWd/2+dis*ratio*Math.cos(ang),homeDivH/2+dis*ratio*Math.sin(ang));*/

		if(key == "Projects") {
			tmpCtx.fillStyle="rgba(255,0,0,0.1)";
		} else if (key == "Games") {
			tmpCtx.fillStyle="rgba(0,255,0,0.1)";
		} else if (key == "Blog") {
			tmpCtx.fillStyle="rgba(0,0,255,0.1)";
		}
		//tmpCtx.save();
		//tmpCtx.fillStyle="rgba(0,0,0,0)";
		//fillCircle(tmpCtx,w2,w2,homeDivs[key].hoverCount/0.1+w2);
		//tmpCtx.clip();
		tmpCtx.fillStyle="rgba(0,51,204,0.8)"
		if (homeDivs[key].hover) {
			tmpCtx.fillStyle="rgba("+0+","+Math.floor(51*(1-ratio))+","+Math.floor(204*(1-ratio))+",1)"
		}
		tmpCtx.globalAlpha = 0.5;
		fillCircle(tmpCtx,w2,w2-1  ,w2-2);
		fillCircle(tmpCtx,w2,w2-3  ,-homeDivs[key].hoverCount*0.2+w2-6);
		fillCircle(tmpCtx,w2,w2-6  ,-homeDivs[key].hoverCount*0.1+w2-12);
		fillCircle(tmpCtx,w2,w2-12 ,-homeDivs[key].hoverCount*0.05+w2-24);
		

		tmpCtx.globalAlpha = 1;
		//tmpCtx.restore();

		//fill blue font in middle of Div
		tmpCtx.font = 4-homeDivs[key].hoverCount/60+"vw Karma black";
		tmpCtx.fillStyle="rgba(235,235,235,1)";
		txWd = tmpCtx.measureText(homeDivs[key].name).width;
		tmpCtx.fillText(homeDivs[key].name,homeDivW/2-txWd/2,homeDivH/2);

		

	}

	/*//Draw mouse on BG
	ctxBG.fillStyle="#0086c3";//rgba(0,0,0,0.5)";
	//fillCircle(ctxBG,Math.floor(mouseX)+0.5,Math.floor(mouseY)+0.5,Math.ceil(Math.max(1,1*0.5*w2)));
	ctxBG.beginPath();
	ctxBG.moveTo(mouseX - 5,mouseY - 5);
	ctxBG.arc(mouseX - 5,mouseY - 5,5,0,Math.PI*2,0);
	ctxBG.closePath()
	ctxBG.stroke();*/
}
var homeDivs = {
	Projects: {
		name: "Projects",
		onclick: function() {
			initProjects();
		},
		hoverCount:0,
		hover:false,
		bgImg:"parallax-02a.png",
	},
	Games: {
		name: "Games",
		onclick: function() {
			initProjects();
		},
		hoverCount:0,
		hover:false,
		bgImg:"parallax-02a.png",
	},
	Blog: {
		name: "Blog",
		onclick: function() {
			initHome();
		},
		hoverCount:0,
		hover:false,
		bgImg:"parallax-02a.png",
	}
}
