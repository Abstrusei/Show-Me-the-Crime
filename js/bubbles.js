const BUBBLE = ".bubble";
const BUBBLETEXT = "#bubble-text_";
var enlarge = false;
var bubbleColors = ["images/gradients/deep-orange.png",
    "images/gradients/green.png",
    "images/gradients/lightBlue-darkBlue.png",
    "images/gradients/lightBlue-purple.png",
    "images/gradients/lightPurple-reddishPurple.png",
    "images/gradients/maroony-purple.png",
    "images/gradients/pinkish-purple.png",
    "images/gradients/purple.png",
    "images/gradients/purplish-blue.png",
    "images/gradients/red-purple.png",
    "images/gradients/turqoise-blue.png",
    "images/gradients/yellow-orange.png"
];
var datasets = [];
var sharedDataset = [];

function beginBubbles(dataset, id) {
    var bubbleValues = [];
    createDataStructure(dataset, bubbleValues);
    bubbleValues =  top12(bubbleValues);
//     if ($('title').text() === "Show Me The Crime | Home") {
//         sharedDataset = [];
// }
//     addToShared(bubbleValues);
//     console.log(sharedDataset);
    sortByAscending(bubbleValues);

    roundValues(bubbleValues);
    // ID changes which set of bubbles to create and impact
    // alert($('title').text());
    if ($('title').text() === "Show Me The Crime | Filter" && $("#mselect").val().length === 0) {
        setDropdown(bubbleValues);
    }
    bubbleSet(bubbleValues, id, 12);
}

// Assume that crime has been selected
function updateByCrime(crimeList) {
    var bubbleValues = [];
    var filteredBubbleValues = [[], []];
    // Reset everything
    resetAll();
    // Build it over again
    for (var j = 0; j < 2; j++) {
        bubbleValues = [];
        createDataStructure(datasets[j], bubbleValues);
        for (var i = 0; i < crimeList.length; i++) {
            // Search for the crime within
            var crime = crimeList[i];
            if (j === 0) {
                filteredBubbleValues[j].push(bubbleValues.find(o => o.crime === crime));

            } else if (j === 1) {
                filteredBubbleValues[j].push(bubbleValues.find(o => o.crime === crime));

            }
        }
        sortByAscending(filteredBubbleValues[j]);
        roundValues(filteredBubbleValues[j]);
        bubbleSet(filteredBubbleValues[j], "-" + (j + 1), filteredBubbleValues[j].length);

    }
}

function createDataStructure(dataset, bubbleValues) {

    $.each(dataset, function(offence, value) {
        var object = {};
        object.crime = offence;
        object.crimeValue = value;
        bubbleValues.push(object);
    });
}

function sortByAscending(bubbleValues) {
    bubbleValues.sort(function (a, b) {
        return a.crimeValue - b.crimeValue;
    });
}

function sortByDescending(bubbleValues) {
    bubbleValues.sort(function (a, b) {
        return b.crimeValue - a.crimeValue;
    });
}

function roundValues(bubbleValues) {
    var round = 0;
    var len = bubbleValues.length;
    while(round < len){
        bubbleValues[round].crimeValue = Math.round(bubbleValues[round].crimeValue);
        round++
    }
}

function top12(bubbleValues) {
    sortByDescending(bubbleValues);
    bubbleValues = bubbleValues.slice(0, 12);
    return bubbleValues;
}

function setDropdown(bubbleValues) {
    var dropdownDefault = [];
    for (var i = 0; i < bubbleValues.length; i ++) {
        dropdownDefault.push(bubbleValues[i].crime);
    }
    $("#mselect").val(dropdownDefault);
    $("#mselect").trigger("chosen:updated");
}

function bubbleSet(bubbleValues, id, length) {
    if (enlarge == true) {
        modifyBubbles("expand", "-1");
    }
    var noBubble = true;
    hoverPopup();
    var center = [[]];

    hoverBubble(bubbleValues, id);
    var smallest = getSmallest(bubbleValues);
    for (var i = 0; i < length; i++) {
        center[i] = getMiddleCoor(BUBBLE + i + id);
        noBubble = setbubbles(bubbleValues[i].crimeValue, BUBBLE + i + id, smallest, bubbleColors[i]);
        setText(bubbleValues[i].crime, bubbleValues[i].crimeValue, BUBBLETEXT + i + id, smallest);
    }
    if (noBubble === false) {
        setInterval(function() {bubbleMovement(center, id, length);}, 1400);
        if ($('#no-bubbles' + id).hasClass("no-bubbles-default")) {
            removeNoBubblePopup(id);
        }
    } else {
        setNoBubblePopup(id);
    }
    hideLoader();   // View is finished updating.

}

