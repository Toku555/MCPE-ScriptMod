/*
* 
* Copyright (c) 2016 Toku. All Rights Reserved.
*
* Ver1.0
*
*/

var Button=android.widget.Button;
var TextView=android.widget.TextView;
var Dialog=android.app.Dialog;
var ScrollView=android.widget.ScrollView;
var LinearLayout=android.widget.LinearLayout;
var OnClickListener=android.view.View.OnClickListener;
var PopupWindow=android.widget.PopupWindow;
var TableLayout=android.widget.TableLayout;
var TableRow=android.widget.TableRow;
var EditText=android.widget.EditText;
var RelativeLayout=android.widget.RelativeLayout;
var Gravity=android.view.Gravity;
var Color=android.graphics.Color;

var Activity=com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
var display=new android.util.DisplayMetrics();
Activity.getWindowManager().getDefaultDisplay().getMetrics(display);
var screen={x:Math.max(display.widthPixels,display.heightPixels)/1280,y:Math.min(display.widthPixels,display.heightPixels)/720};

var ItemProperties=[
	{name:"スーパーピッケル",id:1000,dam:3000,type:0,texture:"SuperPickle",stack:1,hand:true,category:3,recipe:[1,["bab"," c "," c "],["a",49,0,"b",264,0,"c",280,0]]},
	{name:"磁石",id:1001,dam:15,type:0,texture:"jisyaku",stack:1,category:3,recipe:[1,["a b","c c ","ccc"],["a",152,0,"b",22,0,"c",265,0]]},
	{name:"磁石ピッケル",id:1002,dam:1300,type:0,texture:"jisyakupickle",stack:1,hand:true,category:3,recipe:[1,["bad"," c "," c "],["a",1001,0,"b",22,0,"c",280,0,"d",152,0]]},
	{name:"モンスターボール",id:1003,type:1,texture:"monsterball",stack:64,category:3,recipe:[1,["aaa","aba","aaa"],["a",41,0,"b",344,0]]},
	{name:"手榴弾",id:1004,type:1,texture:"stick",stack:64,category:3,recipe:[4,[" a ","aba"," a "],["a",289,0,"b",265,0]]}
];

var BlockProperties=[
	{name:"経験値box",id:250,texture:[["expblockside",0],["expblocktop",0],["expblockside",0],["expblockside",0],["expblockside",0],["expblockside",0]],category:1,permeate:true,form:0,tool:2},
	{name:"トラップブロック",id:251,texture:[["trapblock",0]],category:1,permeate:true,form:0,tool:2,redstone:true},
	{name:"どこでもブロック",id:252,texture:[["dokodemo",0]],category:1,permeate:true,form:0,tool:2},
	{name:"テレポートブロック",id:253,texture:[["reactor_core",1],["reactor_core",1],["reactor_core",1],["reactor_core",1],["reactor_core",1],["reactor_core",1],["reactor_core",0],["reactor_core",0],["reactor_core",0],["reactor_core",0],["reactor_core",0],["reactor_core",0]],category:1,permeate:true,form:0,tool:2}
];

var Add={
	Item:function(obj){
		switch(obj.type){
			case 0:
				ModPE.setItem(obj.id,obj.texture,0,obj.name,obj.stack);
				break;
			case 1:
				Item.defineThrowable(obj.id,obj.texture,0,obj.name,obj.stack);
				break;
		}
		if(obj.hand!=undefined){
			Item.setHandEquipped(obj.id,obj.hand);
		}
		if(obj.category!=undefined){
			Item.setCategory(obj.id,obj.category);
		}
		if(obj.dam!=undefined){
			Item.setMaxDamage(obj.name,obj.dam);
		}
		if(obj.recipe!=undefined){
			Item.addShapedRecipe(obj.id,obj.recipe[0],0,obj.recipe[1],obj.recipe[2]);
		}
		Player.addItemCreativeInv(obj.id,1,0);
	},
	Block:function(obj){
		Block.defineBlock(obj.id,obj.name,obj.texture,obj.tool,obj.permeate,obj.form);
		Player.addItemInventory(obj.id,1,0);
		if(obj.destroytime!=undefined){
			Block.setDestroyTime(obj.id,obj.destroytime);
		}
		if(obj.explosion!=undefined){
			Block.setExplosionResistance(obj.id,obj.explosion); 
		}
		if(obj.redstone!=undefined){
			Block.setRedstoneConsumer(obj.id,obj.redstone);
		}
		if(obj.friction!=undefined){
			Block.setFriction(obj.id,obj.friction);
		}
		if(obj.light!=undefined){
			Block.setLightLevel(obj.id,obj.light); 
		}
		if(obj.renderlayer!=undefined){
			Block.setRenderLayer(obj.id,obj.renderlayer);
		}
		if(obj.shape!=undefined){
			for(var i=0;i<obj.shape.length;i++){
				Block.setShape(obj.id,obj.shape[i][1][0],obj.shape[i][1][1],obj.shape[i][1][2],obj.shape[i][1][3],obj.shape[i][1][4],obj.shape[i][1][5],obj.shape[i][0]);
			}
		}
		if(obj.recipe!=undefined){
			Item.addShapedRecipe(obj.id,obj.recipe[0],0,obj.recipe[1],obj.recipe[2]);
		}
		if(obj.category!=undefined){
			Item.setCategory(obj.id,obj.category);
		}
		Player.addItemCreativeInv(obj.id,1,0);
	}
}

