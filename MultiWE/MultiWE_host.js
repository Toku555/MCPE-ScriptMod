var Activity=com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
var LinearLayout=android.widget.LinearLayout;
var ScrollView=android.widget.ScrollView;
var Dialog=android.app.Dialog;
var TableLayout=android.widget.TableLayout;
var TableRow=android.widget.TableRow;
var TextView=android.widget.TextView;
var Button=android.widget.Button;
var OnClickListener=android.view.View.OnClickListener;
var Gravity=android.view.Gravity;
var AbsoluteLayout=android.widget.AbsoluteLayout;
var ListView=android.widget.ListView;
var AdapterView=android.widget.AdapterView;
var ArrayAdapter=android.widget.ArrayAdapter;
var EditText=android.widget.EditText;
var InputType=android.text.InputType;
var Color=android.graphics.Color;
var LayoutParams=android.view.ViewGroup.LayoutParams;
var OnTouchListener=android.view.View.OnTouchListener;
var TextWatcher=android.text.TextWatcher;
var Switch=android.widget.Switch;
var CompoundButton=android.widget.CompoundButton;
var CheckBox=android.widget.CheckBox;
var RadioGroup=android.widget.RadioGroup;
var RadioButton=android.widget.RadioButton;

var display=new android.util.DisplayMetrics();
Activity.getWindowManager().getDefaultDisplay().getMetrics(display);
var screen={x:Math.max(display.widthPixels,display.heightPixels),y:Math.min(display.widthPixels,display.heightPixels)};

var GuiColor={
	top:"#000000",
	background:"#66000000",
	mode:"#F4A460",
	text:"#FFFFFF",
	button:"#22FFFFFF",
}

var language=[
	"mode",//0
	"Pos1",//1
	"Pos2",//2
	"Set pos1",//3
	"Set pos2",//4
	"Run",//5
	"Undo",//6
	"Redo",//7
	"Block",//8
	"Target",//9
	"Copy",//10
	"Cut",//11
	"Rotate",//12
	"Option",//13
	"Pile",//14
	"Radius",//15
	"Please enter a name",//16
	"Fill",//17
	"completed",//18
	"Reverse-x",//19
	"Reverse-y",//20
	"Reverse-z",//21
	"Select",//22
	"Delete",//23
	"Name",//24
	"Air",//25
	"X×Y×Z",//26
	{
		CHICKEN:"CHICKEN",
		COW:"COW",
		PIG:"PIG",
		SHEEP:"SHEEP",
		WOLF:"WOLF",
		VILLAGER:"VILLAGER",
		MUSHROOM:"MUSHROOM",
		SQUID:"SQUID",
		RABBIT:"RABBIT",
		IRON_GOLEM:"IRON_GOLEM",
		SNOW_GOLEM:"SNOW_GOLEM",
		OCELOT:"OCELOT",
		ZOMBIE:"ZOMBIE",
		CREEPER:"CREEPER",
		SKELETON:"SKELETON",
		SPIDER:"SPIDER",
		PIG_ZOMBIE:"PIG_ZOMBIE",
		SLIME:"SLIME",
		ENDERMAN:"ENDERMAN",
		SILVERFISH:"SILVERFISH",
		CAVE_SPIDER:"CAVE_SPIDER",
		GHAST:"GHAST",
		LAVA_SLIME:"LAVA_SLIME",
		BLAZE:"BLAZE",
		ZOMBIE_VILLAGER:"ZOMBIE_VILLAGER"
	},//27
	"Spawn control"//28
];

var m=0;
var mList=["Set","Line","Circle","Sphere","Copy","Paste","Setting"];

var Option={
	pile:1,
	mobspawn:{
		CHICKEN:true,
		COW:true,
		PIG:true,
		SHEEP:true,
		WOLF:true,
		VILLAGER:true,
		MUSHROOM:true,
		SQUID:true,
		RABBIT:true,
		IRON_GOLEM:true,
		SNOW_GOLEM:true,
		OCELOT:true,
		ZOMBIE:true,
		CREEPER:true,
		SKELETON:true,
		SPIDER:true,
		PIG_ZOMBIE:true,
		SLIME:true,
		ENDERMAN:true,
		SILVERFISH:true,
		CAVE_SPIDER:true,
		GHAST:true,
		LAVA_SLIME:true,
		BLAZE:true,
		ZOMBIE_VILLAGER:true
	}
};

var mobName=[];
for(var i in EntityType)mobName[EntityType[i]]=i;

var process=[];

var player=[];

function PlayerObj(){
	this.auth=false;
	this.log=[];
	this.undo=[];
	this.redo=[];
	this.pile=1;
	this.r=0;
	this.fill=true;
	this.block=[];
	this.target=[];
	this.pos={s:{x:0,y:0,z:0},e:{x:0,y:0,z:0}};
	this.clipboard={};
	this.air=true;
	this.rotate=0;
	this.reverse={
		x:false,
		y:false,
		z:false
	};
	this.paste=[[0,0,0]];
	this.paste_num=[1,1,1];
}

var host={
	log:[],
	undo:[],
	redo:[],
	pile:Option.pile,
	r:0,
	fill:true,
	block:[],
	target:[],
	pos:{s:{x:0,y:0,z:0},e:{x:0,y:0,z:0}},
	clipboard:{},
	air:true,
	rotate:0,
	reverse:{
		x:false,
		y:false,
		z:false
	},
	paste:[[0,0,0]],
	paste_num:[1,1,1]
};

var SDcard=android.os.Environment.getExternalStorageDirectory();
var MCPEdata=new java.io.File(SDcard.getAbsolutePath()+"/games/com.mojang/minecraftpe");
var File={
	Save:function(name,data,indent){
		var Folder=new java.io.File(MCPEdata+"/WorldEditor");
		Folder.mkdirs();
		var DataFile=new java.io.File(MCPEdata+"/WorldEditor/"+name+".json");
		DataFile.createNewFile();
		var DataWrite=new java.io.FileWriter(DataFile,false);
		if(indent)DataWrite.write(JSON.stringify(data,null,"\t"));else DataWrite.write(JSON.stringify(data));
		DataWrite.close();
	},
	Load:function(name){
		try{
			var DataFile=new java.io.FileReader(MCPEdata+"/WorldEditor/"+name+".json");
			var Read=new java.io.BufferedReader(DataFile);
			var str="";
			var Data=Read.readLine();
			while(Data!=null){
				str+=Data;
				Data=Read.readLine();
			}
			var rtn=JSON.parse(str);
			Read.close();
			return rtn;
		}catch(e){
			return null;
		}
	},
	List:function(){
		var Folder=new java.io.File(MCPEdata+"/WorldEditor");
		Folder.mkdir();
		var list=Folder.list();
		for(var i in list){
			list[i]=list[i].replace('.json',"");
		}
		return list;
	}
};

var _GuiColor=File.Load("GuiColor");
if(_GuiColor==null)File.Save("GuiColor",GuiColor,true);else GuiColor=_GuiColor;
var _Option=File.Load("Option");
if(_Option==null)File.Save("Option",Option,true);else Option=_Option;
var _ClipBoard=File.Load("ClipBoard");
if(_ClipBoard==null)File.Save("ClipBoard",host.clipboard);else host.clipboard=_ClipBoard;
var _language=File.Load("Text");
if(_language==null)File.Save("Text",language,true);else language=_language;



function newLevel(){
	host.name=Player.getName(getPlayerEnt());
}

function modTick(){
	if(process.length>0){
		eval(process[0][0]);
		if(process[0][1]!=undefined)clientMessage(process[0][1]);
		process.shift();
	}
}

