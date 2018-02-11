var AppService = angular.module("AppService", []);
var deviceUrl = "http://139.196.141.29:9999"; //saas manager api  old 118.89.140.11
var userUrl = "http://139.196.141.29:1111";  //user manager api  http://139.196.141.29/  xmx http://119.3.2.68
var fileuploaderUrl = "http://139.196.141.29:9498"; //fineUploader huawei http://122.112.237.243
var testUrl = "http://118.89.140.11:3030";//测试保存屏幕元素位置

//用户相关api
AppService.factory('userApi', ['$http', '$q', function($http, $q) {
    var service = {};
    service.checkAccount = function(account) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: userUrl + '/sso/check_user_name',
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data:{account:account},
            withCredentials: true,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj){
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            }
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.SendVerifyCode = function(phone) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: userUrl + '/sso/send_code',
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data:{phone:phone},
            withCredentials: true,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj){
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            }
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.createUser = function(account,password,name,company,email,phone,code) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: userUrl + '/sso/reg',
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data:{
                account:account,
                password:password,
                name:name,
                company:company,
                email:email,
                phone:phone,
                code:code
            },
            withCredentials: true,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj){
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            }
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };
    //修改用户
    service.updateUser = function(userId,username,realname,avatar,phone,email,sex,locked) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: userUrl + '/manage/user/update/'+userId,
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data:{
                username:username,
                realname:realname,
                avatar:avatar,
                phone:phone,
                email:email,
                sex:sex,
                locked:locked,
            },
            withCredentials: true,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj){
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            }
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.passback = function(phone,code,pass1,pass2) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: userUrl + '/sso/back',
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data:{
                phone:phone,
                code:code,
                password:pass1,
                confirmPassword:pass2
            },
            withCredentials: true,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj){
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            }
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.login = function(username,password,rememberMe,backurl) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: userUrl + '/sso/login',
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data:{
                username:username,
                password:password,
                rememberMe:rememberMe,
                backurl:backurl,
            },
            withCredentials: true,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj){
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            }
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.userInfo = function(phone) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: userUrl + '/manage/user/find/'+phone,
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            withCredentials: true,
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };
    //获取用户的权限 tree
    service.userPermission = function(userId) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: userUrl + '/manage/permission/user/'+userId+'?type=1',
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            withCredentials: true,
            data:{},
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };
    //获取用户的权限id数组
    service.userPermissionCode = function(userId) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: userUrl + '/manage/permission/ids/user/'+userId+'?type=1',
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            withCredentials: true,
            data:{},
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.logout = function() {
        var d = $q.defer();
        $http({
            method: 'get',
            url: userUrl+ '/sso/logout',
  		      headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            withCredentials: true,
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };
    return service;
}]);
//设备相关api
AppService.factory('deviceApi',['$http', '$q', 'sharedataApi',function($http, $q, sharedataApi) {
  var service = {};


  //设备模型管理
    service.createdeviceModel = function(name, number, protocolId) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/equipment/model/create',
  		      headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data:{name:name,number:number,protocolId:protocolId},
            withCredentials: true,
            transformRequest: function(obj) {
              var str = [];
              for(var p in obj){
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              }
              return str.join("&");
            }

        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.updatedeviceModel = function(id,name, number, protocolId) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/equipment/model/update/'+id,
  		      headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data:{name:name,number:number,protocolId:protocolId},
            withCredentials: true,
            transformRequest: function(obj) {
              var str = [];
              for(var p in obj){
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              }
              return str.join("&");
            }

        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.deletedeviceModel = function(id) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/equipment/model/delete/'+id,
  		      headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            withCredentials: true,
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.getdeviceModellist = function(order, offset, limit) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/equipment/model/list',
  		      headers: {"Accept":"application/json"},
            withCredentials: true,
            params: {order:'asc', offset:offset, limit:limit}
        }).then(function(response) {
            sharedataApi.setModeldata(response.data.rows);
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.getmodelPropertylist = function(equipmentid,order, offset, limit) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/equipment/model/property/list/'+equipmentid,
  		      headers: {"Accept":"application/json"},
            withCredentials: true,
            params: {order:'asc', offset:offset, limit:limit}
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.createPropertyItem = function(params) {
      var d = $q.defer();
      $http({
          method: 'post',
          url: deviceUrl+ '/manage/equipment/model/property/create',
          headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
          data: params,
          withCredentials: true,
          transformRequest: function(obj) {
            var str = [];
            for(var p in obj){
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
          }

      }).then(function(response) {
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
    }

    service.deletePropertyItem = function(id) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/equipment/model/property/delete/'+id,
  		      headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            withCredentials: true,
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.updatePropertyItem = function(id, params) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/equipment/model/property/update/'+ id,
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data: params,
            withCredentials: true,
            transformRequest: function(obj) {
              var str = [];
              for(var p in obj){
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              }
              return str.join("&");
            }

        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };
    //模型参数传感器读写指令设置  create 和 update 都是 /manage/sensor/create/
    service.createPropertySensor = function(params) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/sensor/create/',
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data:params,
            withCredentials: true,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj){
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            }

        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    //模型参数传感器读写数值转换  create 和 update 都是 /manage/sensor/create/
    service.updatePropertySensor = function(params) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/sensor/update/',
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data:params,
            withCredentials: true,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj){
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            }

        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };
    service.getSensorModbus = function(mId,pId) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/equipment/model/property/sensor/modbus/'+mId+'/'+pId,
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            withCredentials: true,
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };
    service.getSensorGrm = function(mId,pId) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/equipment/model/property/sensor/grm/'+mId+'/'+pId,
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            withCredentials: true,
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };
    //设置参数报警
    service.createPropertyAlarm = function(params) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/alarm/create/',
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data:params,
            withCredentials: true,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj){
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            }

        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.deleteAlarmset = function(alarmId) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/alarm/delete/'+alarmId,
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            withCredentials: true,
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };
    service.getAlarmset = function(mId,pId) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/equipment/model/property/sensor/alarm/'+mId+'/'+pId,
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            withCredentials: true,
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };
    service.getCurrentAlarms = function() {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/alarm/record/list/',
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            withCredentials: true,
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.searchHistoryAlarms = function(params) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/alarm/record/history/list/',
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            withCredentials: true,
            data: params,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj){
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            }

        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

  //设备信息管理
    service.getDevicelist = function(order, offset, limit) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/equipment/list',
  		      headers: {"Accept":"application/json"},
            withCredentials: true,
            params: {order:'asc', offset:offset, limit:limit}
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.getDeviceInfoById = function(id) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/equipment/'+id,
            headers: {"Accept":"application/json"},
            withCredentials: true,
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.createDevice = function(params) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/equipment/create',
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data:params,
            withCredentials: true,
            transformRequest: function(obj) {
              var str = [];
              for(var p in obj){
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              }
              return str.join("&");
            }

        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.updateDevice = function(id, params) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/equipment/update/'+ id,
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data: params,
            withCredentials: true,
            transformRequest: function(obj) {
              var str = [];
              for(var p in obj){
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              }
              return str.join("&");
            }

        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.deleteDevice = function(id) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/equipment/delete/'+id,
  		      headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            withCredentials: true,
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };
  //新建dtu
  service.createDTU = function(params) {
      var d = $q.defer();
      $http({
          method: 'post',
          url: deviceUrl+ '/manage/dtu/create',
          headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
          data:params,
          withCredentials: true,
          transformRequest: function(obj) {
            var str = [];
            for(var p in obj){
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
          }

      }).then(function(response) {
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
  };
  //delete dtu
  service.deleteDtu = function(id) {
      var d = $q.defer();
      $http({
          method: 'get',
          url: deviceUrl+ '/manage/dtu/delete/'+id,
          headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
          withCredentials: true,
      }).then(function(response) {
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
  };
  //update DTU
  service.updateDTU = function(dtuId,params) {
      var d = $q.defer();
      $http({
          method: 'post',
          url: deviceUrl+ '/manage/dtu/update/'+dtuId,
          headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
          data:params,
          withCredentials: true,
          transformRequest: function(obj) {
            var str = [];
            for(var p in obj){
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
          }

      }).then(function(response) {
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
  };
  // dtu接入
  service.getDtulist = function(order, offset, limit) {
      var d = $q.defer();
      $http({
          method: 'get',
          url: deviceUrl+ '/manage/dtu/list',
          headers: {"Accept":"application/json"},
          withCredentials: true,
          params: {order:'asc', offset:offset, limit:limit}
      }).then(function(response) {
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
  };
  //获取dtu下面关联的设备
  service.getDtueEuipmentlist = function(dtuId,order, offset, limit) {
      var d = $q.defer();
      $http({
          method: 'get',
          url: deviceUrl+ '/manage/dtu/equipment/list',
          headers: {"Accept":"application/json"},
          withCredentials: true,
          params: {dtuId:dtuId,order:'asc', offset:offset, limit:limit}
      }).then(function(response) {
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
  };
  //设备关联dtu
  service.dtuConnect = function(dtuid, ids) {
      var d = $q.defer();
      $http({
          method: 'post',
          url: deviceUrl+ '/manage/dtu/connect/',
          headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
          data: {dtuId:dtuid,eIds:ids},
          withCredentials: true,
          transformRequest: function(obj) {
            var str = [];
            for(var p in obj){
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
          }

      }).then(function(response) {
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
  };
  //添加一个设备到dtu
  service.addEquipmentToDtu = function(dtuid, eid) {
      var d = $q.defer();
      $http({
          method: 'post',
          url: deviceUrl+ '/manage/dtu/connect/one',
          headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
          data: {dtuId:dtuid,eId:eid},
          withCredentials: true,
          transformRequest: function(obj) {
            var str = [];
            for(var p in obj){
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
          }

      }).then(function(response) {
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
  };
  //删除一个设备到dtu
  service.deleteEquipmentFromDtu = function(dtuid, eid) {
      var d = $q.defer();
      $http({
          method: 'post',
          url: deviceUrl+ '/manage/dtu/unconnected/one',
          headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
          data: {dtuId:dtuid,eId:eid},
          withCredentials: true,
          transformRequest: function(obj) {
            var str = [];
            for(var p in obj){
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
          }

      }).then(function(response) {
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
  };
  // 写入equipment在dtu中的信息 saveId 和dtuId
  service.dtuWriteEquipment = function(equipmentInfo) {
      var d = $q.defer();
      var param = {"salveId":equipmentInfo.salveId,"equipmentId":equipmentInfo.equipmentId};
      console.log('params',param);
      $http({
          method: 'post',
          url: deviceUrl+ '/manage/dtu/equipment/write',
          headers: {"Content-Type":"application/json;charset=UTF-8"},
          data: param,
          withCredentials: true,

      }).then(function(response) {
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
  };
  //设置设备在dtu中的从站地址
  service.dtuSetAddress = function(params) {
      var d = $q.defer();
      $http({
          method: 'post',
          url: deviceUrl+ '/manage/dtu/equipment/write',
          headers: {"Content-Type":"application/json; charset=UTF-8"},
          data: params,
          withCredentials: true,
      }).then(function(response) {
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
  };
  //设备展示
    service.getDeviceTree = function() {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/equipment/city/tree',
            headers: {"Accept":"application/json"},
            withCredentials: true,
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.getDeviceSensorData = function(eId) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/equipment/sensor/data/'+eId,
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            withCredentials: true,
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.getSensorHistory = function(eId,sId,start,end) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/sensor/data/list/curve/?eId='+eId+'&sensorId='+sId+'&startDate='+start+'&endDate='+end,
            withCredentials: true,
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.getSensorHistoryDetail = function(eId,sId,start,end) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/sensor/data/list/?eId='+eId+'&sensorId='+sId+'&startDate='+start+'&endDate='+end,
            withCredentials: true,
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };
  //设备接入
    service.accessDevice = function(params) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/equipment/connect/'+params.equipmentId,
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data:params,
            withCredentials: true,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj){
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            }

        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

  //子公司管理
    service.getCompanyList = function(order, offset, limit) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/company/list',
            headers: {"Accept":"application/json"},
            withCredentials: true,
            params: {order:'asc', offset:offset, limit:limit}
        }).then(function(response) {
            sharedataApi.setModeldata(response.data.rows);
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };
    service.createCompany = function(params) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/company/create',
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            withCredentials: true,
            data: params,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj){
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            }

        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.updateCompany = function(params,companyId) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/company/update/'+companyId,
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            withCredentials: true,
            data: params,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj){
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            }

        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };
    //ids 以 - 相连 如 ids:1212-1213
    service.deleteCompany  = function(companyIds) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/company/delete/'+companyIds,
  		      headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            withCredentials: true,
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };
    //获取子公司名下的设备
    service.getCompanyEuipmentlist = function(companyId, order, offset, limit) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/company/equipment/list',
            headers: {"Accept":"application/json"},
            withCredentials: true,
            params: {companyId:companyId,order:'asc', offset:offset, limit:limit}
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };
    //set 子公司名下设备
    //设备关联dtu  ids 以 :: 相连
    service.setCompanyEquipments = function(companyId, eIds) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/company/auth/',
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data: {companyId:companyId,eIds:eIds},
            withCredentials: true,
            transformRequest: function(obj) {
              var str = [];
              for(var p in obj){
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              }
              return str.join("&");
            }

        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

  //设备启停
    service.startCollect = function(param) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/equipment/collect/start/',
            headers: {"Content-Type":"application/json"},
            data: param,
            withCredentials: true

        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };
    service.stopCollect = function(param) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/equipment/collect/stop/',
            headers: {"Content-Type":"application/json"},
            data: param,
            withCredentials: true

        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

  //仓库管理
    service.getWarehouselist = function(order, offset, limit) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/warehouse/list',
  		      headers: {"Accept":"application/json"},
            withCredentials: true,
            params: {order:'asc', offset:offset, limit:limit}
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.createWarehouse = function(name, comments) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/warehouse/create',
  		      headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data:{name:name,comments:comments},
            withCredentials: true,
            transformRequest: function(obj) {
              var str = [];
              for(var p in obj){
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              }
              return str.join("&");
            }

        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.updateWarehouse = function(id, name, comments) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/warehouse/update/'+id,
  		      headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data:{name:name, comments:comments},
            withCredentials: true,
            transformRequest: function(obj) {
              var str = [];
              for(var p in obj){
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              }
              return str.join("&");
            }

        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.deletedWarehouse = function(id) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/warehouse/delete/'+id,
  		      headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            withCredentials: true,
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.getWarelocationlistById = function(warehouseId, order, offset, limit) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/location/list',
  		      headers: {"Accept":"application/json"},
            withCredentials: true,
            params: {warehouseId: warehouseId,order:'asc', offset:offset, limit:limit}
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.getWarelocationlist = function(order, offset, limit) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/location/list',
  		      headers: {"Accept":"application/json"},
            withCredentials: true,
            params: {order:'asc', offset:offset, limit:limit}
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.createWarelocation = function(warehouseId, number, comments) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/location/create',
  		      headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data:{warehouseId:warehouseId,number:number,comments:comments},
            withCredentials: true,
            transformRequest: function(obj) {
              var str = [];
              for(var p in obj){
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              }
              return str.join("&");
            }

        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.updateWarelocation= function(locationId, number, comments) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/location/update/'+locationId,
  		      headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data:{number:number, comments:comments},
            withCredentials: true,
            transformRequest: function(obj) {
              var str = [];
              for(var p in obj){
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              }
              return str.join("&");
            }

        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.deletedWarelocation= function(ids) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/location/delete/'+ids,
  		      headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            withCredentials: true,
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };
  //库存管理
    service.getInventorylist = function(order, offset, limit) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/inventory/list',
  		      headers: {"Accept":"application/json"},
            withCredentials: true,
            params: {order:'asc', offset:offset, limit:limit}
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.createInventory = function(params) {
      var d = $q.defer();
      $http({
          method: 'post',
          url: deviceUrl+ '/manage/inventory/create',
          headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
          data:params,
          withCredentials: true,
          transformRequest: function(obj) {
              var str = [];
              for(var p in obj){
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              }
              return str.join("&");
          }

      }).then(function(response) {
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
    };

    service.updateInventory = function(inventoryId, params) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/inventory/update/'+inventoryId,
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data:params,
            withCredentials: true,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj){
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            }

        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.deleteInventory = function(ids) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/inventory/delete/'+ids,
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            withCredentials: true,
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };
  //配件类别
    service.createPartCategory = function(name) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/part/category/create',
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data:{name:name},
            withCredentials: true,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj){
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            }

        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.updatePartCategory = function(id, name) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/part/category/update/'+id,
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data:{name:name},
            withCredentials: true,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj){
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            }

        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.deletePartCategory = function(ids) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/part/category/delete/'+ids,
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            withCredentials: true,
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.getPartCategoryList = function(order, offset, limit) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/part/category/list',
            headers: {"Accept":"application/json"},
            withCredentials: true,
            params: {order:'asc', offset:offset, limit:limit}
        }).then(function(response) {
            sharedataApi.setModeldata(response.data.rows);
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };
  //配件
    service.createPart = function(params) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/part/create',
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data:params,
            withCredentials: true,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj){
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            }

        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.updatePart = function(id, params) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/part/update/'+id,
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data:params,
            withCredentials: true,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj){
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            }

        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.deletePart = function(ids) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/part/delete/'+ids,
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            withCredentials: true,
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.getPartList = function(order, offset, limit) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/part/list',
            headers: {"Accept":"application/json"},
            withCredentials: true,
            params: {order:'asc', offset:offset, limit:limit}
        }).then(function(response) {
            sharedataApi.setModeldata(response.data.rows);
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };
  //基础数据管理 /manage/equipment/category/list
  service.getEquipmentCategoryList = function(order, offset, limit) {
      var d = $q.defer();
      $http({
          method: 'get',
          url: deviceUrl+ '/manage/equipment/category/list',
          headers: {"Accept":"application/json"},
          withCredentials: true,
          params: {order:'asc', offset:offset, limit:limit}
      }).then(function(response) {
          sharedataApi.setModeldata(response.data.rows);
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
  };
  service.createEquipmentCategory = function(name) {
      var d = $q.defer();
      $http({
          method: 'post',
          url: deviceUrl+ '/manage/equipment/category/create',
          headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
          data:{name:name},
          withCredentials: true,
          transformRequest: function(obj) {
              var str = [];
              for(var p in obj){
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              }
              return str.join("&");
          }

      }).then(function(response) {
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
  };
  service.updateEquipmentCategory = function(id, name) {
      var d = $q.defer();
      $http({
          method: 'post',
          url: deviceUrl+ '/manage/equipment/category/update/'+id,
          headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
          data:{name:name},
          withCredentials: true,
          transformRequest: function(obj) {
              var str = [];
              for(var p in obj){
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              }
              return str.join("&");
          }

      }).then(function(response) {
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
  };

  service.deleteEquipmentCategory = function(ids) {
      var d = $q.defer();
      $http({
          method: 'get',
          url: deviceUrl+ '/manage/equipment/category/delete/'+ids,
          headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
          withCredentials: true,
      }).then(function(response) {
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
  };
  // 数据点管理
  service.getEquipmentDataList = function(order, offset, limit) {
      var d = $q.defer();
      $http({
          method: 'get',
          url: deviceUrl+ '/manage/dataElement/list',
          headers: {"Accept":"application/json"},
          withCredentials: true,
          params: {order:'asc', offset:offset, limit:limit}
      }).then(function(response) {
          sharedataApi.setModeldata(response.data.rows);
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
  };

  service.createEquipmentData = function(params) {
      var d = $q.defer();
      $http({
          method: 'post',
          url: deviceUrl+ '/manage/dataElement/create',
          headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
          data:params,
          withCredentials: true,
          transformRequest: function(obj) {
              var str = [];
              for(var p in obj){
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              }
              return str.join("&");
          }

      }).then(function(response) {
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
  };
  service.updateEquipmentData = function(params) {
      var d = $q.defer();
      $http({
          method: 'post',
          url: deviceUrl+ '/manage/dataElement/update/'+params.id,
          headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
          data:params,
          withCredentials: true,
          transformRequest: function(obj) {
              var str = [];
              for(var p in obj){
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              }
              return str.join("&");
          }

      }).then(function(response) {
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
  };
  service.deleteEquipmentData = function(ids) {
      var d = $q.defer();
      $http({
          method: 'get',
          url: deviceUrl+ '/manage/dataElement/delete/'+ids,
          headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
          withCredentials: true,
      }).then(function(response) {
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
  };

  //数据点分组
  service.getEquipmentDataGroupList = function(order, offset, limit) {
      var d = $q.defer();
      $http({
          method: 'get',
          url: deviceUrl+ '/manage/dataElementGroup/list',
          headers: {"Accept":"application/json"},
          withCredentials: true,
          params: {order:'asc', offset:offset, limit:limit}
      }).then(function(response) {
          sharedataApi.setModeldata(response.data.rows);
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
  };
  service.createEquipmentDataGroup = function(name) {
      var d = $q.defer();
      $http({
          method: 'post',
          url: deviceUrl+ '/manage/dataElementGroup/create',
          headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
          data:{name:name},
          withCredentials: true,
          transformRequest: function(obj) {
              var str = [];
              for(var p in obj){
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              }
              return str.join("&");
          }

      }).then(function(response) {
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
  };
  service.updateEquipmentDataGroup = function(id, name) {
      var d = $q.defer();
      $http({
          method: 'post',
          url: deviceUrl+ '/manage/dataElementGroup/update/'+id,
          headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
          data:{name:name},
          withCredentials: true,
          transformRequest: function(obj) {
              var str = [];
              for(var p in obj){
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              }
              return str.join("&");
          }

      }).then(function(response) {
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
  };

  service.deleteEquipmentDataGroup = function(ids) {
      var d = $q.defer();
      $http({
          method: 'get',
          url: deviceUrl+ '/manage/dataElementGroup/delete/'+ids,
          headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
          withCredentials: true,
      }).then(function(response) {
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
  };


  return service;
}]);
//locals
AppService.factory('locals', ['$window', function($window) {
    return { //存储单个属性
        set: function(key, value) {
            $window.localStorage[key] = value;
        }, //读取单个属性
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        }, //存储对象，以JSON格式存储
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value); //将对象以字符串保存
        }, //读取对象
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}'); //获取字符串并解析成对象
        }

    }
}]);
//数据共享
AppService.factory('sharedataApi',function() {
    var service = {};
    var modeldata = {}; // 共享的设备模型list数据
    var partCategorydata ={}; // 共享的备件类别数据
    var wareHousedata = {};// 共享的仓库数据
    var userpermissiondata = {};//用户权限数据

    service.setModeldata = function(data){
      modeldata = data;
    }
    service.getModeldata = function(){
      return modeldata;
    }
    service.setpartCategorydata = function(data){
      partCategorydata = data;
    }
    service.getpartCategorydata = function(){
      return partCategorydata;
    }
    service.setwareHousedata = function(data){
      wareHousedata = data;
    }
    service.getwareHousedata = function(){
      return wareHousedata;
    }

    service.getUploaderUrl = function(){
      return fileuploaderUrl;
    }
    return service;
});
//session超时
AppService.factory('sessionTimeout', ['$q','$rootScope', function($q,$rootScope){
  var sessiontimeout = {
    request: function(config){
      return config;
    },
    requestError: function(err){
      // console.log('requestError:' + err);
      return $q.reject(err);
    },
    response: function(res){
      // console.log('sdfsd',$rootScope.showtimeoutflag);
      // console.log('res:' + res.data.code);
      if(res.status === 200){
        if(res.data.code && res.data.code === 403){
          console.log('连接超时，请重新登录',$rootScope.showtimeoutflag);
          $rootScope.showtimeoutflag +=1;
          $rootScope.$broadcast('to-login','true');
        }else{

        }
      }
      return res;

    },
    responseError: function(err){
      if (err.status === -1) {
        console.log('resperr',err);
      }
      return $q.reject(err);
    }
  };
  return sessiontimeout;
}]);

//测试保存位置
AppService.factory('testApi', ['$http', '$q', function($http, $q) {
  var service = {};
  service.setPosition = function(params) {
      var d = $q.defer();
      $http({
          method: 'post',
          url: testUrl + '/set/position',
          headers: {"Content-Type":"application/json; charset=UTF-8"},
          data:params,
          withCredentials: true,
      }).then(function(response) {
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
  };

  service.getPosition = function() {
      var d = $q.defer();
      $http({
          method: 'get',
          url: testUrl + '/get/position',
          headers: {"Content-Type":"application/json; charset=UTF-8"},
          withCredentials: true,
      }).then(function(response) {
          d.resolve(response);
      }).catch(function(err) {
          d.reject(err);
      });
      return d.promise;
  };
  return service;
}]);
