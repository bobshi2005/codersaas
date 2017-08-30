var AppService = angular.module("AppService", []);
var url = "http://118.89.140.11/main/system/webdev/Saas/api";
// var url = "http://192.168.1.103:3000/api";
//var url = "http://localhost/codersaas/admin_1_angularjs/demo/api.php";   //jerryshen test api
// var url = "http://192.168.1.104/admin_1_angularjs/demo/api.php";   //ljp test api
var deviceUrl = "http://118.89.140.11:9999"; //saas manager api
var userUrl = "http://118.89.140.11:1111";  //user manager api

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
    //  service.getAlarms = function(role) {
    //     var d = $q.defer();
    //     $http({
    //         method: 'post',
    //         url: url,
    //         headers: {
    //             "accept": "application/json",
    //             "Content-Type":"text/plain;charset=utf-8"
    //         },
    //         processData: false,
    //         data: {
    //             "cmd": "getAlarms",
    //             "role": role
    //         }
    //     }).then(function(response) {
    //         d.resolve(response);
    //     }).catch(function(err) {
    //         d.reject(err);
    //     });
    //     return d.promise;
    // };
    // service.getSnapshot = function(equipid,datetime) {
    //     var d = $q.defer();
    //     $http({
    //         method: 'post',
    //         url: url,
    //         headers: {
    //             "accept": "application/json",
    //             "Content-Type":"text/plain;charset=utf-8"
    //         },
    //         processData: false,
    //         data: {
    //             "cmd"     : "getSnapshot",
    //             "equipid" : equipid,
    //             "datetime": datetime
    //         }
    //     }).then(function(response) {
    //         d.resolve(response);
    //     }).catch(function(err) {
    //         d.reject(err);
    //     });
    //     return d.promise;
    // };

    return service;
}]);

AppService.factory('deviceApi',['$http', '$q', 'sharedataApi',function($http, $q, sharedataApi) {
  var service = {};


  //设备模型管理
    service.createdeviceModel = function(userId, name, number) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/equipment/model/create',
  		      headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data:{userId:userId,name:name,number:number},
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

    service.updatedeviceModel = function(id, userid, name, number) {
        var d = $q.defer();
        $http({
            method: 'post',
            url: deviceUrl+ '/manage/equipment/model/update/'+id,
  		      headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            data:{userid: userid, name:name, number:number},
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

    service.getSensorHistory = function(sId,start,end) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/sensor/data/list/curve/?sensorId='+sId+'&startDate='+start+'&endDate='+end,
            withCredentials: true,
        }).then(function(response) {
            d.resolve(response);
        }).catch(function(err) {
            d.reject(err);
        });
        return d.promise;
    };

    service.getSensorHistoryDetail = function(sId,start,end) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/sensor/data/list/?sensorId='+sId+'&startDate='+start+'&endDate='+end,
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

    service.createSensor = function(params) {
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

    service.getSensor = function(eId,pId) {
        var d = $q.defer();
        $http({
            method: 'get',
            url: deviceUrl+ '/manage/equipment/sensor/modbus/'+eId+'/'+pId,
            headers: {"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            withCredentials: true,
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

  return service;
}]);

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

AppService.factory('sharedataApi',function() {
    var service = {};
    var modeldata = {}; // 共享的设备模型list数据
    var partCategorydata ={}; // 共享的备件类别数据
    var wareHousedata = {};// 共享的仓库数据
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
    return service;
});