for(var i=0;i<ItemProperties.length;i++){
	Add.Item(ItemProperties[i]);
}

for(var i=0;i<BlockProperties.length;i++){
	Add.Block(BlockProperties[i]);
}

var DestroyTime=[];

for(var i=1;i<=255;i++){
	if(Item.isValidItem(i)){
		DestroyTime[i]=Block.getDestroyTime(i);
	}
}

var MMI={
	SuperPickle:{
		Var:{
			id:[1,4,24,45,48,49,87,112,121,155,159],
			W:1,
			H:3,
			flag:{
				block:false,
			}
		},
		procCmd:function(com){
			if(com[0]=="sp"){
				clientMessage("スーパーピッケルの設定を変更:");
				if(Number(com[1])!=NaN){
					this.Var.W=Math.floor(Number(com[1])/2);
					clientMessage("横幅:"+String(Math.floor(Number(com[1])/2)));
				}
				if(Number(com[2])!=NaN){
					this.Var.H=Math.floor(Number(com[2]));
					clientMessage("高さ:"+String(Math.floor(Number(com[2]))));
				}
			}
		},
		destroyBlock:function(x,y,z,side,bid,bdam,itemid,itemdam){
			if(itemid==ItemProperties[0].id){
				for(var i=0;i<this.Var.id.length;i++){
					if(bid==this.Var.id[i]){
						var bcount=1;
						Level.destroyBlock(x,y,z,false);
						for(var ii=-this.Var.W;ii<=this.Var.W;ii++){
							switch(side){
								case 0:
									for(var iii=-this.Var.W;iii<=this.Var.W;iii++){
										if(getTile(x+ii,y,z+iii)==bid&&Level.getData(x+ii,y,z+iii)==bdam){
											setTile(x+ii,y,z+iii,0,0);
											bcount++;
										}
									}
									break;
								case 1:
									for(var iii=-this.Var.W;iii<=this.Var.W;iii++){
										if(getTile(x+ii,y,z+iii)==bid&&Level.getData(x+ii,y,z+iii)==bdam){
											setTile(x+ii,y,z+iii,0,0);
											bcount++;
										}
									}
									break;
								case 2:
									for(var iii=-1;iii<=this.Var.H-2;iii++){
										if(getTile(x+ii,y+iii,z)==bid&&Level.getData(x+ii,y+iii,z)==bdam){
											setTile(x+ii,y+iii,z,0,0);
											bcount++;
										}
									}
									break;
								case 3:
									for(var iii=-1;iii<=this.Var.H-2;iii++){
										if(getTile(x+ii,y+iii,z)==bid&&Level.getData(x+ii,y+iii,z)==bdam){
											setTile(x+ii,y+iii,z,0,0);
											bcount++;
										}
									}
									break;
								case 4:
									for(var iii=-1;iii<=this.Var.H-2;iii++){
										if(getTile(x,y+iii,z+ii)==bid&&Level.getData(x,y+iii,z+ii)==bdam){
											setTile(x,y+iii,z+ii,0,0);
											bcount++;
										}
									}
									break;
								case 5:
									for(var iii=-1;iii<=this.Var.H-2;iii++){
										if(getTile(x,y+iii,z+ii)==bid&&Level.getData(x,y+iii,z+ii)==bdam){
											setTile(x,y+iii,z+ii,0,0);
											bcount++;
										}
									}
									break;
							}
						}
						if(bid==1){
							if(bdam==0){
								Level.dropItem(x+0.5,y+0.5,z+0.5,1,4,bcount,0);
							}else{
								Level.dropItem(x+0.5,y+0.5,z+0.5,1,bid,bcount,bdam);
							}
						}else{
							Level.dropItem(x+0.5,y+0.5,z+0.5,1,bid,bcount,bdam);
						}
						if(itemdam+bcount<ItemProperties[0].dam){
							Entity.setCarriedItem(getPlayerEnt(),itemid,1,itemdam+bcount);
						}else{
							Entity.setCarriedItem(getPlayerEnt(),0,0,0);
						}
						break;
					}
				}
			}
		},
		modTick:function(itemid){
			if(itemid==ItemProperties[0].id){
				if(!this.Var.flag.block){
					for(var i=0;i<this.Var.id.length;i++){
						Block.setDestroyTime(this.Var.id[i],DestroyTime[this.Var.id[i]]-2);
					}
					this.Var.flag.block=true;
				}
			}else{
				if(this.Var.flag.block){
					for(var i=0;i<this.Var.id.length;i++){
						Block.setDestroyTime(this.Var.id[i],DestroyTime[this.Var.id[i]]);
					}
					this.Var.flag.block=false;
				}
			}
		}
	},
	Jisyaku:{
		Var:{
			id:[14,15,16,21,56,73,129]
		},
		useItem:function(x,y,z,itemId,blockId,side,itemDamage,blockDamage){
			if(itemId==ItemProperties[1].id){
				var OrePos=[],y1=y,sbid=null;
				while(y1>=0){
					var bid=getTile(x,y1,z),loop=false;
					for(var j=0;j<this.Var.id.length;j++){
						if(bid==this.Var.id[j]){
							sbid=bid,loop=true;
							for(var i=-3;i<=3;i++){
								for(var ii=-3;ii<=3;ii++){
									for(var iii=-3;iii<=3;iii++){
										if(getTile(x+i,y1+ii,z+iii)==sbid){
											OrePos.push([i,ii,iii]);
											setTile(x+i,y1+ii,z+iii,0,0);
										}
									}
								}
							}
							break;
						}
					}
					if(loop){
						break;
					}
					y1--;
				}
				if(sbid!=null){
					for(var i=0;i<OrePos.length;i++){
						setTile(x+OrePos[i][0],y+OrePos[i][1],z+OrePos[i][2],sbid,0);
					}
				}
				if(itemDamage+1<ItemProperties[1].dam){
					Entity.setCarriedItem(getPlayerEnt(),itemId,1,itemDamage+1);
				}else{
					Entity.setCarriedItem(getPlayerEnt(),0,0,0);
				}
			}
		}
	},
	JisyakuPickle:{
		Var:{
			flag:{block:false},
			dbid:[1,4,14,15,16,21,22,23,24,41,42,43,44,45,48,49,52,56,57,61,62,67,73,74,79,87,89,97,98,101,108,109,112,113,114,121,125,128,129,133,152,153,155,156,159,172,173,174],
			rdbid:[[16,5,263,0],[21,6,351,4],[56,3,264,0],[73,6,331,0],[74,6,331,0],[89,5,348,0],[153,3,406,0]],
			dropitem:[]
		},
		destroyBlock:function(x,y,z,side,bid,bdam,itemid,itemdam){
			if(itemid==ItemProperties[2].id){
				for(var i=0;i<this.Var.dbid.length;i++){
					if(bid==this.Var.dbid[i]){
						var exi=null;
						for(var ii=0;ii<this.Var.rdbid.length;ii++){
							if(this.Var.rdbid[ii][0]==bid){
								exi=ii;
								break;
							}
						}
						if(bid==1){
							if(bdam==0){
								Level.dropItem(x,y,z,1,4,1,0);
							}else{
								Level.dropItem(x,y,z,1,bid,1,bdam);
							}
						}else if(exi!=null){
							Level.dropItem(x,y,z,1,this.Var.rdbid[exi][2],this.Var.rdbid[exi][1]-Math.floor(Math.random()*3),this.Var.rdbid[exi][3]);
						}else{
							Level.dropItem(x,y,z,1,bid,1,bdam);
						}
						break;
					}
				}
			}
		},
		entityAddedHook:function(entity,eid,itemId,px,py,pz,ex,ey,ez){
			if(itemId==ItemProperties[2].id){
				if(eid==64){
					if(((px-ex)*(px-ex)+(py-ey)*(py-ey)+(pz-ez)*(pz-ez))<=25){
						this.Var.dropitem.push(entity);
					}
				}
			}
		},
		modTick:function(itemid){
			for(var i=0;i<this.Var.dropitem.length;i++){
				Entity.setVelX(this.Var.dropitem[i],(getPlayerX()-Entity.getX(this.Var.dropitem[i]))/3);
				Entity.setVelY(this.Var.dropitem[i],(getPlayerY()-Entity.getY(this.Var.dropitem[i]))/3);
				Entity.setVelZ(this.Var.dropitem[i],(getPlayerZ()-Entity.getZ(this.Var.dropitem[i]))/3);
			}
			if(itemid==ItemProperties[2].id){
				if(!this.Var.flag.block){
					for(var i=0;i<this.Var.dbid.length;i++){
						Block.setDestroyTime(this.Var.dbid[i],DestroyTime[this.Var.dbid[i]]-2);
					}
					this.Var.flag.block=true;
				}
			}else{
				if(this.Var.flag.block){
					for(var i=0;i<this.Var.dbid.length;i++){
						Block.setDestroyTime(this.Var.dbid[i],DestroyTime[this.Var.dbid[i]]);
					}
					this.Var.flag.block=false;
				}
			}
		},
		entityRemovedHook:function(entity){
			for(var i=0;i<this.Var.dropitem.length;i++){
				if(this.Var.dropitem[i]===entity){
					this.Var.dropitem.splice(i,1);
				}
			}
		}
	},
	MonsterBall:{
		Var:{
			entity:[]
		},
		entityAddedHook:function(entity,eid,itemId,px,py,pz,ex,ey,ez){
			if(eid==81){
				if(itemId==ItemProperties[3].id){
					if((Math.abs(px-ex)<1)&&(Math.abs(py-ey)<1)&&(Math.abs(pz-ez)<1)){
						this.Var.entity[entity]=true;
					}
				}
			}
		},
		projectileHitEntityHook:function(projectile,targetEntity){
			if(this.Var.entity[projectile]){
				var eid=Entity.getEntityTypeId(targetEntity);
				if(eid<63){
					if(Math.floor(Math.random()*3)==0){
						Level.dropItem(Entity.getX(targetEntity),Entity.getY(targetEntity),Entity.getZ(targetEntity),1,383,1,Entity.getEntityTypeId(targetEntity));
						Entity.remove(targetEntity);
						delete this.Var.entity[projectile];
					}
				}
			}
		}
	},
	Bom:{
		entityAddedHook:function(entity,eid,itemId,px,py,pz,ex,ey,ez){
			if(eid==81){
				if(itemId==ItemProperties[4].id){
					if((Math.abs(px-ex)<1)&&(Math.abs(py-ey)<1)&&(Math.abs(pz-ez)<1)){
						var Vx=Entity.getVelX(entity),Vy=Entity.getVelY(entity),Vz=Entity.getVelZ(entity);
						Entity.remove(entity);
						var ent=Level.spawnMob(px,py,pz,65);
						Entity.setVelX(ent,Vx*(2/3));
						Entity.setVelY(ent,Vy*(2/3));
						Entity.setVelZ(ent,Vz*(2/3));
					}
				}
			}
		},
	},
	ExpBlock:{
		Var:{
			flag:true
		},
		useItem:function(x,y,z,itemId,blockId,side,itemDam,blockDam){
			if(blockId==BlockProperties[0].id){
				var Exp=BlockData.Load(x,y,z,"ExpBlock");
				if(this.Var.flag){
					this.CreateGui(Exp,x,y,z);
					this.Var.flag=false;
				}
			}
		},
		SetBlockHook:function(x,y,z,bid,bdam,itemid){
			if(bid==BlockProperties[0].id){
				BlockData.Save(x,y,z,"ExpBlock",0);
			}
		},
		CreateGui:function(exp,x,y,z){
			Activity.runOnUiThread(new java.lang.Runnable({
				run:function(){
					try{
						var MainLayout=new LinearLayout(Activity);
						MainLayout.setOrientation(0);
						MainLayout.setGravity(Gravity.CENTER);
						var SubLayout1=new LinearLayout(Activity);
						SubLayout1.setOrientation(1);
						SubLayout1.setGravity(Gravity.CENTER);
						var tx1=new TextView(Activity);
						tx1.setText("Player");
						tx1.setTextSize(30);
						tx1.setGravity(Gravity.CENTER);
						//tx1.setTextColor(Color.WHITE);
						SubLayout1.addView(tx1);
						var tx2=new TextView(Activity);
						tx2.setText(String(Player.getLevel()));
						tx2.setTextSize(25);
						tx2.setGravity(Gravity.CENTER);
						//tx2.setTextColor(Color.argb(10,0,10,0));
						SubLayout1.addView(tx2);
						MainLayout.addView(SubLayout1);
						var SubLayout2=new LinearLayout(Activity);
						SubLayout2.setOrientation(1);
						SubLayout2.setGravity(Gravity.CENTER);
						var Exps=new Button(Activity);
						Exps.setText("→");
						Exps.setTextSize(20);
						var tx3=new TextView(Activity);
						var tx5=new TextView(Activity);
						tx3.setText("0");
						tx3.setTextSize(25);
						tx3.setGravity(Gravity.CENTER);
						//tx3.setTextColor(Color.argb(10,0,10,0));
						//tx3.setBackgroundColor(Color.LTGRAY);
						var click1=(function(txt1,txt2,txt3,x,y,z){
							var rt=new OnClickListener(){
								onClick:function(){
									try{
										var pexp=Player.getLevel();
										var bexp=BlockData.Load(x,y,z,"ExpBlock");
										var num=Number(txt1.getText());
										if(pexp-num<=0){
											BlockData.Save(x,y,z,"ExpBlock",bexp+pexp);
											Player.setLevel(0);
										}else{
											BlockData.Save(x,y,z,"ExpBlock",bexp+num);
											Player.setLevel(pexp-num);
										}
										txt1.setText("0");
										txt2.setText(String(Player.getLevel()));
										txt3.setText(String(BlockData.Load(x,y,z,"ExpBlock")));
									}catch(e){
										clientMessage(e);
									}
								}
							}
							return rt;
						})(tx3,tx2,tx5,x,y,z);
						Exps.setOnClickListener(click1);
						var Expb=new Button(Activity);
						Expb.setText("←");
						Expb.setTextSize(20);
						var click2=(function(txt1,txt2,txt3,x,y,z){
							var rt=new OnClickListener(){
								onClick:function(){
									try{
										var pexp=Player.getLevel();
										var bexp=BlockData.Load(x,y,z,"ExpBlock");
										var num=Number(txt1.getText());
										if(bexp-num<=0){
											BlockData.Save(x,y,z,"ExpBlock",0);
											Player.setLevel(pexp+bexp);
										}else{
											BlockData.Save(x,y,z,"ExpBlock",bexp-num);
											Player.setLevel(pexp+num);
										}
										txt1.setText("0");
										txt2.setText(String(Player.getLevel()));
										txt3.setText(String(BlockData.Load(x,y,z,"ExpBlock")));
									}catch(e){
										clientMessage(e);
									}
								}
							}
							return rt;
						})(tx3,tx2,tx5,x,y,z);
						Expb.setOnClickListener(click2);
						SubLayout2.addView(Exps);
						SubLayout2.addView(tx3);
						SubLayout2.addView(Expb);
						function cclick(num,layout){
							var row=new TableRow(Activity);
							var button1=new Button(Activity);
							button1.setText("-"+String(num));
							var bclick1=(function(){
								var rt=new OnClickListener(){
									onClick:function(){
										try{
											var txnum=Number(tx3.getText());
											if(txnum-num<=0){
												tx3.setText("0");
											}else{
												tx3.setText(String(txnum-num));
											}
										}catch(e){
											clientMessage(e);
										}
									}
								}
								return rt;
							})();
							button1.setOnClickListener(bclick1);
							var button2=new Button(Activity);
							button2.setText("+"+String(num));
							var bclick2=(function(){
								var rt=new OnClickListener(){
									onClick:function(){
										try{
											var txnum=Number(tx3.getText());
											tx3.setText(String(txnum+num));
										}catch(e){
											clientMessage(e);
										}
									}
								}
								return rt;
							})();
							button2.setOnClickListener(bclick2);
							row.addView(button1);
							row.addView(button2);
							layout.addView(row);
						}
						var table=new TableLayout(Activity);
						cclick(1,table);
						cclick(10,table);
						var scroll=new ScrollView(Activity);
						scroll.addView(table);
						SubLayout2.addView(scroll);
						MainLayout.addView(SubLayout2);
						var SubLayout3=new LinearLayout(Activity);
						SubLayout3.setOrientation(1);
						SubLayout3.setGravity(Gravity.CENTER);
						var tx4=new TextView(Activity);
						tx4.setText("Box");
						tx4.setTextSize(30);
						tx4.setGravity(Gravity.CENTER);
						tx5.setText(String(exp));
						tx5.setTextSize(25);
						tx5.setGravity(Gravity.CENTER);
						SubLayout3.addView(tx4);
						SubLayout3.addView(tx5);
						MainLayout.addView(SubLayout3);
						var SubLayout4=new LinearLayout(Activity);
						SubLayout4.setOrientation(1);
						var closebutton=new Button(Activity);
						closebutton.setText("×");
						closebutton.setTextSize(25);
						var window=new PopupWindow();
						var close=(function(win){
							var rt=new OnClickListener(){
								onClick:function(){
									try{
										win.dismiss();
										MMI.ExpBlock.Var.flag=true;
									}catch(e){
										clientMessage(e);
									}
								}
							}
							return rt;
						})(window);
						closebutton.setOnClickListener(close);
						SubLayout4.addView(closebutton);
						var space=new TextView(Activity);
						space.setText("   ");
						space.setTextSize(25);
						var Show=new LinearLayout(Activity);
						Show.setGravity(Gravity.RIGHT);
						Show.setOrientation(0);
						Show.addView(space);
						Show.addView(MainLayout);
						Show.addView(SubLayout4);
						window.setContentView(Show);
						window.setWidth(screen.x*1000);
						window.setHeight(screen.y*500);
						window.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.LTGRAY));
						window.showAtLocation(Activity.getWindow().getDecorView(),Gravity.CENTER|Gravity.CENTER,0,0);
					}catch(e){
						clientMessage(e);
					}
				}
			}));
		}
	},
	TrapBlock:{
		Var:{
			Entity:[]
		},
		entityAddedHook:function(entity,eid,itemId,px,py,pz,ex,ey,ez){
			if(eid<=63){
				this.Var.Entity.push(entity);
			}
		},
		redstoneUpdateHook:function(x,y,z,newCurrent,someBooleanIDontKnow,blockId,blockData){
			if(blockId==BlockProperties[1].id){
				if(newCurrent!=0){
					for(var i=0;i<this.Var.Entity.length;i++){
						var epos={x:Math.floor(Entity.getX(this.Var.Entity[i])),y:Math.floor(Entity.getY(this.Var.Entity[i])),z:Math.floor(Entity.getZ(this.Var.Entity[i]))};
						if(getTile(epos.x,epos.y-1,epos.z)===BlockProperties[1].id||getTile(epos.x,epos.y-2,epos.z)==BlockProperties[1].id){
							Entity.setHealth(this.Var.Entity[i],1);
						}
					}
				}
			}
		},
		entityRemovedHook:function(entity){
			for(var i=0;i<this.Var.Entity.length;i++){
				if(this.Var.Entity[i]===entity){
					this.Var.Entity.splice(i,1);
					break;
				}
			}
		}
	},
	Dokodemo:{
		Var:{
			flag:false,
			Pos:{x:null,y:null,z:null}
		},
		useItem:function(x,y,z,itemId,blockId,side,itemDam,blockDam){
			if(blockId===BlockProperties[2].id){
				var DokoProp=BlockData.Load(x,y,z,"Dokodemo");
				if(!DokoProp.load){
					this.Var.flag=true;
					this.Var.Pos={x:DokoProp.x,y:DokoProp.y,z:DokoProp.z};
					DokoProp.load=true;
					BlockData.Save(x,y,z,"Dokodemo",DokoProp);
				}
			}
		},
		SetBlockHook:function(x,y,z,bid,bdam,itemid){
			if(bid===BlockProperties[2].id){
				var rpos={x:Math.floor(Math.random()*10000),y:y,z:Math.floor(Math.random()*10000),load:true};
				BlockData.Save(x,y,z,"Dokodemo",rpos);
				BlockData.Save(rpos.x,rpos.y,rpos.z,"Dokodemo",{x:x,y:y,z:z,load:false});
			}
		},
		modTick:function(itemid){
			if(this.Var.flag){
				for(var i1=-1;i1<=1;i1++){
					for(i2=0;i2<=2;i2++){
						for(i3=-1;i3<=1;i3++){
							setTile(this.Var.Pos.x+i1,this.Var.Pos.y+i2,this.Var.Pos.z+i3,0,0);
						}
					}
				}
				for(var i1=-1;i1<=1;i1++){
					for(var i2=-1;i2<=1;i2++){
						setTile(this.Var.Pos.x+i1,this.Var.Pos.y,this.Var.Pos.z+i2,50,0);
					}
				}
				setTile(this.Var.Pos.x,this.Var.Pos.y,this.Var.Pos.z,BlockProperties[2].id,0);
				this.Var.flag=false;
				this.Var.Pos={x:null,y:null,z:null};
			}
		}
	},
	TPBlock:{
		Var:{
			PosProps:[],
			name:null
		},
		newLevel:function(){
			var props=File.Load("TPBlock");
			if(props!=null){
				this.Var.PosProps=props;
			}
		},
		destroyBlock:function(x,y,z,side,bid,bdam,itemid,itemdam){
			if(bid===BlockProperties[3].id){
				for(var i1=0;i1<this.Var.PosProps.length;i1++){
					if((this.Var.PosProps[i1].x===x)&&(this.Var.PosProps[i1].y===y)&&(this.Var.PosProps[i1].z===z)){
						this.Var.PosProps.splice(i1,1);
					}
				}
			}
			preventDefault();
			Level.destroyBlock(x,y,z,false);
		},
		useItem:function(x,y,z,itemId,blockId,side,itemDam,blockDam){
			if(blockId===BlockProperties[3].id){
				if(blockDam===0){
					preventDefault();
					this.EnterName("",x,y,z);
				}else{
					if(Entity.isSneaking(getPlayerEnt())){
						preventDefault();
						for(var i1=0;i1<this.Var.PosProps.length;i1++){
							if((this.Var.PosProps[i1].x===x)&&(this.Var.PosProps[i1].y===y)&&(this.Var.PosProps[i1].z===z)){
								this.EnterName(this.Var.PosProps[i1].name,x,y,z);
							}
						}
					}else{
						preventDefault();
						this.CreateGui(this.Var.PosProps);
					}
				}
			}
		},
		EnterName:function(name,x,y,z){
			Activity.runOnUiThread(new java.lang.Runnable({
				run:function(){
					try{
						var dia=new Dialog(Activity);
						var MainScroll=new ScrollView(Activity);
						dia.setTitle("テレポート先の名前");
						var MainLayout=new LinearLayout(Activity);
						MainLayout.setOrientation(1);
						var Pos=new TextView(Activity);
						Pos.setText("[X:"+String(x)+",Y:"+String(y)+",Z:"+String(z)+"]");
						MainLayout.addView(Pos);
						var Edit=new EditText(Activity);
						Edit.setText(name);
						MainLayout.addView(Edit);
						var Enter=new Button(Activity);
						Enter.setText("決定");
						var click=TpEnter(x,y,z,dia,Edit);
						Enter.setOnClickListener(click);
						MainLayout.addView(Enter);
						MainScroll.addView(MainLayout);
						dia.setContentView(MainScroll);
						dia.show();
					}catch(e){
						clientMessage(e);
					}
				}
			}));
		},
		CreateGui:function(obj){
			Activity.runOnUiThread(new java.lang.Runnable({
				run:function(){
					try{
						var dia=new Dialog(Activity);
						dia.setTitle("テレポートブロック");
						var MainLayout=new TableLayout(Activity);
						var MainScroll=new ScrollView(Activity);
						for(var i1=0;i1<obj.length;i1++){
							var SubLayout=new TableRow(Activity);
							var TpText=new TextView(Activity);
							TpText.setText(obj[i1].name+"[X:"+String(obj[i1].x)+",Y:"+String(obj[i1].y)+",Z:"+String(obj[i1].z)+"]");
							SubLayout.addView(TpText);
							var TpButton=new Button(Activity);
							TpButton.setText("移動");
							var click=TpClick(obj[i1].name,obj[i1].x,obj[i1].y,obj[i1].z);
							TpButton.setOnClickListener(click);
							SubLayout.addView(TpButton);
							MainLayout.addView(SubLayout);
						}
						//var window=new PopupWindow(MainScroll);
						var CloseButton=new Button(Activity);
						var click=new OnClickListener(){
							onClick:function(){
								dia.dismiss();
							}
						}
						CloseButton.setOnClickListener(click);
						CloseButton.setText("閉じる");
						MainScroll.addView(MainLayout);
						var Content=new LinearLayout(Activity);
						Content.setOrientation(1);
						Content.addView(CloseButton);
						Content.addView(MainScroll);
						dia.setContentView(Content);
						dia.show();
						//window.setWidth(screen.x*1280);
						//window.setHeight(screen.y*720);
						//window.showAtLocation(Activity.getWindow().getDecorView(),android.view.Gravity.CENTER|android.view.Gravity.CENTER,0,0);
					}catch(e){
						clientMessage(e);
					}
				}
			}));
		}
	}
};