function useItem(x,y,z,iid,bid,side,idam,bdam){
	//ダイヤでタップした時モードによって処理分岐
	if(iid==264){
		if(host.name==Player.getName(getPlayerEnt())){
			switch(mList[m]){
				case "Set":
					WE.Set(host);
					break;
				case "Line":
					WE.Line(host);
					break;
				case "Circle":
					WE.Circle(host,side,x,y,z);
					break;
				case "Sphere":
					WE.Sphere(host,x,y,z);
					break;
				case "Paste":
					WE.Paste(host,x,y,z);
			}
		}
	}
	
	if(iid==280){
		if(idam==0){
			var pname=Player.getName(getPlayerEnt());
			if(pname==host.name)clientMessage("Id:"+bid+",Dam:"+bdam);
		}
		//参加者側からのコマンド送信
		if(idam==1){
			var cn=Player.getItemCustomName(0);
			if(cn!=null){
				var com=cn.split(" ");
				if(com[0]=="we"){
					var pname=Player.getName(getPlayerEnt());
					if(player[pname]==undefined){
						player[pname]=new PlayerObj();
					}
					if(player[pname].auth){
						if(WeCommand[com[1]]!=undefined){
							if(CheckCommand(WeCommand[com[1]].arg,com)){
								WeCommand[com[1]].fnc(pname,com,x,y,z);
							}
						}else{
							WeMessage(pname,"コマンドの引数が正しくありません");
						}
					}else{
						WeMessage(pname,"WEを使用する権限がありません");
					}
				}
			}
		}
	}
	
	//ブロック積み上げ
	if(iid==281){
		var pname=Player.getName(getPlayerEnt());
		var pile=(pname==host.name ? host.pile:player[pname].pile);
		var undo=[];
		var i=1;
		while(i<=pile){
			switch(side){
				case 0:
					undo.push([x,y-i,z,getTile(x,y-i,z),Level.getData(x,y-i,z)]);
					setTile(x,y-i,z,bid,bdam);
					break;
				case 1:
					undo.push([x,y+i,z,getTile(x,y+i,z),Level.getData(x,y+i,z)]);
					setTile(x,y+i,z,bid,bdam);
					break;
				case 2:
					undo.push([x,y,z-i,getTile(x,y,z-i),Level.getData(x,y,z-i)]);
					setTile(x,y,z-i,bid,bdam);
					break;
				case 3:
					undo.push([x,y,z+i,getTile(x,y,z+i),Level.getData(x,y,z+i)]);
					setTile(x,y,z+i,bid,bdam);
					break;
				case 4:
					undo.push([x-i,y,z,getTile(x-i,y,z),Level.getData(x-i,y,z)]);
					setTile(x-i,y,z,bid,bdam);
					break;
				case 5:
					undo.push([x+i,y,z,getTile(x+i,y,z),Level.getData(x+i,y,z)]);
					setTile(x+i,y,z,bid,bdam);
					break;
			}
			i++;
		}
		if(pname==host.name)host.undo.unshift(undo);else player[pname].undo.unshift(undo);
	}
}

function entityAddedHook(entity){
	var eid=Entity.getEntityTypeId(entity);
	
	//mobのスポーン制御
	if(!Option.mobspawn[mobName[eid]] && eid!=EntityType.PLAYER)Entity.remove(entity);
}

var WeCommand={
	pos1:{
		arg:[],
		fnc:function(name,com,x,y,z){
			player[name].Pos.s={x:x,y:y,z:z};
			WeMessage(name,"始点を設定しました");
		}
	},
	pos2:{
		arg:[],
		fnc:function(name,com,x,y,z){
			player[name].Pos.e={x:x,y:y,z:z};
			WeMessage(name,"終点を設定しました");
		}
	},
	circle:{
		arg:["num","num","anum"],
		fnc:function(name,com,x,y,z){

		}
	},
	all:{
		arg:["num","anum"],
		fnc:function(name,com,x,y,z){
			if(player[name].Pos.s.x==null||player[name].Pos.e.x==null){
				WeMessage(name,"始点と終点を設定してください");
			}else{
				var dam=0;
				if(com[3]!=undefined)dam=Number(com[3]);
				WE.All(name,Number(com[2]),dam,Option.processType);
			}
		}
	}
};

