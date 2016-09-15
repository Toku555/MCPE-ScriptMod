var mcpelauncher=net.zhuoweizhang.mcpelauncher;

var AdapterView=android.widget.AdapterView;
var ArrayAdapter=android.widget.ArrayAdapter;
var ListView=android.widget.ListView;
var Dialog=android.app.Dialog;
var LinearLayout=android.widget.LinearLayout;
var TableLayout=android.widget.TableLayout;
var TableRow=android.widget.TableRow;
var Button=android.widget.Button;
var ScrollView=android.widget.ScrollView;
var EditText=android.widget.EditText;
var SeekBar=android.widget.SeekBar;
var OnClickListener=android.view.View.OnClickListener;
var Color=android.graphics.Color;
var PopupWindow=android.widget.PopupWindow;
var Gravity=android.view.Gravity;
var TextView=android.widget.TextView;
var LayoutParams=android.view.ViewGroup.LayoutParams;
var AbsoluteLayout=android.widget.AbsoluteLayout;


var Activity=com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
var display=new android.util.DisplayMetrics();
Activity.getWindowManager().getDefaultDisplay().getMetrics(display);
var screen={x:Math.max(display.widthPixels,display.heightPixels),y:Math.min(display.widthPixels,display.heightPixels)};



var edit=null;
var d={part:"",id:""};
var rdata=new NewObj();
var rpart=["RLeg","LLeg","RArm","LArm","Head","Body"];
var help=[
	' /name [レンダラ名]',
	' /list [パーツ]',
	' /edit [パーツ] [id]',
	' /add [パーツ] [id]',
	' /delete [パーツ] [id]',
	' /pos [数値] [数値] [数値]',
	' /ppos [パーツ] [数値] [数値] [数値]',
	' /size [数値]',
	' /load',
	' /save'
];

function NewObj(){
	this.size=16;
	this.pos=[0,0,0];
	this.render=[];
}

function UiThread(func){
	Activity.runOnUiThread(new java.lang.Runnable({
		run:function(){
			func();
		}
	}));
}

var flag={s:false,e:false};
var Pos={s:{x:0,y:0,z:0},e:{x:0,y:0,z:0}};
var mob;

ModPE.overrideTexture("images/mob/RenderMaker.png",'http://i.imgur.com/jxFE01M.png');

UiThread(function(){
	var window=new PopupWindow(Math.floor(screen.x/16),LayoutParams.WRAP_CONTENT);
	var text=new TextView(Activity);
	text.setText("open");
	text.setTextColor(Color.WHITE);
	text.setBackgroundColor(Color.BLACK);
	text.setOnClickListener(new OnClickListener(){
		onClick:function(v){
			try{
				var layout;
				if(edit==null){
					layout=Gui.SelectFile();
				}else if(d.part==""){
					layout=Gui.SelectPart();
				}else if(d.id==""){
					layout=Gui.SelectId();
				}else{
					layout=Gui.Edit();
				}
				Gui.Base.change(layout);
				Gui.Base.show();
			}catch(e){
				clientMessage(e);
			}
		}
	});
	window.setContentView(text);
	window.showAtLocation(Activity.getWindow().getDecorView(),Gravity.LEFT|Gravity.TOP,0,0);
});

