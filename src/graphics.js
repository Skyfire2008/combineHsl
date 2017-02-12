
//BITMAP DATA METHODS:

function BitmapData(canvas){
	this.context=canvas.getContext("2d");
	console.log(canvas.width, canvas.height);
	this.data=this.context.getImageData(0, 0, canvas.width, canvas.height);
}

BitmapData.prototype={
	get width(){
		return this.data.width;
	},
	get height(){
		return this.data.height;
	}
};

BitmapData.prototype.getIndex=function(x, y){
	return 4*(this.width*y+x);
}

BitmapData.prototype.getPixel=function(x, y){
	var index=this.getIndex(x, y);
	return [this.data.data[index], this.data.data[index+1], this.data.data[index+2], this.data.data[index+3]];
};

BitmapData.prototype.setPixel=function(x, y, r, g, b, a){
	var index=this.getIndex(x, y);

	this.data.data[index]=r;
	this.data.data[index+1]=g;
	this.data.data[index+2]=b;
	this.data.data[index+3]=a;
};

BitmapData.prototype.getColor=function(x, y){
	if(x>=this.width){
		x=2*this.width-x-1;
	}else if(x<0){
		x=-x;
	}
	
	if(y>=this.height){
		y=2*this.height-y-1;
	}else if(y<0){
		y=-y;
	}
	
	var index=this.getIndex(x, y);

	return new Color(this.data.data[index], this.data.data[index+1], this.data.data[index+2], this.data.data[index+3]);
};

BitmapData.prototype.setColor=function(x, y, color){
	this.setPixel(x, y, color.r, color.g, color.b, color.a);
};

BitmapData.prototype.update=function(){
	this.context.putImageData(this.data, 0, 0);
};

//COLOR METHODS:

function Color(r, g, b, a){
	this.r=r;
	this.g=g;
	this.b=b;
	this.a=a;
}

function toHsl(color){
	var R=color.r/255;
	var G=color.g/255;
	var B=color.b/255;

	var maxC=Math.max(R, G, B);
	var minC=Math.min(R, G, B);

	var L=0.5*(minC+maxC); //calculate luminance

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

	return {h:H, s:S, l:L};
}

function fromHsl(h, s, l){ //taken from http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
	var R, G, B;

	h/=360;

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

	return new Color(255*R, 255*G, 255*B, 255);
}

function limit01(v){
	if(v>1){
		return v-1;
	}else if(v<0){
		return v+1;
	}else{
		return v;
	}
}

module.exports={
	BitmapData: BitmapData,
	Color: Color,
	toHsl: toHsl,
	fromHsl: fromHsl
}