function TpEnter(x,y,z,dia,edit){
	var rt=new OnClickListener(){
		onClick:function(){
			var str=String(edit.getText());
			var props=MMI.TPBlock.Var.PosProps;
			if(str.length<=10){
				var exi=false;
				for(var i1=0;i1<props.length;i1++){
					if((props[i1].x===x)&&(props[i1].y===y)&&(props[i1].z===z)){
						exi=true;
						MMI.TPBlock.Var.PosProps[i1].name=str;
						break;
					}
				}
				if(!exi){
					MMI.TPBlock.Var.PosProps.push({name:str,x:x,y:y,z:z});
				}
				setTile(x,y,z,BlockProperties[3].id,1);
				File.Save("TPBlock",MMI.TPBlock.Var.PosProps);
				clientMessage("テレポート先の名前を"+str+"に変更しました");
			}else{
				clientMessage("テレポート先の名前は10文字以下にしてください");
			}
			dia.dismiss();
		}
	}
	return rt;
}

function TpClick(name,x,y,z){
	var rt=new OnClickListener(){
		onClick:function(){
			try{
				clientMessage(name+"[X:"+String(x)+",Y:"+String(y)+",Z:"+String(z)+"]\nに移動しました。");
				Entity.setPosition(getPlayerEnt(),x+0.5,y+2.5,z+0.5);
			}catch(e){
				clientMessage(e);
			}
		}
	}
	return rt;
}