function procCmd(command){
	var com=command.split(" ");
	switch(com[0]){
		case "name":
			if(com[1]==undefined){
				clientMessage("名前を入力してください。");
			}else{
				edit=new MakeRender(com[1]);
			}
			break;
		case "list":
			if(rpart.indexOf(com[1])>=0){
				var list=edit.list(com[1]);
				clientMessage(com[1]+"のid一覧");
				for(var i=0;i<list.length;i++){
					clientMessage(list[i]);
				}
			}else{
				clientMessage("存在しないパーツです");
			}
			break;
		case "edit":
			if(rpart.indexOf(com[1])>=0){
				if(edit.exist(com[1],com[2])){
					d={part:com[1],id:com[2]};
					clientMessage(com[1]+":"+com[2]+"を編集します");
				}else{
					clientMessage("存在しないidです");
				}
			}else{
				clientMessage("存在しないパーツです");
			}
			break;
		case "add":
			if(edit==null){
				clientMessage("名前を設定してください");
			}else{
				if(rpart.indexOf(com[1])>=0){
					if(com[2]==undefined){
						clientMessage("idを入力して下さい");
					}else{
						edit.setData(com[1],com[2],JSON.stringify(rdata));
						rdata=new NewObj();
						clientMessage(com[1]+"に"+com[2]+"としてデータを追加");
						setRender();
					}
				}else{
					clientMessage("存在しないパーツです");
				}
			}
			break;
		case "delete":
			if(edit==null){
				clientMessage("名前を設定してください");
			}else{
				if(rpart.indexOf(com[1])>=0){
					if(edit.exist(com[1],com[2])){
						edit.Delete(com[1],com[2]);
						clientMessage(com[1]+":"+com[2]+"を削除しました");
						setRender();
					}
				}else{
					clientMessage("存在しないパーツです");
				}
			}
			break;
		case "pos":
			if(edit==null){
				clientMessage("名前を設定してください");
			}else{
				if(edit.exist(d.part,d.id)){
					edit.setPos(d.part,d.id,com[1],com[2],com[3]);
					clientMessage(d.part+"の"+d.id+"の座標を変更");
					setRender();
				}else{
					clientMessage("存在しないidです");
				}
			}
			break;
		case "ppos":
			if(edit==null){
				clientMessage("名前を設定してください");
			}else{
				if(rpart.indexOf(com[1])>=0){
					edit.setPartPos(com[1],com[2],com[3],com[4]);
					clientMessage(com[1]+"の座標を変更");
					setRender();
				}else{
					clientMessage("存在しないパーツです");
				}
			}
			break;
		case "size":
			if(edit==null){
				clientMessage("名前を設定してください");
			}else{
				var num=Number(com[1]);
				if(num==NaN){
					clientMessage("数値を設定してください");
				}else{
					if(edit.exist(d.part,d.id)){
						edit.setSize(d.part,d.id,num);
						setRender();
					}else{
						clientMessage("存在しないidです");
					}
				}
			}
			break;
		case "load":
			if(flag.s && flag.e){
				LoadBlock(Pos.s.x,Pos.s.y,Pos.s.z,Pos.e.x,Pos.e.y,Pos.e.z);
				clientMessage("ブロックを読み込ました");
				flag.s=false;
				flag.e=false;
			}else{
				clientMessage("始点と終点を設定してください");
			}
			break;
		case "save":
			edit.Save();
			clientMessage("保存しました");
			break;
		case "help":
			for(var i in help)clientMessage(help[i]);
			break;
	}
}

function modTick(){
	var yaw=Math.floor(getYaw(getPlayerEnt())%360);
	ModPE.showTipMessage(String(yaw<0 ? yaw+360:yaw));
}

function useItem(x,y,z,item){
	switch(item){
		case 280:
			flag.s=true;
			Pos.s={x:x,y:y,z:z};
			clientMessage("始点を設定しました");
			break;
		case 281:
			flag.e=true;
			Pos.e={x:x,y:y,z:z};
			clientMessage("終点を設定しました");
			break;
		case 264:
			if(edit==null){
				clientMessage("名前を設定してください。");
			}else{
				mob=Level.spawnMob(x+0.5,y+1,z+0.5,15,"mob/RenderMaker.png");
				setRender();
				Entity.setImmobile(mob,true);
			}
			break;
	}
}

function setRender(){
	try{
		Entity.setRenderType(mob,edit.Type());
	}catch(e){
		clientMessage(e);
	}
}