function getSmallest(bubbleValues) {
    for (var i = 0; i < bubbleValues.length; i++) {
        if (bubbleValues[i].crimeValue === 0) {
            continue;
        }
        return bubbleValues[i].crimeValue;
    }
}
//
// function addToShared(bubbleValues) {
//     for (var i = 0; i < bubbleValues.length; i++) {
//         sharedDataset.push(bubbleValues[i]);
//     }
//     sortByAscending(sharedDataset);
// }

function setbubbles(crimeValue, element, smallestValue, color) {
    var height = getBubbleSize(crimeValue, element, smallestValue);
    $(element).css({"height":height + "px", "width":height + "px", "background-image":"url(" + color + ")"});
    if (height === 0) {
        return true;
    }
    return false;
}

function getBubbleSize(crimeValue, element, smallestValue) {
    if (crimeValue == 0) {
        return 0;
    }
    var minHeight = 40;
    var standardArea = Math.PI * Math.pow(minHeight, 2);
    var modifiedarea = crimeValue/smallestValue * standardArea;
    // Area of circle is pi * r^2

    return Math.sqrt(modifiedarea / Math.PI) * 2;
}

function setText(text, crimeValue, element, smallestValue) {
    var fontSize = 15 + crimeValue/smallestValue;
    if (crimeValue === 0) {
        $(element).text("");
        return;
    } else {
        $(element).text(text);
    }
    $(element).css({"font-size":fontSize + "px"});

}

function placeBubblesOnPage(bubbles) {
    // Suppose we store the height & width according to the correct order
    // We need to set a specific location to start
    var startingLocation = [100, 100];
    var BUBBLE = "#bubble_";
    for (var i = 0; i < 12; i++) {
        startingLocation[0] += bubbles[i];
        startingLocation[1] += bubbles[i];
        $(BUBBLE + i).css({"top":startingLocation[0] + "px", "left":startingLocation[1] + "px"});
    }
}

// Element has to be a string
function getMiddleCoor(element) {
    try {
        // var y = $(element).position().top;
        // var x = $(element).position().left;
        // var y = $(element).offset().top;
        // var x = $(element).offset().left;
        // var trueY = y + yOffset;
        // var trueX = x + xOffset;
        var height = $(element).height();
        var width = $(element).width();
        var centerY = height / 2;
        var centerX = width / 2;
        // alert(x + " " + y);
        return {centerX, centerY}
    } catch (ns) {
        alert("getMiddleCoor has received a variable that is not a string!");
    }
}

function bubbleMovement(center, id, length) {
    try {
        var BUBBLE = "#bubble_";
        // Repeat for each BUBBLE
        for (var i = 0; i < length; i++) {
            var centerX = center[i].centerX;
            var centerY = center[i].centerY;
            var moveX;
            var moveY;
            do {
                moveX = 3 + Math.floor(Math.random() * 6);
                moveY = 3 + Math.floor(Math.random() * 6);
                moveX *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
                moveY *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
            } while ((moveX + centerX) > (centerX + 20) ||
            (moveX + centerX) < (centerX - 20) ||
            (moveY + centerY) > (centerY + 20) ||
            (moveY + centerY) < (centerY - 20));
            // simple if else statement, if random == 1, positive movement else negative movement

            var moveCSSx = moveX + "px";
            var moveCSSy = moveY + "px";
            $(BUBBLE + i + id).css({left: moveCSSx, top: moveCSSy});
        }

    } catch (e) {
        alert("bubbleMovement did not receive an array");
        return;
    }
}

// I had no choice...
// These values should only be used in hoverBubble and NO WHERE ELSE
var bubblecounter = 0;
var globalBubble = [[]];
var globalBubbleText;

function hoverBubble(bubbles, id) {
    var type;
    if (id == "-1") {
        type = 0;
    } else if (id == "-2") {
        type = 1;
    } else {
        alert("Invalid id");
    }
    globalBubble[id] = bubbles;
    for (var i = 0; i < bubbles.length; i++) {
        // This prevents hover over popup changing the bubble as well
        if (i === 7 && $('title').text() === "Show Me The Crime | Home") {
            $("#popup-separator").hover(function(){
                // strip the words in front of the class till numbers
                var counter = $(this).attr("class").match(/\d+/);
                // counter = counter.splice(0, -1);
                // alert(counter);
                $(this).find("span").text(globalBubble[id][counter].crime + "\n" +
                    globalBubble[id][counter].crimeValue);
                $(this).find("span").css({fontWeight: "bold"});

                // $("#popup-content").toggleClass("popup");
                // $("#popup-content").toggleClass("collapse");
                $("#popup-content").css({width: "0px"});
                $("#popup-content").find("strong").text("");
            }, function(){
                var counter = $(this).attr("class").match(/\d+/);
                $(this).find("span").text(globalBubble[id][counter].crime);
                $(this).find("span").css({fontWeight: "normal"})
            });
        } else {
            $("#bubble_" + i + id).hover(function(){
                // strip the words in front of the class till numbers
                var counter = $(this).attr("class").match(/\d+/);
                $(this).find("span").text(globalBubble[id][counter].crime + "\n" +
                    globalBubble[id][counter].crimeValue);
                $(this).find("span").css({fontWeight: "bold"})
            }, function(){
                var counter = $(this).attr("class").match(/\d+/);
                $(this).find("span").text(globalBubble[id][counter].crime);
                $(this).find("span").css({fontWeight: "normal"})
            });
        }
    }
}

