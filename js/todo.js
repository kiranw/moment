var items = {};
var currentIndex = 0;

function registerSpeech(){
    console.log("registerSpeech");
    var rec = new webkitSpeechRecognition();
    rec.start();
    rec.onresult = function(event) {
        console.log(event.results[0][0]);
        result = event.results[0][0].transcript;
        if (result.toLowerCase().startsWith("next")){
            startSelection();
        } else {
            if (result.toLowerCase().startsWith("add")){
                registerText(result.substr(4));
            }
            if (result.toLowerCase().startsWith("put")){
                registerText(result.substr(4));
            }
            if (result.toLowerCase().startsWith("at")){
                registerText(result.substr(3));
            }
            registerSpeech();
        }
    }
}

function startSelection(){
    $("#todo-container").attr("class", "animate fadeOutLeft").hide();
    $("#environment-container").attr("class", "animate fadeInUp").show();
    // $("#therapy-container").attr("class", "animate fadeInUp").hide();
    $("#arrow-link").attr("onclick", "$('#arrow-link').hide(); startTherapy();");

    var content = '<div class="environment animated fadeInUp"><div class="thumb1 thumb animated fadeInUp"></div><div class="label animated fadeInUp">Forest Walk</div></div><div class="environment animated fadeInUp">' +
        '<div class="thumb3 thumb"></div><div class="label animated fadeInUp">City</div></div><div class="environment animated fadeInUp"><div class="thumb2 thumb animated fadeInUp"></div><div class="label animated fadeInUp">Abstract</div>' +
        '</div>';

    $(content).appendTo("#environment-container");
    setTimeout(500, responsiveVoice.speak("Where should we go today?", "UK English Female", {rate: 1, onend: registerSpeech}));
    registerEnvironment();
}

function registerText(todoText){
    console.log("registering ",todoText);
    var todoText = titleCase(todoText);
    var newHtml = '<div class="animated fadeInUp todo" id="id' + currentIndex + '"><div class="animated fadeIn circle"></div><div class="animated fadeInUp todo-text">' + todoText + '</div></div>';
    $(newHtml).appendTo("#todo-container");
    items[todoText.toLowerCase()] = "id" + currentIndex;
    currentIndex += 1;
}

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
}

var options = {"forest":"forest", "forest walk":"forest", "walk":"forest", "city":"city", "new york":"city", "york":"city"};

function registerEnvironment(){
    var rec = new webkitSpeechRecognition();
    rec.start();
    rec.onresult = function(event) {
        result = event.results[0][0].transcript;
        var options2 = {"forest":"forest", "forest walk":"forest", "walk":"forest", "city":"city", "new york":"city", "york":"city"};
        if (result.toLowerCase() in Object.keys(options2)) {
            chosenEnvironment = options2[result.toLowerCase()];
            startTherapy();
        }
        else {
            registerEnvironment();
        }
    }
}

setTimeout(500, responsiveVoice.speak("What do you have to get done today?", "UK English Female", {rate: 1, onend: registerSpeech}));