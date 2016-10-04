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

var display=new android.util.DisplayMetrics();
Activity.getWindowManager().getDefaultDisplay().getMetrics(display);
var screen={x:Math.max(display.widthPixels,display.heightPixels),y:Math.min(display.widthPixels,display.heightPixels)};

var GuiColor={
	top:"#000000",
	background:"#66000000",
	mode:"#F4A460",
	text:"#FFFFFF",
	button1:"#22000000",
	button2:"#22FFFFFF",
}

var m=0;
var mList=["Set","Circle","Sphere","Copy","Paste","Setting"];

var Option={
	pile:1,
};

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
	clipboard:{}
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
				case "Circle":
					WE.Circle(host,side,x,y,z);
					break;
				case "Sphere":
					WE.Sphere(host,x,y,z);
					break;
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
		if(obj.redo.length>0){
			for(var i=0;i<obj.redo[0].length;i++){
				undo.push([obj.redo[0][i][0],obj.redo[0][i][1],obj.redo[0][i][2],getTile(obj.redo[0][i][0],obj.redo[0][i][1],obj.redo[0][i][2]),Level.getData(obj.redo[0][i][0],obj.redo[0][i][1],obj.redo[0][i][2])]);
				setTile(obj.redo[0][i][0],obj.redo[0][i][1],obj.redo[0][i][2],obj.redo[0][i][3],obj.redo[0][i][4]);
			}
			obj.redo.shift();
			obj.undo.unshift(undo);
		}
	},
	Copy:function(obj,name){
		var max={x:Math.max(obj.pos.s.x,obj.pos.e.x),y:Math.max(obj.pos.s.y,obj.pos.e.y),z:Math.max(obj.pos.s.z,obj.pos.e.z)};
		var min={x:Math.min(obj.pos.s.x,obj.pos.e.x),y:Math.min(obj.pos.s.y,obj.pos.e.y),z:Math.min(obj.pos.s.z,obj.pos.e.z)};
		var tar=target(obj.target);
		var copy=[];
		for(var i1=min.x;i1<=max.x;i1++){
			for(var i2=min.y;i2<=max.y;i2++){
				for(var i3=min.z;i3<=max.z;i3++){
					var id=getTile(min.x+i1,min.y+i2,min.z+i3),dam=Level.getData(min.x+i1,min.y+i2,min.z+i3);
					if(tar==null){
						copy.push([min.x+i1,min.y+i2,min.z+i3,id,dam]);
					}else if(tar[id][dam]){
						copy.push([min.x+i1,min.y+i2,min.z+i3,id,dam]);
					}
				}
			}
		}
	},
	Cut:function(obj,name){
		var max={x:Math.max(obj.pos.s.x,obj.pos.e.x),y:Math.max(obj.pos.s.y,obj.pos.e.y),z:Math.max(obj.pos.s.z,obj.pos.e.z)};
		var min={x:Math.min(obj.pos.s.x,obj.pos.e.x),y:Math.min(obj.pos.s.y,obj.pos.e.y),z:Math.min(obj.pos.s.z,obj.pos.e.z)};
		var tar=target(obj.target);
		var cut=[];
		var undo=[];
		for(var i1=min.x;i1<=max.x;i1++){
			for(var i2=min.y;i2<=max.y;i2++){
				for(var i3=min.z;i3<=max.z;i3++){
					var id=getTile(min.x+i1,min.y+i2,min.z+i3),dam=Level.getData(min.x+i1,min.y+i2,min.z+i3);
					if(tar==null){
						cut.push([min.x+i1,min.y+i2,min.z+i3,id,dam]);
						undo.push([min.x+i1,min.y+i2,min.z+i3,id,dam]);
						setTile(min.x+i1,min.y+i2,min.z+i3,0,0);
					}else if(tar[id][dam]){
						cut.push([min.x+i1,min.y+i2,min.z+i3,id,dam]);
						undo.push([min.x+i1,min.y+i2,min.z+i3,id,dam]);
						setTile(min.x+i1,min.y+i2,min.z+i3,0,0);
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
		mode.setText("mode");
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
			pos1.setText("Pos1");
			pos1.setLayoutParams(new LayoutParams(screen.x/8,LayoutParams.WRAP_CONTENT));
			pos1.setTextColor(Color.parseColor(GuiColor.text));
			pos1.setBackgroundColor(Color.parseColor(GuiColor.button1));
			pos1.setOnClickListener(new OnClickListener(){
				onClick:function(v){
					host.pos.s={x:Math.floor(getPlayerX()),y:Math.floor(getPlayerY())-2,z:Math.floor(getPlayerZ())};
					print("Set pos1");
				}
			});
			var pos2=new Button(Activity);
			pos2.setText("Pos2");
			pos2.setLayoutParams(new LayoutParams(screen.x/8,LayoutParams.WRAP_CONTENT));
			pos2.setTextColor(Color.parseColor(GuiColor.text));
			pos2.setBackgroundColor(Color.parseColor(GuiColor.button1));
			pos2.setOnClickListener(new OnClickListener(){
				onClick:function(v){
					host.pos.e={x:Math.floor(getPlayerX()),y:Math.floor(getPlayerY())-2,z:Math.floor(getPlayerZ())};
					print("Set pos2");
				}
			});
			layout.addView(pos1);
			layout.addView(pos2);
			return layout;
		}
		
		//runボタンを生成
		function run(fnc){
			var btn=new Button(Activity);
			btn.setText("Run");
			btn.setTextColor(Color.parseColor(GuiColor.text));
			btn.setBackgroundColor(Color.parseColor(GuiColor.button2));
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
			undo.setText("Undo");
			undo.setLayoutParams(new LayoutParams(screen.x/8,LayoutParams.WRAP_CONTENT));
			undo.setTextColor(Color.parseColor(GuiColor.text));
			undo.setBackgroundColor(Color.parseColor(GuiColor.button1));
			undo.setOnClickListener(new OnClickListener(){
				onClick:function(v){
					process.push(['WE.Undo(host)']);
				}
			});
			var redo=new Button(Activity);
			redo.setText("Redo");
			redo.setLayoutParams(new LayoutParams(screen.x/8,LayoutParams.WRAP_CONTENT));
			redo.setTextColor(Color.parseColor(GuiColor.text));
			redo.setBackgroundColor(Color.parseColor(GuiColor.button1));
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
			layout.setGravity(Gravity.CENTER);
			layout.setLayoutParams(new LayoutParams(LayoutParams.FILL_PARENT,LayoutParams.WRAP_CONTENT));
			var text=WeText(str,15);
			text.setLayoutParams(new LayoutParams(screen.x*(12/16),LayoutParams.WRAP_CONTENT));
			var checkbox=CheckBox(Activity);
			checkbox.setChecked(checked);
			checkbox.setLayoutParams(new LayoutParams(screen.x*(1/4),LayoutParams.WRAP_CONTENT));
			checkbox.setOnClickListener(new OnClickListener(){
				onClick:function(v){
					fnc(v.isChecked());
				}
			});
			layout.addView(text);
			layout.addView(checkbox);
			return layout;
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
			check:check
		};
	}()),
	
	//以下各モードのレイアウト生成
	Set:function(){
		var scroll=new ScrollView(Activity);
		var main=new LinearLayout(Activity);
		main.setOrientation(1);
		main.addView(this.Base.unredo());
		main.addView(this.Base.run(function(){
			process.push(['WE.Set(host)',"[Set] completed"]);
		}));
		main.addView(this.Base.pos());
		main.addView(WeText("Block",20));
		main.addView(this.Base.block());
		main.addView(WeText("Target",20));
		main.addView(this.Base.target());
		scroll.addView(main);
		return scroll;
	},
	Circle:function(){
		var scroll=new ScrollView(Activity);
		var main=new LinearLayout(Activity);
		main.setOrientation(1);
		main.addView(this.Base.unredo());
		main.addView(WeText("Block",20));
		main.addView(this.Base.block());
		main.addView(WeText("Target",20));
		main.addView(this.Base.target());
		main.addView(WeText("Radius",20));
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
		main.addView(this.Base.check("Fill",host.fill,function(ischeck){
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
		main.addView(WeText("Block",20));
		main.addView(this.Base.block());
		main.addView(WeText("Target",20));
		main.addView(this.Base.target());
		main.addView(WeText("Radius",20));
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
		main.addView(this.Base.check("Fill",host.fill,function(ischeck){
			host.fill=ischeck;
		}));
		scroll.addView(main);
		return scroll;
	},
	Copy:function(){
		var scroll=new ScrollView(Activity);
		var main=new LinearLayout(Activity);
		main.setOrientation(1);
		main.addView(this.Base.unredo());
		main.addView(WeText("Target",20));
		main.addView(this.Base.target());
		var edit_name=new EditText(Activity);
		edit_name.setTextColor(Color.parseColor(GuiColor.text));
		var layout=new LinearLayout(Activity);
		layout.setOrientation(0);
		layout.setGravity(Gravity.CENTER);
		layout.setLayoutParams(new LayoutParams(LayoutParams.FILL_PARENT,LayoutParams.WRAP_CONTENT));
		var bcopy=new Button(Activity);
		bcopy.setText("Copy");
		bcopy.setLayoutParams(new LayoutParams(screen.x/8,LayoutParams.WRAP_CONTENT));
		bcopy.setTextColor(Color.parseColor(GuiColor.text));
		bcopy.setBackgroundColor(Color.parseColor(GuiColor.button2));
		bcopy.setOnClickListener(new OnClickListener(){
			onClick:function(v){
				var name=edit_name.getText();
				if(name==""){
					print("Please enter a name");
				}else{
					process.push(["WE.Copy(host,"+name+');File.Save("ClipBoard",host.clipboard);',"[Copy] completed"]);
				}
			}
		});
		var bcut=new Button(Activity);
		bcut.setText("Cut");
		bcut.setLayoutParams(new LayoutParams(screen.x/8,LayoutParams.WRAP_CONTENT));
		bcut.setTextColor(Color.parseColor(GuiColor.text));
		bcut.setBackgroundColor(Color.parseColor(GuiColor.button2));
		bcut.setOnClickListener(new OnClickListener(){
			onClick:function(v){
				var name=edit_name.getText();
				if(name==""){
					print("Please enter a name");
				}else{
					process.push(["WE.Cut(host,"+name+');File.Save("ClipBoard",host.clipboard);',"[Cut] completed"]);
				}
			}
		});
		layout.addView(bcopy);
		layout.addView(bcut);
		main.addView(layout);
		main.addView(edit_name);
		scroll.addView(main);
		return scroll;
	},
	Paste:function(){
		var scroll=new ScrollView(Activity);
		var main=new LinearLayout(Activity);
		main.setOrientation(1);
		main.addView(this.Base.unredo());
		main.addView(WeText("Target",20));
		main.addView(this.Base.target());
		scroll.addView(main);
		return scroll;
	},
	Setting:function(){
		var scroll=new ScrollView(Activity);
		var main=new LinearLayout(Activity);
		main.setOrientation(1);
		main.addView(WeText("Pile",20));
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

