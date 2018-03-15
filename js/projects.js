var projDivW = 0;
var projDivH = 0;

function initProjects() {
	hoverCanvas = false;
	currentSite = "projects";

	doTransitionAnimation();
	//Clear Main Window
	document.getElementById("mainWindow").innerHTML = "";

	//Create Wrapper 
	let wrap = createDiv("outerWrapper", "outerWrapper");

	//Create Intro Text.
	let welc = createDiv("welcText", "welcText");
	welc.innerHTML = "</br>Here's an overview over my past and current projects.</br></br>";
	wrap.appendChild(welc);
	document.getElementById("mainWindow").appendChild(wrap);

	projDivW = Math.floor(width * 2 / 3);
	projDivH = Math.max(150, Math.floor(height / 3));



	for (let i in projects) {

		createProjectDiv(i);
	}
	for (let i in projects) {
		if (projects[i].onload) {
			projects[i].onload();
		}
	}
}

function createProjectDiv(i) {
	let outestDiv = createDiv("outestProjectDiv" + i, "outestProjectDiv");
	let outerDiv = createDiv("outerProjectDiv" + i, "outerProjectDiv");
	let descrDiv = createDiv("descrProjectDiv" + i, "descrProjectDiv");
	let titleDiv = createDiv("titleProjectDiv" + i, "titleProjectDiv");
	let imgDiv = createDiv("imgProjectDiv" + i, "imgProjectDiv");

	titleDiv.innerHTML = projects[i].name;
	descrDiv.innerHTML = projects[i].descr;
	let tmpCanv = createCanvas(projDivW, projDivH, 0, 0, "projCanvas" + i, "projCanvas", 0, 0, true);
	outerDiv.style.width = projDivW + "px";
	outerDiv.style.height = projDivH + "px";
	outestDiv.style.width = projDivW + "px";
	outestDiv.style.height = projDivH * 1 / 0.9 + "px";

	tmpCanv.addEventListener("click", projCanvClick);
	tmpCanv.addEventListener("mouseenter", projCanvHover);
	tmpCanv.addEventListener("mouseleave", projCanvHoverOut);

	let outPath = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	outPath.setAttributeNS(null, "viewBox", "0 0 " + projDivW + " " + projDivH);
	outPath.setAttributeNS(null, "width", projDivW);
	outPath.setAttributeNS(null, "height", projDivH);
	outPath.style.display = "block";
	/*outPath.style.width = projDivW+"px";
	outPath.style.height= projDivH+"px";*/
	/*outPath.width = projDivW;
	outPath.height =projDivH;*/
	let circ = document.createElementNS("http://www.w3.org/2000/svg", "path");
	circ.setAttributeNS(null, "d", "M0 0 L0 " + projDivH + " L" + projDivW + " " + projDivH + " L" + projDivW + " 0 L0 0");
	circ.setAttributeNS(null, "stroke", "black");
	circ.setAttributeNS(null, "fill", "transparent");
	circ.setAttributeNS(null, "stroke-dasharray", "5");
	circ.id = "dashedFrame" + i;

	circ.setAttribute("curOffset", 5);
	circ.setAttributeNS(null, "stroke-dashoffset", "5");

	circ.className = "dashedFrame"


	outPath.appendChild(circ);
	outerDiv.appendChild(outPath);
	outerDiv.appendChild(tmpCanv);
	projects[i].ct = tmpCanv.getContext("2d");
	outerDiv.appendChild(descrDiv);
	outerDiv.appendChild(imgDiv);
	outestDiv.appendChild(titleDiv);
	outestDiv.appendChild(outerDiv);

	$("#outerWrapper").append(outestDiv);

}

function projCanvClick(e) {
	let id = e.target.id;
	console.log(id);
	hoverCanvas = e.target.id.split("projCanvas")[1];
	projects[hoverCanvas].onclick();
	hoverCanvas = false;
}

function projCanvHover(e) {
	if (hoverCanvas) {
		projects[hoverCanvas].hover = false;
	}
	let id = e.target.id;
	let rect = e.target.getBoundingClientRect();

	hoverCanvas = e.target.id.split("projCanvas")[1];
	projects[hoverCanvas].lastX = mouseX - rect.x;
	projects[hoverCanvas].lastY = mouseY - rect.y;
	projects[hoverCanvas].hover = true
}

function projCanvHoverOut(e) {
	let id = e.target.id;
	projects[hoverCanvas].hover = false
	hoverCanvas = false;
}

