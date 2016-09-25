var Activity=com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
var LinearLayout=android.widget.LinearLayout;
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

var display=new android.util.DisplayMetrics();
Activity.getWindowManager().getDefaultDisplay().getMetrics(display);
var screen={x:Math.max(display.widthPixels,display.heightPixels),y:Math.min(display.widthPixels,display.heightPixels)};

var m=0;
var mList=["All","Setting"];

var host={
	id:0,
	dam:0,
	pos:{s:{x:null,y:null,z:null},e:{x:null,y:null,z:null}}
};

var process=[];
var option={
	processType:0,
	speed:3
};

var player=[];

function modTick(){
	for(var i=0;i<=option.speed;i++){
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
	this.Undo:[];
	this.Redo:[];
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
				WE.All(name,Number(com[2]),dam,option.processType);
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
						set.push([i1,i2,i3,getTile(i1,i2,i3),Level.getData(i1,i2,i3);
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

var Gui={
	Base:(function(){
		var window=new android.widget.PopupWindow(Math.floor(screen.x/4),Math.floor(screen.y));
		window.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(Color.parseColor("#66000000")));
		main.setOrientation(1);
		var main=new LinearLayout(Activity);
		window.setContentView(main);
		var sub=new AbsoluteLayout(Activity);
		sub.setBackgroundColor(Color.BLACK);
		sub.setLayoutParams(new LayoutParams(LayoutParams.FILL_PARENT,LayoutParams.WRAP_CONTENT));
		main.addView(sub);
		
		var title=new TextView(Activity);
		title.setTextColor(Color.WHITE);
		title.setTextSize(16);
		title.setText(mList[m]);
		main.addView(title);
		
		var close=new TextView(Activity);
		close.setLayoutParams(new AbsoluteLayout.LayoutParams(LayoutParams.WRAP_CONTENT,LayoutParams.WRAP_CONTENT,screen.x*(3/16),0));
		close.setText(">>");
		close.setTextColor(Color.WHITE);
		close.setOnClickListener(new OnClickListener({
			onClick:function(v){
				window.dismiss();
			}
		}));
		sub.addView(close);
		var mode=new TextView(Activity);
		mode.setLayoutParams(new AbsoluteLayout.LayoutParams(LayoutParams.WRAP_CONTENT,LayoutParams.WRAP_CONTENT,0,0));
		mode.setText("mode");
		mode.setTextColor(Color.WHITE);
		mode.setOnClickListener(new OnClickListener({
			onClick:function(v){
				var dia=new Dialog(Activity);
				var list=new ListView(Activity);
				var adapter=new ArrayAdapter(Activity,net.zhuoweizhang.mcpelauncher.R.layout.patch_list_item,list);
				list.setAdapter(adapter);
				list.setOnItemClickListener(new AdapterView.OnItemClickListener(){
				onItemClick:function(parent,view,position,id){
					m=position;
					Gui.Base.change(mList[m]);
					dia.dismiss();
				}
				dia.setContentView(list);
				dia.show();
			});
				
			}
		}));
		sub.addView(mode);
		
		function show(){
			window.showAtLocation(Activity.getWindow().getDecorView(),Gravity.RIGHT|Gravity.TOP,0,0);
		}
		
		var v=null;
		function change(view){
			if(v!=null)layout.removeView(v);
			if(view==undefined){
				v=null;
			}else{
				v=view;
				title.setText(mList[m]);
				layout.addView(view);
			}
		}
		
		var  edit_id=new EditText(Activity);
		edit_id.setInputType(InputType.TYPE_CLASS_NUMBER);
		edit_id.setText("0");
		
		var  edit_dam=new EditText(Activity);
		edit_dam.setInputType(InputType.TYPE_CLASS_NUMBER);
		edit_dam.setText("0");
		
		return {
			window:window,
			show:show,
			change:change,
			id:edit_id,
			dam:edit_dam
		};
	}()),
	
	All:function(){
		var main=new LinearLayout(Activity);
		main.setOrientation(1);
		main.addView(Gui.Base.id);
		main.addView(Gui.Base.dam);
		return main;
	},
	Setting:function(){
		var main=new LinearLayout(Activity);
		return main;
	}
}

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