var objkey=Object.keys(MMI);

for(var i=0;i<objkey.length;i++){
	if(typeof MMI[objkey[i]].LoadHook=="function"){
		MMI[objkey[i]].LoadHook();
	}
}

function attackHook(attacker,victim){
	for(var i=0;i<objkey.length;i++){
		if(typeof MMI[objkey[i]].attackHook=="function"){
			MMI[objkey[i]].attackHook(attacker,victim);
		}
	}
}

function chatHook(string){
	for(var i=0;i<objkey.length;i++){
		if(typeof MMI[objkey[i]].chatHook=="function"){
			MMI[objkey[i]].chatHook(string);
		}
	}
}

function destroyBlock(x, y, z,side){
	var bid=getTile(x,y,z),bdam=Level.getData(x,y,z),itemid=getCarriedItem(),itemdam=Player.getCarriedItemData();
	for(var i=0;i<objkey.length;i++){
		if(typeof MMI[objkey[i]].destroyBlock=="function"){
			MMI[objkey[i]].destroyBlock(x,y,z,side,bid,bdam,itemid,itemdam);
		}
	}
}

function projectileHitEntityHook(projectile,targetEntity){
	for(var i=0;i<objkey.length;i++){
		if(typeof MMI[objkey[i]].projectileHitEntityHook=="function"){
			MMI[objkey[i]].projectileHitEntityHook(projectile,targetEntity);
		}
	}
}