function drawProjects() {
	for (let p in projects) {
		let el = document.getElementById("projCanvas" + p);
		if (!el) {
			return;
		}
		let ct = el.getContext("2d");
		let w = el.width;
		let h = el.height;
		ct.fillStyle = "black";
		if (hoverCanvas == p) {

		//}
		//if (projects[p].hover) {
			let el2 = document.getElementById("dashedFrame" + p);
			let off = parseInt(el2.getAttribute("curOffset"));
			el2.setAttribute("curOffset", (off + 1));
			el2.setAttributeNS(null, "stroke-dashoffset", (off + 1));
			projects[p].ondraw();
		}
		//ct.fillRect(0,0,w,h);
	}
}
var projects = {
		Cursors: {
			name: "Animated Shapes",
			descr: "A set of animated shapes rendered on HTML Canvas. ",
			hover: false,
			hoverCount: 0,
			ct: null,
			onclick: function() {
				initCursors();
			},
			ondraw: function() {
				let ct = this.ct;
				ct.clearRect(0, 0, projDivW, projDivH)


				//mouseEasing("LinearLong");
				if (!mousePulseGoingBack) {
					mousePulse += 1; //0.1 + Math.min(50, mousePulse / 50)
					if (mousePulse >= 100) {
						mousePulse = 1;
						//mousePulseGoingBack = true;
					}
				} else {
					mousePulse -= 1; //0.1 + Math.min(50, mousePulse / 50)
					if (mousePulse <= 1) {
						mousePulseGoingBack = false;
					}
				}

				let rgr = ct.createRadialGradient(cMouseX, cMouseY, 0, cMouseX, cMouseY, width / 2);
				rgr.addColorStop(0, "rgba(100,100,250,0.8)");
				rgr.addColorStop(1, "rgba(200,200,200,0.4)");

				let rgrInv = ct.createRadialGradient(cMouseX, cMouseY, 0, cMouseX, cMouseY, width / 2);
				rgrInv.addColorStop(0, "rgba(0,0,200,0.8)");
				rgrInv.addColorStop(1, "rgba(100,100,250,0.8)");

				let rgrFade = ct.createRadialGradient(cMouseX, cMouseY, 0, cMouseX, cMouseY, width / 2);
				rgrFade.addColorStop(0, "rgba(0,0,200,0.1)");
				rgrFade.addColorStop(1, "rgba(100,100,250,0.1)");

				ct.lineWidth = 4;
				let ratio = 0;
				let i = mousePulse * 0.01 * Math.PI * 4;
				let iterations = i + 12;
				let ang = Math.sin(i * 0.5 - 1.5);
				let siz2 = projDivW/3/10;
				let dis = Math.cos(i * 0.5 - 1.5 - Math.floor(i / iterations / 2) * 1.5) * siz2;
				/*let rgr = ct.createRadialGradient(projDivW*0.15, projDivH*0.6, 0, projDivW*0.15, projDivH*0.6, 20);
				rgr.addColorStop(0, "rgba(100,100,250,0.8)");
				rgr.addColorStop(1, "rgba(200,200,250,0.4)");*/
				let col = Math.floor(255 * Math.abs(mousePulse - 50) / 100);
				ct.strokeStyle = "rgba(" + 0 + "," + 0 + "," + col + "," + 1 + ")"; //"rgba(0,0,0,0.5)";
				//ctBG.strokeStyle="rgba(255,255,255,0.1)";
				let x = (projDivW * 0.1) + dis * Math.cos(ang);
				let y = (projDivH * 0.65) + dis * Math.sin(ang);


				ct.beginPath();

				while (i < iterations - Math.abs(mousePulse - 50) * 0.05) {
					i += 0.1;
					ang = Math.sin(i * 0.5 - 1.5);
					dis = Math.cos(i * 0.5 - 1.5 - Math.floor(i / iterations / 2) * 1.5) * siz2;

					ct.moveTo(x, y);
					x = (projDivW * 0.1) + dis * Math.cos(ang);
					y = (projDivH * 0.65) + dis * Math.sin(ang);


					ct.lineTo(x, y);
				}
				ct.stroke();

				ct.closePath();

				ct.fillStyle = "rgba(" + 0 + "," + 0 + "," + col + "," + (col / 255) + ")";
				ct.beginPath();
				ct.arc(projDivW * 0.1 - siz2/2, projDivH * 0.65, siz2/2, 0, Math.PI * 2, 0);
				ct.fill();
				ct.closePath();
				ct.fillStyle = "rgba(0," + 0 + "," + (1 - col) + "," + (1 - col / 255) + ")";
				ct.beginPath();
				ct.arc(projDivW * 0.1 + siz2/2, projDivH * 0.65, siz2/2, 0, Math.PI * 2, 0);
				ct.fill();
				ct.closePath();

				//Spiral
				drawCrazySpiral(ct, projDivW * 0.1, projDivH * 0.35, projDivW/3/2, 4, 100, (mousePulse) / 100 * Math.PI * 2, 3, rgr);

				//rings
				am = 10;
				angleStep = Math.PI * 2 / am;
				dis = 20;
				siz = projDivW/3/2/5;


				for (let j = 0; j < am; j++) {
					let x = projDivW * 0.25 + dis * Math.cos(angleStep * j + mousePulse / 100 * Math.PI % Math.PI * 2);
					let y = projDivH * 0.65 + dis * Math.sin(angleStep * j + mousePulse / 100 * Math.PI % Math.PI * 2);
					ct.beginPath();
					ct.fillStyle = rgr; //"rgba("+Math.max(0,colorStep * j - 510)+","+Math.min(255,Math.max(0,colorStep * j - 255))+","+Math.min(510,colorStep * j )-2*10+",0.5)";
					ct.moveTo(x, y);
					ct.arc(
						x,
						y,
						siz, 0, Math.PI * 2, 0);
					ct.fill();
					ct.closePath();
				}

				ct.closePath();


				//Frequencythingy
				ct.lineWidth = 2; //Math.abs(mousePulse-50)/100;
				i = Math.abs(mousePulse - 50);

				iterations = i + 14;
				ang = Math.cos(i % Math.PI * 2);
				dis = Math.cos(i * 0.1 - Math.floor(i / 50) * Math.PI * 2) * 15;

				ct.strokeStyle = rgrFade;


				x = (projDivW * 0.25) + dis * Math.cos(ang);
				y = (projDivH * 0.35) + dis * Math.sin(ang);

				ct.beginPath();

				while (i < iterations - 1) {
					i += 1;
					ang = Math.cos(i % Math.PI * 2);
					dis = Math.cos(i * 0.1 - Math.floor(i / 50) * Math.PI * 2) * 15;

					ct.moveTo(x, y);
					x = (projDivW * 0.25) + dis * Math.cos(ang);
					y = (projDivH * 0.35) + dis * Math.sin(ang);

					ct.lineTo(x, y);
					ct.stroke();
				}

				ct.closePath();



			}
		},
		FreeDraw: {
			name: "Free Drawing",
			descr: "Free drawing on HTML Canvas using several different Brushes. ",
			hover: false,
			hoverCount: 0,
			ct: null,
			points: [],
			lastX: 0,
			lastY: 0,
			onclick: function() {
				FreeDrawCanvas.init(document.getElementById("mainWindow"));
			},
			onload: function() {
				this.points=[];
			},
			ondraw: function() {
				let ct = this.ct;
				/*ct.clearRect(0,0,projDivW,projDivH)*/
				let mx = cMouseX;
				let my = cMouseY;

				let dis = Distance(mx, my, this.lastX, this.lastY);
				let ang = angle(this.lastX, this.lastY, mx, my);
				ct.lineWidth = 2;
				ct.strokeStyle = "rgba(0,0,0,0.1)";
				if (dis > 10) {
					let steps = Math.ceil(dis / 10);
					let stepSize = dis / steps;


					ct.beginPath();
					ct.moveTo(this.lastX, this.lastY);
					ct.lineTo(mx, my);
					ct.stroke();
					ct.closePath();
					this.lastX = mx;
					this.lastY = my;

				}

				let bool = true;
				for (let p in this.points) {
					let pt = this.points[p];
					if (Distance(mx, my, pt[0], pt[1]) < 3) {
						bool = false;
						break;
					}
				}
				if (bool) {
					for (let p = this.points.length - 1; p >= 0; p--) {
						let pt = this.points[p];

						this.points[p][2]--;
						if (this.points[p][2] <= 0) {
							ct.save(),
								ct.beginPath();
							ct.arc(pt[0], pt[1], 15, 0, Math.PI * 2, 0);
							ct.clip();
							ct.clearRect(pt[0] - 15, pt[1] - 15, 30, 30);
							ct.closePath();
							ct.restore();
							this.points.splice(p, 1);
						}

						if (Distance(mx, my, pt[0], pt[1]) < 60) {
							ct.beginPath();
							ct.moveTo(mx, my);
							ct.lineTo(pt[0], pt[1]);
							ct.stroke();
							ct.closePath();
						}
					}
					this.points.push([mx, my, 500]);
					ct.beginPath();
					ct.moveTo(this.lastX, this.lastY);
					ct.lineTo(mx, my);
					ct.stroke();
					ct.closePath();
					this.lastX = mx;
					this.lastY = my;
				}



			}
		},
		ImageGeneration: {
			name: "Image Generation",
			descr: "Lots of different image generation (mostly simple shapes) techniques.",
			hover: false,
			hoverCount: 0,
			ct: null,
			theImg: null,
			origCnv: null,
			origDt: null,
			ctxOrig:null,
			ctxNew:null,
			cnvW: null,
			cnvH: null,
			sizeMod:1,
			newCnv: null,
			lowestMSE: 1e99,	
			highestMSE:1e99,
			currentLowest:null,
			loaded: false,
			innerCounter:0,
			onclick: function() {
				initCursors();
			},
			onload:function() {
				let ct = this.ct;
				if (!theImg) {
					theImg = new Image();
					theImg.src = "img/earth.jpg";
					theImg.crossOrigin = "Anonymous";
					console.log(theImg);
				} else {
					let thi = projects.ImageGeneration;
					thi.theImg = theImg;
					thi.cnvW = thi.theImg.width;
					thi.cnvH = thi.theImg.height;

					thi.origCnv = document.createElement("canvas");
					thi.origCnv.width = thi.cnvW;
					thi.origCnv.height = thi.cnvH;

					//document.body.appendChild(thi.origCnv);
					thi.ctxOrig = thi.origCnv.getContext("2d");
					thi.ctxOrig.drawImage(thi.theImg, 0, 0);

					thi.origDt = thi.ctxOrig.getImageData(0, 0, thi.cnvW, thi.cnvH).data;

					thi.newCnv = document.createElement("canvas");
					thi.newCnv.width = thi.cnvW;
					thi.newCnv.height = thi.cnvH;
					//document.body.appendChild(cnv);

					thi.ctxNew = thi.newCnv.getContext("2d");

					thi.lowestMSE = getMSEBetter(thi.ctxNew, 0, 0, thi.cnvW, thi.cnvH);
					thi.highestMSE = thi.lowestMSE;
					thi.loaded = true;
					let scale = Math.min(1, (projDivW/3)/thi.cnvW );
					let top = Math.max(0,(projDivH-thi.cnvH*scale)/2);
					ct.drawImage(thi.origCnv,0,0,thi.cnvW,thi.cnvH,5,top,thi.cnvW*scale,thi.cnvH*scale);
					
				}
				theImg.onload = function() {
					let thi = projects.ImageGeneration;
					thi.theImg = theImg;
					thi.cnvW = thi.theImg.width;
					thi.cnvH = thi.theImg.height;

					thi.origCnv = document.createElement("canvas");
					thi.origCnv.width = thi.cnvW;
					thi.origCnv.height = thi.cnvH;

					//document.body.appendChild(thi.origCnv);
					thi.ctxOrig = thi.origCnv.getContext("2d");
					thi.ctxOrig.drawImage(thi.theImg, 0, 0);

					thi.origDt = thi.ctxOrig.getImageData(0, 0, thi.cnvW, thi.cnvH).data;

					thi.newCnv = document.createElement("canvas");
					thi.newCnv.width = thi.cnvW;
					thi.newCnv.height = thi.cnvH;
					//document.body.appendChild(cnv);

					thi.ctxNew = thi.newCnv.getContext("2d");

					thi.lowestMSE = getMSEBetter(thi.ctxNew, 0, 0, thi.cnvW, thi.cnvH);
					thi.highestMSE = thi.lowestMSE;
					thi.loaded = true;
					let scale = Math.min(1, (projDivW/3)/thi.cnvW );
					let top = Math.max(0,(projDivH-thi.cnvH*scale)/2);
					ct.drawImage(thi.origCnv,0,0,thi.cnvW,thi.cnvH,5,top,thi.cnvW*scale,thi.cnvH*scale);
					console.log(thi.origCnv);
				}
			},
			ondraw: function() {
				
				if (this.loaded) {
					let ct = this.ct;
					//for (let j = 0; j < 10; j++) {

						//Create cnvTmp  - draw random shape on it
						let cnvTmp = document.createElement("canvas");
						cnvTmp.width = this.cnvW;
						cnvTmp.height = this.cnvH;
						let ctxTmp = cnvTmp.getContext("2d");

						let cnvTmp2 = document.createElement("canvas");
						cnvTmp2.width = this.cnvW;
						cnvTmp2.height = this.cnvH;
						let ctxTmp2 = cnvTmp2.getContext("2d");
						ctxTmp2.drawImage(this.newCnv,0,0);

						let rndX = Math.floor(this.cnvW/2 - Math.random() * 0.5 * this.cnvW + Math.random() * 0.5 * this.cnvW);
						let rndY = Math.floor(this.cnvH/2 - Math.random() * 0.5 * this.cnvH + Math.random() * 0.5 * this.cnvH);

						let ind = rndX * 4 + rndY * this.cnvW * 4;

						ctxTmp.fillStyle = "rgba(" +
							this.origDt[ind + 0] + "," +
							this.origDt[ind + 1] + "," +
							this.origDt[ind + 2] + "," +
							this.origDt[ind + 3] / 255 * 0.8 + ")";

						drawEvenTriangle(ctxTmp,rndX,rndY,Math.random()*this.cnvW*this.sizeMod,Math.random()*Math.PI);
			            ctxTmp.fill();
						
						ctxTmp2.drawImage(cnvTmp, 0, 0);


						let newMSE = getMSEBetter(ctxTmp2, 0, 0, this.cnvW, this.cnvH);
						
						if (newMSE < this.lowestMSE) {
							this.lowestMSE = newMSE;
							this.currentLowest = cnvTmp;


							
						}
						this.innerCounter++;
						if (this.innerCounter<10) {
							return;
						} else {
							this.innerCounter=0;
						}

					//}
					if (this.currentLowest != null) {
						this.ctxNew.drawImage(this.currentLowest, 0, 0);
						this.currentLowest=null;
						this.sizeMod = this.lowestMSE/this.highestMSE;
						//shapeCounter++;
						let scale = Math.min(1, (projDivW/3)/this.cnvW );
						let top = Math.max(0,(projDivH-this.cnvH*scale)/2);
						ct.clearRect(this.cnvW+top,top,this.cnvW*scale,this.cnvH*scale);
						ct.drawImage(this.newCnv,0,0,this.cnvW,this.cnvH,this.cnvW*scale+5*2,top,scale*this.cnvW,scale*this.cnvH);
						
					} else {
						console.log("None found");
					}
				}
			},
		},
		MandelBrotRender: {
			name: "Mandelbrot-Set Render",
			descr: "A real-time zoomable render of the Mandelbrot set. Does not zoom too deep since it uses the GPU and becomes prone to float errors",
			hover: false,
			hoverCount: 0,
			ct: null,
			theImg: null,
			origCnv: null,
			origDt: null,
			ctxOrig:null,
			ctxNew:null,
			cnvW: null,
			cnvH: null,
			sizeMod:1,
			newCnv: null,
			lowestMSE: 1e99,	
			highestMSE:1e99,
			currentLowest:null,
			loaded: false,
			innerCounter:0,
			onclick: function() {
				document.getElementById("mainWindow").innerHTML = "";
				MandelBrotRender.init(document.getElementById("mainWindow"));
			},
			onload:function() {
				let ct = this.ct;
				let thi = projects.MandelBrotRender;
				if (!thi.theImg) {
					thi.theImg = new Image();
					thi.theImg.src = "img/Mandelbrot.png";
					thi.theImg.crossOrigin = "Anonymous";
				} else {
					ct.drawImage(thi.theImg,0,0);
				}
				thi.theImg.onload = function() {
					ct.drawImage(thi.theImg,0,0);
				}
				
			},
			ondraw: function() {
				
				if (this.loaded) {

				}
			},
		},


	
}
var theImg=null;
var theImg2=null;
function getMSEBetter(ct, x, y, w, h) {
    try {
        let data1 = ct.getImageData(x, y, w, h).data;
        let dt = projects.ImageGeneration.origDt;
        let sum = 0;
        for (let i = 0; i < data1.length - 37; i += 4) {
        	let mod = 1;
            /*if (dt[i]+dt[i+1]+dt[i+2] == 0) {
            	mod = 0.2;
            }*/
            //sum += Math.abs((data1[i] + data1[i + 1] + data1[i + 2])- (dt[i] + dt[i + 1] + dt[i + 2]));
            sum += (Math.abs(data1[i ] - dt[i ])) * mod;
            sum += (Math.abs(data1[i + 1] - dt[i + 1]))* mod;
            sum += (Math.abs(data1[i + 2] - dt[i + 2]))* mod;
            sum += (Math.abs(data1[i + 3] - dt[i + 3]));

        }
        return sum;
    } catch (e) {

        return 1E91;
    }
}