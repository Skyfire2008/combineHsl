
var grafix=require("./graphics.js");

var hFileInput, sFileInput, lFileInput;
var applyBtn;
var resultCanvas;

var hImg=new Image();
var sImg=new Image();
var lImg=new Image();

var hCanvas=document.createElement("canvas");
var sCanvas=document.createElement("canvas");
var lCanvas=document.createElement("canvas");

var readFile=function(input, image, canvas){

	fr=new FileReader();

	fr.onload=function(e){
		var target=e.target;
		image.src=target.result;
		image.onload=new function(){

			canvas.width=image.naturalWidth;
			canvas.height=image.naturalHeight;
			canvas.getContext("2d").drawImage(image, 0, 0);
		};
	};
	fr.readAsDataURL(input.files[0]);
};

document.addEventListener("DOMContentLoaded", function(){

	resultCanvas=document.getElementById("resultCanvas");

	applyBtn=document.getElementById("applyBtn");
	applyBtn.onclick=function(){

		resultCanvas.width=Math.min(hCanvas.width, sCanvas.width, lCanvas.width);
		resultCanvas.height=Math.min(hCanvas.height, sCanvas.height, lCanvas.height);
		
		var resultBmd=new grafix.BitmapData(resultCanvas);
		var hBmd=new grafix.BitmapData(hCanvas);
		var sBmd=new grafix.BitmapData(sCanvas);
		var lBmd=new grafix.BitmapData(lCanvas);
		
		for(var x=0; x<resultCanvas.width; x++){
			for(var y=0; y<resultCanvas.height; y++){

				var h=(hBmd.getRGBA(x, y)).toHSL().h;
				var s=(sBmd.getRGBA(x, y)).toHSL().s;
				var l=(lBmd.getRGBA(x, y)).toHSL().l;

				if(x==10 && y==10){
					console.log(h, s, l);
					console.log(new grafix.HSL(h, s, l).toRGBA());
				}

				resultBmd.setRGBA(x, y, new grafix.HSL(h, s, l).toRGBA());
			}
		}

		resultBmd.update();
		
	};

	hFileInput=document.getElementById("hFileInput");
	hFileInput.onchange=readFile.bind(null, hFileInput, hImg, hCanvas);

	sFileInput=document.getElementById("sFileInput");
	sFileInput.onchange=readFile.bind(null, sFileInput, sImg, sCanvas);

	lFileInput=document.getElementById("lFileInput");
	lFileInput.onchange=readFile.bind(null, lFileInput, lImg, lCanvas);

});