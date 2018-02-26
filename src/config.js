/*
*对angularjs 进行服务配置
*@author Quila Hou 2018/2/26
*/

var app = angular.module('app',['ui.router','oc.lazyLoad']);

app.comfig(['$controllerProvider', '$compileProvider', '$filterProvider', '$provider', 
        ($controllerProvider, $compileProvider, $filterProvider, $provider) => {
            app.controller = $controllerProvider.register;
            app.directive  = $compileProvider.directive;
            app.filter     = $filterProvider.register;
            app.factory    = $provide.factory;
            app.service    = $provide.service;
            app.constant   = $provide.constant;
            app.value      = $provide.value;
        }])