//WEの機能
var WE={
	Circle:function(obj,side,x,y,z){
		var undo=[];
		var tar=target(obj.target);
		obj.log.push("Circle:"+String(x)+"*"+String(y)+"*"+String(z));
		if(obj.fill){
			for(var i1=-1*obj.r;i1<=obj.r;i1++){
				var cr1=Math.floor(Math.sqrt(Math.abs(obj.r*obj.r-i1*i1)));
				for(var i2=-1*cr1;i2<=cr1;i2++){
					var block=getBlock(obj);
					switch(side){
						case 0:
						case 1:
							var id=getTile(x+i1,y,z+i2),dam=Level.getData(x+i1,y,z+i2);
							if(tar==null){
								undo.push([x+i1,y,z+i2,id,dam]);
								setTile(x+i1,y,z+i2,block[0],block[1]);
							}else if(tar[id][dam]){
								undo.push([x+i1,y,z+i2,id,dam]);
								setTile(x+i1,y,z+i2,block[0],block[1]);
							}
							break;
						case 2:
						case 3:
							var id=getTile(x+i1,y+i2,z),dam=Level.getData(x+i1,y+i2,z);
							if(tar==null){
								undo.push([x+i1,y+i2,z,id,dam]);
								setTile(x+i1,y+i2,z,block[0],block[1]);
							}else if(tar[id][dam]){
								undo.push([x+i1,y+i2,z,id,dam]);
								setTile(x+i1,y+i2,z,block[0],block[1]);
							}
							break;
						case 4:
						case 5:
							var id=getTile(x,y+i1,z+i2),dam=Level.getData(x,y+i1,z+i2);
							if(tar==null){
								undo.push([x,y+i1,z+i2,id,dam]);
								setTile(x,y+i1,z+i2,block[0],block[1]);
							}else if(tar[id][dam]){
								undo.push([x,y+i1,z+i2,id,dam]);
								setTile(x,y+i1,z+i2,block[0],block[1]);
							}
							break;
					}
				}
			}
		}else{
			for(var i1=-1*obj.r;i1<=obj.r;i1++){
				var cr=Math.floor(Math.sqrt(Math.abs(obj.r*obj.r-i1*i1)));
				var id,dam,block=getBlock(obj);
				switch(side){
					case 0:
					case 1:
						id=getTile(x+i1,y,z+cr),dam=Level.getData(x+i1,y,z+cr);
						undo.push([x+i1,y,z+cr,id,dam]);
						setTile(x+i1,y,z+cr,block[0],block[1]);
						
						id=getTile(x+i1,y,z-cr),dam=Level.getData(x+i1,y,z-cr);
						undo.push([x+i1,y,z-cr,id,dam]);
						setTile(x+i1,y,z-cr,block[0],block[1]);
						
						id=getTile(x+cr,y,z+i1),dam=Level.getData(x+cr,y,z+i1);
						undo.push([x+cr,y,z+i1,id,dam]);
						setTile(x+cr,y,z+i1,block[0],block[1]);
						
						id=getTile(x-cr,y,z+i1),dam=Level.getData(x-cr,y,z+i1);
						undo.push([x-cr,y,z+i1,id,dam]);
						setTile(x-cr,y,z+i1,block[0],block[1]);
						
						break;
					case 2:
					case 3:
						id=getTile(x+i1,y+cr,z),dam=Level.getData(x+i1,y+cr,z);
						undo.push([x+i1,y+cr,z,id,dam]);
						setTile(x+i1,y+cr,z,block[0],block[1]);
						
						id=getTile(x+i1,y-cr,z),dam=Level.getData(x+i1,y-cr,z);
						undo.push([x+i1,y-cr,z,id,dam]);
						setTile(x+i1,y-cr,z,block[0],block[1]);
						
						id=getTile(x+cr,y+i1,z),dam=Level.getData(x+cr,y+i1,z);
						undo.push([x+cr,y+i1,z,id,dam]);
						setTile(x+cr,y+i1,z,block[0],block[1]);
						
						id=getTile(x-cr,y+i1,z),dam=Level.getData(x-cr,y+i1,z);
						undo.push([x-cr,y+i1,z,id,dam]);
						setTile(x-cr,y+i1,z,block[0],block[1]);
						break;
					case 4:
					case 5:
						id=getTile(x,y+i1,z+cr),dam=Level.getData(x,y+i1,z+cr);
						undo.push([x,y+i1,z+cr,id,dam]);
						setTile(x,y+i1,z+cr,block[0],block[1]);
						
						id=getTile(x,y+i1,z-cr),dam=Level.getData(x,y+i1,z-cr);
						undo.push([x,y+i1,z-cr,id,dam]);
						setTile(x,y+i1,z-cr,block[0],block[1]);
						
						id=getTile(x,y+cr,z+i1),dam=Level.getData(x,y+cr,z+i1);
						undo.push([x,y+cr,z+i1,id,dam]);
						setTile(x,y+cr,z+i1,block[0],block[1]);
						
						id=getTile(x,y-cr,z+i1),dam=Level.getData(x,y-cr,z+i1);
						undo.push([x,y-cr,z+i1,id,dam]);
						setTile(x,y-cr,z+i1,block[0],block[1]);
						break;
				}
			}
		}
		obj.undo.unshift(undo);
		obj.redo=[];
	},
	Sphere:function(obj,x,y,z){
		var undo=[];
		var tar=target(obj.target);
		obj.log.push("Sphere:"+String(x)+"*"+String(y)+"*"+String(z));
		if(obj.fill){
			for(var i1=-1*obj.r;i1<=obj.r;i1++){
				var sy=Math.floor(Math.sqrt(Math.abs(obj.r*obj.r-i1*i1)));
				for(var i2=-1*sy;i2<=sy;i2++){
					var sz=Math.floor(Math.sqrt(Math.abs(obj.r*obj.r-i1*i1-i2*i2)));
					for(var i3=-1*sz;i3<=sz;i3++){
						var id=getTile(x+i1,y+i2,z+i3),dam=Level.getData(x+i1,y+i2,z+i3);
						if(tar==null){
							var block=getBlock(obj);
							if(block!=null){
								undo.push([x+i1,y+i2,z+i3,id,dam]);
								setTile(x+i1,y+i2,z+i3,block[0],block[1]);
							}
						}else if(tar[id][dam]){
							var block=getBlock(obj);
							if(block!=null){
								undo.push([x+i1,y+i2,z+i3,id,dam]);
								setTile(x+i1,y+i2,z+i3,block[0],block[1]);
							}
						}
					}
				}
			}
		}else{
			for(var i1=-1*obj.r;i1<=obj.r;i1++){
				var sy=Math.floor(Math.sqrt(Math.abs(obj.r*obj.r-i1*i1)));
				for(var i2=-1*sy;i2<=sy;i2++){
					var sr=Math.floor(Math.sqrt(Math.abs(obj.r*obj.r-i1*i1-i2*i2)));
					var id,dam,block;
					
					id=getTile(x+i1,y+i2,z+sr);dam=Level.getData(x+i1,y+i2,z+sr),block=getBlock(obj);
					if(tar==null){
						undo.push([x+i1,y+i2,z+sr,id,dam]);
						setTile(x+i1,y+i2,z+sr,block[0],block[1]);
					}else if(tar[id][dam]){
						undo.push([x+i1,y+i2,z+sr,id,dam]);
						setTile(x+i1,y+i2,z+sr,block[0],block[1]);
					}
					id=getTile(x+i1,y+i2,z-sr);dam=Level.getData(x+i1,y+i2,z-sr),block=getBlock(obj);
					if(tar==null){
						undo.push([x+i1,y+i2,z-sr,id,dam]);
						setTile(x+i1,y+i2,z-sr,block[0],block[1]);
					}else if(tar[id][dam]){
						undo.push([x+i1,y+i2,z-sr,id,dam]);
						setTile(x+i1,y+i2,z-sr,block[0],block[1]);
					}
					id=getTile(x+i1,y+sr,z+i2);dam=Level.getData(x+i1,y+sr,z+i2),block=getBlock(obj);
					if(tar==null){
						undo.push([x+i1,y+sr,z+i2,id,dam]);
						setTile(x+i1,y+sr,z+i2,block[0],block[1]);
					}else if(tar[id][dam]){
						undo.push([x+i1,y+sr,z+i2,id,dam]);
						setTile(x+i1,y+sr,z+i2,block[0],block[1]);
					}
					id=getTile(x+i1,y-sr,z+i2);dam=Level.getData(x+i1,y-sr,z+i2),block=getBlock(obj);
					if(tar==null){
						undo.push([x+i1,y-sr,z+i2,id,dam]);
						setTile(x+i1,y-sr,z+i2,block[0],block[1]);
					}else if(tar[id][dam]){
						undo.push([x+i1,y-sr,z+i2,id,dam]);
						setTile(x+i1,y-sr,z+i2,block[0],block[1]);
					}
					id=getTile(x+sr,y+i2,z+i1);dam=Level.getData(x+sr,y+i2,z+i1),block=getBlock(obj);
					if(tar==null){
						undo.push([x+sr,y+i2,z+i1,id,dam]);
						setTile(x+sr,y+i2,z+i1,block[0],block[1]);
					}else if(tar[id][dam]){
						undo.push([x+sr,y+i2,z+i1,id,dam]);
						setTile(x+sr,y+i2,z+i1,block[0],block[1]);
					}
					id=getTile(x-sr,y+i2,z+i1);dam=Level.getData(x-sr,y+i2,z+i1),block=getBlock(obj);
					if(tar==null){
						undo.push([x-sr,y+i2,z+i1,id,dam]);
						setTile(x-sr,y+i2,z+i1,block[0],block[1]);
					}else if(tar[id][dam]){
						undo.push([x-sr,y+i2,z+i1,id,dam]);
						setTile(x-sr,y+i2,z+i1,block[0],block[1]);
					}
				}
			}
		}
		obj.undo.unshift(undo);
		obj.redo=[];
	},
	Set:function(obj){
		var max={x:Math.max(obj.pos.s.x,obj.pos.e.x),y:Math.max(obj.pos.s.y,obj.pos.e.y),z:Math.max(obj.pos.s.z,obj.pos.e.z)};
		var min={x:Math.min(obj.pos.s.x,obj.pos.e.x),y:Math.min(obj.pos.s.y,obj.pos.e.y),z:Math.min(obj.pos.s.z,obj.pos.e.z)};
		var undo=[];
		var tar=target(obj.target);
		obj.log.push("Set:"+String(max.x-min.x)+"*"+String(max.y-min.y)+"*"+String(max.z-min.z));
		for(var i1=min.x;i1<=max.x;i1++){
			for(var i2=min.y;i2<=max.y;i2++){
				for(var i3=min.z;i3<=max.z;i3++){
					var id=getTile(i1,i2,i3),dam=Level.getData(i1,i2,i3);
					if(tar==null){
						var block=getBlock(obj);
						if(block!=null){
							undo.push([i1,i2,i3,id,dam]);
							setTile(i1,i2,i3,block[0],block[1]);
						}
					}else if(tar[id][dam]){
						var block=getBlock(obj);
						if(block!=null){
							undo.push([i1,i2,i3,id,dam]);
							setTile(i1,i2,i3,block[0],block[1]);
						}
					}
				}
			}
		}
		obj.undo.unshift(undo);
		obj.redo=[];
	},
	Undo:function(obj){
		var redo=[];
		obj.log.push("Undo");
		if(obj.undo.length>0){
			for(var i=0;i<obj.undo[0].length;i++){
				redo.push([obj.undo[0][i][0],obj.undo[0][i][1],obj.undo[0][i][2],getTile(obj.undo[0][i][0],obj.undo[0][i][1],obj.undo[0][i][2]),Level.getData(obj.undo[0][i][0],obj.undo[0][i][1],obj.undo[0][i][2])]);
				setTile(obj.undo[0][i][0],obj.undo[0][i][1],obj.undo[0][i][2],obj.undo[0][i][3],obj.undo[0][i][4]);
			}
			obj.undo.shift();
			obj.redo.unshift(redo);
		}
	},
	Redo:function(obj){
		var undo=[];
		obj.log.push("Redo");
		if(obj.redo.length>0){
			for(var i=0;i<obj.redo[0].length;i++){
				undo.push([obj.redo[0][i][0],obj.redo[0][i][1],obj.redo[0][i][2],getTile(obj.redo[0][i][0],obj.redo[0][i][1],obj.redo[0][i][2]),Level.getData(obj.redo[0][i][0],obj.redo[0][i][1],obj.redo[0][i][2])]);
				setTile(obj.redo[0][i][0],obj.redo[0][i][1],obj.redo[0][i][2],obj.redo[0][i][3],obj.redo[0][i][4]);
			}
			obj.redo.shift();
			obj.undo.unshift(undo);
		}
	},
	Line:function(obj){
		var max={x:Math.max(obj.pos.s.x,obj.pos.e.x),y:Math.max(obj.pos.s.y,obj.pos.e.y),z:Math.max(obj.pos.s.z,obj.pos.e.z)};
		var min={x:Math.min(obj.pos.s.x,obj.pos.e.x),y:Math.min(obj.pos.s.y,obj.pos.e.y),z:Math.min(obj.pos.s.z,obj.pos.e.z)};
		var undo=[];
		var tar=target(obj.target);
		obj.log.push("Line:["+String(min.x)+","+String(min.y)+","+String(min.z)+"]-["+String(max.x)+","+String(max.y)+","+String(max.z)+"]");
		for(var i1=0;i1<=max.x-min.x;i1++){
			var x=min.x+i1,y=min.y+((max.y-min.y)/(max.x-min.x))*i1,z=min.z+((max.z-min.z)/(max.x-min.x))*i1;
			var id=getTile(x,y,z),dam=Level.getData(x,y,z);
			var block=getBlock(obj);
			if(tar==null){
				undo.push([x,y,z,id,dam]);
				setTile(x,y,z,block[0],block[1]);
			}else if(tar[id][dam]){
				undo.push([x,y,z,id,dam]);
				setTile(x,y,z,block[0],block[1]);
			}
		}
		for(var i1=0;i1<=max.y-min.y;i1++){
			var x=min.x+((max.x-min.x)/(max.y-min.y))*i1,y=min.y+i1,z=min.z+((max.z-min.z)/(max.y-min.y))*i1;
			var id=getTile(x,y,z),dam=Level.getData(x,y,z);
			var block=getBlock(obj);
			if(tar==null){
				undo.push([x,y,z,id,dam]);
				setTile(x,y,z,block[0],block[1]);
			}else if(tar[id][dam]){
				undo.push([x,y,z,id,dam]);
				setTile(x,y,z,block[0],block[1]);
			}
		}
		for(var i1=0;i1<=max.z-min.z;i1++){
			var x=min.x+((max.x-min.x)/(max.z-min.z))*i1,y=min.y+((max.y-min.y)/(max.z-min.z))*i1,z=min.z+i1;
			var id=getTile(x,y,z),dam=Level.getData(x,y,z);
			var block=getBlock(obj);
			if(tar==null){
				undo.push([x,y,z,id,dam]);
				setTile(x,y,z,block[0],block[1]);
			}else if(tar[id][dam]){
				undo.push([x,y,z,id,dam]);
				setTile(x,y,z,block[0],block[1]);
			}
		}
		obj.undo.unshift(undo);
		obj.redo=[];
	},
	Copy:function(obj,name){
		var max={x:Math.max(obj.pos.s.x,obj.pos.e.x),y:Math.max(obj.pos.s.y,obj.pos.e.y),z:Math.max(obj.pos.s.z,obj.pos.e.z)};
		var min={x:Math.min(obj.pos.s.x,obj.pos.e.x),y:Math.min(obj.pos.s.y,obj.pos.e.y),z:Math.min(obj.pos.s.z,obj.pos.e.z)};
		var tar=target(obj.target);
		var copy=[[max.x-min.x,max.y-min.y,max.z-min.z]];
		for(var i1=0;i1<=max.x-min.x;i1++){
			for(var i2=0;i2<=max.y-min.y;i2++){
				for(var i3=0;i3<=max.z-min.z;i3++){
					var id=getTile(min.x+i1,min.y+i2,min.z+i3),dam=Level.getData(min.x+i1,min.y+i2,min.z+i3);
					if(tar==null){
						if(obj.air){
							copy.push([min.x+i1-obj.pos.s.x,min.y+i2-obj.pos.s.y,min.z+i3-obj.pos.s.z,id,dam]);
						}else{
							if(id!=0)copy.push([min.x+i1-obj.pos.s.x,min.y+i2-obj.pos.s.y,min.z+i3-obj.pos.s.z,id,dam]);
						}
					}else if(tar[id][dam]){
						if(obj.air){
							copy.push([min.x+i1-obj.pos.s.x,min.y+i2-obj.pos.s.y,min.z+i3-obj.pos.s.z,id,dam]);
						}else{
							if(id!=0)copy.push([min.x+i1-obj.pos.s.x,min.y+i2-obj.pos.s.y,min.z+i3-obj.pos.s.z,id,dam]);
						}
					}
				}
			}
		}
		obj.clipboard[name]=copy;
	},
	Cut:function(obj,name){
		var max={x:Math.max(obj.pos.s.x,obj.pos.e.x),y:Math.max(obj.pos.s.y,obj.pos.e.y),z:Math.max(obj.pos.s.z,obj.pos.e.z)};
		var min={x:Math.min(obj.pos.s.x,obj.pos.e.x),y:Math.min(obj.pos.s.y,obj.pos.e.y),z:Math.min(obj.pos.s.z,obj.pos.e.z)};
		var tar=target(obj.target);
		var cut=[[max.x-min.x,max.y-min.y,max.z-min.z]];
		var undo=[];
		for(var i1=0;i1<=max.x-min.x;i1++){
			for(var i2=0;i2<=max.y-min.y;i2++){
				for(var i3=0;i3<=max.z-min.z;i3++){
					var id=getTile(min.x+i1,min.y+i2,min.z+i3),dam=Level.getData(min.x+i1,min.y+i2,min.z+i3);
					if(tar==null){
						if(obj.air){
							cut.push([min.x+i1-obj.pos.s.x,min.y+i2-obj.pos.s.y,min.z+i3-obj.pos.s.z,id,dam]);
							undo.push([min.x+i1,min.y+i2,min.z+i3,id,dam]);
							setTile(min.x+i1,min.y+i2,min.z+i3,0,0);
						}else{
							if(id!=0){
								cut.push([min.x+i1-obj.pos.s.x,min.y+i2-obj.pos.s.y,min.z+i3-obj.pos.s.z,id,dam]);
								undo.push([min.x+i1,min.y+i2,min.z+i3,id,dam]);
								setTile(min.x+i1,min.y+i2,min.z+i3,0,0);
							}
						}
					}else if(tar[id][dam]){
						if(obj.air){
							cut.push([min.x+i1-obj.pos.s.x,min.y+i2-obj.pos.s.y,min.z+i3-obj.pos.s.z,id,dam]);
							undo.push([min.x+i1,min.y+i2,min.z+i3,id,dam]);
							setTile(min.x+i1,min.y+i2,min.z+i3,0,0);
						}else{
							if(id!=0){
								cut.push([min.x+i1-obj.pos.s.x,min.y+i2-obj.pos.s.y,min.z+i3-obj.pos.s.z,id,dam]);
								undo.push([min.x+i1,min.y+i2,min.z+i3,id,dam]);
								setTile(min.x+i1,min.y+i2,min.z+i3,0,0);
							}
						}
					}
				}
			}
		}
		obj.clipboard[name]=cut;
		obj.undo.unshift(undo);
		obj.redo=[];
	},
	Paste:function(obj,x,y,z){
		var tar=target(obj.target);
		var undo=[];
		var x1=x,y1=y,z1=z;
		obj.log.push("Pasete");
		for(var i=0;i<Math.abs(obj.paste_num[0]);i++){
			x1=x+i*(obj.paste_num[0]<0 ? -1:1)*(obj.paste[0][0]+1);
			for(var ii=0;ii<Math.abs(obj.paste_num[1]);ii++){
				y1=y+ii*(obj.paste_num[1]<0 ? -1:1)*(obj.paste[0][1]+1);
				for(var iii=0;iii<Math.abs(obj.paste_num[2]);iii++){
					z1=z+iii*(obj.paste_num[2]<0 ? -1:1)*(obj.paste[0][2]+1);
					switch(obj.rotate){
						case 0:
							for(var i1=1;i1<obj.paste.length;i1++){
								var px=(obj.reverse.x ? -1*obj.paste[i1][0]:obj.paste[i1][0]),py=(obj.reverse.y ? -1*obj.paste[i1][1]:obj.paste[i1][1]),pz=(obj.reverse.z ? -1*obj.paste[i1][2]:obj.paste[i1][2]);
								var id=getTile(x1+px,y1+py,z1+pz),dam=Level.getData(x1+px,y1+py,z1+pz);
								if(tar==null){
									undo.push([x1+px,y1+py,z1+pz,id,dam]);
									setTile(x1+px,y1+py,z1+pz,obj.paste[i1][3],obj.paste[i1][4]);
								}else if(tar[id][dam]){
									undo.push([x1+px,y1+py,z1+pz,id,dam]);
									setTile(x1+px,y1+py,z1+pz,obj.paste[i1][3],obj.paste[i1][4]);
								}
							}
							break;
						case 1:
							for(var i1=1;i1<obj.paste.length;i1++){
								var px=(obj.reverse.x ? -1*obj.paste[i1][0]:obj.paste[i1][0]),py=(obj.reverse.y ? -1*obj.paste[i1][1]:obj.paste[i1][1]),pz=(obj.reverse.z ? -1*obj.paste[i1][2]:obj.paste[i1][2]);
								var id=getTile(x1+pz,y1+py,z1-px),dam=Level.getData(x1+pz,y1+py,z1-px);
								if(tar==null){
									undo.push([x1+pz,y1+py,z1-px,id,dam]);
									setTile(x1+pz,y1+py,z1-px,obj.paste[i1][3],obj.paste[i1][4]);
								}else if(tar[id][dam]){
									undo.push([x1+pz,y1+py,z1-px,id,dam]);
									setTile(x1+pz,y1+py,z1-px,obj.paste[i1][3],obj.paste[i1][4]);
								}
							}
							break;
						case 2:
							for(var i1=1;i1<obj.paste.length;i1++){
								var px=(obj.reverse.x ? -1*obj.paste[i1][0]:obj.paste[i1][0]),py=(obj.reverse.y ? -1*obj.paste[i1][1]:obj.paste[i1][1]),pz=(obj.reverse.z ? -1*obj.paste[i1][2]:obj.paste[i1][2]);
								var id=getTile(x1-px,y1+py,z1-pz),dam=Level.getData(x1-px,y1+py,z1-pz);
								if(tar==null){
									undo.push([x1-px,y1+py,z1-pz,id,dam]);
									setTile(x1-px,y1+py,z1-pz,obj.paste[i1][3],obj.paste[i1][4]);
								}else if(tar[id][dam]){
									undo.push([x-px,y+py,z-pz,id,dam]);
									setTile(x1-px,y1+py,z1-pz,obj.paste[i1][3],obj.paste[i1][4]);
								}
							}
							break;
						case 3:
							for(var i1=1;i1<obj.paste.length;i1++){
								var px=(obj.reverse.x ? -1*obj.paste[i1][0]:obj.paste[i1][0]),py=(obj.reverse.y ? -1*obj.paste[i1][1]:obj.paste[i1][1]),pz=(obj.reverse.z ? -1*obj.paste[i1][2]:obj.paste[i1][2]);
								var id=getTile(x1-pz,y1+py,z1+px),dam=Level.getData(x1-pz,y1+py,z1+px);
								if(tar==null){
									undo.push([x1-pz,y1+py,z1+px,id,dam]);
									setTile(x1-pz,y1+py,z1+px,obj.paste[i1][3],obj.paste[i1][4]);
								}else if(tar[id][dam]){
									undo.push([x1-pz,y1+py,z1+px,id,dam]);
									setTile(x1-pz,y1+py,z1+px,obj.paste[i1][3],obj.paste[i1][4]);
								}
							}
							break;
					}
				}
			}
		}
		obj.undo.unshift(undo);
		obj.redo=[];
	}
};

