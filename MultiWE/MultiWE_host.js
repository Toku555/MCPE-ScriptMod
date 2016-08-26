var Activity=com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
var LinearLayout=android.widget.LinearLayout;
var Dialog=android.app.Dialog;
var TableLayout=android.widget.TableLayout;
var TableRow=android.widget.TableRow;
var TextView=android.widget.TextView;
var Button=android.widget.Button;
var OnClickListener=android.view.View.OnClickListener;
var Gravity=android.view.Gravity;

var player={};

function NewObj(){
	return {
		Dialog:true,
		Auth:false,
		Undo:[],
		Redo:[],
		PileUp:1,
		Pos:{
			s:{x:null,y:null,z:null},
			e:{x:null,y:null,z:null}
		}
	};
}

var WeCommand={
	enter:{
		fnc:function(name){
			Activity.runOnUiThread(new java.lang.Runnable({
				run:function(){
					if(player[name].Dialog){
						var dia=new Dialog(Activity);
						var mainlayout=new LinearLayout(Activity);
						mainlayout.setOrientation(1);
						mainlayout.setGravity(Gravity.CENTER);
						var text=new TextView(Activity);
						text.setText("[WorldEditor]\n"+name+"にWEを使用する権限を与えますか?");
						mainlayout.addView(text);
						var sublayout=new TableLayout(Activity);
						var subsublayout=new TableRow(Activity);
						subsublayout.setGravity(Gravity.CENTER);
						var button1=Button(Activity);
						button1.setText("はい");
						var click1=new OnClickListener(){
							onClick:function(v){
								WeMessage(name,"WEを使用する権限を与えました");
								player[name].Dialog=false;
								player[name].Auth=true;
								dia.dismiss();
							}
						}
						button1.setOnClickListener(click1);
						subsublayout.addView(button1);
						var button2=Button(Activity);
						button2.setText("いいえ");
						var click2=new OnClickListener(){
							onClick:function(v){
								player[name].Dialog=false;
								dia.dismiss();
							}
						}
						button2.setOnClickListener(click2);
						subsublayout.addView(button2);
						sublayout.addView(subsublayout);
						mainlayout.addView(sublayout);
						dia.setContentView(mainlayout);
						dia.show();
					}
				}
			}));
		}
	},
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
		arg:[],
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
				WE.All(name,Number(com[2]),dam);
			}
		}
	}
};

var WE={
	Circle:function(name,r,id,dam,x,y,z){
		
	},
	All:function(name,id,dam){
		var max={x:Math.max(player[name].Pos.s.x,player[name].Pos.e.x),y:Math.max(player[name].Pos.s.y,player[name].Pos.e.y),z:Math.max(player[name].Pos.s.z,player[name].Pos.e.z)};
		var min={x:Math.min(player[name].Pos.s.x,player[name].Pos.e.x),y:Math.min(player[name].Pos.s.y,player[name].Pos.e.y),z:Math.min(player[name].Pos.s.z,player[name].Pos.e.z)};
		var undo=[];
		for(var i1=min.x;i1<=max.x;i1++){
			for(var i2=min.y;i2<=max.y;i2++){
				for(var i3=min.z;i3<=max.z;i3++){
					undo.push([i1,i2,i3,getTile(i1,i2,i3),Level.getData(i1,i2,i3)]);
					setTile(i1,i2,i3,id,dam);
				}
			}
		}
		player[name].Undo.push(undo);
	}
};

function useItem(x,y,z,itemId,blockId,side,itemDamage,blockDamage){
	if(itemId==280){
		var cn=Player.getItemCustomName(0);
		if(cn!=null){
			var com=cn.split(" ");
			if(com[0]=="we"){
				var pname=Player.getName(getPlayerEnt());
				if(player[pname]==undefined){
					player[pname]=NewObj();
				}
				if(com[1]=="enter"){
					if(!player[pname].Auth)WeCommand.enter.fnc(pname);
				}else{
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
