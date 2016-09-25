var data1={RLeg:[[0,0,0],{}],LLeg:[[0,0,0],{}],RArm:[[0,0,0],{}],LArm:[[0,0,0],{}],Head:[[0,0,0],{}],Body:[[0,0,0],{a:{size:4,pos:[0,-8,6],render:[[0,0,0,0,0],[0,0,-1,0,224],[0,0,-2,64,0],[0,0,-3,0,64],[0,0,-4,64,64],[0,0,-5,64,224],[0,-1,0,0,224],[0,-2,0,64,0],[0,-3,0,0,64],[0,-4,0,64,64],[0,-5,0,64,224],[1,0,0,0,224],[2,0,0,64,0],[3,0,0,0,64],[4,0,0,64,64],[5,0,0,64,224],[5,0,-5,0,0]]},b:{size:10,pos:[0,6,0],render:[[0,0,0,0,224],[0,0,-1,64,128],[0,0,-2,64,128],[0,0,-3,64,128],[0,0,-4,0,224],[0,-1,0,0,224],[0,-1,-1,0,224],[0,-1,-2,64,32],[0,-1,-3,0,224],[0,-1,-4,0,224],[1,0,0,64,64],[1,0,-1,0,32],[1,0,-3,0,32],[1,0,-4,64,64],[1,-1,0,0,160],[1,-1,-1,0,32],[1,-1,-2,64,192],[1,-1,-3,0,32],[1,-1,-4,0,160],[2,0,0,64,64],[2,0,-1,0,32],[2,0,-3,0,32],[2,0,-4,64,64],[2,-1,0,0,160],[2,-1,-1,0,32],[2,-1,-2,64,192],[2,-1,-3,0,32],[2,-1,-4,0,160],[3,0,0,0,224],[3,0,-1,64,128],[3,0,-2,64,128],[3,0,-3,64,128],[3,0,-4,0,224],[3,-1,0,0,224],[3,-1,-1,0,224],[3,-1,-2,64,32],[3,-1,-3,0,224],[3,-1,-4,0,224]]}}]};
var example1=new RenderMaker(data1).Type;

var data2='{"RLeg":[[0,0,0],{}],"LLeg":[[0,0,0],{}],"RArm":[[0,0,0],{}],"LArm":[[0,0,0],{}],"Head":[[0,0,0],{}],"Body":[[0,0,0],{"a":{"size":4,"pos":[0,-8,6],"render":[[0,0,0,0,0],[0,0,-1,0,224],[0,0,-2,64,0],[0,0,-3,0,64],[0,0,-4,64,64],[0,0,-5,64,224],[0,-1,0,0,224],[0,-2,0,64,0],[0,-3,0,0,64],[0,-4,0,64,64],[0,-5,0,64,224],[1,0,0,0,224],[2,0,0,64,0],[3,0,0,0,64],[4,0,0,64,64],[5,0,0,64,224],[5,0,-5,0,0]]},"b":{"size":10,"pos":[0,6,0],"render":[[0,0,0,0,224],[0,0,-1,64,128],[0,0,-2,64,128],[0,0,-3,64,128],[0,0,-4,0,224],[0,-1,0,0,224],[0,-1,-1,0,224],[0,-1,-2,64,32],[0,-1,-3,0,224],[0,-1,-4,0,224],[1,0,0,64,64],[1,0,-1,0,32],[1,0,-3,0,32],[1,0,-4,64,64],[1,-1,0,0,160],[1,-1,-1,0,32],[1,-1,-2,64,192],[1,-1,-3,0,32],[1,-1,-4,0,160],[2,0,0,64,64],[2,0,-1,0,32],[2,0,-3,0,32],[2,0,-4,64,64],[2,-1,0,0,160],[2,-1,-1,0,32],[2,-1,-2,64,192],[2,-1,-3,0,32],[2,-1,-4,0,160],[3,0,0,0,224],[3,0,-1,64,128],[3,0,-2,64,128],[3,0,-3,64,128],[3,0,-4,0,224],[3,-1,0,0,224],[3,-1,-1,0,224],[3,-1,-2,64,32],[3,-1,-3,0,224],[3,-1,-4,0,224]]}}]}';
var example2=new RenderMaker().Json(data2);

var example3=new RenderMaker().Texture("test");

function useItem(x,y,z,item){
	switch(item){
		case 280:
			var mob=Level.spawnMob(x+0.5,y+1,z+0.5,15,"mob/RenderMaker.png");
			Entity.setRenderType(mob,example1);
			break;
		case 281:
			var mob=Level.spawnMob(x+0.5,y+1,z+0.5,15,"mob/RenderMaker.png");
			Entity.setRenderType(mob,example2);
			break;
		case 264:
			var mob=Level.spawnMob(x+0.5,y+1,z+0.5,15,"mob/RenderMaker.png");
			Entity.setRenderType(mob,example3);
			break;
	}
}

