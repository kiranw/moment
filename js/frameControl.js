var delay = 200;
var frameRange = 999;
var prefix = "img/";
var suffix = ".jpg";
var currentFrame = 0;
var chosenEnvironment = "city";

var started = false;

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function setBackground(){
    if (currentFrame < frameRange){
        var newFile = prefix + chosenEnvironment + "/" + pad(currentFrame, 4) + suffix;
        $("#background").attr("src", newFile);
        var newDelay = Math.floor((Math.random() * 200) + 1)-100 + delay;
        currentFrame +=1;
        var breathingProxy = Math.abs(1 - breathingOnTrack);
        if (breathingProxy < 0.3){
            delay -= 30;
            delay = Math.max(delay, 50);
        } else if (breathingProxy > 0.8){
            delay += 30;
            delay = Math.min(delay, 400);
        }
        setTimeout(setBackground, newDelay);
    }
}