//Gui関連
var Gui={
	Base:(function(){
		//メインのwindow
		var window=new android.widget.PopupWindow(Math.floor(screen.x/4),Math.floor(screen.y));
		window.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(Color.parseColor(GuiColor.background)));
		window.setFocusable(true);
		window.update();
		
		//windowにcontentViewするレイアウト
		var main=new LinearLayout(Activity);
		main.setOrientation(1);
		window.setContentView(main);
		var sub=new AbsoluteLayout(Activity);
		sub.setBackgroundColor(Color.parseColor(GuiColor.top));
		sub.setLayoutParams(new LayoutParams(LayoutParams.FILL_PARENT,LayoutParams.WRAP_CONTENT));
		main.addView(sub);
		
		//上のレイアウトにaddViewされるモード表示のテキスト
		var title=new TextView(Activity);
		title.setTextColor(Color.parseColor(GuiColor.mode));
		title.setTextSize(30);
		title.setText(mList[m]);
		main.addView(title);
		
		//windowを閉じるボタン
		var close=new TextView(Activity);
		close.setLayoutParams(new AbsoluteLayout.LayoutParams(LayoutParams.WRAP_CONTENT,LayoutParams.WRAP_CONTENT,screen.x*(4/19),0));
		close.setText(">>");
		close.setTextColor(Color.parseColor(GuiColor.text));
		close.setOnClickListener(new OnClickListener({
			onClick:function(v){
				window.dismiss();
			}
		}));
		sub.addView(close);
		
		//モード選択のリストを出すためのボタン
		var mode=new TextView(Activity);
		mode.setLayoutParams(new AbsoluteLayout.LayoutParams(LayoutParams.WRAP_CONTENT,LayoutParams.WRAP_CONTENT,0,0));
		mode.setText(language[0]);
		mode.setTextColor(Color.parseColor(GuiColor.text));
		mode.setOnClickListener(new OnClickListener({
			onClick:function(v){
				var dia=new Dialog(Activity);
				var list=new ListView(Activity);
				var adapter=new ArrayAdapter(Activity,net.zhuoweizhang.mcpelauncher.R.layout.patch_list_item,mList);
				list.setAdapter(adapter);
				list.setOnItemClickListener(new AdapterView.OnItemClickListener(){
					onItemClick:function(parent,view,position,id){
						try{
							m=position;
							Gui.Base.change(Gui[mList[m]]());
							dia.dismiss();
						}catch(e){
							print(e);
						}
					}
				});
				dia.setContentView(list);
				dia.show();
			}
		}));
		sub.addView(mode);
		
		//windowの表示
		function show(){
			window.showAtLocation(Activity.getWindow().getDecorView(),Gravity.RIGHT|Gravity.TOP,0,0);
		}
		
		//mainのレイアウトを変更
		var v=null;
		function change(view){
			if(v!=null)main.removeView(v);
			if(view==undefined){
				v=null;
			}else{
				v=view;
				title.setText(mList[m]);
				main.addView(view);
			}
		}
		
		//ブロックのid,ダメージ値,比率入力のeditTextを生成
		function block(){
			var  edit_block=new EditText(Activity);
			var s="";
			for(var i1=0;i1<host.block.length;i1++){
				if(s!="")s+=",";
				s+=String(host.block[i1][0])+" "+String(host.block[i1][1])+" "+String(host.block[i1][2]);
			}
			edit_block.setText(s);
			edit_block.setTextColor(Color.parseColor(GuiColor.text));
			edit_block.addTextChangedListener(new TextWatcher(){
				afterTextChanged:function(s){
					var block1=String(s).split(","),block2=[];
					for(var i1=0;i1<block1.length;i1++){
						if(block1[i1]!=""){
							var block3=block1[i1].split(" ");
							block3[0]=Number(block3[0])>=0 ? Number(block3[0]):0;
							block3[1]=Number(block3[1])>=0 ? Number(block3[1]):0;
							block3[2]=Number(block3[2])>=0 ? Number(block3[2]):0;
							block2.push(block3);
						}
					}
					host.block=block2;
				}
			});
			return edit_block;
		}
		
		//設置の対象となるブロックを入力するeditTextを生成
		function target(){
			var edit_target=new EditText(Activity);
			var s="";
			for(var i1=0;i1<host.target.length;i1++){
				if(s!="")s+=",";
				s+=String(host.target[i1][0])+" "+String(host.target[i1][1]);
			}
			edit_target.setText(s);
			edit_target.setTextColor(Color.parseColor(GuiColor.text));
			edit_target.addTextChangedListener(new TextWatcher(){
				afterTextChanged:function(s){
					var target1=String(s).split(","),target2=[];
					for(var i1=0;i1<target1.length;i1++){
						if(target1[i1]!=""){
							var target3=target1[i1].split(" ");
							target3[0]=Number(target3[0])>=0 ? Number(target3[0]):0;
							target3[1]=Number(target3[1])>=0 ? Number(target3[1]):0;
							target2.push(target3);
						}
					}
					host.target=target2;
				}
			});
			return edit_target;
		}
		
		//pos1,pos2を設定するためのボタンのあるレイアウト
		function pos(){
			var layout=new LinearLayout(Activity);
			layout.setOrientation(0);
			layout.setGravity(Gravity.CENTER);
			layout.setLayoutParams(new LayoutParams(LayoutParams.FILL_PARENT,LayoutParams.WRAP_CONTENT));
			var pos1=new Button(Activity);
			pos1.setText(language[1]);
			pos1.setLayoutParams(new LayoutParams(screen.x/8,LayoutParams.WRAP_CONTENT));
			pos1.setTextColor(Color.parseColor(GuiColor.text));
			pos1.setBackgroundColor(Color.parseColor(GuiColor.button));
			pos1.setOnClickListener(new OnClickListener(){
				onClick:function(v){
					host.pos.s={x:Math.floor(getPlayerX()),y:Math.floor(getPlayerY())-2,z:Math.floor(getPlayerZ())};
					print(language[3]);
				}
			});
			var pos2=new Button(Activity);
			pos2.setText(language[2]);
			pos2.setLayoutParams(new LayoutParams(screen.x/8,LayoutParams.WRAP_CONTENT));
			pos2.setTextColor(Color.parseColor(GuiColor.text));
			pos2.setBackgroundColor(Color.parseColor(GuiColor.button));
			pos2.setOnClickListener(new OnClickListener(){
				onClick:function(v){
					host.pos.e={x:Math.floor(getPlayerX()),y:Math.floor(getPlayerY())-2,z:Math.floor(getPlayerZ())};
					print(language[4]);
				}
			});
			layout.addView(pos1);
			layout.addView(pos2);
			return layout;
		}
		
		//runボタンを生成
		function run(fnc){
			var btn=new Button(Activity);
			btn.setText(language[5]);
			btn.setTextColor(Color.parseColor(GuiColor.text));
			btn.setBackgroundColor(Color.parseColor(GuiColor.button));
			btn.setOnClickListener(new OnClickListener(){
				onClick:function(v){
					fnc();
				}
			});
			return btn;
		}
		
		//undo,redoのボタンを生成
		function unredo(fnc){
			var layout=new LinearLayout(Activity);
			layout.setOrientation(0);
			layout.setGravity(Gravity.CENTER);
			layout.setLayoutParams(new LayoutParams(LayoutParams.FILL_PARENT,LayoutParams.WRAP_CONTENT));
			var undo=new Button(Activity);
			undo.setText(language[6]);
			undo.setLayoutParams(new LayoutParams(screen.x/8,LayoutParams.WRAP_CONTENT));
			undo.setTextColor(Color.parseColor(GuiColor.text));
			undo.setBackgroundColor(Color.parseColor(GuiColor.button));
			undo.setOnClickListener(new OnClickListener(){
				onClick:function(v){
					process.push(['WE.Undo(host)']);
				}
			});
			var redo=new Button(Activity);
			redo.setText(language[7]);
			redo.setLayoutParams(new LayoutParams(screen.x/8,LayoutParams.WRAP_CONTENT));
			redo.setTextColor(Color.parseColor(GuiColor.text));
			redo.setBackgroundColor(Color.parseColor(GuiColor.button));
			redo.setOnClickListener(new OnClickListener(){
				onClick:function(v){
					process.push(['WE.Redo(host)']);
				}
			});
			layout.addView(undo);
			layout.addView(redo);
			return layout;
		}
		
		//チェックボタンのレイアウトを生成
		function check(str,checked,fnc){
			var layout=new LinearLayout(Activity);
			layout.setOrientation(0);
			layout.setLayoutParams(new LayoutParams(LayoutParams.FILL_PARENT,LayoutParams.WRAP_CONTENT));
			var text=WeText(str,15);
			text.setLayoutParams(new LayoutParams(Math.floor(screen.x/5),LayoutParams.WRAP_CONTENT));
			var checkbox=CheckBox(Activity);
			checkbox.setChecked(checked);
			checkbox.setOnClickListener(new OnClickListener(){
				onClick:function(v){
					fnc(v.isChecked());
				}
			});
			layout.addView(text);
			layout.addView(checkbox);
			return layout;
		}
		
		//radioボタンの生成
		function radio(list,checked,fnc){
			var group=new RadioGroup(Activity);
			group.setLayoutParams(new LayoutParams(LayoutParams.FILL_PARENT,LayoutParams.WRAP_CONTENT));
			for(var i1=0;i1<list.length;i1++){
				var rb=new RadioButton(Activity);
				rb.setText(list[i1]);
				rb.setId(i1);
				rb.setTextColor(Color.parseColor(GuiColor.text));
				group.addView(rb);
			}
			group.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener(){
				onCheckedChanged(group,checkedId){
					fnc(checkedId);
				}
			});
			group.check(checked);
			return group;
		}
		
		return {
			window:window,
			show:show,
			change:change,
			block:block,
			target:target,
			pos:pos,
			run:run,
			unredo:unredo,
			check:check,
			radio:radio
		};
	}()),
	
	//以下各モードのレイアウト生成
	Set:function(){
		var scroll=new ScrollView(Activity);
		var main=new LinearLayout(Activity);
		main.setOrientation(1);
		main.addView(this.Base.unredo());
		main.addView(this.Base.run(function(){
			process.push(['WE.Set(host)']);
		}));
		main.addView(this.Base.pos());
		main.addView(WeText(language[8],20));
		main.addView(this.Base.block());
		main.addView(WeText(language[9],20));
		main.addView(this.Base.target());
		scroll.addView(main);
		return scroll;
	},
	Circle:function(){
		var scroll=new ScrollView(Activity);
		var main=new LinearLayout(Activity);
		main.setOrientation(1);
		main.addView(this.Base.unredo());
		main.addView(WeText(language[8],20));
		main.addView(this.Base.block());
		main.addView(WeText(language[9],20));
		main.addView(this.Base.target());
		main.addView(WeText(language[15],20));
		var edit_rad=new EditText(Activity);
		edit_rad.setInputType( InputType.TYPE_CLASS_NUMBER);
		edit_rad.setText(String(host.r));
		edit_rad.setTextColor(Color.parseColor(GuiColor.text));
		edit_rad.addTextChangedListener(new TextWatcher(){
			afterTextChanged:function(s){
				host.r=(Number(s)>=0 ? Number(s):0);
			}
		});
		main.addView(edit_rad);
		main.addView(this.Base.check(language[17],host.fill,function(ischeck){
			host.fill=ischeck;
		}));
		scroll.addView(main);
		return scroll;
	},
	Sphere:function(){
		var scroll=new ScrollView(Activity);
		var main=new LinearLayout(Activity);
		main.setOrientation(1);
		main.addView(this.Base.unredo());
		main.addView(WeText(language[8],20));
		main.addView(this.Base.block());
		main.addView(WeText(language[9],20));
		main.addView(this.Base.target());
		main.addView(WeText(language[15],20));
		var edit_rad=new EditText(Activity);
		edit_rad.setInputType( InputType.TYPE_CLASS_NUMBER);
		edit_rad.setText(String(host.r));
		edit_rad.setTextColor(Color.parseColor(GuiColor.text));
		edit_rad.addTextChangedListener(new TextWatcher(){
			afterTextChanged:function(s){
				host.r=(Number(s)>=0 ? Number(s):0);
			}
		});
		main.addView(edit_rad);
		main.addView(this.Base.check(language[17],host.fill,function(ischeck){
			host.fill=ischeck;
		}));
		scroll.addView(main);
		return scroll;
	},
	Line:function(){
		var scroll=new ScrollView(Activity);
		var main=new LinearLayout(Activity);
		main.setOrientation(1);
		main.addView(this.Base.unredo());
		main.addView(this.Base.run(function(){
			process.push(['WE.Line(host)']);
		}));
		main.addView(this.Base.pos());
		main.addView(WeText(language[8],20));
		main.addView(this.Base.block());
		main.addView(WeText(language[9],20));
		main.addView(this.Base.target());
		scroll.addView(main);
		return scroll;
	},
	Copy:function(){
		var scroll=new ScrollView(Activity);
		var main=new LinearLayout(Activity);
		main.setOrientation(1);
		main.addView(this.Base.unredo());
		main.addView(this.Base.pos());
		main.addView(WeText(language[9],20));
		main.addView(this.Base.target());
		var edit_name=new EditText(Activity);
		edit_name.setTextColor(Color.parseColor(GuiColor.text));
		var layout=new LinearLayout(Activity);
		layout.setOrientation(0);
		layout.setGravity(Gravity.CENTER);
		layout.setLayoutParams(new LayoutParams(LayoutParams.FILL_PARENT,LayoutParams.WRAP_CONTENT));
		var bcopy=new Button(Activity);
		bcopy.setText(language[10]);
		bcopy.setLayoutParams(new LayoutParams(screen.x/8,LayoutParams.WRAP_CONTENT));
		bcopy.setTextColor(Color.parseColor(GuiColor.text));
		bcopy.setBackgroundColor(Color.parseColor(GuiColor.button));
		bcopy.setOnClickListener(new OnClickListener(){
			onClick:function(v){
				var name=edit_name.getText();
				if(name==""){
					print(language[16]);
				}else{
					process.push(['WE.Copy(host,"'+name+'");File.Save("ClipBoard",host.clipboard);',"[Copy] "+language[18]]);
				}
			}
		});
		var bcut=new Button(Activity);
		bcut.setText(language[11]);
		bcut.setLayoutParams(new LayoutParams(screen.x/8,LayoutParams.WRAP_CONTENT));
		bcut.setTextColor(Color.parseColor(GuiColor.text));
		bcut.setBackgroundColor(Color.parseColor(GuiColor.button));
		bcut.setOnClickListener(new OnClickListener(){
			onClick:function(v){
				var name=edit_name.getText();
				if(name==""){
					print(language[16]);
				}else{
					process.push(['WE.Cut(host,"'+name+'");File.Save("ClipBoard",host.clipboard);',"[Cut] "+language[18]]);
				}
			}
		});
		layout.addView(bcopy);
		layout.addView(bcut);
		main.addView(layout);
		main.addView(WeText(language[24],20));
		main.addView(edit_name);
		main.addView(this.Base.check(language[25],host.air,function(ischeck){
			host.air=ischeck;
		}));
		scroll.addView(main);
		return scroll;
	},
	Paste:function(){
		var scroll=new ScrollView(Activity);
		var main=new LinearLayout(Activity);
		main.setOrientation(1);
		main.addView(this.Base.unredo());
		main.addView(this.Base.run(function(){
			process.push(['WE.Paste(host,Math.floor(getPlayerX()),Math.floor(getPlayerY()),Math.floor(getPlayerZ()));']);
		}));
		main.addView((function(){
			var select=new Button(Activity);
			select.setText(language[22]);
			select.setOnClickListener(new OnClickListener(){
				onClick:function(v){
					var dia=new Dialog(Activity);
					var list=new ListView(Activity);
					var key=Object.keys(host.clipboard);
					var adapter=new ArrayAdapter(Activity,net.zhuoweizhang.mcpelauncher.R.layout.patch_list_item,key);
					list.setAdapter(adapter);
					list.setOnItemClickListener(new AdapterView.OnItemClickListener(){
						onItemClick:function(parent,view,position,id){
							try{
								var item=parent.getItemAtPosition(position);
								host.paste=(host.clipboard[item]==undefined ? []:host.clipboard[item]);
								dia.dismiss();
							}catch(e){
								print(e);
							}
						}
					});
					list.setOnItemLongClickListener(new AdapterView.OnItemLongClickListener(){
						onItemLongClick:function(parent,view,position,id){
							var item=parent.getItemAtPosition(position);
							var _dia=new Dialog(Activity);
							var button=new TextView(Activity);
							button.setText(language[23]);
							button.setOnClickListener((function(item){
								return new OnClickListener(){
									onClick:function(v){
										try{
											host.paste=[[0,0,0]];
											delete host.clipboard[item];
											File.Save("ClipBoard",host.clipboard);
											_dia.dismiss();
										}catch(e){
											print(e);
										}
									}
								}
							}(item)));
							button.setLayoutParams(new LayoutParams(screen.x/3,LayoutParams.WRAP_CONTENT));
							_dia.setContentView(button);
							_dia.show();
							return false;
						}
					});
					dia.setContentView(list);
					dia.show();
				}
			});
			select.setTextColor(Color.parseColor(GuiColor.text));
			select.setBackgroundColor(Color.parseColor(GuiColor.button));
			return select;
		}()));
		main.addView(WeText(language[26],20));
		var edit_xyz=new EditText(Activity);
		edit_xyz.setText(String(host.paste_num[0])+" "+String(host.paste_num[1])+" "+String(host.paste_num[2]));
		edit_xyz.setTextColor(Color.parseColor(GuiColor.text));
		edit_xyz.addTextChangedListener(new TextWatcher(){
			afterTextChanged:function(s){
				var xyz=String(s).split(" ");
				xyz[0]=(Number(xyz[0]==NaN ? 0:Number(xyz[0])));
				xyz[1]=(Number(xyz[1]==NaN ? 0:Number(xyz[1])));
				xyz[2]=(Number(xyz[2]==NaN ? 0:Number(xyz[2])));
				host.paste_num=xyz;
			}
		});
		main.addView(edit_xyz);
			
		main.addView(WeText(language[9],20));
		main.addView(this.Base.target());
		main.addView(WeText(language[12],20));
		main.addView(this.Base.radio(["0","90","180","270"],host.rotate,function(id){
			host.rotate=id;
		}));
		
		//Option
		main.addView(WeText(language[13],20));
		main.addView(this.Base.check(language[19],host.reverse.x,function(ischeck){
			host.reverse.x=ischeck;
		}));
		main.addView(this.Base.check(language[20],host.reverse.y,function(ischeck){
			host.reverse.y=ischeck;
		}));
		main.addView(this.Base.check(language[21],host.reverse.z,function(ischeck){
			host.reverse.z=ischeck;
		}));
		scroll.addView(main);
		return scroll;
	},
	Setting:function(){
		var scroll=new ScrollView(Activity);
		var main=new LinearLayout(Activity);
		main.setOrientation(1);
		main.addView(WeText(language[14],20));
		var edit_pile=new EditText(Activity);
		edit_pile.setText(String(Option.pile));
		edit_pile.setTextColor(Color.parseColor(GuiColor.text));
		edit_pile.addTextChangedListener(new TextWatcher(){
			afterTextChanged:function(s){
				Option.pile=(Number(s)>=0 ? Number(s):0);
				host.pile=Option.pile;
				File.Save("Option",Option);
			}
		});
		main.addView(edit_pile);
		
		main.addView(WeText(language[28],20));
		var scroll_mob=new ScrollView(Activity);
		var scrolllayout=new LinearLayout(Activity);
		scrolllayout.setOrientation(1);
		scroll_mob.setLayoutParams(new LayoutParams(LayoutParams.FILL_PARENT,Math.floor(screen.y/4)));
		for(var i1 in Option.mobspawn){
			scrolllayout.addView(this.Base.check(language[27][i1],Option.mobspawn[i1],(function(mob){
				return function(checked){
					Option.mobspawn[mob]=checked;
					var allent=Entity.getAll();
					for(var i2=0;i2<allent.length;i2++){
						var eid=Entity.getEntityTypeId(allent[i2]);
						if(!Option.mobspawn[mobName[eid]] && eid!=EntityType.PLAYER)Entity.remove(allent[i2]);
					}
					File.Save("Option",Option,true);
				}
			}(i1))));
		}
		scroll_mob.addView(scrolllayout);
		main.addView(scroll_mob);
		
		scroll.addView(main);
		return scroll;
	}
};

