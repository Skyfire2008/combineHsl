var grafix=require("./graphics.js");

self.addEventListener("message", function(e){

	if(e.data.mode==0){ //convert rgb of input images to hsl

		//data is transferred as uint8 typed arrays
		var hData=e.data.hData;
		var sData=e.data.sData;
		var lData=e.data.lData;

		var hues=null;
		var saturations=null;
		var lightnesses=null;

		if(hData!=null){ //if hData given, calculate hues
			hues=new Float32Array(hData.length/4);

			let j=0;
			for(let i=0; i<hData.length; i+=4){
				let rgba=new grafix.RGBA(hData[i], hData[i+1], hData[i+2], hData[i+3]);
				hues[j]=rgba.toHSL().h;
				j++;
			}
		}

		if(sData!=null){ //if sData given, calculate saturations
			saturations=new Float32Array(sData.length/4);

			let j=0;
			for(let i=0; i<sData.length; i+=4){
				let rgba=new grafix.RGBA(sData[i], sData[i+1], sData[i+2], sData[i+3]);
				saturations[j]=rgba.toHSL().s;
				j++;
			}
		}

		if(lData!=null){ //if lData given, calculate lightnesses
			lightnesses=new Float32Array(lData.length/4);

			let j=0;
			for(let i=0; i<lData.length; i+=4){
				let rgba=new grafix.RGBA(lData[i], lData[i+1], lData[i+2], lData[i+3]);
				lightnesses[j]=rgba.toHSL().l;
				j++;
			}
		}

		self.postMessage({hData: hData, sData: sData, lData: lData});

	}else if(e.data.mode==1){

	}else{
		console.log("Worker: unknown mode");
	}
});