var Gui={
	Base:(function(){
			var layout=new LinearLayout(Activity);
			layout.setOrientation(1);
			var window=new PopupWindow(Math.floor(screen.x/4),screen.y);
			window.setContentView(layout);
			window.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(Color.parseColor("#66000000")));
			var top=new AbsoluteLayout(Activity);
			var back=new TextView(Activity);
			back.setLayoutParams(new AbsoluteLayout.LayoutParams(LayoutParams.WRAP_CONTENT,LayoutParams.WRAP_CONTENT,0,0));
			back.setText("<<");
			back.setTextColor(Color.WHITE);
			back.setOnClickListener(new OnClickListener(){
				onClick:function(v){
					var layout=Gui.SelectFile();
					if(edit!=null){
						if(d.part==""){
							layout=Gui.SelectFile();
							edit=null;
						}else if(d.id==""){
							layout=Gui.SelectPart();
							d.part="";
						}else{
							layout=Gui.SelectId();
							d.id="";
						}
					}
					Gui.Base.change(layout);
				}
			});
			var close=new TextView(Activity);
			close.setLayoutParams(new AbsoluteLayout.LayoutParams(LayoutParams.WRAP_CONTENT,LayoutParams.WRAP_CONTENT,screen.x*(3/16),0));
			close.setText("close");
			close.setTextColor(Color.WHITE);
			var click=new OnClickListener(){
				onClick:function(v){
					window.dismiss();
				}
			}
			close.setOnClickListener(click);
			top.addView(back);
			top.addView(close);
			top.setBackgroundColor(Color.BLACK);
			top.setLayoutParams(new LayoutParams(LayoutParams.FILL_PARENT,LayoutParams.WRAP_CONTENT));
			layout.addView(top);
			function show(){
				window.showAtLocation(Activity.getWindow().getDecorView(),Gravity.LEFT|Gravity.TOP,0,0);
			}
			var v=null;
			function change(view){
				if(v!=null)layout.removeView(v);
				if(view==undefined){
					v=null;
				}else{
					v=view;
					layout.addView(view);
				}
			}
			
			return {
				window:window,
				show:show,
				change:change,
				layout:layout
			};
	}()),
	SelectFile:function(){
		var main=new LinearLayout(Activity);
		main.setOrientation(1);
		var add=new Button(Activity);
		add.setText("add new file");
		var click=new OnClickListener(){
			onClick:function(v){
				var dia=new Dialog(Activity);
				var layout=new LinearLayout(Activity);
				layout.setOrientation(1);
				var edittext=new EditText(Activity);
				layout.addView(edittext);
				var button=new Button(Activity);
				button.setText("Add");
				button.setOnClickListener(new OnClickListener(){
					onClick:function(v){
						var tx=edittext.getText();
						if(tx!=""){
							var data={RLeg:[[0,0,0],{}],LLeg:[[0,0,0],{}],RArm:[[0,0,0],{}],LArm:[[0,0,0],{}],Head:[[0,0,0],{}],Body:[[0,0,0],{}]};
							File.Save(tx,data);
						}
						Gui.Base.change(Gui.SelectFile());
						dia.dismiss();
					}
				});
				layout.addView(button);
				dia.setContentView(layout);
				dia.show();
			}
		}
		add.setOnClickListener(click);
		main.addView(add);
		var list=File.List();
		var adapter=new ArrayAdapter(Activity,net.zhuoweizhang.mcpelauncher.R.layout.patch_list_item,list);
		var listView=new ListView(Activity);
		listView.setBackgroundColor(Color.WHITE);
		listView.setAdapter(adapter);
		listView.setOnItemClickListener(new AdapterView.OnItemClickListener(){
			onItemClick:function(parent,view,position,id){
				try{
				var item=parent.getItemAtPosition(position);
				edit=new MakeRender(item);
				Gui.Base.change(Gui.SelectPart());
				}catch(e){
					clientMessage(e);
				}
			}
		});
		listView.setLayoutParams(new LayoutParams(screen.x/5,LayoutParams.WRAP_CONTENT));
		main.setGravity(Gravity.CENTER | Gravity.TOP);
		main.addView(listView);
		return main;
	},
	SelectPart:function(){
		var main=new LinearLayout(Activity);
		main.setOrientation(1);
		var adapter=new ArrayAdapter(Activity,net.zhuoweizhang.mcpelauncher.R.layout.patch_list_item,rpart);
		var listView=new ListView(Activity);
		listView.setBackgroundColor(Color.WHITE);
		listView.setAdapter(adapter);
		listView.setOnItemClickListener(new AdapterView.OnItemClickListener(){
			onItemClick:function(parent,view,position,id){
				var item=parent.getItemAtPosition(position);
				d.part=item;
				Gui.Base.change(Gui.SelectId());
			}
		});
		listView.setLayoutParams(new LayoutParams(screen.x/5,LayoutParams.WRAP_CONTENT));
		main.addView(listView);
		main.setGravity(Gravity.CENTER | Gravity.TOP);
		return main;
	},
	SelectId:function(){
		var main=new LinearLayout(Activity);
		main.setOrientation(1);
		
		var rowX=new TableRow(Activity);
		var rowY=new TableRow(Activity);
		var rowZ=new TableRow(Activity);
		var tsize=35;
		var texX=new TextView(Activity);
		texX.setTextSize(tsize);
		texX.setTextColor(Color.WHITE);
		texX.setText("X:");
		rowX.addView(texX);
		var texY=new TextView(Activity);
		texY.setTextSize(tsize);
		texY.setTextColor(Color.WHITE);
		texY.setText("Y:");
		rowY.addView(texY);
		var texZ=new TextView(Activity);
		texZ.setTextSize(tsize);
		texZ.setTextColor(Color.WHITE);
		texZ.setText("Z:");
		rowZ.addView(texZ);
		var posX=new TextView(Activity);
		posX.setTextSize(tsize);
		posX.setTextColor(Color.WHITE);
		posX.setText(String(edit.data[d.part][0][0]));
		rowX.addView(posX);
		var posY=new TextView(Activity);
		posY.setTextSize(tsize);
		posY.setTextColor(Color.WHITE);
		posY.setText(String(edit.data[d.part][0][1]));
		rowY.addView(posY);
		var posZ=new TextView(Activity);
		posZ.setTextSize(tsize);
		posZ.setTextColor(Color.WHITE);
		posZ.setText(String(edit.data[d.part][0][2]));
		rowZ.addView(posZ);
		
		var mX=new TextView(Activity);
		mX.setText(" - ");
		mX.setTextSize(tsize);
		mX.setTextColor(Color.WHITE);
		mX.setOnClickListener(new OnClickListener(){
			onClick:function(v){
				var num=Number(posX.getText());
				posX.setText(String(num-1));
				edit.setPartPos(d.part,Number(posX.getText()),Number(posY.getText()),Number(posZ.getText()));
				edit.Save();
				setRender();
			}
		});
		var pX=new TextView(Activity);
		pX.setText(" + ");
		pX.setTextSize(tsize);
		pX.setTextColor(Color.WHITE);
		pX.setOnClickListener(new OnClickListener(){
			onClick:function(v){
				var num=Number(posX.getText());
				posX.setText(String(num+1));
				edit.setPartPos(d.part,Number(posX.getText()),Number(posY.getText()),Number(posZ.getText()));
				edit.Save();
				setRender();
			}
		});
		rowX.addView(mX);
		rowX.addView(pX);
		var mY=new TextView(Activity);
		mY.setText(" - ");
		mY.setTextSize(tsize);
		mY.setTextColor(Color.WHITE);
		mY.setOnClickListener(new OnClickListener(){
			onClick:function(v){
				var num=Number(posY.getText());
				posY.setText(String(num-1));
				edit.setPartPos(d.part,Number(posX.getText()),Number(posY.getText()),Number(posZ.getText()));
				edit.Save();
				setRender();
			}
		});
		var pY=new TextView(Activity);
		pY.setText(" + ");
		pY.setTextSize(tsize);
		pY.setTextColor(Color.WHITE);
		pY.setOnClickListener(new OnClickListener(){
			onClick:function(v){
				var num=Number(posY.getText());
				posY.setText(String(num+1));
				edit.setPartPos(d.part,Number(posX.getText()),Number(posY.getText()),Number(posZ.getText()));
				edit.Save();
				setRender();
			}
		});
		rowY.addView(mY);
		rowY.addView(pY);
		var mZ=new TextView(Activity);
		mZ.setText(" - ");
		mZ.setTextSize(tsize);
		mZ.setTextColor(Color.WHITE);
		mZ.setOnClickListener(new OnClickListener(){
			onClick:function(v){
				var num=Number(posZ.getText());
				posZ.setText(String(num-1));
				edit.setPartPos(d.part,Number(posX.getText()),Number(posY.getText()),Number(posZ.getText()));
				edit.Save();
				setRender();
			}
		});
		var pZ=new TextView(Activity);
		pZ.setText(" + ");
		pZ.setTextSize(tsize);
		pZ.setTextColor(Color.WHITE);
		pZ.setOnClickListener(new OnClickListener(){
			onClick:function(v){
				var num=Number(posZ.getText());
				posZ.setText(String(num+1));
				edit.setPartPos(d.part,Number(posX.getText()),Number(posY.getText()),Number(posZ.getText()));
				edit.Save();
				setRender();
			}
		});
		rowZ.addView(mZ);
		rowZ.addView(pZ);
		
		var table=new TableLayout(Activity);
		table.addView(rowX);
		table.addView(rowY);
		table.addView(rowZ);
		main.addView(table);
		
		var add=new Button(Activity);
		add.setText("add new id");
		var click=new OnClickListener(){
			onClick:function(v){
				var dia=new Dialog(Activity);
				var layout=new LinearLayout(Activity);
				layout.setOrientation(1);
				var edittext=new EditText(Activity);
				layout.addView(edittext);
				var button=new Button(Activity);
				button.setText("Add");
				button.setOnClickListener(new OnClickListener(){
					onClick:function(v){
						var tx=edittext.getText();
						if(tx!=""){
							edit.setData(d.part,tx,JSON.stringify(rdata));
							edit.Save();
							setRender();
						}
						Gui.Base.change(Gui.SelectId());
						dia.dismiss();
					}
				});
				layout.addView(button);
				dia.setContentView(layout);
				dia.show();
			}
		}
		add.setOnClickListener(click);
		main.addView(add);
		var list=edit.list(d.part);
		var adapter=new ArrayAdapter(Activity,net.zhuoweizhang.mcpelauncher.R.layout.patch_list_item,list);
		var listView=new ListView(Activity);
		listView.setBackgroundColor(Color.WHITE);
		listView.setAdapter(adapter);
		listView.setOnItemClickListener(new AdapterView.OnItemClickListener(){
			onItemClick:function(parent,view,position,id){
				var item=parent.getItemAtPosition(position);
				d.id=item;
				Gui.Base.change(Gui.Edit());
			}
		});
		listView.setLayoutParams(new LayoutParams(screen.x/5,LayoutParams.WRAP_CONTENT));
		main.addView(listView);
		main.setGravity(Gravity.CENTER | Gravity.TOP);
		return main;
	},
	Edit:function(){
		try{
		var main=new LinearLayout(Activity);
		main.setOrientation(1);
		var rowX=new TableRow(Activity);
		var rowY=new TableRow(Activity);
		var rowZ=new TableRow(Activity);
		var tsize=35;
		var texX=new TextView(Activity);
		texX.setTextSize(tsize);
		texX.setTextColor(Color.WHITE);
		texX.setText("X:");
		rowX.addView(texX);
		var texY=new TextView(Activity);
		texY.setTextSize(tsize);
		texY.setTextColor(Color.WHITE);
		texY.setText("Y:");
		rowY.addView(texY);
		var texZ=new TextView(Activity);
		texZ.setTextSize(tsize);
		texZ.setTextColor(Color.WHITE);
		texZ.setText("Z:");
		rowZ.addView(texZ);
		var posX=new TextView(Activity);
		posX.setTextSize(tsize);
		posX.setTextColor(Color.WHITE);
		posX.setText(String(edit.data[d.part][1][d.id].pos[0]));
		rowX.addView(posX);
		var posY=new TextView(Activity);
		posY.setTextSize(tsize);
		posY.setTextColor(Color.WHITE);
		posY.setText(String(edit.data[d.part][1][d.id].pos[1]));
		rowY.addView(posY);
		var posZ=new TextView(Activity);
		posZ.setTextSize(tsize);
		posZ.setTextColor(Color.WHITE);
		posZ.setText(String(edit.data[d.part][1][d.id].pos[2]));
		rowZ.addView(posZ);
		
		var mX=new TextView(Activity);
		mX.setText(" - ");
		mX.setTextSize(tsize);
		mX.setTextColor(Color.WHITE);
		mX.setOnClickListener(new OnClickListener(){
			onClick:function(v){
				var num=Number(posX.getText());
				posX.setText(String(num-1));
				edit.setPos(d.part,d.id,Number(posX.getText()),Number(posY.getText()),Number(posZ.getText()));
				edit.Save();
				setRender();
			}
		});
		var pX=new TextView(Activity);
		pX.setText(" + ");
		pX.setTextSize(tsize);
		pX.setTextColor(Color.WHITE);
		pX.setOnClickListener(new OnClickListener(){
			onClick:function(v){
				var num=Number(posX.getText());
				posX.setText(String(num+1));
				edit.setPos(d.part,d.id,Number(posX.getText()),Number(posY.getText()),Number(posZ.getText()));
				edit.Save();
				setRender();
			}
		});
		rowX.addView(mX);
		rowX.addView(pX);
		var mY=new TextView(Activity);
		mY.setText(" - ");
		mY.setTextSize(tsize);
		mY.setTextColor(Color.WHITE);
		mY.setOnClickListener(new OnClickListener(){
			onClick:function(v){
				var num=Number(posY.getText());
				posY.setText(String(num-1));
				edit.setPos(d.part,d.id,Number(posX.getText()),Number(posY.getText()),Number(posZ.getText()));
				edit.Save();
				setRender();
			}
		});
		var pY=new TextView(Activity);
		pY.setText(" + ");
		pY.setTextSize(tsize);
		pY.setTextColor(Color.WHITE);
		pY.setOnClickListener(new OnClickListener(){
			onClick:function(v){
				var num=Number(posY.getText());
				posY.setText(String(num+1));
				edit.setPos(d.part,d.id,Number(posX.getText()),Number(posY.getText()),Number(posZ.getText()));
				edit.Save();
				setRender();
			}
		});
		rowY.addView(mY);
		rowY.addView(pY);
		var mZ=new TextView(Activity);
		mZ.setText(" - ");
		mZ.setTextSize(tsize);
		mZ.setTextColor(Color.WHITE);
		mZ.setOnClickListener(new OnClickListener(){
			onClick:function(v){
				var num=Number(posZ.getText());
				posZ.setText(String(num-1));
				edit.setPos(d.part,d.id,Number(posX.getText()),Number(posY.getText()),Number(posZ.getText()));
				edit.Save();
				setRender();
			}
		});
		var pZ=new TextView(Activity);
		pZ.setText(" + ");
		pZ.setTextSize(tsize);
		pZ.setTextColor(Color.WHITE);
		pZ.setOnClickListener(new OnClickListener(){
			onClick:function(v){
				var num=Number(posZ.getText());
				posZ.setText(String(num+1));
				edit.setPos(d.part,d.id,Number(posX.getText()),Number(posY.getText()),Number(posZ.getText()));
				edit.Save();
				setRender();
			}
		});
		rowZ.addView(mZ);
		rowZ.addView(pZ);
		
		var table=new TableLayout(Activity);
		table.addView(rowX);
		table.addView(rowY);
		table.addView(rowZ);
		main.addView(table);
		
		var tx_size=new TextView(Activity);
		tx_size.setTextSize(tsize);
		tx_size.setTextColor(Color.WHITE);
		tx_size.setText("Size:"+String(edit.data[d.part][1][d.id].size));
		main.addView(tx_size);
		var seek=SeekBar(Activity);
		seek.setMax(16);
		seek.setProgress(edit.data[d.part][1][d.id].size);
		seek.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener(){
			onProgressChanged:function(seekBar,progress,fromTouch){
				edit.setSize(d.part,d.id,progress);
				tx_size.setText("Size:"+String(edit.data[d.part][1][d.id].size));
				setRender();
			},
			onStopTrackingTouch:function(seekBar){
				edit.Save();
			}
		});
		main.addView(seek);
		var del=new Button(Activity);
		del.setText("delete");
		del.setOnClickListener(new OnClickListener(){
			onClick:function(v){
				edit.Delete(d.part,d.id);
				d.id="";
				Gui.Base.change(Gui.SelectId());
				edit.Save();
				setRender();
			}
		});
		main.addView(del);
		main.setGravity(Gravity.CENTER | Gravity.TOP);
		return main;
		}catch(e){
			clientMessage(e);
		}
	}
};

