
//BITMAP DATA METHODS:

function BitmapData(canvas){
	this.context=canvas.getContext("2d");
	this.imageData=this.context.getImageData(0, 0, canvas.width, canvas.height);
}

BitmapData.prototype={
	get width(){
		return this.imageData.width;
	},
	get height(){
		return this.imageData.height;
	}
};

BitmapData.prototype.getIndex=function(x, y){
	return 4*(this.width*y+x);
}

BitmapData.prototype.setPixel=function(x, y, r, g, b, a){
	var index=this.getIndex(x, y);

	this.imageData.data[index]=r;
	this.imageData.data[index+1]=g;
	this.imageData.data[index+2]=b;
	this.imageData.data[index+3]=a;
};

BitmapData.prototype.getRGBA=function(x, y){
	
	var index=this.getIndex(x, y);

	return new RGBA(this.imageData.data[index], this.imageData.data[index+1], this.imageData.data[index+2], this.imageData.data[index+3]);
};

BitmapData.prototype.setRGBA=function(x, y, rgba){
	this.setPixel(x, y, rgba.r, rgba.g, rgba.b, rgba.a);
};

BitmapData.prototype.update=function(){
	this.context.putImageData(this.imageData, 0, 0);
};

//COLOR METHODS:

function RGBA(r, g, b, a){
	this.r=r;
	this.g=g;
	this.b=b;
	this.a=a;
}

RGBA.prototype.toHSL=function(){
	//TODO: maybe, take alpha into account?
	var R=this.r/255;
	var G=this.g/255;
	var B=this.b/255;

	var maxC=Math.max(R, G, B);
	var minC=Math.min(R, G, B);

	var L=0.5*(minC+maxC); //calculate lightness

	var S=0;
	var H=0;

	if(maxC!==minC){
		if(L<0.5){ //calculate saturation
			S=(maxC-minC)/(maxC+minC);
		}else{
			S=(maxC-minC)/(2-(maxC+minC));
		}

		if(R===maxC){ //calculate hue
			H=(G-B)/(maxC-minC);
		}else if(G===maxC){
			H=2+(B-R)/(maxC-minC);
		}else{
			H=4+(R-G)/(maxC-minC);
		}

		H*=60;
		if(H>360){
			H-=360;
		}else if(H<0){
			H+=360;
		}
	}

	return new HSL(H, S, L);
}

function HSL(h, s, l){
	this.h=h;
	this.s=s;
	this.l=l;
}

HSL.prototype.toRGBA=function(){ //taken from http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
	var R, G, B;

	var h=this.h/360;
	var s=this.s;
	var l=this.l;

	if(s === 0){
		R = G = B = l; // achromatic
	}else{
		function hue2rgb(p, q, t){
			if(t < 0) t += 1;
			if(t > 1) t -= 1;
			if(t < 1/6) return p + (q - p) * 6 * t;
			if(t < 1/2) return q;
			if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			return p;
		}

		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		R = hue2rgb(p, q, h + 1/3);
		G = hue2rgb(p, q, h);
		B = hue2rgb(p, q, h - 1/3);
	}

	return new RGBA(255*R, 255*G, 255*B, 255);
}

module.exports={
	BitmapData: BitmapData,
	RGBA: RGBA,
	HSL: HSL
}