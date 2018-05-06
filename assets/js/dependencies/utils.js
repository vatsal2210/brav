var bodyparser_old = function(p){
  let b= "";
  for (var key in p)
  {
    if (p.hasOwnProperty(key))
    {
      if(typeof p[key] == 'string'){
        b+=key+"="+ p[key]+"&";
      }
      else if(typeof p[key] == 'Object'){
        b+=key+"="+ p[key]+"&";
      }
      else if(typeof p[key] == 'Array'){
        b+=key+"="+ p[key]+"&";
      }
    }
  }
  return b;
};

var isEmpty = function(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
};

var humanReadableDate = function(epoch) {
    return moment(epoch).format('MMMM Do YYYY, h:mm a');
};

var giveDate = function(epoch) {
    return moment(epoch).format('MMMM Do YYYY');
};


var validateEmail = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

var param = function(obj) {

  if ( ! angular.isObject( obj) ) {
    return( ( obj== null ) ? "" : obj.toString() );
  }
  var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

  for(name in obj) {

    value = obj[name];
    if(value instanceof Array) {
      for(i in value) {
        subValue = value[i];
        fullSubName = name + '[' + i + ']';
        innerObj = {};
        innerObj[fullSubName] = subValue;
        query += param(innerObj) + '&';
      }

    } else if(value instanceof Object) {
      for(subName in value) {

        subValue = value[subName];
        fullSubName = name + '[' + subName + ']';
        innerObj = {};
        innerObj[fullSubName] = subValue;
        query += param(innerObj) + '&';
      }
    }
    else if(value !== undefined && value !== null)
      query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
  }

  return query.length ? query.substr(0, query.length - 1) : query;
};

var bodyparser = param ;



var attachMediaStream = function (stream, el, options) {
    var item;
    var URL = window.URL;
    var element = el;
    var opts = {
        autoplay: true,
        mirror: false,
        muted: false,
        audio: false,
        disableContextMenu: false
    };

    if (options) {
        for (item in options) {
            opts[item] = options[item];
        }
    }

    if (!element) {
        element = document.createElement(opts.audio ? 'audio' : 'video');
    } else if (element.tagName.toLowerCase() === 'audio') {
        opts.audio = true;
    }

    if (opts.disableContextMenu) {
        element.oncontextmenu = function (e) {
            e.preventDefault();
        };
    }

    if (opts.autoplay) element.autoplay = 'autoplay';
    if (opts.muted) element.muted = true;
    if (!opts.audio && opts.mirror) {
        ['', 'moz', 'webkit', 'o', 'ms'].forEach(function (prefix) {
            var styleName = prefix ? prefix + 'Transform' : 'transform';
            element.style[styleName] = 'scaleX(-1)';
        });
    }

    element.srcObject = stream;
    return element;
};