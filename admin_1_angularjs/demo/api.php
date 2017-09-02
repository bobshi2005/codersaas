<?php
 //"{"cmd":"login","account":"1213","password":"12"}"
//var_dump($GLOBALS['HTTP_RAW_POST_DATA']);
$input = file_get_contents("php://input");
$data = json_decode($input, true);

$cmd=$data["cmd"];

if ($cmd == 'login') {

	$username=$data["account"];
	$password=$data["password"];

	echo json_encode(array('errCode' => 0, 'errMsg' => 'OK' ,'role'=>'1_1'));
}
else
if ($cmd == 'getAlarms') {

    $dataArr[]=array('equipid'=>'111','gatewaySN'=>'222.2','equipname'=>'333.2','time'=>'2010-09-09','alarm'=>'电源烧坏');
    $dataArr[]=array('equipid'=>'111','gatewaySN'=>'222.2','equipname'=>'333.2','time'=>'2010-09-09','alarm'=>'电源烧坏');
    $dataArr[]=array('equipid'=>'111','gatewaySN'=>'222.2','equipname'=>'333.2','time'=>'2010-09-09','alarm'=>'电源烧坏');
    $dataArr[]=array('equipid'=>'111','gatewaySN'=>'222.2','equipname'=>'333.2','time'=>'2010-09-09','alarm'=>'电源烧坏');
    $dataArr[]=array('equipid'=>'111','gatewaySN'=>'222.2','equipname'=>'333.2','time'=>'2010-09-09','alarm'=>'电源烧坏');
    $dataArr[]=array('equipid'=>'111','gatewaySN'=>'222.2','equipname'=>'333.2','time'=>'2010-09-09','alarm'=>'电源烧坏');


	echo json_encode(array('errCode' => 0, 'errMsg' => 'OK', 'alarms'=>$dataArr));
}
else
if ($cmd == 'getEquipmentList') {


	$keydataArr[]=array("unit"=>"","name"=>"模式","value"=>"制冷");
	$keydataArr[]=array("unit"=>"","name"=>"能效比","value"=>"0.00");
	$keydataArr[]=array("unit"=>"kWh","name"=>"耗电量","value"=>"3.51");
	$keydataArr[]=array("unit"=>"℃","name"=>"温度设定","value"=>"10");
	$keydataArr[]=array("unit"=>"kW","name"=>"制冷（热）量","value"=>"0.00");

    $dataArr[]=array('equipid'=>'1','equipname'=>'库德莱兹公司1','vendor'=>'333.2','latitude'=>'34.223','region'=>'电源烧坏','user'=>'电源烧坏','gatewaySN'=>'电源烧坏','longitude'=>'124.3423','keydata'=>$keydataArr);
		$dataArr[]=array('equipid'=>'2','equipname'=>'库德莱兹公司2','vendor'=>'333.2','latitude'=>'32.114','region'=>'电源烧坏','user'=>'电源烧坏','gatewaySN'=>'电源烧坏','longitude'=>'131.2343','keydata'=>$keydataArr);
		$dataArr[]=array('equipid'=>'3','equipname'=>'库德莱兹公司3','vendor'=>'333.2','latitude'=>'34.623','region'=>'电源烧坏','user'=>'电源烧坏','gatewaySN'=>'电源烧坏','longitude'=>'122.9423','keydata'=>$keydataArr);
		$dataArr[]=array('equipid'=>'4','equipname'=>'库德莱兹公司4','vendor'=>'333.2','latitude'=>'33.019','region'=>'电源烧坏','user'=>'电源烧坏','gatewaySN'=>'电源烧坏','longitude'=>'134.1353','keydata'=>$keydataArr);

	echo json_encode(array('errCode' => 0, 'errMsg' => 'OK', 'equipments'=>$dataArr));
}
else
if ($cmd == 'getEquipmentInfo') {
	echo json_encode(array(
		'errCode' => 0,
		'errMsg' => 'OK',
		'gatewaySN'=>'xx',
		'address'=>'xx',
		'phone'=>'xx',
		'contactor'=>'xx',
		'equipname'=>'测试名称',
		'vendor'=>'xx',
		'type'=>'xx',
		'sn'=>'xx',
		'user'=>'xx',
		'deliverDate'=>'xx',
		'tryrunDate'=>'xx',
		'longitude'=>'120.79255',
		'latitude'=>'31.35046'
	));
}
else
if ($cmd == 'getCityTree') {

	$subChildArr[]=array("name"=>"库德莱兹公司1","id"=>"1");
	$subChildArr[]=array("name"=>"库德莱兹公司2","id"=>"2");

	$childArr[]=array("tatal"=>"1","code"=>"320400","name"=>"常州市(1/1)","online"=>1,"latitude"=>"35.032","longitude"=>"124.032","children"=>$subChildArr);

	unset($subChildArr);
	$subChildArr[]=array("name"=>"库德莱兹公司3","id"=>"3");
	$subChildArr[]=array("name"=>"库德莱兹公司4","id"=>"4");

	$childArr[]=array("tatal"=>"1","code"=>"320500","name"=>"苏州市(1/1)","online"=>1,"latitude"=>"35.032","longitude"=>"35.032","children"=>$subChildArr);

  $treeArr[]=array('total'=>'2','code'=>'3200000','children'=>$childArr,'name'=>"江苏省","online"=>2);


	echo json_encode(array('errCode' => 0, 'errMsg' => 'OK', 'tree'=>$treeArr));
}
else
if ($cmd == 'getEquipmentList') {

	$childArr[]=array("name"=>"测试数据1","online"=>1,'longitude'=>'31.35046','latitude'=>'120.79255');
	$childArr[]=array("name"=>"测试数据2","online"=>0,'longitude'=>'32.35046','latitude'=>'120.21255');

    $dataArr[]=array('data'=>$childArr);


	echo json_encode(array('errCode' => 0, 'errMsg' => 'OK', 'data'=>$dataArr));
}
else
if ($cmd == 'getDataModel') {

	$varsArr[]=array("name"=>"环境温度","unit"=>"℃","showchart"=>"true","varid"=>"[saas]coderise/demo1/运行数据/环境温度");
	$varsArr[]=array("name"=>"冷凝温度","unit"=>"℃","showchart"=>"false","varid"=>"[saas]coderise/demo1/运行数据/冷凝温度");

    $dataArr[]=array('groupName'=>'运行数据','type'=>'analog','vars'=>$varsArr);

	unset($varsArr);
	$varsArr[]=array("name"=>"电源保护开关","unit"=>"","showchart"=>"","varid"=>"[saas]coderise/demo1/机组启停/电源保护开关");
	$varsArr[]=array("name"=>"蒸发器水流开关","unit"=>"","showchart"=>"false","varid"=>"[saas]coderise/demo1/机组启停/蒸发器水流开关");

    $dataArr[]=array('groupName'=>'机组启停','type'=>'digital','vars'=>$varsArr);


	echo json_encode(array('errCode' => 0, 'errMsg' => 'OK', 'data'=>$dataArr));
}
else
if ($cmd == 'getDataModelAndValues') {

	$varsArr[]=array("name"=>"环境湿度","unit"=>"%","showchart"=>"true","showtype"=>"pie","varid"=>"[saas]coderise/demo1/运行数据/环境湿度","value"=>"22");
	$varsArr[]=array("name"=>"冷凝温度","unit"=>"","showchart"=>"false","showtype"=>"led","varid"=>"[saas]coderise/demo1/运行数据/冷凝温度","value"=>"12:23:23");
	$varsArr[]=array("name"=>"环境温度","unit"=>"℃","showchart"=>"true","showtype"=>"gauge","varid"=>"[saas]coderise/demo1/运行数据/环境温度","value"=>"22");
	$varsArr[]=array("name"=>"测试参数1","unit"=>"℃","showchart"=>"false","showtype"=>"","varid"=>"[saas]coderise/demo1/运行数据/冷凝温度","value"=>"33");
	$varsArr[]=array("name"=>"测试参数2","unit"=>"℃","showchart"=>"true","showtype"=>"","varid"=>"[saas]coderise/demo1/运行数据/环境温度","value"=>"22");
	$varsArr[]=array("name"=>"测试参数3","unit"=>"℃","showchart"=>"false","showtype"=>"","varid"=>"[saas]coderise/demo1/运行数据/冷凝温度","value"=>"33");


    $dataArr[]=array('groupName'=>'运行数据','type'=>'analog','vars'=>$varsArr);

	unset($varsArr);
	$varsArr[]=array("name"=>"电源保护开关","unit"=>"","showchart"=>"","varid"=>"[saas]coderise/demo1/机组启停/电源保护开关","value"=>"ON");
	$varsArr[]=array("name"=>"蒸发器水流开关","unit"=>"℃","showchart"=>"false","varid"=>"[saas]coderise/demo1/机组启停/蒸发器水流开关","value"=>"OFF");

    $dataArr[]=array('groupName'=>'机组启停','type'=>'digital','vars'=>$varsArr);


	echo json_encode(array('errCode' => 0, 'errMsg' => 'OK', 'data'=>$dataArr));
}
else
if ($cmd == 'getData') {


    $dataArr[]=array('varid'=>'[saas]coderise/demo1/运行数据/环境温度','value'=>'28.42');
    $dataArr[]=array('varid'=>'[saas]coderise/demo1/运行数据/冷凝温度','value'=>'28.42');

    $dataArr[]=array('varid'=>'[saas]coderise/demo1/机组启停/电源保护开关','value'=>'ON');
    $dataArr[]=array('varid'=>'[saas]coderise/demo1/机组启停/蒸发器水流开关','value'=>'OFF');


	echo json_encode(array('errCode' => 0, 'errMsg' => 'OK', 'data'=>$dataArr));
}
?>