/*ここから下のコードは貼り付け*/
ModPE.overrideTexture("images/mob/RenderMaker.png",'http://i.imgur.com/jxFE01M.png');
function RenderMaker(data){
	this.Type;
	
	this.Create=function(obj){
		var render=Renderer.createHumanoidRenderer();
		var model=render.getModel();
		var RLeg=model.getPart('rightLeg').clear();
		var LLeg=model.getPart('leftLeg').clear();
		var RArm=model.getPart('rightArm').clear();
		var LArm=model.getPart('leftArm').clear();
		var Head=model.getPart('head').clear();
		var Body=model.getPart('body').clear();
		
		Head.setTextureSize(128,256);
		Body.setTextureSize(128,256);
		RArm.setTextureSize(128,256);
		LArm.setTextureSize(128,256);
		RLeg.setTextureSize(128,256);
		LLeg.setTextureSize(128,256);
		
		for(var i in obj.RLeg[1]){
			for(var j in obj.RLeg[1][i].render){
				RLeg.setTextureOffset(obj.RLeg[1][i].render[j][3],obj.RLeg[1][i].render[j][4],true);
				RLeg.addBox(obj.RLeg[0][0]+obj.RLeg[1][i].pos[0]+obj.RLeg[1][i].size*obj.RLeg[1][i].render[j][0],obj.RLeg[0][1]+obj.RLeg[1][i].pos[1]+obj.RLeg[1][i].size*obj.RLeg[1][i].render[j][1],obj.RLeg[0][2]+obj.RLeg[1][i].pos[2]+obj.RLeg[1][i].size*obj.RLeg[1][i].render[j][2],obj.RLeg[1][i].size,obj.RLeg[1][i].size,obj.RLeg[1][i].size);
			}
		}
		for(var i in obj.LLeg[1]){
			for(var j in obj.LLeg[1][i].render){
				LLeg.setTextureOffset(obj.LLeg[1][i].render[j][3],obj.LLeg[1][i].render[j][4],true);
				LLeg.addBox(obj.LLeg[0][0]+obj.LLeg[1][i].pos[0]+obj.LLeg[1][i].size*obj.LLeg[1][i].render[j][0],obj.LLeg[0][1]+obj.LLeg[1][i].pos[1]+obj.LLeg[1][i].size*obj.LLeg[1][i].render[j][1],obj.LLeg[0][2]+obj.LLeg[1][i].pos[2]+obj.LLeg[1][i].size*obj.LLeg[1][i].render[j][2],obj.LLeg[1][i].size,obj.LLeg[1][i].size,obj.LLeg[1][i].size);
			}
		}
		for(var i in obj.RArm[1]){
			for(var j in obj.RArm[1][i].render){
				RArm.setTextureOffset(obj.RArm[1][i].render[j][3],obj.RArm[1][i].render[j][4],true);
				RArm.addBox(obj.RArm[0][0]+obj.RArm[1][i].pos[0]+obj.RArm[1][i].size*obj.RArm[1][i].render[j][0],obj.RArm[0][1]+obj.RArm[1][i].pos[1]+obj.RArm[1][i].size*obj.RArm[1][i].render[j][1],obj.RArm[0][2]+obj.RArm[1][i].pos[2]+obj.RArm[1][i].size*obj.RArm[1][i].render[j][2],obj.RArm[1][i].size,obj.RArm[1][i].size,obj.RArm[1][i].size);
			}
		}
		for(var i in obj.LArm[1]){
			for(var j in obj.LArm[1][i].render){
				LArm.setTextureOffset(obj.LArm[1][i].render[j][3],obj.LArm[1][i].render[j][4],true);
				LArm.addBox(obj.LArm[0][0]+obj.LArm[1][i].pos[0]+obj.LArm[1][i].size*obj.LArm[1][i].render[j][0],obj.LArm[0][1]+obj.LArm[1][i].pos[1]+obj.LArm[1][i].size*obj.LArm[1][i].render[j][1],obj.LArm[0][2]+obj.LArm[1][i].pos[2]+obj.LArm[1][i].size*obj.LArm[1][i].render[j][2],obj.LArm[1][i].size,obj.LArm[1][i].size,obj.LArm[1][i].size);
			}
		}
		for(var i in obj.Head[1]){
			for(var j in obj.Head[1][i].render){
				Head.setTextureOffset(obj.Head[1][i].render[j][3],obj.Head[1][i].render[j][4],true);
				Head.addBox(obj.Head[0][0]+obj.Head[1][i].pos[0]+obj.Head[1][i].size*obj.Head[1][i].render[j][0],obj.Head[0][1]+obj.Head[1][i].pos[1]+obj.Head[1][i].size*obj.Head[1][i].render[j][1],obj.Head[0][2]+obj.Head[1][i].pos[2]+obj.Head[1][i].size*obj.Head[1][i].render[j][2],obj.Head[1][i].size,obj.Head[1][i].size,obj.Head[1][i].size);
			}
		}
		for(var i in obj.Body[1]){
			for(var j in obj.Body[1][i].render){
				Body.setTextureOffset(obj.Body[1][i].render[j][3],obj.Body[1][i].render[j][4],true);
				Body.addBox(obj.Body[0][0]+obj.Body[1][i].pos[0]+obj.Body[1][i].size*obj.Body[1][i].render[j][0],obj.Body[0][1]+obj.Body[1][i].pos[1]+obj.Body[1][i].size*obj.Body[1][i].render[j][1],obj.Body[0][2]+obj.Body[1][i].pos[2]+obj.Body[1][i].size*obj.Body[1][i].render[j][2],obj.Body[1][i].size,obj.Body[1][i].size,obj.Body[1][i].size);
			}
		}
		return render.renderType;
	};
	
	if(typeof data=='object')this.Type=this.Create(data);
	
	this.Json=function(json){
		var obj=JSON.parse(json);
		this.Type=this.Create(obj);
		return this.Type;
	};
	
	this.Texture=function(name){
		var Byte=ModPE.getBytesFromTexturePack("assets/Render/"+name+".json");
		var str=new java.lang.String(Byte,"UTF-8");
		var obj=JSON.parse(str);
		this.Type=this.Create(obj);
		return this.Type;
	};
}

