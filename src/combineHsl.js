
var grafix=require("./graphics.js");

var hFileInput, sFileInput, lFileInput;
var applyBtn;
var resultCanvas;

var wrapModeSel;
var wrapMode=grafix.WrapMode.clamp;

var imgSizeModeSel;
var imgSizeMode=Math.max;

var hImg=new Image();
var sImg=new Image();
var lImg=new Image();

var hCanvas=document.createElement("canvas");
hCanvas.loaded=false;
var sCanvas=document.createElement("canvas");
sCanvas.loaded=false;
var lCanvas=document.createElement("canvas");
lCanvas.loaded=false;

var readFile=function(input, image, canvas){

	if(input.files.length>0){ //check, that the file was selected

		console.log(input.files);

		fr = new FileReader();

		fr.onload = function (e) {
			var target = e.target;
			image.src = target.result;
			image.onload = function () {

				canvas.width = image.naturalWidth;
				canvas.height = image.naturalHeight;
				canvas.loaded = true;
				canvas.getContext("2d").drawImage(image, 0, 0);

				console.log(image.naturalWidth, image.naturalHeight);
				console.log(canvas);
			};
		};
		fr.readAsDataURL(input.files[0]);

	}
};

document.addEventListener("DOMContentLoaded", function(){

	resultCanvas=document.getElementById("resultCanvas");

	applyBtn=document.getElementById("applyBtn");
	applyBtn.onclick=function(){

		if(hCanvas.loaded && sCanvas.loaded && lCanvas.loaded) {

			resultCanvas.width = imgSizeMode(hCanvas.width, sCanvas.width, lCanvas.width);
			resultCanvas.height = imgSizeMode(hCanvas.height, sCanvas.height, lCanvas.height);

			var resultBmd = new grafix.BitmapData(resultCanvas);
			var hBmd = new grafix.BitmapData(hCanvas);
			var sBmd = new grafix.BitmapData(sCanvas);
			var lBmd = new grafix.BitmapData(lCanvas);

			for (var x = 0; x < resultCanvas.width; x++) {
				for (var y = 0; y < resultCanvas.height; y++) {

					var h = (hBmd.getRGBA(x, y, wrapMode)).toHSL().h;
					var s = (sBmd.getRGBA(x, y, wrapMode)).toHSL().s;
					var l = (lBmd.getRGBA(x, y, wrapMode)).toHSL().l;

					resultBmd.setRGBA(x, y, wrapMode, new grafix.HSL(h, s, l).toRGBA());
				}
			}

			resultBmd.update();

		}else{
			alert("Please load all images first!");
		}
		
	};

	hFileInput=document.getElementById("hFileInput");
	hFileInput.onchange=readFile.bind(null, hFileInput, hImg, hCanvas);

	sFileInput=document.getElementById("sFileInput");
	sFileInput.onchange=readFile.bind(null, sFileInput, sImg, sCanvas);

	lFileInput=document.getElementById("lFileInput");
	lFileInput.onchange=readFile.bind(null, lFileInput, lImg, lCanvas);

	wrapModeSel=document.getElementById("wrapModeSel");
	wrapModeSel.addEventListener("change", function(){
		if(wrapModeSel.value=="wrap"){
			wrapMode=grafix.WrapMode.wrap;
		}else if(wrapModeSel.value=="clamp"){
			wrapMode=grafix.WrapMode.clamp;
		}else{
			wrapMode=grafix.WrapMode.mirror;
		}
	});

	imgSizeModeSel=document.getElementById("imgSizeModeSel");
	imgSizeModeSel.addEventListener("change", function(){
		if(imgSizeModeSel.value=="min"){
			imgSizeMode=Math.min;
		}else{
			imgSizeMode=Math.max;
		}
	});

});