var SDcard=android.os.Environment.getExternalStorageDirectory();
var MCPEdata=new java.io.File(SDcard.getAbsolutePath()+"/games/com.mojang/minecraftpe");
var File={
	Save:function(name,data){
		var Folder=new java.io.File(MCPEdata+"/RenderMaker");
		Folder.mkdirs();
		var DataFile=new java.io.File(MCPEdata+"/RenderMaker/"+name+".json");
		DataFile.createNewFile();
		var DataWrite=new java.io.FileWriter(DataFile,false);
		DataWrite.write(JSON.stringify(data));
		DataWrite.close();
	},
	Load:function(name){
		try{
			var DataFile=new java.io.FileReader(MCPEdata+"/RenderMaker/"+name+".json");
			var Read=new java.io.BufferedReader(DataFile);
			var Data=Read.readLine();
			var rtn=JSON.parse(Data);
			Read.close();
			return rtn;
		}catch(e){
			return null;
		}
	},
	List:function(){
		var Folder=new java.io.File(MCPEdata+"/RenderMaker");
		Folder.mkdir();
		var list=Folder.list();
		for(var i in list){
			list[i]=list[i].replace('.json',"");
		}
		return list;
	}
};

function MakeRender(name){
	this.name=name;
	//[[基準x,基準y,基準z],{example{size:1,pos:[0,0,0],render:[x,y,z,テクスチャxテクスチャy]},…]]
	this.data={RLeg:[[0,0,0],{}],LLeg:[[0,0,0],{}],RArm:[[0,0,0],{}],LArm:[[0,0,0],{}],Head:[[0,0,0],{}],Body:[[0,0,0],{}]};
	this.render=Renderer.createHumanoidRenderer();
	this.model=this.render.getModel();
	this.RLeg=this.model.getPart('rightLeg');
	this.LLeg=this.model.getPart('leftLeg');
	this.RArm=this.model.getPart('rightArm');
	this.LArm=this.model.getPart('leftArm');
	this.Head=this.model.getPart('head');
	this.Body=this.model.getPart('body');
	
	this.Head.setTextureSize(128,256);
	this.Body.setTextureSize(128,256);
	this.RArm.setTextureSize(128,256);
	this.LArm.setTextureSize(128,256);
	this.RLeg.setTextureSize(128,256);
	this.LLeg.setTextureSize(128,256);
	
	this.clear=function(){
		this.RLeg.clear();
		this.LLeg.clear();
		this.RArm.clear();
		this.LArm.clear();
		this.Head.clear();
		this.Body.clear();
	}
	this.clear();
	
	this.Save=function(){
		File.Save(this.name,this.data);
	}
	
	var load=File.Load(this.name);
	if(load==null){
		clientMessage("ファイルが見つかりませんでした。新たなファイルを生成します。");
		this.Save();
	}else{
		clientMessage("ファイルが見つかりました。ファイルを読み込みます。");
		this.data=load;
	}
	
	this.Reload=function(){
		this.clear();
		for(var i in this.data.RLeg[1]){
			for(var j in this.data.RLeg[1][i].render){
				this.RLeg.setTextureOffset(this.data.RLeg[1][i].render[j][3],this.data.RLeg[1][i].render[j][4],true);
				this.RLeg.addBox(this.data.RLeg[0][0]+this.data.RLeg[1][i].pos[0]+this.data.RLeg[1][i].size*this.data.RLeg[1][i].render[j][0],this.data.RLeg[0][1]+this.data.RLeg[1][i].pos[1]+this.data.RLeg[1][i].size*this.data.RLeg[1][i].render[j][1],this.data.RLeg[0][2]+this.data.RLeg[1][i].pos[2]+this.data.RLeg[1][i].size*this.data.RLeg[1][i].render[j][2],this.data.RLeg[1][i].size,this.data.RLeg[1][i].size,this.data.RLeg[1][i].size);
			}
		}
		for(var i in this.data.LLeg[1]){
			for(var j in this.data.LLeg[1][i].render){
				this.LLeg.setTextureOffset(this.data.LLeg[1][i].render[j][3],this.data.LLeg[1][i].render[j][4],true);
				this.LLeg.addBox(this.data.LLeg[0][0]+this.data.LLeg[1][i].pos[0]+this.data.LLeg[1][i].size*this.data.LLeg[1][i].render[j][0],this.data.LLeg[0][1]+this.data.LLeg[1][i].pos[1]+this.data.LLeg[1][i].size*this.data.LLeg[1][i].render[j][1],this.data.LLeg[0][2]+this.data.LLeg[1][i].pos[2]+this.data.LLeg[1][i].size*this.data.LLeg[1][i].render[j][2],this.data.LLeg[1][i].size,this.data.LLeg[1][i].size,this.data.LLeg[1][i].size);
			}
		}
		for(var i in this.data.RArm[1]){
			for(var j in this.data.RArm[1][i].render){
				this.RArm.setTextureOffset(this.data.RArm[1][i].render[j][3],this.data.RArm[1][i].render[j][4],true);
				this.RArm.addBox(this.data.RArm[0][0]+this.data.RArm[1][i].pos[0]+this.data.RArm[1][i].size*this.data.RArm[1][i].render[j][0],this.data.RArm[0][1]+this.data.RArm[1][i].pos[1]+this.data.RArm[1][i].size*this.data.RArm[1][i].render[j][1],this.data.RArm[0][2]+this.data.RArm[1][i].pos[2]+this.data.RArm[1][i].size*this.data.RArm[1][i].render[j][2],this.data.RArm[1][i].size,this.data.RArm[1][i].size,this.data.RArm[1][i].size);
			}
		}
		for(var i in this.data.LArm[1]){
			for(var j in this.data.LArm[1][i].render){
				this.LArm.setTextureOffset(this.data.LArm[1][i].render[j][3],this.data.LArm[1][i].render[j][4],true);
				this.LArm.addBox(this.data.LArm[0][0]+this.data.LArm[1][i].pos[0]+this.data.LArm[1][i].size*this.data.LArm[1][i].render[j][0],this.data.LArm[0][1]+this.data.LArm[1][i].pos[1]+this.data.LArm[1][i].size*this.data.LArm[1][i].render[j][1],this.data.LArm[0][2]+this.data.LArm[1][i].pos[2]+this.data.LArm[1][i].size*this.data.LArm[1][i].render[j][2],this.data.LArm[1][i].size,this.data.LArm[1][i].size,this.data.LArm[1][i].size);
			}
		}
		for(var i in this.data.Head[1]){
			for(var j in this.data.Head[1][i].render){
				this.Head.setTextureOffset(this.data.Head[1][i].render[j][3],this.data.Head[1][i].render[j][4],true);
				this.Head.addBox(this.data.Head[0][0]+this.data.Head[1][i].pos[0]+this.data.Head[1][i].size*this.data.Head[1][i].render[j][0],this.data.Head[0][1]+this.data.Head[1][i].pos[1]+this.data.Head[1][i].size*this.data.Head[1][i].render[j][1],this.data.Head[0][2]+this.data.Head[1][i].pos[2]+this.data.Head[1][i].size*this.data.Head[1][i].render[j][2],this.data.Head[1][i].size,this.data.Head[1][i].size,this.data.Head[1][i].size);
			}
		}
		for(var i in this.data.Body[1]){
			for(var j in this.data.Body[1][i].render){
				this.Body.setTextureOffset(this.data.Body[1][i].render[j][3],this.data.Body[1][i].render[j][4],true);
				this.Body.addBox(this.data.Body[0][0]+this.data.Body[1][i].pos[0]+this.data.Body[1][i].size*this.data.Body[1][i].render[j][0],this.data.Body[0][1]+this.data.Body[1][i].pos[1]+this.data.Body[1][i].size*this.data.Body[1][i].render[j][1],this.data.Body[0][2]+this.data.Body[1][i].pos[2]+this.data.Body[1][i].size*this.data.Body[1][i].render[j][2],this.data.Body[1][i].size,this.data.Body[1][i].size,this.data.Body[1][i].size);
			}
		}
	}
	
	this.setSize=function(part,id,size){
		if(this.exist(part,id)){
			if(Number(size)<=16){
				this.data[part][1][id].size=Number(size);
				//clientMessage("サイズを変更しました。");
			}else{
				clientMessage("サイズは16以下にしてください。");
			}
		}else{
			clientMessage("存在しないidです");
		}
	}
	
	this.setData=function(part,id,data){
		if(this.data[part][1][id]==undefined){
			this.data[part][1][id]=JSON.parse(data);
		}else{
			clientMessage("そのidはすでに使われています");
		}
	}
	
	this.Delete=function(part,id){
		if(this.data[part][1][id]!=undefined){
			delete this.data[part][1][id];
		}
	}
	
	this.setPos=function(part,id,x,y,z){
		var rx=Number(x)==NaN ? 0:Number(x);
		var ry=Number(y)==NaN ? 0:Number(y);
		var rz=Number(z)==NaN ? 0:Number(z);
		this.data[part][1][id].pos=[rx,ry,rz];
	}
	
	this.setPartPos=function(part,x,y,z){
		var rx=Number(x)==NaN ? 0:Number(x);
		var ry=Number(y)==NaN ? 0:Number(y);
		var rz=Number(z)==NaN ? 0:Number(z);
		this.data[part][0]=[rx,ry,rz];
	}
	
	this.exist=function(part,id){
		if(this.data[part][1][id]==undefined){
			return false;
		}else{
			return true;
		}
	}
	
	this.list=function(part){
		return Object.keys(this.data[part][1]);
	}
	
	this.Type=function(){
		this.Reload();
		return this.render.renderType;
	}
	
}

function LoadBlock(x1,y1,z1,x2,y2,z2){
	rdata.render=[];
	var max={x:Math.max(x1,x2),y:Math.max(y1,y2),z:Math.max(z1,z2)};
	var min={x:Math.min(x1,x2),y:Math.min(y1,y2),z:Math.min(z1,z2)};
	for(var i1=0;i1<=(max.x-min.x);i1++){
		for(var i2=0;i2<=(max.y-min.y);i2++){
			for(var i3=0;i3<=(max.z-min.z);i3++){
				var id=getTile(min.x+i1,min.y+i2,min.z+i3);
				if(id==35){
					var dam=Level.getData(min.x+i1,min.y+i2,min.z+i3);
					rdata.render.push([i1,-1*i2,-1*i3,64*(dam%2),32*Math.floor(dam/2)]);
				}
			}
		}
	}
}
