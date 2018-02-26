/*
*单页面切换，路由配置
*@author Quila Hua
*/

app.config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {
    $urlRouterProvider.otherwise('/home');
    $stateProvider.state('home',{
        url: '/home',
        templateUrl: 'content/home/home.html?' + Math.random(),
        resolve:{
            deps: [
                'ocLazyLoad',(ocLazyLoad) => ocLazyLoad.load()
            ]
        }
    })
}])