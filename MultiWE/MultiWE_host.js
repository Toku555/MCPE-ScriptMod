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

var display=new android.util.DisplayMetrics();
Activity.getWindowManager().getDefaultDisplay().getMetrics(display);
var screen={x:Math.max(display.widthPixels,display.heightPixels),y:Math.min(display.widthPixels,display.heightPixels)};

var GuiColor={
	top:"#000000",
	background:"#66000000",
	mode:"#F4A460",
	text:"#FFFFFF"
}

var m=0;
var mList=["Set","Setting"];

var host={
	id:0,
	dam:0,
	target:[],
	pos:{s:{x:null,y:null,z:null},e:{x:null,y:null,z:null}}
};

var process=[];
var Option={
	processType:0,
	speed:3
};

var ClipBoard={};

var player=[];

var SDcard=android.os.Environment.getExternalStorageDirectory();
var MCPEdata=new java.io.File(SDcard.getAbsolutePath()+"/games/com.mojang/minecraftpe");
var File={
	Save:function(name,data){
		var Folder=new java.io.File(MCPEdata+"/WorldEditor");
		Folder.mkdirs();
		var DataFile=new java.io.File(MCPEdata+"/WorldEditor/"+name+".json");
		DataFile.createNewFile();
		var DataWrite=new java.io.FileWriter(DataFile,false);
		DataWrite.write(JSON.stringify(data,null,"\t"));
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
if(_GuiColor==null)File.Save("GuiColor",GuiColor);else GuiColor=_GuiColor;
var _Option=File.Load("Option");
if(_Option==null)File.Save("Option",Option);else Option=_Option;
var _ClipBoard=File.Load("ClipBoard");
if(_ClipBoard==null)File.Save("ClipBoard",ClipBoard);else ClipBoard=_ClipBoard;


function modTick(){
	for(var i=0;i<=Option.speed;i++){
		if(process.length>0){
			if(process[0].set.length>process[0].i){
				process[0].undo.push([process[0].set[0],process[0].set[1],process[0].set[2],getTile(process[0].set[0],process[0].set[1],process[0].set[2]),Level.getData(process[0].set[0],process[0].set[1],process[0].set[2])]);
				setTile(process[0].set[0],process[0].set[1],process[0].set[2],process[0].set[3],process[0].set[4]);
				process[0].i++;
			}else{
				player[process[0].name].Undo.push();
				process.shift();
			}
		}
	}
}

function useItem(x,y,z,iid,bid,side,idam,bdam){
	if(iid==280){
		var cn=Player.getItemCustomName(0);
		if(cn!=null){
			var com=cn.split(" ");
			if(com[0]=="we"){
				var pname=Player.getName(getPlayerEnt());
				if(player[pname]==undefined){
					player[pname]=new PlayerObj();
				}
				if(player[pname].Auth){
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

function onThread(func){
	Activity.runOnUiThread(new java.lang.Runnable({
		run:function(){
			func();
		}
	}));
}

function PlayerObj(){
	this.Auth=false;
	this.Log=[];
	this.Undo=[];
	this.Redo=[];
	this.PileUp=1;
	this.Pos={
		s:{x:null,y:null,z:null},
		e:{x:null,y:null,z:null}
	};
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

var WE={
	Circle:function(name,r,id,dam,x,y,z){

	},
	All:function(name,id,dam,type){
		var max={x:Math.max(player[name].Pos.s.x,player[name].Pos.e.x),y:Math.max(player[name].Pos.s.y,player[name].Pos.e.y),z:Math.max(player[name].Pos.s.z,player[name].Pos.e.z)};
		var min={x:Math.min(player[name].Pos.s.x,player[name].Pos.e.x),y:Math.min(player[name].Pos.s.y,player[name].Pos.e.y),z:Math.min(player[name].Pos.s.z,player[name].Pos.e.z)};
		var undo=[];
		player[name].Log.push("All:"+String(max.x-min.x)+"*"+String(max.y-min.y)+"*"+String(max.z-min.z));
		if(type==0){
			for(var i1=min.x;i1<=max.x;i1++){
				for(var i2=min.y;i2<=max.y;i2++){
					for(var i3=min.z;i3<=max.z;i3++){
						undo.push([i1,i2,i3,getTile(i1,i2,i3),Level.getData(i1,i2,i3)]);
						setTile(i1,i2,i3,id,dam);
					}
				}
			}
			player[name].Undo.unshift(undo);
		}else if(tyoe==1){
			var set=[];
			for(var i1=min.x;i1<=max.x;i1++){
				for(var i2=min.y;i2<=max.y;i2++){
					for(var i3=min.z;i3<=max.z;i3++){
						set.push([i1,i2,i3,getTile(i1,i2,i3),Level.getData(i1,i2,i3)]);
					}
				}
			}
			process.push({
				player:name,
				name:"All",
				undo:[],
				i:0,
				set:set
			});
		}
	}
};

var Gui=(function(){
	
	Base=(function(){
		var window=new android.widget.PopupWindow(Math.floor(screen.x/4),Math.floor(screen.y));
		window.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(Color.parseColor(GuiColor.background)));
		window.setFocusable(true);
		//window.setOutsideTouchable(false);
		/*window.setTouchInterceptor(new OnTouchListener(){
			onTouch:function(v,event){
				clientMessage(event.getAction());
				switch(event.getAction()){
					case 0:
						return false;
						break;
				}
				return false;
			}
		});*/
		window.update();
		var main=new LinearLayout(Activity);
		main.setOrientation(1);
		window.setContentView(main);
		var sub=new AbsoluteLayout(Activity);
		sub.setBackgroundColor(Color.parseColor(GuiColor.top));
		sub.setLayoutParams(new LayoutParams(LayoutParams.FILL_PARENT,LayoutParams.WRAP_CONTENT));
		main.addView(sub);
		
		var title=new TextView(Activity);
		title.setTextColor(Color.parseColor(GuiColor.mode));
		title.setTextSize(30);
		title.setText(mList[m]);
		main.addView(title);
		
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
							Gui.Base.change(Gui[mList[m]]);
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
		
		function show(){
			window.showAtLocation(Activity.getWindow().getDecorView(),Gravity.RIGHT|Gravity.TOP,0,0);
		}
		
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
		
		WeText=function(text,size){
			var textview=new TextView(Activity);
			textview.setTextColor(Color.parseColor(GuiColor.text));
			textview.setText(text);
			textview.setTextSize(size);
			return textview;
		}
		
		var  edit_id=new EditText(Activity);
		edit_id.setInputType(InputType.TYPE_CLASS_NUMBER);
		edit_id.setText("0");
		edit_id.setTextColor(Color.parseColor(GuiColor.text));
		edit_id.addTextChangedListener(new TextWatcher(){
			afterTextChanged:function(s){
				host.id=Number(s)==NaN ? 0:Number(s);
			}
		});
		//edit_id.setBackgroundColor(Color.parseColor("#00000000"));
		
		var  edit_dam=new EditText(Activity);
		edit_dam.setInputType(InputType.TYPE_CLASS_NUMBER);
		edit_dam.setText("0");
		edit_dam.setTextColor(Color.parseColor(GuiColor.text));
		edit_dam.addTextChangedListener(new TextWatcher(){
			afterTextChanged:function(s){
				host.dam=Number(s)==NaN ? 0:Number(s);
			}
		});
		//edit_dam.setBackgroundColor(Color.parseColor("#00000000"));
		
		var edit_target=new EditText(Activity);
		//edit_target.setInputType(InputType.TYPE_CLASS_NUMBER);
		edit_target.setText("0");
		edit_target.setTextColor(Color.parseColor(GuiColor.text));
		edit_target.addTextChangedListener(new TextWatcher(){
			afterTextChanged:function(s){
				try{
					var target1=String(s).split(","),target2=[];
					for(var i1=0;i1<target1.length;i1++){
						var target3=target1[i1].split(":");
						target3[0]=Number(target3[0])==NaN ? 0:Number(target3[0]);
						target3[1]=Number(target3[1])==NaN ? 0:Number(target3[1]);
						target2.push(target3);
					}
					host.target=target2;
					clientMessage(JSON.stringify(host.target));
				}catch(e){
					print(e);
				}
			}
		});
		
		return {
			window:window,
			show:show,
			change:change,
			id:edit_id,
			dam:edit_dam,
			target:edit_target
		};
	}());
	
	
	var Set=(function(){
		var scroll=new ScrollView(Activity);
		var main=new LinearLayout(Activity);
		main.setOrientation(1);
		main.addView(WeText("ID",20));
		main.addView(Base.id);
		main.addView(WeText("Damage",20));
		main.addView(Base.dam);
		main.addView(WeText("Target",20));
		main.addView(Base.target);
		scroll.addView(main);
		return scroll;
	}());
	
	
	var Setting=(function(){
		var main=new LinearLayout(Activity);
		main.setOrientation(1);
		return main;
	}());
	
	return {
		Base:Base,
		Set:Set,
		Setting:Setting
	}
}());

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
			Gui.Base.change(Gui[mList[m]]);
			Gui.Base.show();
			}catch(e){
				print(e);
			}
		}
	}));
	window.setContentView(open);
	window.showAtLocation(Activity.getWindow().getDecorView(),Gravity.RIGHT|Gravity.TOP,0,0);
});

function WeMessage(name,message){
	//Server.sendChat("\n[WorldEditor]\n>>"+name+"\n"+message);
	clientMessage("\n[WorldEditor]\n>>"+name+"\n"+message);
}

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

function OnThread(fnc){
	Activity.runOnUiThread(new java.lang.Runnable({
		run:function(){
			fnc();
		}
	}));
}