function eatHook(hearts,saturationRatio){
	for(var i=0;i<objkey.length;i++){
		if(typeof MMI[objkey[i]].eatHook=="function"){
			MMI[objkey[i]].eatHook(hearts,saturationRatio);
		}
	}
}

function entityAddedHook(entity){
	var px=getPlayerX(),py=getPlayerY(),pz=getPlayerZ(),ex=Entity.getX(entity),ey=Entity.getY(entity),ez=Entity.getZ(entity);
	var itemId=getCarriedItem();
	var eid=Entity.getEntityTypeId(entity);
	for(var i=0;i<objkey.length;i++){
		if(typeof MMI[objkey[i]].entityAddedHook=="function"){
			MMI[objkey[i]].entityAddedHook(entity,eid,itemId,px,py,pz,ex,ey,ez);
		}
	}
}

function entityHurtHook(attacker, victim, halfhearts){
	for(var i=0;i<objkey.length;i++){
		if(typeof MMI[objkey[i]].entityHurtHook=="function"){
			MMI[objkey[i]].entityHurtHook(attacker, victim, halfhearts);
		}
	}
}

function entityRemovedHook(entity){
	for(var i=0;i<objkey.length;i++){
		if(typeof MMI[objkey[i]].entityRemovedHook=="function"){
			MMI[objkey[i]].entityRemovedHook(entity);
		}
	}
}

