var FreeDrawCanvas = (function() {
var theColor;
var started = false; //Needed to stop generatepointsstatic function from emptying pointsToDraw array when creating Brush Buttons.
var freeDrawSettings;
var settDivs=[];
var fdCtx = null;
var fdCtx1 = null;
var fdW = 0;
var fdH = 0;
var pointsToDraw = [];
var savedStates = [];
var gpu;
var calcSet;
var nMinX, nMaxX, nMinY, nMaxY;

var delay=false;
var mouseDown=false;
var FDlastMouseX = 0;
var FDlastMouseY = 0;
var FDcMouseX = 0;
var FDcMouseY = 0;
var FDmouseX = 0;
var FDmouseY = 0;
	function initFreeDraw(el) {
		currentSite = "freeDraw";

		fdW = Math.ceil(width * 0.7);
		fdH = Math.ceil(height * 0.6);




		started = false;
		/*if (freeDrawSettings) {
			freeDrawSettings.destroy();
		}*/
		//Clear Main Window
		$(el).html("");
		pointsToDraw=[];
		mouseDown=false;
		/*$(el).children().each(function () {
		    $(this).remove(); // "this" is the current element in the loop
		});
*/
		//Create Wrapper 
		let wrap = createDiv("outerWrapper", "outerWrapper");
		let cnv = document.createElement("canvas");
		cnv.width = fdW;
		cnv.height = fdH;
		cnv.style.position = "fixed";
		cnv.style.left = "25px";
		cnv.style.top = "75px";
		cnv.style.zIndex = 0;
		cnv.id = "freeDrawLayer0";
		cnv.className = "freeDrawLayer";
		cnv.addEventListener("mouseenter", FDenterFreeDraw);
		cnv.addEventListener("mouseleave", FDexitFreeDraw);
		cnv.addEventListener("mousemove", FDhandleMouseMove);
		cnv.addEventListener("mousedown", FDhandleMouseDown);
		cnv.addEventListener("mouseup", FDhandleMouseUp);
		let cnv1 = document.createElement("canvas");
		cnv1.width = fdW;
		cnv1.height = fdH;
		cnv1.style.position = "fixed";
		cnv1.style.left = "25px";
		cnv1.style.top = "75px";
		cnv1.style.zIndex = -1;
		cnv1.id = "freeDrawLayerBG";
		cnv1.className = "freeDrawLayerBG";
		fdCtx = cnv.getContext("2d");
		fdCtx1 = cnv1.getContext("2d");
		fdCtx.lineJoin = fdCtx.lineCap = fdCtx1.lineJoin = fdCtx1.lineCap = 'round';





		let toolBar = createDiv("toolbar", "toolBar");
		toolBar.style.width = "100%";
		toolBar.style.height = height * 0.3 - 75 + "px";
		toolBar.style.position = "absolute";
		toolBar.style.right = "0px";
		toolBar.style.bottom = "0px";
		toolBar.style.zIndex = 1;
		toolBar.id = "freeDrawToolBar";
		toolBar.className = "freeDrawToolBar";

		let c = 0;
		for (let b in brushes) {
			c++;
			if (c > 5) {
				let div = createDiv("breaker" + c, "breaker");
				toolBar.appendChild(div)
			}
			toolBar.appendChild(getBrushDiv(b));
		}


		pointsToDraw = [];
		let settingsBar = createDiv("toolbar", "toolBar");
		settingsBar.style.width = width - fdW - 25 + "px";
		settingsBar.style.height = "10vh";
		settingsBar.style.position = "absolute";
		settingsBar.style.right = "0px";
		settingsBar.style.top = 0 + "px";
		settingsBar.style.zIndex = 1;
		settingsBar.id = "freeDrawSettingsBar";
		settingsBar.className = "freeDrawSettingsBar";

		wrap.appendChild(cnv);
		wrap.appendChild(toolBar);
		wrap.appendChild(settingsBar);
		/*//Create Intro Text.
		let welc = createDiv("welcText", "welcText");*/
		/*welc.innerHTML = "</br>Here's an overview over my past and current projects.</br></br>";
		wrap.appendChild(welc);*/
		//document.getElementById("mainWindow").appendChild(wrap);
		$(el).append(wrap);

		//projDivW = Math.floor(width * 2 / 3);
		//projDivH = Math.max(150, Math.floor(height / 3));

		started = true;


	}
	
	function fillSettingsDiv(i) {
		if (freeDrawSettings) {
			freeDrawSettings.destroy();
		}
		freeDrawSettings = QuickSettings.create(0, 50, i, document.getElementById("freeDrawSettingsBar"));
		for (let set in brushes[i].settings) {
			//document.getElementById("freeDrawSettingsBar").appendChild(createSettingDiv(i,set))
			addAppropriateInputField(i, set);
		}
	}

	function addAppropriateInputField(i, set) {
		if (brushes[i].settings[set].type == "number") {
			freeDrawSettings.addNumber(set, 0, 1000, brushes[i].settings[set].val, 0.1, function(val) {
				brushes[i].settings[set].val = val;
			})
		} else if (brushes[i].settings[set].type == "angle") {
			freeDrawSettings.addRange(set, 0, Math.PI * 2, brushes[i].settings[set].val, 0.1, function(val) {
				brushes[i].settings[set].val = val;
			})
		} else if (brushes[i].settings[set].type == "color") {
			/*freeDrawSettings.addColor(set,brushes[i].settings[set].val,function(val) {
				brushes[i].settings[set].val = val;
			})*/
			let colInp = document.createElement("input");
			colInp.type = "text";
			colInp.id = set;
			freeDrawSettings.addElement(set, colInp);
			$("#" + set).spectrum({
				color: brushes[i].settings[set].val,
				showAlpha: true,
				change: function(e) {
					theColor = e;
					brushes[i].settings[set].val = e.toRgbString();
				}
			})
		} else if (brushes[i].settings[set].type == "bool") {
			freeDrawSettings.addBoolean(set, brushes[i].settings[set].val, function(val) {
				brushes[i].settings[set].val = val;
			})
		}
	}

	function makeRgbaString(col) {
		return "rgba(" + col._r + "," + col._g + "," + col._b + "," + col._a + ")";
	}

	function createSettingDiv(i, set) {
		let outerSettings = createDiv("settingDiv" + i + set, "settingDiv");
		outerSettings.style.width = 100 + "px";
		outerSettings.style.height = 50 + "px";
		outerSettings.innerHTML = set;
		let inp = document.createElement("input");
		inp.value = brushes[i].settings[set];
		inp.addEventListener("change", function(e) {
			
			brushes[i].settings[set] = this.value;
			
		})
		outerSettings.appendChild(inp);
		return outerSettings
	}

	function FDenterFreeDraw(e) {
		let id = e.target.id;
		let rect = e.target.getBoundingClientRect();
		FDlastMouseX = FDmouseX - rect.x;
		FDlastMouseY = FDmouseY - rect.y;
	}

	function FDexitFreeDraw(e) {
		let rect = e.target.getBoundingClientRect();
		FDlastMouseX = FDmouseX - rect.x;
		FDlastMouseY = FDmouseY - rect.y;
	}

	function FDhandleMouseDown(e) {
		mouseDown=true;
		pointsToDraw=[];
		let rect = e.target.getBoundingClientRect();
		FDlastMouseX = FDmouseX - rect.x;
		FDlastMouseY = FDmouseY - rect.y;
	}
	function FDhandleMouseUp(e) {
		mouseDown=false;
	}

function FDhandleMouseMove(e) {
	let rect = e.target.getBoundingClientRect();
	FDcMouseX = e.clientX - rect.left;
	FDcMouseY = e.clientY - rect.top;
	FDmouseX = e.clientX;
	FDmouseY = e.clientY;
}
	function getBrushDiv(i) {
		let outDiv = createDiv("brushDiv" + i, "brushDiv");
		let wd = Math.sqrt(width * (height * 0.3 - 75) / 20);
		let ht = Math.floor((height * 0.3 - 75) / 2.5);
		outDiv.style.width = Math.min(wd, ht) + "px";
		outDiv.style.height = Math.min(wd, ht) + "px";
		outDiv.addEventListener("click", function(e) {
			pointsToDraw = [];
			let rect = fdCtx.canvas.getBoundingClientRect();
			FDlastMouseX = FDmouseX - rect.x;
			FDlastMouseY = FDmouseY - rect.y;
			brushes[i].onclick(e);
			fillSettingsDiv(i);
		});
		brushes[i].internalCount=1;

	let tmpImg = document.createElement("canvas");
		tmpImg.className = "brushDivImg";
		tmpImg.height = 100;
		tmpImg.width = 100;
		tmpImg.style.width = "100%";
		tmpImg.style.height = "100%";
		tmpImg.innerHTML = brushes[i].name;
		pointsToDraw = getRoundPoints();
		brushes[i].draw(tmpImg.getContext("2d"));
		outDiv.appendChild(tmpImg);
		return outDiv;

	}

	function getRoundPoints() {
		let w = 100;
		let h = 100;
		let points = [];
		for (let i = Math.PI; i > -Math.PI; i -= 0.2) {
			let x = w / 2 + 25 * Math.cos(i);
			let y = h * 2 / 4 + 25 * Math.sin(i);
			points.push([x, y]);
		}
		for (let i = 0; i < 20; i++) {
			let x = w / 2 + 25 * Math.cos(-Math.PI + 0.1);
			let y = h * 3 / 4 + 25 * Math.sin(-Math.PI + 0.1);
			x -= i * 3 * Math.cos(Math.PI * 0.5)
			y -= i * 3 * Math.sin(Math.PI * 0.5)
			points.push([x, y])
		}
		return points;
	}

	function createBrushPic() {

	}

	function drawFreeDraw() {

		selectedBrush.draw(fdCtx);
	};

	var brushes = {
		standard: {
			name: "standard",
			settings:  {
				lineWidth: {
					val: 5,
					type: "number"
				},
				strokeStyle: {
					val: "rgba(0,0,0,0.5)",
					type: "color"
				}
			},
			onclick: function(e) {
				let id = e.target.id.split("brushDiv")[1]
				selectedBrush = brushes[id];

			},
			draw: function(ct) {
				generatePoints(ct.canvas);
				//fdCtx.clearRect(0,0,fdW,fdH);
				ct.lineWidth = this.settings.lineWidth.val;
				ct.strokeStyle = this.settings.strokeStyle.val;
				ct.beginPath();
				if (pointsToDraw.length > 0) {
					ct.moveTo(pointsToDraw[0][0], pointsToDraw[0][1]);
					for (let i = 1; i < pointsToDraw.length; i++) {
						ct.lineTo(pointsToDraw[i][0], pointsToDraw[i][1]);
					}
					ct.stroke();
					ct.closePath();
					pointsToDraw = [];
				}
			}
		},
		quadratic: {
			name: "quadratic",
			settings:  {
				margin: {
					val: 5,
					type: "number"
				},
				lineWidth: {
					val: 5,
					type: "number"
				},
				strokeStyle: {
					val: "rgba(0,0,0,1)",
					type: "color"
				}
			},
			onclick: function(e) {
				let id = e.target.id.split("brushDiv")[1]
				selectedBrush = brushes[id];


			},
			internalCount: 1,
			draw: function(ct) {
				//generatePointsStatic(ct.canvas, this.settings.margin.val);
				
				if (pointsToDraw.length == 0) {
					this.internalCount = 1;
				}
				
				//ct.clearRect(0,0,fdW,fdH);
				ct.lineWidth = this.settings.lineWidth.val;
				ct.fillStyle = this.settings.strokeStyle.val;
				
				ct.beginPath();
				if (pointsToDraw.length > this.internalCount + 1) {
					//ct.lineTo(pointsToDraw[1][0],pointsToDraw[1][1]);
					for (let i = this.internalCount; i < pointsToDraw.length; i++) {
						ct.moveTo(pointsToDraw[this.internalCount - 1][0], pointsToDraw[this.internalCount - 1][1]);
						ct.arc(pointsToDraw[this.internalCount - 1][0], pointsToDraw[this.internalCount - 1][1], this.settings.lineWidth.val, 0, Math.PI * 2, 0);
						this.internalCount++;
						/*ct.quadraticCurveTo(pointsToDraw[i][0],
							pointsToDraw[i][1],
							(pointsToDraw[i-1][0]+pointsToDraw[i][0])/2,
							(pointsToDraw[i-1][1]+pointsToDraw[i][1])/2);*/
					}
					ct.fill();
					ct.closePath();

				}
				//pointsToDraw.splice(0,pointsToDraw.length-1);
			}
		},
		quadraticThick: {
			//Shit
			name: "quadraticThick",
			settings:  {
				margin: {
					val: 1,
					type: "number"
				},
				lineWidth: {
					val: 5,
					type: "number"
				},
				strokeStyle: {
					val: "rgba(0,0,0,0.5)",
					type: "color"
				}
			},
			onclick: function(e) {
				let id = e.target.id.split("brushDiv")[1]
				selectedBrush = brushes[id];


			},
			internalCount: 1,
			draw: function(ct) {
				generatePointsStatic(ct.canvas, this.settings.margin.val);
				if (pointsToDraw.length == 0) {
					this.internalCount = 1;
				}
				//ct.clearRect(0,0,fdW,fdH);
				//ct.strokeStyle = this.settings.strokeStyle;
				if (pointsToDraw.length > this.internalCount) {
					ct.lineWidth = Math.max(0.1, Math.ceil(this.settings.lineWidth.val / Math.min(2, Math.log(Math.max(0.1, (pointsToDraw.length - this.internalCount))))));
					ct.fillStyle = this.settings.strokeStyle.val;
					//ct.lineTo(pointsToDraw[1][0],pointsToDraw[1][1]);
					for (let i = this.internalCount; i < pointsToDraw.length; i++) {
						ct.beginPath();
						//ct.moveTo(pointsToDraw[this.internalCount-1][0],pointsToDraw[this.internalCount-1][1]);
						ct.arc(pointsToDraw[this.internalCount - 1][0], pointsToDraw[this.internalCount - 1][1], ct.lineWidth, 0, Math.PI * 2, 0);
						ct.fill();
						ct.closePath();
						this.internalCount++;
						/*ct.quadraticCurveTo(pointsToDraw[i][0],
							pointsToDraw[i][1],
							(pointsToDraw[i-1][0]+pointsToDraw[i][0])/2,
							(pointsToDraw[i-1][1]+pointsToDraw[i][1])/2);*/
					}

				}
				//pointsToDraw.splice(0,pointsToDraw.length-1);
			}
		},
		quadraticThick2: {
			//Shit
			name: "quadraticThick2",
			settings:  {
				margin: {
					val: 1,
					type: "number"
				},
				lineWidth: {
					val: 10,
					type: "number"
				},
				strokeStyle: {
					val: "rgba(0,0,0,0.5)",
					type: "color"
				},
				interval: {
					val: 50,
					type: "number"
				},
			},
			onclick: function(e) {
				let id = e.target.id.split("brushDiv")[1]
				selectedBrush = brushes[id];


			},
			internalCount: 1,
			internalCount2: 0,
			draw: function(ct) {
				generatePointsStatic(ct.canvas, this.settings.margin.val);
				if (pointsToDraw.length == 0) {
					this.internalCount = 1;
					this.internalCount2 = 0;
				}
				//ct.clearRect(0,0,fdW,fdH);
				//ct.strokeStyle = this.settings.strokeStyle;
				if (pointsToDraw.length > this.internalCount) {
					//ct.lineTo(pointsToDraw[1][0],pointsToDraw[1][1]);
					ct.fillStyle = this.settings.strokeStyle.val;
					for (let i = this.internalCount; i < pointsToDraw.length; i++) {
						ct.lineWidth = this.settings.lineWidth.val * (Math.abs((this.internalCount2 % this.settings.interval.val) - (this.settings.interval.val / 2)) / (this.settings.interval.val / 2));
						ct.beginPath();
						let dis = Distance(pointsToDraw[this.internalCount - 1][0], pointsToDraw[this.internalCount - 1][1], pointsToDraw[this.internalCount][0], pointsToDraw[this.internalCount][1])
						//ct.moveTo(pointsToDraw[this.internalCount-1][0],pointsToDraw[this.internalCount-1][1]);
						ct.arc(pointsToDraw[this.internalCount - 1][0], pointsToDraw[this.internalCount - 1][1], ct.lineWidth, 0, Math.PI * 2, 0);
						ct.fill();
						ct.closePath();
						this.internalCount++;
						this.internalCount2 += dis;

					}

				}

			}
		},
		fuzzy: {
			name: "fuzzy",
			settings:  {
				margin: {
					val: 5,
					type: "number"
				},
				lineWidth: {
					val: 4,
					type: "number"
				},
				strokeStyle: {
					val: "rgba(0,250,0,0.05)",
					type: "color"
				},
				fuzzAmount: {
					val: 10,
					type: "number"
				},
				fuzzLength: {
					val: 50,
					type: "number"
				},
			},
			onclick: function(e) {
				let id = e.target.id.split("brushDiv")[1]
				selectedBrush = brushes[id];


			},
			internalCount: 1,
			draw: function(ct) {
				generatePointsStatic(ct.canvas, this.settings.margin.val);
				if (pointsToDraw.length == 0) {
					this.internalCount = 1;
				}
				//ct.clearRect(0,0,fdW,fdH);
				ct.lineWidth = this.settings.lineWidth.val;
				ct.strokeStyle = this.settings.strokeStyle.val;
				if (pointsToDraw.length > this.internalCount + 1) {
					//ct.lineTo(pointsToDraw[1][0],pointsToDraw[1][1]);
					for (let i = this.internalCount; i < pointsToDraw.length; i++) {
						/*ct.beginPath();
						//ct.moveTo(pointsToDraw[this.internalCount-1][0],pointsToDraw[this.internalCount-1][1]);
						ct.arc(pointsToDraw[this.internalCount-1][0],pointsToDraw[this.internalCount-1][1],this.settings.lineWidth,0,Math.PI*2,0);
						ct.fill();
						ct.closePath();*/
						let rndAm = Math.ceil(this.settings.fuzzAmount.val * Math.random());
						for (let j = 0; j < rndAm; j++) {
							ct.beginPath();
							ct.moveTo(pointsToDraw[this.internalCount - 1][0], pointsToDraw[this.internalCount - 1][1]);
							ct.lineTo(pointsToDraw[this.internalCount - 1][0] + Math.random() * this.settings.fuzzLength.val * Math.cos(Math.random() * Math.PI * 2), pointsToDraw[this.internalCount - 1][1] + Math.random() * this.settings.fuzzLength.val * Math.sin(Math.random() * Math.PI * 2));
							ct.stroke();
							ct.closePath();
						}
						this.internalCount++;
						/*ct.quadraticCurveTo(pointsToDraw[i][0],
							pointsToDraw[i][1],
							(pointsToDraw[i-1][0]+pointsToDraw[i][0])/2,
							(pointsToDraw[i-1][1]+pointsToDraw[i][1])/2);*/
					}

				}
				//pointsToDraw.splice(0,pointsToDraw.length-1);
			}
		},
		krakelig: {
			name: "krakelig",
			settings:  {
				margin: {
					val: 5,
					type: "number"
				},
				lineWidth: {
					val: 1,
					type: "number"
				},
				strokeStyle: {
					val: "rgba(0,0,250,0.5)",
					type: "number"
				},
				scribbleAmount: {
					val: 5,
					type: "number"
				},
				scribbleOffset: {
					val: 5,
					type: "number"
				},
			},
			onclick: function(e) {
				let id = e.target.id.split("brushDiv")[1]
				selectedBrush = brushes[id];


			},
			internalCount: 1,
			draw: function(ct) {
				generatePointsStatic(ct.canvas, this.settings.margin.val);
				if (pointsToDraw.length == 0) {
					this.internalCount = 1;
				}
				//ct.clearRect(0,0,fdW,fdH);
				ct.lineWidth = this.settings.lineWidth.val;
				ct.strokeStyle = this.settings.strokeStyle.val;
				if (pointsToDraw.length > this.internalCount + 1) {
					ct.beginPath();
					ct.moveTo(pointsToDraw[this.internalCount - 1][0], pointsToDraw[this.internalCount - 1][1]);
					/*ct.lineTo(pointsToDraw[1][0],pointsToDraw[1][1]);*/
					for (let i = this.internalCount; i < pointsToDraw.length; i++) {
						ct.lineTo(pointsToDraw[i - 1][0], pointsToDraw[i - 1][1]);
						ct.stroke();
						ct.closePath();
						let rndAm = Math.ceil(this.settings.scribbleAmount.val * Math.random());
						for (let j = 0; j < rndAm; j++) {
							ct.beginPath();
							ct.moveTo(pointsToDraw[i - 1][0] + Math.random() * this.settings.scribbleOffset.val - Math.random() * this.settings.scribbleOffset.val, pointsToDraw[i - 1][1] + Math.random() * this.settings.scribbleOffset.val - Math.random() * this.settings.scribbleOffset.val);
							ct.lineTo(pointsToDraw[i][0] + Math.random() * this.settings.scribbleOffset.val - Math.random() * this.settings.scribbleOffset.val, pointsToDraw[i][1] + Math.random() * this.settings.scribbleOffset.val - Math.random() * this.settings.scribbleOffset.val);
							ct.stroke();
							ct.closePath();
						}
						this.internalCount++;
					}
				}

			}
		},
		krakeligx5: {
			name: "krakeligx5",
			settings:  {
				margin: {
					val: 5,
					type: "number"
				},
				lineWidth: {
					val: 1,
					type: "number"
				},
				strokeStyle: {
					val: "rgba(0,0,250,0.5)",
					type: "color"
				},
				scribbleAmount: {
					val: 20,
					type: "number"
				},
				scribbleOffset: {
					val: 5,
					type: "number"
				},
			},
			onclick: function(e) {
				let id = e.target.id.split("brushDiv")[1]
				selectedBrush = brushes[id];


			},
			internalCount: 1,
			draw: function(ct) {
				generatePointsStatic(ct.canvas, this.settings.margin.val);
				if (pointsToDraw.length == 0) {
					this.internalCount = 1;
				}
				//ct.clearRect(0,0,fdW,fdH);
				ct.lineWidth = this.settings.lineWidth.val;
				ct.strokeStyle = this.settings.strokeStyle.val;
				if (pointsToDraw.length > this.internalCount + 1) {
					ct.beginPath();
					ct.moveTo(pointsToDraw[this.internalCount - 1][0], pointsToDraw[this.internalCount - 1][1]);
					/*ct.lineTo(pointsToDraw[1][0],pointsToDraw[1][1]);*/
					for (let i = this.internalCount; i < pointsToDraw.length; i++) {
						ct.lineTo(pointsToDraw[i - 1][0], pointsToDraw[i - 1][1]);
						ct.stroke();
						ct.closePath();
						let rndAm = Math.ceil(this.settings.scribbleAmount.val * Math.random());
						rndAm -= rndAm % 2;
						for (let j = 0; j < rndAm; j++) {
							ct.beginPath();
							ct.moveTo(pointsToDraw[i - 1][0] + (j - rndAm / 2) * this.settings.scribbleOffset.val, pointsToDraw[i - 1][1] + (j - rndAm / 2) * this.settings.scribbleOffset.val);
							ct.lineTo(pointsToDraw[i][0] + (j - rndAm / 2) * this.settings.scribbleOffset.val, pointsToDraw[i][1] + (j - rndAm / 2) * this.settings.scribbleOffset.val);
							ct.stroke();
							ct.closePath();
						}
						this.internalCount++;
					}
				}

			}
		},
		perspective: {
			name: "perspective",
			settings:  {
				margin: {
					val: 1,
					type: "number"
				},
				lineWidth: {
					val: 1,
					type: "number"
				},
				strokeStyle: {
					val: "rgba(0,0,250,0.5)",
					type: "color"
				},
				angle: {
					val: Math.PI * 0.25,
					type: "angle"
				},
				offset: {
					val: 15,
					type: "number"
				},
			},
			onclick: function(e) {
				let id = e.target.id.split("brushDiv")[1]
				selectedBrush = brushes[id];


			},
			internalCount: 1,
			draw: function(ct) {
				generatePointsStatic(ct.canvas, this.settings.margin.val);
				if (pointsToDraw.length == 0) {
					this.internalCount = 1;
				}
				//ct.clearRect(0,0,fdW,fdH);
				ct.lineWidth = this.settings.lineWidth.val;
				ct.strokeStyle = this.settings.strokeStyle.val;
				if (pointsToDraw.length > this.internalCount + 1) {
					/*ct.lineTo(pointsToDraw[1][0],pointsToDraw[1][1]);*/
					for (let i = this.internalCount; i < pointsToDraw.length; i++) {
						ct.beginPath();
						ct.moveTo(pointsToDraw[this.internalCount][0], pointsToDraw[this.internalCount][1]);
						ct.lineTo(pointsToDraw[this.internalCount][0] + this.settings.offset.val * Math.cos(this.settings.angle.val), pointsToDraw[this.internalCount][1] + this.settings.offset.val * Math.sin(this.settings.angle.val));

						ct.stroke();
						ct.closePath();

						this.internalCount++;
					}
				}

			}
		},
		perspectiveMoving: {
			name: "perspectiveMoving",
			settings:  {
				margin: {
					val: 1,
					type: "number"
				},
				lineWidth: {
					val: 1,
					type: "number"
				},
				strokeStyle: {
					val: "rgba(0,0,250,0.5)",
					type: "color"
				},
				angle: {
					val: 0,
					type: "angle"
				},
				offset: {
					val: 15,
					type: "number"
				},
				interval: {
					val: 35,
					type: "number"
				},
			},
			onclick: function(e) {
				let id = e.target.id.split("brushDiv")[1]
				selectedBrush = brushes[id];


			},
			internalCount: 1,
			internalCount2: 0,
			draw: function(ct) {
				generatePointsStatic(ct.canvas, this.settings.margin.val);
				if (pointsToDraw.length == 0) {
					this.internalCount = 1;
				}
				//ct.clearRect(0,0,fdW,fdH);
				ct.lineWidth = this.settings.lineWidth.val;
				ct.strokeStyle = this.settings.strokeStyle.val;

				if (pointsToDraw.length > this.internalCount + 1) {
					/*ct.lineTo(pointsToDraw[1][0],pointsToDraw[1][1]);*/
					for (let i = this.internalCount; i < pointsToDraw.length; i++) {
						ct.beginPath();
						ct.moveTo(pointsToDraw[this.internalCount][0], pointsToDraw[this.internalCount][1]);
						ct.lineTo(pointsToDraw[this.internalCount][0] + this.settings.offset.val * Math.cos(this.settings.angle.val + Math.PI * 2 * (this.internalCount2 % this.settings.interval.val) / this.settings.interval.val), pointsToDraw[this.internalCount][1] + this.settings.offset.val * Math.sin(this.settings.angle.val + Math.PI * 2 * (this.internalCount2 % this.settings.interval.val) / this.settings.interval.val));

						ct.stroke();
						ct.closePath();

						this.internalCount++;
						this.internalCount2++;
					}
				}

			}
		},
		spiral: {
			name: "spiral",
			settings:  {
				margin: {
					val: 1,
					type: "number"
				},
				lineWidth: {
					val: 1,
					type: "number"
				},
				strokeStyle: {
					val: "rgba(0,0,250,0.5)",
					type: "color"
				},
				angle: {
					val: 0,
					type: "angle"
				},
				offset: {
					val: 15,
					type: "number"
				},
			},
			onclick: function(e) {
				let id = e.target.id.split("brushDiv")[1]
				selectedBrush = brushes[id];


			},
			internalCount: 1,
			internalCount2: 0,
			draw: function(ct) {
				generatePointsStatic(ct.canvas, this.settings.margin.val);
				if (pointsToDraw.length == 0) {
					this.internalCount = 1;
				}
				//ct.clearRect(0,0,fdW,fdH);
				ct.lineWidth = this.settings.lineWidth.val;
				ct.strokeStyle = this.settings.strokeStyle.val;
				if (pointsToDraw.length > this.internalCount + 1) {
					/*ct.lineTo(pointsToDraw[1][0],pointsToDraw[1][1]);*/
					for (let i = this.internalCount; i < pointsToDraw.length; i++) {
						let dis = Distance(pointsToDraw[this.internalCount - 1][0], pointsToDraw[this.internalCount - 1][1], pointsToDraw[this.internalCount][0], pointsToDraw[this.internalCount][1])
						ct.beginPath();
						ct.moveTo(pointsToDraw[this.internalCount][0], pointsToDraw[this.internalCount][1]);
						ct.lineTo(pointsToDraw[this.internalCount][0] + this.settings.offset.val * (this.internalCount2 % 50) / 50 * Math.cos(this.settings.angle.val + Math.PI * 2 * (this.internalCount2 % 50) / 50), pointsToDraw[this.internalCount][1] + this.settings.offset.val * Math.sin(this.settings.angle.val + Math.PI * 2 * (this.internalCount2 % 50) / 50));

						ct.stroke();
						ct.closePath();

						this.internalCount++;
						this.internalCount2 += dis;
					}
				}

			}
		},
		points: {
			name: "points",
			settings:  {
				margin: {
					val: 1,
					type: "number"
				},
				fillStyle: {
					val: "rgba(0,0,0,0.5)",
					type: "color"
				},
				radius: {
					val: 1,
					type: "number"
				},
				offset: {
					val: 4,
					type: "number"
				},
				xAm: {
					val: 8,
					type: "number"
				},
				yAm: {
					val: 2,
					type: "number"
				},
				/*angle: {val:Math.PI*0.25,type:"angle"},*/
			},
			onclick: function(e) {
				let id = e.target.id.split("brushDiv")[1]
				selectedBrush = brushes[id];


			},
			internalCount: 1,
			internalCount2: 0,
			draw: function(ct) {
				generatePointsStatic(ct.canvas, this.settings.margin.val);
				if (pointsToDraw.length == 0) {
					this.internalCount = 1;
				}
				ct.fillStyle = this.settings.fillStyle.val;
				if (pointsToDraw.length > this.internalCount + 1) {
					for (let i = this.internalCount; i < pointsToDraw.length; i++) {
						ct.beginPath();
						let x = pointsToDraw[this.internalCount][0];
						let y = pointsToDraw[this.internalCount][1];
						for (let r = 0; r < this.settings.xAm.val; r++) {
							for (let c = 0; c < this.settings.yAm.val; c++) {

								ct.moveTo(x + (r - this.settings.xAm.val / 2) * this.settings.offset.val, y + (c - this.settings.yAm.val / 2) * this.settings.offset.val);
								ct.arc(x + (r - this.settings.xAm.val / 2) * this.settings.offset.val, y + (c - this.settings.yAm.val / 2) * this.settings.offset.val, this.settings.radius.val, 0, Math.PI * 2, 0);

							}
						}



						ct.fill();
						ct.closePath();

						this.internalCount++;
						this.internalCount2++;
					}
				}

			}
		},
		helix: {
			name: "helix",
			settings:  {
				margin: {
					val: 7,
					type: "number"
				},
				lineWidth: 1,
				strokeStyle: {
					val: "rgba(0,0,250,0.5)",
					type: "color"
				},
				interval: {
					val: 15,
					type: "number"
				},
				connect: {
					val: true,
					type: "bool"
				},
			},
			onclick: function(e) {
				let id = e.target.id.split("brushDiv")[1]
				selectedBrush = brushes[id];


			},
			internalCount: 1,
			internalCount2: 0,
			draw: function(ct) {
				generatePointsStatic(ct.canvas, this.settings.margin.val);
				if (pointsToDraw.length == 0) {
					this.internalCount = 1;
					this.internalCount2 = 0;
				}
				//ct.clearRect(0,0,fdW,fdH);
				ct.lineWidth = this.settings.lineWidth.val;
				ct.strokeStyle = this.settings.strokeStyle.val;
				if (pointsToDraw.length > this.internalCount + 1) {
					/*ct.lineTo(pointsToDraw[1][0],pointsToDraw[1][1]);*/
					for (let i = this.internalCount; i < pointsToDraw.length; i++) {
						ct.beginPath();
						let offset = (this.settings.interval.val / 2 - (this.internalCount2 % this.settings.interval.val));
						ct.moveTo(pointsToDraw[this.internalCount - 1][0] - offset, pointsToDraw[this.internalCount - 1][1] - offset);
						ct.lineTo(pointsToDraw[this.internalCount][0] - offset, pointsToDraw[this.internalCount][1] - offset);

						if (this.settings.connect.val) {
							ct.moveTo(pointsToDraw[this.internalCount - 1][0] - offset, pointsToDraw[this.internalCount - 1][1] - offset);
							ct.lineTo(pointsToDraw[this.internalCount][0] + offset, pointsToDraw[this.internalCount][1] + offset);
						}



						ct.moveTo(pointsToDraw[this.internalCount - 1][0] + offset, pointsToDraw[this.internalCount - 1][1] + offset);
						ct.lineTo(pointsToDraw[this.internalCount][0] + offset, pointsToDraw[this.internalCount][1] + offset);

						ct.stroke();
						ct.closePath();

						this.internalCount++;
						this.internalCount2++;
					}
				}

			}
		},
		circleLines: {
			name: "circleLines",
			settings:  {
				margin: {
					val: 5,
					type: "number"
				},
				lineWidth: {
					val: 5,
					type: "number"
				},
				strokeStyle: {
					val: "rgba(0,0,0,1)",
					type: "color"
				},
				randomColor: {
					val: "false",
					type: "bool"
				},
				interval: {
					val: 50,
					type: "number"
				},
			},
			onclick: function(e) {
				let id = e.target.id.split("brushDiv")[1]
				selectedBrush = brushes[id];


			},
			internalCount: 1,
			internalCount2: 0,
			draw: function(ct) {
				generatePointsStatic(ct.canvas, this.settings.margin.val);
				if (pointsToDraw.length == 0) {
					this.internalCount = 1;
					this.internalCount2 = 0;
				}
				//ct.clearRect(0,0,fdW,fdH);
				ct.lineWidth = this.settings.lineWidth.val;
				if (this.settings.randomColor.val) {

					ct.strokeStyle = "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ",0.5)"; //this.settings.fuzzStyle;
				} else {
					ct.strokeStyle = this.settings.strokeStyle.val;
				}
				ct.beginPath();
				if (pointsToDraw.length > this.internalCount + 1) {
					for (let i = this.internalCount; i < pointsToDraw.length; i++) {
						let offset = (this.internalCount2 % this.settings.interval.val / 4) - this.settings.interval.val / 2;
						let ang = angle(pointsToDraw[0][0], pointsToDraw[0][1], pointsToDraw[this.internalCount - 1][0], pointsToDraw[this.internalCount - 1][1]);
						let dis = Distance(pointsToDraw[0][0], pointsToDraw[0][1], pointsToDraw[this.internalCount - 1][0], pointsToDraw[this.internalCount - 1][1]);
						let dis2 = Distance(pointsToDraw[this.internalCount - 1][0], pointsToDraw[this.internalCount - 1][1], pointsToDraw[this.internalCount][0], pointsToDraw[this.internalCount][1]);
						ct.moveTo(pointsToDraw[0][0], pointsToDraw[0][1]);
						ct.lineTo(pointsToDraw[0][0] + Math.cos(ang) * offset, pointsToDraw[0][1] + Math.sin(ang) * offset);
						//ct.lineTo(pointsToDraw[this.internalCount-1][0],pointsToDraw[this.internalCount-1][1]);

						/*if(this.settings.connect) {
							ct.moveTo(pointsToDraw[this.internalCount-1][0]-offset,pointsToDraw[this.internalCount-1][1]-offset);
							ct.lineTo(pointsToDraw[this.internalCount][0]+offset,pointsToDraw[this.internalCount][1]+offset);
						}
							
							

						ct.moveTo(pointsToDraw[this.internalCount-1][0]+offset,pointsToDraw[this.internalCount-1][1]+offset);
						ct.lineTo(pointsToDraw[this.internalCount][0]+offset,pointsToDraw[this.internalCount][1]+offset);*/

						ct.stroke();
						ct.closePath();

						this.internalCount++;
						this.internalCount2 += dis2;
					}
				}

			}
		},
		tubedisconnected: {
			name: "tubedisconnected",
			settings:  {
				margin: {
					val: 10,
					type: "number"
				},
				lineWidth: {
					val: 10,
					type: "number"
				},
				strokeStyle1: {
					val: "rgba(0,255,0,0.5)",
					type: "color"
				},
				strokeStyle2: {
					val: "rgba(0,0,255,0.5)",
					type: "color"
				},
				angle: {
					val: 0,
					type: "angle"
				},
				offset: {
					val: 15,
					type: "number"
				},
				interval: {
					val: 15,
					type: "number"
				},
				connect: {
					val: true,
					type: "bool"
				},
			},
			onclick: function(e) {
				let id = e.target.id.split("brushDiv")[1]
				selectedBrush = brushes[id];


			},
			internalCount: 1,
			internalCount2: 0,
			draw: function(ct) {
				generatePointsStatic(ct.canvas, this.settings.margin.val);
				if (pointsToDraw.length == 0) {
					this.internalCount = 1;
					this.internalCount2 = 0;
				}
				//ct.clearRect(0,0,fdW,fdH);
				ct.lineWidth = this.settings.lineWidth.val;
				if (pointsToDraw.length > this.internalCount + 1) {
					/*ct.lineTo(pointsToDraw[1][0],pointsToDraw[1][1]);*/
					for (let i = this.internalCount; i < pointsToDraw.length; i++) {
						let ang = this.settings.angle.val + angle(pointsToDraw[this.internalCount - 1][0], pointsToDraw[this.internalCount - 1][1], pointsToDraw[this.internalCount][0], pointsToDraw[this.internalCount][1]);
						///let rgr = ct.createRadialGradient(pointsToDraw[this.internalCount-1][0],pointsToDraw[this.internalCount-1][1],0,pointsToDraw[this.internalCount-1][0],pointsToDraw[this.internalCount-1][1],)
						let lgr = ct.createLinearGradient(pointsToDraw[this.internalCount - 1][0] + this.settings.offset.val * Math.cos(ang + Math.PI * 0.5), pointsToDraw[this.internalCount - 1][1] + this.settings.offset.val * Math.sin(ang + Math.PI * 0.5), pointsToDraw[this.internalCount - 1][0] - this.settings.offset.val * Math.cos(ang + Math.PI * 0.5), pointsToDraw[this.internalCount - 1][1] - this.settings.offset.val * Math.sin(ang + Math.PI * 0.5))
						lgr.addColorStop(0, this.settings.strokeStyle1.val);
						lgr.addColorStop(1, this.settings.strokeStyle2.val);
						ct.fillStyle = lgr; //this.settings.fuzzStyle;
						ct.beginPath();
						let offset = this.settings.offset.val; //(this.settings.interval/2-(this.internalCount2%this.settings.interval));
						let x1 = pointsToDraw[this.internalCount - 1][0];
						let y1 = pointsToDraw[this.internalCount - 1][1];
						let x2 = pointsToDraw[this.internalCount][0];
						let y2 = pointsToDraw[this.internalCount][1];
						let p1 = {
							x: x1 + offset * Math.cos(ang - 0.5 * Math.PI),
							y: y1 + offset * Math.sin(ang - 0.5 * Math.PI)
						};
						let p2 = {
							x: x1 - offset * Math.cos(ang - 0.5 * Math.PI),
							y: y1 - offset * Math.sin(ang - 0.5 * Math.PI)
						};
						let p3 = {
							x: x2 + offset * Math.cos(ang - 0.5 * Math.PI),
							y: y2 + offset * Math.sin(ang - 0.5 * Math.PI)
						};
						let p4 = {
							x: x2 - offset * Math.cos(ang - 0.5 * Math.PI),
							y: y2 - offset * Math.sin(ang - 0.5 * Math.PI)
						};


						ct.moveTo(p1.x, p1.y);
						ct.quadraticCurveTo(p3.x, p3.y, (p1.x + p3.x) / 2, (p1.y + p3.y) / 2);
						ct.lineTo(p4.x, p4.y);
						ct.quadraticCurveTo(p2.x, p2.y, (p2.x + p4.x) / 2, (p2.y + p4.y) / 2);

						ct.closePath();
						ct.fill();

						this.internalCount++;
						this.internalCount2++;
					}
				}

			}
		},
		jaggedTube: {
			name: "jaggedTube",
			settings:  {
				margin: {
					val: 5,
					type: "number"
				},
				lineWidth: {
					val: 10,
					type: "number"
				},
				strokeStyle1: {
					val: "rgba(0,255,0,0.05)",
					type: "color"
				},
				strokeStyle2: {
					val: "rgba(0,0,255,0.05)",
					type: "color"
				},
				angle: {
					val: Math.PI * 0.25,
					type: "angle"
				},
				offset: {
					val: 15,
					type: "number"
				},
				interval: {
					val: 15,
					type: "number"
				},
				connect: {
					val: true,
					type: "bool"
				},
				jaggedness: {
					val: 10,
					type: "number"
				},
			},
			onclick: function(e) {
				let id = e.target.id.split("brushDiv")[1]
				selectedBrush = brushes[id];


			},
			internalCount: 1,
			internalCount2: 0,
			draw: function(ct) {
				generatePointsStatic(ct.canvas, this.settings.margin.val);
				if (pointsToDraw.length == 0) {
					this.internalCount = 1;
					this.internalCount2 = 0;
				}
				//ct.clearRect(0,0,fdW,fdH);
				ct.lineWidth = this.settings.lineWidth.val;
				if (pointsToDraw.length > this.internalCount + 1) {
					/*ct.lineTo(pointsToDraw[1][0],pointsToDraw[1][1]);*/
					for (let i = this.internalCount; i < pointsToDraw.length; i++) {
						let ang = angle(pointsToDraw[this.internalCount - 1][0], pointsToDraw[this.internalCount - 1][1], pointsToDraw[this.internalCount][0], pointsToDraw[this.internalCount][1]);
						let dis = Distance(pointsToDraw[this.internalCount - 1][0], pointsToDraw[this.internalCount - 1][1], pointsToDraw[this.internalCount][0], pointsToDraw[this.internalCount][1]);
						///let rgr = ct.createRadialGradient(pointsToDraw[this.internalCount-1][0],pointsToDraw[this.internalCount-1][1],0,pointsToDraw[this.internalCount-1][0],pointsToDraw[this.internalCount-1][1],)
						let lgr = ct.createLinearGradient(pointsToDraw[this.internalCount - 1][0] + this.settings.offset.val * Math.cos(ang + Math.PI * 0.5), pointsToDraw[this.internalCount - 1][1] + this.settings.offset.val * Math.sin(ang + Math.PI * 0.5), pointsToDraw[this.internalCount - 1][0] - this.settings.offset.val * Math.cos(ang + Math.PI * 0.5), pointsToDraw[this.internalCount - 1][1] - this.settings.offset.val * Math.sin(ang + Math.PI * 0.5))
						lgr.addColorStop(0, this.settings.strokeStyle1.val);
						lgr.addColorStop(1, this.settings.strokeStyle2.val);
						ct.fillStyle = lgr; //this.settings.fuzzStyle;
						ct.beginPath();
						let offset = this.settings.offset.val; //(this.settings.interval/2-(this.internalCount2%this.settings.interval));
						let x1 = pointsToDraw[this.internalCount - 1][0];
						let y1 = pointsToDraw[this.internalCount - 1][1];
						let x2 = pointsToDraw[this.internalCount - 1][0] + Math.cos(ang) * dis * this.settings.jaggedness.val;
						let y2 = pointsToDraw[this.internalCount - 1][1] + Math.sin(ang) * dis * this.settings.jaggedness.val;
						let p1 = {
							x: x1 + offset * Math.cos(ang + 0.5 * Math.PI),
							y: y1 + offset * Math.sin(ang + 0.5 * Math.PI)
						};
						let p2 = {
							x: x1 - offset * Math.cos(ang + 0.5 * Math.PI),
							y: y1 - offset * Math.sin(ang + 0.5 * Math.PI)
						};
						let p3 = {
							x: x2 + offset * Math.cos(ang + 0.5 * Math.PI),
							y: y2 + offset * Math.sin(ang + 0.5 * Math.PI)
						};
						let p4 = {
							x: x2 - offset * Math.cos(ang + 0.5 * Math.PI),
							y: y2 - offset * Math.sin(ang + 0.5 * Math.PI)
						};


						ct.moveTo(p1.x, p1.y);
						ct.quadraticCurveTo(p3.x, p3.y, (p1.x + p3.x) / 2, (p1.y + p3.y) / 2);
						ct.lineTo(p4.x, p4.y);
						ct.quadraticCurveTo(p2.x, p2.y, (p2.x + p4.x) / 2, (p2.y + p4.y) / 2);

						ct.closePath();
						ct.fill();

						this.internalCount++;
						this.internalCount2++;
					}
				}

			}
		},

		connectedDots: {
			name: "connectedDots",
			settings:  {
				margin: {
					val: 5,
					type: "number"
				},
				lineWidth: {
					val: 1,
					type: "number"
				},
				fillStyle: {
					val: "rgba(0,0,250,0.5)",
					type: "color"
				},
				connectThreshold: {
					val: 50,
					type: "number"
				},
				connectLineWidth: {
					val: 1,
					type: "number"
				},
				connectStyle: {
					val: "rgba(250,0,50,0.05)",
					type: "color"
				},
				connectMax: {
					val: 100,
					type: "number"
				},
			},
			internalCount: 1,
			onclick: function(e) {
				let id = e.target.id.split("brushDiv")[1]
				selectedBrush = brushes[id];


			},
			draw: function(ct) {
				generatePointsStatic(ct.canvas, this.settings.margin.val);
				//ct.clearRect(0,0,fdW,fdH);
				if (pointsToDraw.length == 0) {
					this.internalCount = 1;
				}

				if (pointsToDraw.length > this.internalCount + 1) {
					let newPoints = [];
					ct.beginPath();
					ct.fillStyle = this.settings.fillStyle.val;
					for (let i = this.internalCount + 1; i < pointsToDraw.length; i++) {
						ct.moveTo(pointsToDraw[i][0], pointsToDraw[i][1]);
						ct.arc(pointsToDraw[i][0], pointsToDraw[i][1], this.settings.lineWidth.val, 0, Math.PI * 2, 0);
						newPoints.push([pointsToDraw[i][0], pointsToDraw[i][1]]);
						//ct.quadraticCurveTo((pointsToDraw[i-1][0]+pointsToDraw[i][0])/2,(pointsToDraw[i-1][1]+pointsToDraw[i][1])/2,pointsToDraw[i][0],pointsToDraw[i][1]);
						this.internalCount++;

					}
					ct.fill();
					ct.closePath();



					ct.lineWidth = this.settings.connectLineWidth.val;
					ct.strokeStyle = this.settings.connectStyle.val;
					ct.beginPath();
					//ct.moveTo(pointsToDraw[this.internalCount-1][0],pointsToDraw[this.internalCount-1][1]);
					loop1:
						for (let p = 0; p < newPoints.length; p++) {
							let innerCount = 0;
							loop2:
								for (let p2 = 0; p2 < pointsToDraw.length; p2++) {

									let dis2 = Distance(newPoints[p][0], newPoints[p][1], pointsToDraw[p2][0], pointsToDraw[p2][1]);
									if (dis2 < this.settings.connectThreshold.val) {
										let ang2 = angle(newPoints[p][0], newPoints[p][1], pointsToDraw[p2][0], pointsToDraw[p2][1]);
										ct.moveTo(
											newPoints[p][0] /*+dis2*this.settings.margin.val*Math.cos(ang2)*/ ,
											newPoints[p][1] /*+dis2*this.settings.margin.val*Math.sin(ang2)*/ );
										ct.lineTo(
											pointsToDraw[p2][0] /*+dis2*this.settings.margin.val*Math.cos(ang2)*/ ,
											pointsToDraw[p2][1] /*+dis2*this.settings.margin.val*Math.sin(ang2)*/ );
										/*ct.lineTo(
											newPoints[p][0]+dis2*(1-this.settings.margin.val)*Math.cos(ang2),
											newPoints[p][1]+dis2*(1-this.settings.margin.val)*Math.sin(ang2));*/
										innerCount++;
										if (innerCount > this.settings.connectMax.val) {
											break loop2;
										}
									}
								}
						}
					ct.stroke();
					ct.closePath();
				}
				//pointsToDraw.splice(0,pointsToDraw.length-2);
			}
		},
		linesFromPoint: {
			name: "linesFromPoint",
			settings:  {
				margin: {
					val: 5,
					type: "number"
				},
				lineWidth: {
					val: 1,
					type: "number"
				},
				fillStyle: {
					val: "rgba(0,0,250,0.5)",
					type: "color"
				},
				connectThreshold: {
					val: 50,
					type: "number"
				},
				connectLineWidth: {
					val: 1,
					type: "number"
				},
				connectStyle: {
					val: "rgba(250,0,50,0.5)",
					type: "color"
				},
				connectMax: {
					val: 100,
					type: "number"
				},
			},
			internalCount: 1,
			onclick: function(e) {
				let id = e.target.id.split("brushDiv")[1]
				selectedBrush = brushes[id];


			},
			draw: function(ct) {
				generatePointsStatic(ct.canvas, this.settings.margin.val);
				//ct.clearRect(0,0,fdW,fdH);
				if (pointsToDraw.length == 0) {
					this.internalCount = 1;
				}

				if (pointsToDraw.length > this.internalCount + 1) {
					let newPoints = [];
					ct.beginPath();
					ct.fillStyle = this.settings.fillStyle.val;
					for (let i = this.internalCount + 1; i < pointsToDraw.length; i++) {
						ct.moveTo(pointsToDraw[i][0], pointsToDraw[i][1]);
						ct.arc(pointsToDraw[i][0], pointsToDraw[i][1], this.settings.lineWidth.val, 0, Math.PI * 2, 0);
						newPoints.push([pointsToDraw[i][0], pointsToDraw[i][1]]);
						//ct.quadraticCurveTo((pointsToDraw[i-1][0]+pointsToDraw[i][0])/2,(pointsToDraw[i-1][1]+pointsToDraw[i][1])/2,pointsToDraw[i][0],pointsToDraw[i][1]);
						this.internalCount++;

					}
					ct.fill();
					ct.closePath();



					ct.lineWidth = this.settings.connectLineWidth.val;
					ct.strokeStyle = this.settings.connectStyle.val;
					ct.beginPath();
					//ct.moveTo(pointsToDraw[this.internalCount-1][0],pointsToDraw[this.internalCount-1][1]);
					loop1:
						for (let p = 0; p < newPoints.length; p++) {
							let innerCount = 0;
							loop2:
								for (let p2 = 0; p2 < pointsToDraw.length; p2++) {

									let dis2 = Distance(newPoints[p][0], newPoints[p][1], pointsToDraw[p2][0], pointsToDraw[p2][1]);
									if (dis2 < this.settings.connectThreshold.val) {
										let ang2 = angle(newPoints[p][0], newPoints[p][1], pointsToDraw[p2][0], pointsToDraw[p2][1]);
										ct.moveTo(
											newPoints[p][0] /*+dis2*this.settings.margin.val*Math.cos(ang2)*/ ,
											newPoints[p][1] /*+dis2*this.settings.margin.val*Math.sin(ang2)*/ );
										ct.lineTo(
											pointsToDraw[p][0] /*+dis2*this.settings.margin.val*Math.cos(ang2)*/ ,
											pointsToDraw[p][1] /*+dis2*this.settings.margin.val*Math.sin(ang2)*/ );
										/*ct.lineTo(
											newPoints[p][0]+dis2*(1-this.settings.margin.val)*Math.cos(ang2),
											newPoints[p][1]+dis2*(1-this.settings.margin.val)*Math.sin(ang2));*/
										innerCount++;
										if (innerCount > this.settings.connectMax.val) {
											break loop2;
										}
									}
								}
						}
					ct.stroke();
					ct.closePath();
				}
				//pointsToDraw.splice(0,pointsToDraw.length-2);
			}
		},
		iDontEvenKnow: {
			name: "iDontEvenKnow",
			settings:  {
				margin: {
					val: 5,
					type: "number"
				},
				lineWidth: {
					val: 1,
					type: "number"
				},
				fillStyle: {
					val: "rgba(0,0,250,0.5)",
					type: "color"
				},
				connectThreshold: {
					val: 50,
					type: "number"
				},
				connectLineWidth: {
					val: 1,
					type: "number"
				},
				connectStyle: {
					val: "rgba(250,0,50,0.5)",
					type: "color"
				},
				connectMax: {
					val: 100,
					type: "number"
				},
			},
			internalCount: 1,
			onclick: function(e) {
				let id = e.target.id.split("brushDiv")[1]
				selectedBrush = brushes[id];


			},
			draw: function(ct) {
				generatePointsStatic(ct.canvas, this.settings.margin.val);
				//ct.clearRect(0,0,fdW,fdH);
				if (pointsToDraw.length == 0) {
					this.internalCount = 1;
				}

				if (pointsToDraw.length > this.internalCount + 1) {
					let newPoints = [];
					ct.beginPath();
					ct.fillStyle = this.settings.fillStyle.val;
					for (let i = this.internalCount + 1; i < pointsToDraw.length; i++) {
						ct.moveTo(pointsToDraw[i][0], pointsToDraw[i][1]);
						ct.arc(pointsToDraw[i][0], pointsToDraw[i][1], this.settings.lineWidth.val, 0, Math.PI * 2, 0);
						newPoints.push([pointsToDraw[i][0], pointsToDraw[i][1]]);
						//ct.quadraticCurveTo((pointsToDraw[i-1][0]+pointsToDraw[i][0])/2,(pointsToDraw[i-1][1]+pointsToDraw[i][1])/2,pointsToDraw[i][0],pointsToDraw[i][1]);
						this.internalCount++;

					}
					ct.fill();
					ct.closePath();



					ct.lineWidth = this.settings.connectLineWidth.val;
					ct.strokeStyle = this.settings.connectStyle.val;
					ct.beginPath();
					ct.moveTo(pointsToDraw[this.internalCount - 1][0], pointsToDraw[this.internalCount - 1][1]);
					loop1:
						for (let p = 0; p < newPoints.length; p++) {
							let innerCount = 0;
							loop2:
								for (let p2 = 0; p2 < pointsToDraw.length; p2++) {

									let dis2 = Distance(newPoints[p][0], newPoints[p][1], pointsToDraw[p2][0], pointsToDraw[p2][1]);
									if (dis2 < this.settings.connectThreshold.val) {
										let ang2 = angle(newPoints[p][0], newPoints[p][1], pointsToDraw[p2][0], pointsToDraw[p2][1]);
										/*ct.moveTo(
											newPoints[p][0]+dis2*this.settings.margin.val*Math.cos(ang2),
											newPoints[p][1]+dis2*this.settings.margin.val*Math.sin(ang2));*/
										ct.lineTo(
											newPoints[p][0] + dis2 * (1 - this.settings.margin.val) * Math.cos(ang2),
											newPoints[p][1] + dis2 * (1 - this.settings.margin.val) * Math.sin(ang2));
										innerCount++;
										if (innerCount > this.settings.connectMax.val) {
											break loop2;
										}
									}
								}
						}
					ct.stroke();
					ct.closePath();
				}
				//pointsToDraw.splice(0,pointsToDraw.length-2);
			}
		},
		/*fill: {
			name: "fill",
			settings:  {

				fillStyle: {
					val: "rgba(0,0,0,1)",
					type: "color"
				},
				tolerance: {
					val: 0.2,
					type: "angle"
				},
			},
			internalCount: 1,
			onclick: function(e) {
				let id = e.target.id.split("brushDiv")[1]
				selectedBrush = brushes[id];


			},
			draw: function(ct) {
				generateOnePoint(ct.canvas, 1);
				if (pointsToDraw.length > 0) {
					let tol = this.settings.tolerance.val / Math.PI * 2;
					let x = pointsToDraw[0][0];
					let y = pointsToDraw[0][1];
					let col = getColorCanvas(x, y, ct.canvas);
					let newCol = [150,50,255,1];
					let w = ct.canvas.width;
					let h = ct.canvas.height;
					let dt = ct.getImageData(0, 0, w, h)
					//myFill(x,y,col,newCol,dt,ct,tol);

					runKernels(w,h);
					//array = [];
					console.log(col,newCol);
					let array = [];
					

					array = calcSet(dt.data, col, w, tol);

					console.log(array,w,h);

					fill(array,x, y, tol, dt, col, newCol,  ct.canvas.width,ct.canvas.height,ct);
					
					
					toFillArray=[];

					pointsToDraw = [];
				}


			}
		},*/
		eraser: {
			name: "eraser",
			settings:  {

				radius: {
					val: 100,
					type: "number"
				},
			},
			internalCount: 1,
			onclick: function(e) {
				let id = e.target.id.split("brushDiv")[1]
				selectedBrush = brushes[id];


			},
			draw: function(ct) {
				generatePointsStatic(ct.canvas, 1);
				if (pointsToDraw.length > 0) {

					for (let i = 0; i < pointsToDraw.length; i++) {
						ct.save();
						ct.beginPath();
						ct.arc(pointsToDraw[i][0], pointsToDraw[i][1], this.settings.radius.val, 0, Math.PI * 2, 0);
						ct.clip();
						ct.clearRect(pointsToDraw[i][0] - this.settings.radius.val, pointsToDraw[i][1] - this.settings.radius.val, this.settings.radius.val * 2, this.settings.radius.val * 2);
						ct.closePath();
						ct.restore();

					}
					pointsToDraw = [];
				}


			}
		}
	}

	function colorDiff(dt1, ind1, dt2, ind2) {
		let totDif = 0;
		totDif += Math.abs(dt1[ind1] - dt2[ind2]) / 255;
		totDif += Math.abs(dt1[ind1 + 1] - dt2[ind2 + 1]) / 255;
		totDif += Math.abs(dt1[ind1 + 2] - dt2[ind2 + 2]) / 255;
		//totDif += dt1[ind1]-dt2[ind2];
		return totDif / 3;
	}

	function colorsMatch(tol, dt1, ind1, dt2, ind2) {
		let totDif = 0;
		totDif += Math.abs(dt1[ind1] - dt2[ind2]) / 255;
		totDif += Math.abs(dt1[ind1 + 1] - dt2[ind2 + 1]) / 255;
		totDif += Math.abs(dt1[ind1 + 2] - dt2[ind2 + 2]) / 255;
		//totDif += dt1[ind1]-dt2[ind2];
		if (totDif / 3 < tol) {
			return true;
		} else {
			return false;
		}
	}


	function runKernels(w, h) {

		let t = performance.now();


		if (!gpu) {
			gpu = new GPU({
				/*canvas,
				webGl: gl*/
			})
		}


		calcSet = gpu.createKernel(function(dt1, d2, w, tol) {
			let totDif = 0;
			totDif += Math.abs(dt1[this.thread.x * 4 + this.thread.y * 4 * w] - d2[0]) / 255;
			totDif += Math.abs(dt1[this.thread.x * 4 + this.thread.y * 4 * w + 1] - d2[1]) / 255;
			totDif += Math.abs(dt1[this.thread.x * 4 + this.thread.y * 4 * w + 2] - d2[2]) / 255;
			totDif += Math.abs(dt1[this.thread.x * 4 + this.thread.y * 4 * w + 3] - d2[3] * 255) / 255;
			if (totDif / 4 < tol) {
				return 0
			} else {
				return 1
			}


		}).setOutput([h, w]);



		let t1 = performance.now();
		lastTime = t1 - t;
		ready = true;

	}
	var toFillArray = [];

	function myFill(x, y, col, newCol, dt, ct, tol, array) {
		if (!delay) {
			delay = true;
			console.log("Filling at (" + x + "," + y + ")");

			nMinX = 0;
			nMaxX = fdW;
			nMinY = 0;
			nMaxY = fdH;

			LineFill_3(x, x, y, newCol, col, tol, ct, array);



			window.setTimeout(function() {
				delay = false;
			}, 1000)
		}
	}

	function LineFill_3(x1, x2, y, newCol, col, tol, ct, array) {
		let xL, xR;
		if (y < nMinY || nMaxY < y)
			return;
		for (xL = x1; xL >= nMinX; --xL) { // scan left
			if (!array[y][xL])
				break;
			ct.fillStyle = "rgba(" + newCol[0] + "," + newCol[1] + "," + newCol[2] + "," + 1 + ")"
			ct.fillRect(xL, y, 1, 1);
			//SetPixel(xL,y,newCol);
		}
		if (xL < x1) {
			LineFill_3(xL, x1, y - 1, newCol, col, tol, ct, array); // fill child
			LineFill_3(xL, x1, y + 1, newCol, col, tol, ct, array); // fill child
			x1++;
		}
		for (xR = x2; xR <= nMaxX; ++xR) { // scan right
			if (!array[y][xR]) {
				break;
			}
			//SetPixel(xR,y,newCol);
			ct.fillStyle = "rgba(" + newCol[0] + "," + newCol[1] + "," + newCol[2] + "," + 1 + ")"
			ct.fillRect(xR, y, 1, 1);
		}
		if (xR > x2) {
			LineFill_3(x2, xR, y - 1, newCol, col, tol, ct, array); // fill child
			LineFill_3(x2, xR, y + 1, newCol, col, tol, ct, array); // fill child
			--x2;
		}
		for (xR = x1; xR <= x2 && xR <= nMaxX; ++xR) { // scan betweens
			if (array[y][xR]) {
				//SetPixel(xR,y,newCol);
				ct.fillStyle = "rgba(" + newCol[0] + "," + newCol[1] + "," + newCol[2] + "," + 1 + ")"
				ct.fillRect(xR, y, 1, 1);
			} else {
				if (x1 < xR) {
					// fill child
					LineFill_3(x1, xR - 1, y - 1, newCol, col, tol, ct, array);
					// fill child
					LineFill_3(x1, xR - 1, y + 1, newCol, col, tol, ct, array);
					x1 = xR;
				}
				// Note: This function still works if this step is removed.
				for (; xR <= x2 && xR <= nMaxX; ++xR) { // skip over border
					if (array[y][xR]) {
						x1 = xR - 1;
						xR--;
						break;
					}
				}
			}
		}
	}

	function fill(array, x, y, tol, dt, col, newCol, wd, ht, ct) {
		while (true) {


			let ox = x;
			let oy = y;
			ct.fillStyle = "rgba(" + newCol[0] + "," + newCol[1] + "," + newCol[2] + "," + 1 + ")"
			ct.fillRect(x, y, 1, 1);
			while (y != 0 && !array[y - 1][x]) {
				y--;
				ct.fillStyle = "rgba(" + newCol[0] + "," + newCol[1] + "," + newCol[2] + "," + 1 + ")"
				ct.fillRect(x, y, 1, 1);
			}
			while (x != 0 && !array[y][x - 1]) {
				x--;
				ct.fillStyle = "rgba(" + newCol[0] + "," + newCol[1] + "," + newCol[2] + "," + 1 + ")"
				ct.fillRect(x, y, 1, 1);
			}
			if (x == ox && y == oy) {
				break
			}
		}
		fillCore(array, col, newCol, tol, dt, x, y, wd, ht, ct);

	}

	function fillCore(array, col, newCol, tol, dt, x, y, wd, ht, ct) {


		let lastRowLength = 0;

		let rowLength = 0
		let sx = x;

		while (true) {
			y++;
			if (lastRowLength == 0 && y + 2 >= ht) {
				return;
			}

			if (lastRowLength != 0 && !array[y][x]) {

				while (!array[y][x + 1]) {

					x++;
					ct.fillStyle = "rgba(" + newCol[0] + "," + newCol[1] + "," + newCol[2] + "," + 1 + ")"
					ct.fillRect(x, y, 1, 1);
					lastRowLength--;
					if (lastRowLength == 0) {
						return;
					}
				}
				sx = x;
			} else {
				for (let i = 0; x != 0 && !array[y][x - 1]; rowLength++, lastRowLength++) {
					x--;
					array[y][x] = 1;
					ct.fillStyle = "rgba(" + newCol[0] + "," + newCol[1] + "," + newCol[2] + "," + 1 + ")"
					ct.fillRect(x, y, 1, 1);
					//array[y, --x] = true; // to avoid scanning the cells twice, we'll fill them and update rowLength here
					// if there's something above the new starting point, handle that recursively. this deals with cases
					// like |* **| when we begin filling from (2,0), move down to (2,1), and then move left to (0,1).
					// the  |****| main scan assumes the portion of the previous row from x to x+lastRowLength has already
					// been filled. adjusting x and lastRowLength breaks that assumption in this case, so we must fix it
					if (y != 0 && !array[y - 1][x]) {
						fill(array, x, y - 1, tol, dt, col, newCol, wd, ht, ct)
						//_MyFill(array, x, y - 1, width, height); // use _Fill since there may be more up and left
					}
				}
			}

			// now at this point we can begin to scan the current row in the rectangular block. the span of the previous
			// row from x (inclusive) to x+lastRowLength (exclusive) has already been filled, so we don't need to
			// check it. so scan across to the right in the current row
			for (let i = 0; sx < width && !array[y][sx]; rowLength++, sx++) {
				//array[y, sx] = true;
				array[y][sx] = 1;
				ct.fillStyle = "rgba(" + newCol[0] + "," + newCol[1] + "," + newCol[2] + "," + 1 + ")"
				ct.fillRect(x, y, 1, 1);
			}
			// now we've scanned this row. if the block is rectangular, then the previous row has already been scanned,
			// so we don't need to look upwards and we're going to scan the next row in the next iteration so we don't
			// need to look downwards. however, if the block is not rectangular, we may need to look upwards or rightwards
			// for some portion of the row. if this row was shorter than the last row, we may need to look rightwards near
			// the end, as in the case of |*****|, where the first row is 5 cells long and the second row is 3 cells long.
			// we must look to the right  |*** *| of the single cell at the end of the second row, i.e. at (4,1)
			if (rowLength < lastRowLength) {
				for (let end = x + lastRowLength; sx < end; sx++) // 'end' is the end of the previous row, so scan the current row to
				{ // there. any clear cells would have been connected to the previous
					if (!array[y][sx], col, 0) {
						fillCore(array, col, newCol, tol, dt, sx, y, wd, ht, ct);
						//MyFillCore(array, sx, y, width, height); // row. the cells up and left must be set so use FillCore
					}
				}
			}
			// alternately, if this row is longer than the previous row, as in the case |*** *| then we must look above
			// the end of the row, i.e at (4,0)                                         |*****|
			else if (rowLength > lastRowLength && y != 0) // if this row is longer and we're not already at the top...
			{
				for (let ux = x + lastRowLength; ux + 1 < sx; ux++) // sx is the end of the current row
				{
					if (!array[y - 1][ux]) {
						fill(array, ux, y - 1, tol, dt, col, newCol, wd, ht, ct)
						//_MyFill(array, ux, y - 1, width, height); // since there may be clear cells up and left, use _Fill
					}
				}
			}
			lastRowLength = rowLength; // record the new row length
		}


	}
	var selectedBrush = brushes.standard;

	function generateOnePoint(cnv) {
		if (mouseDown) {
			let rect = cnv.getBoundingClientRect();
			let mx = FDmouseX - rect.x
			let my = FDmouseY - rect.y
			pointsToDraw.push([mx, my])
		}
	}

	function generatePoints(cnv) {
		if (!started) return;

		if (mouseDown) {
			let rect = cnv.getBoundingClientRect();
			let mx = FDmouseX - rect.x
			let my = FDmouseY - rect.y
			if (mx < 0 || mx > rect.width || my < 0 || my > rect.height) {
				FDlastMouseX=FDmouseX;
				FDlastMouseY=FDmouseY;
				return;
			}
			//selectedBrush.mousedown();
			if (Math.abs(FDlastMouseX - mx) + Math.abs(FDlastMouseY - my) > 1) {
				let dis = Distance(mx, my, FDlastMouseX, FDlastMouseY);
				let ang = angle(mx, my, FDlastMouseX, FDlastMouseY);
				pointsToDraw.push([FDlastMouseX, FDlastMouseY]);
				let i = 10;
				/*while (i<dis-20) {
					pointsToDraw.push([lastMouseX+i/2*Math.cos(ang),lastMouseY+i/2*Math.sin(ang)])
					i+=10;
				}*/
				pointsToDraw.push([mx, my]);

				FDlastMouseX = mx;
				FDlastMouseY = my;

			}

		} else if (started) {
			/*if (pointsToDraw.length>1) {
				paths.push(selectedBrush.path);

			}*/
			pointsToDraw = [];
		}
	}
	var paths = [];

	function generatePointsStatic(cnv, marg) {
		if (!started) return;

		if (mouseDown) {
			let rect = cnv.getBoundingClientRect();
			let mx = FDmouseX - rect.x
			let my = FDmouseY - rect.y
			if (mx < 0 || mx > rect.width || my < 0 || my > rect.height) {
				FDlastMouseX=FDmouseX;
				FDlastMouseY=FDmouseY;
				return;
			}
			if (pointsToDraw.length == 0) {
				pointsToDraw.push([mx, my]);
				//	lastMouseX = mx;
				//	lastMouseY = my;
				//	return;
			}
			//selectedBrush.mousedown();
			let dis = Math.sqrt(Math.pow(FDlastMouseX - mx, 2) + Math.pow(FDlastMouseY - my, 2)); //Distance(lastMouseX,lastMouseY,mx,my);
			if (dis > marg) {
				let xDis = (FDlastMouseX - mx);
				let yDis = (FDlastMouseY - my);
				let ang = angle(FDlastMouseX, FDlastMouseY, mx, my);
				//pointsToDraw.push([lastMouseX,lastMouseY]);
				let am = Math.floor(dis / marg);
				let disStep = dis / am;
				for (let i = 1; i < am; i++) {
					pointsToDraw.push([FDlastMouseX + disStep * (i) * Math.cos(ang), FDlastMouseY + disStep * (i) * Math.sin(ang)])
				}
				/*while (dis>20) {
					dis-=10;
					pointsToDraw.push([mx+dis*Math.cos(ang),my+dis*Math.sin(ang)])
						
					}*/
				//let dis = Distance(mx,my,lastMouseX,lastMouseY);
				//let ang = angle(mx,my,lastMouseX,lastMouseY);

				pointsToDraw.push([mx, my]);

				FDlastMouseX = mx;
				FDlastMouseY = my;

			}

		} else if (started) {
			/*if (pointsToDraw.length>1) {
				paths.push(selectedBrush.path);

			}*/
			pointsToDraw = [];
		}

	}

	function getColorCanvas(x, y, cnv) {
		let imgD = cnv.getContext("2d").getImageData(x, y, 1, 1).data;
		return [imgD[0], imgD[1], imgD[2], imgD[3]];
	}

	function generateSVGPath(arr) {
		let str = "M" + arr[0][0] + " " + arr[0][1]
		for (let i = 1; i < arr.length; i++) {
			str += " L" + arr[i][0] + " " + arr[i][1];
		}
		return str;
	}

	function createSVGFromPath(path) {
		let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttributeNS(null, "viewBox", "0 0 " + fdW + " " + fdH);
		svg.setAttributeNS(null, "width", fdW);
		svg.setAttributeNS(null, "height", fdH);
		let el = document.createElementNS("http://www.w3.org/2000/svg", "path");
		el.setAttributeNS(null, "d", path);
		el.setAttributeNS(null, "stroke", "black");
		el.setAttributeNS(null, "fill", "transparent");
		el.setAttributeNS(null, "stroke-dasharray", "5");
		svg.appendChild(el);
		return svg;
	}

	return {
		init: function(el) {
			initFreeDraw(el);
		},
		draw: function() {
			drawFreeDraw();
		},
		setMouseDown: function(val) {
			mouseDown = val;
		}

	}
})()