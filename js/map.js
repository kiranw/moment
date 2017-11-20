var api = "AIzaSyAa9Y1ijWZ0zF_vuhvntbJDUgsjrlo4kf0";
var lat = -2.9450708;
var lng = -60.6762371;
// 46.414382,10.013988

var request = "https://www.google.com/maps/embed/v1/streetview" +
"?key=" + api +
"&location=" + lat + "," + lng +
"&heading=186.67" +
"&pitch=94.18" +
"&fov=39.4";

console.log(request);
// $("#maplayout").attr('src', request);