function explodeHook(entity, x, y, z, power, fire){
	for(var i=0;i<objkey.length;i++){
		if(typeof MMI[objkey[i]].explodeHook=="function"){
			MMI[objkey[i]].explodeHook(entity);
		}
	}
}

function serverMessageReceiveHook(message){
	for(var i=0;i<objkey.length;i++){
		if(typeof MMI[objkey[i]].serverMessageReceiveHook=="function"){
			MMI[objkey[i]].serverMessageReceiveHook(message);
		}
	}
}

function chatReceiveHook(sender, message){
	for(var i=0;i<objkey.length;i++){
		if(typeof MMI[objkey[i]].chatReceiveHook=="function"){
			MMI[objkey[i]].chatReceiveHook(sender, message);
		}
	}
}

function leaveGame(){
	for(var i=0;i<objkey.length;i++){
		if(typeof MMI[objkey[i]].leaveGame=="function"){
			MMI[objkey[i]].leaveGame();
		}
	}
}

function deathHook(murderer, victim){
	for(var i=0;i<objkey.length;i++){
		if(typeof MMI[objkey[i]].deathHook=="function"){
			MMI[objkey[i]].deathHook(murderer,victim);
		}
	}
}

function playerAddExpHook(player, experienceAdded){
	for(var i=0;i<objkey.length;i++){
		if(typeof MMI[objkey[i]].playerAddExpHook=="function"){
			MMI[objkey[i]].playerAddExpHook(player, experienceAdded);
		}
	}
}