OnThread(function(){
	var window=new android.widget.PopupWindow(Math.floor(screen.x/18),LayoutParams.WRAP_CONTENT);
	var open=new TextView(Activity);
	open.setBackgroundColor(Color.parseColor(GuiColor.top));
	open.setTextColor(Color.parseColor(GuiColor.text));
	open.setText("<<");
	open.setGravity(Gravity.CENTER);
	open.setLayoutParams(new LayoutParams(LayoutParams.FILL_PARENT,LayoutParams.WRAP_CONTENT));
	open.setOnClickListener(new OnClickListener({
		onClick:function(v){
			try{
				Gui.Base.change(Gui[mList[m]]());
				Gui.Base.show();
			}catch(e){
				print(e);
			}
		}
	}));
	window.setContentView(open);
	window.showAtLocation(Activity.getWindow().getDecorView(),Gravity.RIGHT|Gravity.TOP,0,0);
});

//WE用のTextViewを生成
function WeText(text,size){
	var textview=new TextView(Activity);
	textview.setTextColor(Color.parseColor(GuiColor.text));
	textview.setText(text);
	textview.setTextSize(size);
	return textview;
}

function WeMessage(name,message){
	//Server.sendChat("\n[WorldEditor]\n>>"+name+"\n"+message);
	clientMessage("\n§a[WorldEditor]\n§4>>"+name+"\n§r"+message);
}

