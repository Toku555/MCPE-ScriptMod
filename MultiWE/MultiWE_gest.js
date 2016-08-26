

var WeCommand={
	test:function(com){
		
	}
};

function procCmd(command){
	var com=command.split(" ");
	if(com[0]=="we"){
		/*if(typeof WeCommand[com[1]]=="function"){
			WeCommand[com[1]](com);
		}else{
			clientMessage("WEのコマンドに"+com[1]+"は存在しません");
		}*/
		setWeStick(com);
	}
}

function setWeStick(com){
	var str="";
	for(var i=1;i<com.length;i++){
		str+=" "+com[i];
	}
	Player.setInventorySlot(0,280,1,0);
	Player.setItemCustomName(0,"we"+str);
}
