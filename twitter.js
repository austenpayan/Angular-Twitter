;
angular.module('twitter',[]).
directive('twitter',['$http', function($http,$sanitize) {
    var ret = {
        scope:{},
        restrict: 'E',
        link: function(scope, elm, attrs) {
            var config = {
                params: {
                    'screen_name': attrs.user,
                    'callback': "JSON_CALLBACK",
                    'include_rts': attrs.incude_rts,
                    'count': attrs.count
                }
            }
            $http.jsonp("http://api.twitter.com/1/statuses/user_timeline.json", config).success(function(data, status) {
                scope.tweets = data;
            });
           scope.ify = function(tweet) {
                var t;
                //link from https://github.com/remy/twitterlib/
                t =  tweet.replace(/[a-z]+:\/\/([a-z0-9-_]+\.[a-z0-9-_:~\+#%&\?\/.=]+[^:\.,\)\s*$])/ig, function(m, link) {
                    return '<a title="' + m + '" href="' + m + '">' + ((link.length > 36) ? link.substr(0, 35) + '&hellip;' : link) + '</a>';
                });
                //at from https://github.com/remy/twitterlib/
                t = t.replace(/(^|[^\w]+)\@([a-zA-Z0-9_]{1,15}(\/[a-zA-Z0-9-_]+)*)/g, function(m, m1, m2) {
                    return m1 + '<a href="http://twitter.com/' + m2 + '">@' + m2 + '</a>';
                });
                //hash from https://github.com/remy/twitterlib/
                t = t.replace(/(^|[^&\w'"]+)\#([a-zA-Z0-9_^"^<]+)/g, function(m, m1, m2) {
                    return m.substr(-1) === '"' || m.substr(-1) == '<' ? m : m1 + '<a href="http://search.twitter.com/search?q=%23' + m2 + '">#' + m2 + '</a>';
                });
                return t
              }
          },
        template: '<ul class="tweets"><li ng-repeat="tweet in tweets">'+
                  '<img class="userImage" src="{{tweet.user.profile_image_url}}" />'+
                  '<p ng-bind-html-unsafe="ify(tweet.text)"></p></li></ul>'
    }
    return ret;
}]); 


 