//[id,dam]を返す
function getBlock(obj){
	var total=0;
	for(var i1=0;i1<obj.block.length;i1++)total+=obj.block[i1][2];
	var r=Math.floor(Math.random()*total);
	total=0;
	for(var i1=0;i1<obj.block.length;i1++){
		total+=obj.block[i1][2];
		if(r<total)return [obj.block[i1][0],obj.block[i1][1]];
	}
	return null;
}

//コマンドの引数が正しいかチェック(num:数値,str:文字列,anum:任意の数値,astr:任意の文字列)
function CheckCommand(a,com){
	for(var i=0;i<a.length;i++){
		switch(a[i]){
			case "num":
				if(Number.isNaN(Number(com[i+2]))){
					return false;
				}
				break;
			case "str":
				if(!Number.isNaN(Number(com[i+2]))){
					return false;
				}
				break;
			case "anum":
				if(com[i+2]!=undefined){
					if(Number.isNaN(Number(com[i+2]))){
						return false;
					}
				}
				break;
			case "astr":
				if(com[i+2]!=undefined){
					if(!Number.isNaN(Number(com[i+2]))){
						return false;
					}
				}
				break;
		}
	}
	return true;
}

//[id][dam]でターゲットに指定されているブロックの真偽を返す
function target(block){
	if(block.length==0)return null;
	var tar=[];
	for(var i1=0;i1<=255;i1++){
		tar[i1]=[];
		for(var i2=0;i2<=15;i2++)tar[i1][i2]=false;
	}
	for(var i3=0;i3<block.length;i3++)tar[block[i3][0]][block[i3][1]]=true;
	return tar;
}

function OnThread(fnc){
	Activity.runOnUiThread(new java.lang.Runnable({
		run:function(){
			fnc();
		}
	}));
}

var print=function(str){
	android.widget.Toast.makeText(Activity,"WorldEditor:"+str,2).show();
}