function playerExpLevelChangeHook(player, levelsAdded){
	for(var i=0;i<objkey.length;i++){
		if(typeof MMI[objkey[i]].playerExpLevelChangeHook=="function"){
			MMI[objkey[i]].playerExpLevelChangeHook(player, levelsAdded);
		}
	}
}

function redstoneUpdateHook(x, y, z, newCurrent, someBooleanIDontKnow, blockId, blockData){
	for(var i=0;i<objkey.length;i++){
		if(typeof MMI[objkey[i]].redstoneUpdateHook=="function"){
			MMI[objkey[i]].redstoneUpdateHook(x,y,z,newCurrent,someBooleanIDontKnow,blockId,blockData);
		}
	}
}

function selectLevelHook(){
	for(var i=0;i<objkey.length;i++){
		if(typeof MMI[objkey[i]].selectLevelHook=="function"){
			MMI[objkey[i]].selectLevelHook();
		}
	}
}

function newLevel(){
	for(var i=0;i<objkey.length;i++){
		if(typeof MMI[objkey[i]].newLevel=="function"){
			MMI[objkey[i]].newLevel();
		}
	}
}

function projectileHitBlockHook(projectile,blockX,blockY,blockZ,side){
	for(var i=0;i<objkey.length;i++){
		if(typeof MMI[objkey[i]].projectileHitBlockHook=="function"){
			MMI[objkey[i]].projectileHitBlockHook(projectile,blockX,blockY,blockZ,side);
		}
	}
}