function resetAll() {
    for (var i = 0; i < 12; i++) {
        $(BUBBLE + i + "-1").css({"height":0 + "px", "width":0 + "px"});
        $(BUBBLE + i + "-2").css({"height":0 + "px", "width":0 + "px"});
        $(BUBBLETEXT + i + "-1").text("");
        $(BUBBLETEXT + i + "-2").text("");
    }
}

function modifyBubbles(type, id) {
    for (var i = 0; i < $('.bubble').length; i++) {
        var element = BUBBLE + i + id;
        var elementText = BUBBLETEXT + i + id;
        var height, font;
        if ($(element).height() !== 0) {
            if (type == "expand") {

                height = $(element).height() + 0.04 * $(window).height();
                // Returns with px, converting to int selects only the first few numbers
                font = parseInt($(elementText).css("font-size"))  + 3;
                $("#content-container").css({gridTemplateColumns: "min-content 90vw"});
                // $("#bubble-container").css({paddingLeft: "40vw"});

                enlarge = true;


            } else if (type == "shrink") {
                height = $(element).height() - 0.04 * $(window).height();
                font = parseInt($(elementText).css("font-size")) - 3;
                $("#content-container").css({gridTemplateColumns: "min-content min-content"});
                // $("#bubble-container").css({paddingLeft: "0"});
                enlarge = false;
            } else {
                return;
            }

            $(element).css({"height":height + "px", "width":height + "px"});
            $(elementText).css({"font-size":font + "px"})
        }
    }
}

function hoverPopup() {
    $("#popup-content").hover(function(){
        $(this).find("strong").text("The bubble!!!");
    }, function(){
        $(this).find("strong").text("Hover over me!");
    });
}

function setNoBubblePopup(id) {
    $('#no-bubbles' + id).removeClass("no-height");
    $('#no-bubbles'+ id).addClass("no-bubbles-default");

    $('#no-bubbles-text'+ id).removeClass("no-height");
    // $('#no-bubbles-text'+ id).addClass("no-bubbles-default");
}

function removeNoBubblePopup(id) {
    $('#no-bubbles' + id).addClass("no-height");
    $('#no-bubbles'+ id).removeClass("no-bubbles-default");

    $('#no-bubbles-text'+ id).addClass("no-height");
    // $('#no-bubbles-text'+ id).removeClass("no-bubbles-default");
}

// function updateContainer() {
//     $("#bubbles-container").css({gridTemplateRows: "max-content min-content min-content",
//         gridTemplateColumns:
//             "minmax(100px, max-content) minmax(100px, 500px) minmax(100px, 500px) minmax(100px,\n" +
//             "            500px) minmax(100px, 500px)"})
// }

$(document).ready(function() {
    var crimeDropdown = $("#mselect").get();

    // Listen for dataset updates.
    $(document).on('dataset1Ready', function() {
        var dataset = JSON.parse(sessionStorage.getItem('dataset'));
        console.log('Regenerating bubbles for '+ sessionStorage.getItem('lga'));
        var id = "-1";
        datasets[0] = dataset;
        // Checks if there exist the crime dropdown and if it has been populated
        // if not then start the bubbles, else update them
        // if (crimeDropdown) {
        //
        // }
        if (crimeDropdown.length !== 0 && $("#mselect").val().length !== 0) {
            updateByCrime($("#mselect").val());
        } else {
            beginBubbles(dataset, id);
        }
    });

    $(document).on('dataset2Ready', function() {
        var dataset = JSON.parse(sessionStorage.getItem('dataset'));
        console.log('Regenerating bubbles for '+ sessionStorage.getItem('lga'));
        if ($('title').text() === "Show Me The Crime | Filter") {
            var id = "-2";
            datasets[1] = dataset;
            if (crimeDropdown.length !== 0 && $("#mselect").val().length !== 0) {
                updateByCrime($("#mselect").val());
            } else {
                beginBubbles(dataset, id);
            }
        }
    });

});