function modTick(){
	var itemid=getCarriedItem();
	for(var i=0;i<objkey.length;i++){
		if(typeof MMI[objkey[i]].modTick=="function"){
			MMI[objkey[i]].modTick(itemid);
		}
	}
	if(sbflag!=null){
		var bid=getTile(sbflag[0],sbflag[1],sbflag[2]);
		if(bid!==0){
			SetBlockHook(sbflag[0],sbflag[1],sbflag[2],bid,Level.getData(sbflag[0],sbflag[1],sbflag[2]),itemid);
		}
		sbflag=null;
	}
}

function useItem(x,y,z,itemId,blockId,side,itemDamage,blockDamage){
	for(var i=0;i<objkey.length;i++){
		if(typeof MMI[objkey[i]].useItem=="function"){
			MMI[objkey[i]].useItem(x,y,z,itemId,blockId,side,itemDamage,blockDamage);
		}
	}
	switch(side){
		case 0:y--;break;
		case 1:y++;break;
		case 2:z--;break;
		case 3:z++;break;
		case 4:x--;break;
		case 5:x++;break;
	}
	sbflag=[x,y,z];
}

function procCmd(command){
	var com=command.split(" ");
	for(var i=0;i<objkey.length;i++){
		if(typeof MMI[objkey[i]].procCmd=="function"){
			MMI[objkey[i]].procCmd(com);
		}
	}
}

function blockEventHook(x,y,z,eventType,data){
	for(var i=0;i<objkey.length;i++){
		if(typeof MMI[objkey[i]].blockEventHook=="function"){
			MMI[objkey[i]].blockEventHook(x,y,z,eventType,data);
		}
	}
}

var sbflag=null;
function SetBlockHook(x,y,z,bid,bdam,itemid){
	for(var i=0;i<objkey.length;i++){
		if(typeof MMI[objkey[i]].SetBlockHook=="function"){
			MMI[objkey[i]].SetBlockHook(x,y,z,bid,bdam,itemid);
		}
	}
}

var SDcard=android.os.Environment.getExternalStorageDirectory();
var MCPEData=new java.io.File(SDcard.getAbsolutePath()+"/games/com.mojang/minecraftWorlds");
var BlockData={
	Save:function(x,y,z,key,data){
		var BDFolder=new java.io.File(MCPEData+"/"+Level.getWorldDir()+"/MMI/BlockData/"+String(Math.floor(x))+"_"+String(Math.floor(y))+"_"+String(Math.floor(z)));
		BDFolder.mkdirs();
		var BDFile=new java.io.File(MCPEData+"/"+Level.getWorldDir()+"/MMI/BlockData/"+String(Math.floor(x))+"_"+String(Math.floor(y))+"_"+String(Math.floor(z))+"/"+key+".json");
		BDFile.createNewFile();
		var BDFileWrite=new java.io.FileWriter(BDFile,false);
		BDFileWrite.write(JSON.stringify(data));
		BDFileWrite.close();
	},
	Load:function(x,y,z,key){
		try{
			var BDFile=new java.io.FileReader(MCPEData+"/"+Level.getWorldDir()+"/MMI/BlockData/"+String(Math.floor(x))+"_"+String(Math.floor(y))+"_"+String(Math.floor(z))+"/"+key+".json");
			var BDFileReader=new java.io.BufferedReader(BDFile);
			var BD=BDFileReader.readLine();
			BDFileReader.close();
			return JSON.parse(BD);
		}catch(e){
			return null;
		}
	},
	Delete:{
		All:function(x,y,z){
			try{
				var BDFolder=new java.io.File(MCPEData+"/"+Level.getWorldDir()+"/MMI/BlockData/"+String(Math.floor(x))+"_"+String(Math.floor(y))+"_"+String(Math.floor(z)));
				BDFolder.delete();
			}catch(e){
				print(e);
			}
		},
		Data:function(x,y,z,key){
			try{
				var BDFile=new java.io.File(MCPEData+"/"+Level.getWorldDir()+"/MMI/BlockData/"+String(Math.floor(x))+"_"+String(Math.floor(y))+"_"+String(Math.floor(z))+"/"+key+".json");
				BDFile.delete();
			}catch(e){
				print(e);
			}
		}
	}
};

var File={
	Save:function(name,data){
		var Folder=new java.io.File(MCPEData+"/"+Level.getWorldDir()+"/MMI");
		Folder.mkdirs();
		var DataFile=new java.io.File(MCPEData+"/"+Level.getWorldDir()+"/MMI/"+name+".json");
		DataFile.createNewFile();
		var DataWrite=new java.io.FileWriter(DataFile,false);
		DataWrite.write(JSON.stringify(data));
		DataWrite.close();
	},
	Load:function(name){
		try{
			var DataFile=new java.io.FileReader(MCPEData+"/"+Level.getWorldDir()+"/MMI/"+name+".json");
			var Read=new java.io.BufferedReader(DataFile);
			var Data=Read.readLine();
			var rtn=JSON.parse(Data);
			Read.close();
			return rtn;
		}catch(e){
			return null;
		}
	}
};

