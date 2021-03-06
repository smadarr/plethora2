/***********************************************************/
/*                     Firebase Config                     */
/***********************************************************/
var config = {
    apiKey: "AIzaSyDpdQGnnJJUjjQoUsoNG3-bSYcPqmLVfWg",
    authDomain: "plethoradb-b25ff.firebaseapp.com",
    databaseURL: "https://plethoradb-b25ff.firebaseio.com",
    storageBucket: "plethoradb-b25ff.appspot.com",
    messagingSenderId: "942520102070"
};
  var serverUrl = "http://simulife.weizmann.ac.il/PlaygoServer2Load/playgo/playgoservice/";
/***********************************************************/
/*                      Global Params                      */
/***********************************************************/
 var shapes = [];
 var sentences = [];
 var cards;
 var gap = .5;
 var speed = 3;
 var closeTaskTray = false;
 var checkSuccessFlag = false;
 var uniqueUserid = "0";

$(function () {
    ClearPlayGoEvents();

    var pause = "";
    var levelNum = GetLevelNum();
    var successCriterions;
    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');
    var checkSuccess = true;
    ctx.canvas.width = $("#sidebar").offset().left;

var winHight = window.innerHeight == 950 ? 850 : window.innerHeight;
 ctx.canvas.height = winHight - $("#header").height();
    //ctx.canvas.height = window.innerHeight - $("#header").height();
    ctx.fillStyle = '#00031a';

    var limitShapes;
    var container = { x: 60, y: 10, width: ctx.canvas.width - 130, height: ctx.canvas.height - 60 };

    ctx.fillRect(container.x, container.y, container.width, container.height);

  //  ctx.strokeRect(container.x, container.y, container.width, container.height);


 /***********************************************************/
 /*                       Create Border                     */
 /***********************************************************/
var borderColorsTop = ['color9', 'color8', 'color7', 'color6', 'color5', 'color4', 'color11', 'color10', 'color9','color8', 'color7', 'color6', 'color5', 'color4'];
var borderLengthTop = [0.11, 0.06, 0.03, 0.11, 0.06, 0.06, 0.11, 0.03,  0.11, 0.06, 0.03, 0.11, 0.06, 0.06 ];

var borderColorsRight = ['color4', 'color5', 'color6', 'color7', 'color8', 'color9', 'color10'];
var borderLengthRight = [0.2, 0.1, 0.06, 0.22, 0.1, 0.12, 0.2];

var borderColorsBottom = ['color9', 'color8', 'color7', 'color6', 'color5', 'color4', 'color11', 'color10', 'color9', 'color8', 'color7', 'color6', 'color5', 'color4'];
var borderLengthBottom = [0.06, 0.06, 0.11, 0.03, 0.06, 0.11, 0.03, 0.11, 0.06, 0.06, 0.11, 0.03, 0.06, 0.11 ];

var borderColorsLeft = ['color4', 'color5', 'color6', 'color7', 'color8', 'color9', 'color10'];
var borderLengthLeft = [0.2, 0.1, 0.1, 0.22, 0.06, 0.12, 0.2];

var xpos = container.x;
//Top Border
for(b in borderColorsTop)
{
    bLength = container.width * borderLengthTop[b];
    ctx.beginPath();
    ctx.moveTo(xpos, container.y);
    if(b == borderColorsTop.length-2)
    {
        bLength += 10;
    }
    ctx.lineTo(xpos + bLength, container.y);
    ctx.lineWidth = 20;
    ctx.strokeStyle = GetColor(borderColorsTop[b]);
    ctx.stroke();
    xpos = xpos + bLength;
}
xpos -= 10;
var ypos = container.y;

//Right Border
for(b in borderColorsRight)
{
    bLength = container.height * borderLengthRight[b];
    ctx.beginPath();
    ctx.moveTo(xpos, ypos);
    if(b == borderColorsRight.length-2)
    {
        bLength += 10;
    }
    ctx.lineTo(xpos, ypos + bLength);
    ctx.lineWidth = 20;
    ctx.strokeStyle = GetColor(borderColorsRight[b]);
    ctx.stroke();
    ypos = ypos + bLength;
}
ypos -= 10;

//Bottom Border
for(b in borderColorsBottom)
{
    bLength = container.width * borderLengthBottom[b];
    ctx.beginPath();
    ctx.moveTo(xpos, ypos);
    if(b == borderColorsBottom.length-2)
    {
        bLength += 10;
    }
    ctx.lineTo(xpos - bLength, ypos);
    ctx.lineWidth = 20;
    ctx.strokeStyle = GetColor(borderColorsBottom[b]);
    ctx.stroke();
    xpos = xpos - bLength;
}
xpos += 10;
//Left Border
for(b in borderColorsLeft)
{
    bLength = container.height * borderLengthLeft[b];
    ctx.beginPath();
    ctx.moveTo(xpos, ypos);
    if(b == borderColorsLeft.length-2)
    {
        bLength += 10;
    }
    ctx.lineTo(xpos, ypos - bLength);
    ctx.lineWidth = 20;
    ctx.strokeStyle = GetColor(borderColorsLeft[b]);
    ctx.stroke();
    ypos = ypos - bLength;
}

    firebase.initializeApp(config);

 /***********************************************************/
 /*                       Shape Class                       */
 /***********************************************************/
       var Shape = function (id, type, color, size, x, y, vx, vy) {
        this.id = id;
        this.type = type;
        this.color = color;
        this.r = GetSize(size, type).r;//radius for circle
        this.x = x;
        this.y = y;
        this.w = GetSize(size, type).w;
        this.h = GetSize(size, type).h;
        // this.vx = vx;// 10 * Math.random();
        // this.vy = vy;//10 * Math.random();
        this.vx = getRandom(vx-1, vx+1);
        this.vy = getRandom(vy-1, vy+1);
        this.hitWallFlag = false;
        this.hitShapeFlag = false;
        this.delete = false;
    }

    Shape.prototype.Equal = function (shape) {
        if (this.type == shape.type)
            if (this.color == shape.color)
                return true;
        return false;
    }

    Shape.prototype.Created = function () {
        if (shapes.length < limitShapes)
        {
            shapes.push(this);
            SetShapesCurrentState();
            // $("#limit-shapes").text(shapes.length + " מתוך " +  limitShapes);
        }
    }

    Shape.prototype.Deleted = function () {  
        this.delete = true;
        // for(var i in shapes)
        // {
        //     if(shapes[i].id == this.id)
        //     {
        //         shapes.splice(i,1);
        //     }
        // }   
        // SetShapesCurrentState();
    }

    Shape.prototype.ChangeColor = function (newColor) {
        this.color = newColor;
    }

    function SetShapesCurrentState()
    {
        var circle = {type:"circle", color:"color4"};
        var triangle = {type:"triangle", color:"color6"};
        var square = {type:"square", color:"color5"};
        var circleCnt = CountShapes(circle);
        var triangleCnt = CountShapes(triangle);
        var squareCnt = CountShapes(square);
        var shapesCntString = "עיגולים: " + circleCnt + " | משולשים: " + triangleCnt + " | ריבועים: " + squareCnt;
        $("#limit-shapes").text(shapesCntString);
    }

    var slotObj = function (slot) {
        this.type = slot.type;
        this.content = slot.content;
        this.content_h = slot.content_h;
        this.tooltip = slot.tooltip;
        this.card;
    }

    var sentenceObj = function (sentence) {
        this.slots = InitSlots(sentence);
        this.completed = false;
    }

    function InitSentences(sentencesArray) {
        for (var i = 0; i < sentencesArray.length; i++) {
            sentences.push(new sentenceObj(sentencesArray[i]));
        }
    }

    function InitSlots(sentence) {
        var slots = [];
        for (var i = 0; i < sentence.length; i++) {
            var slot = new slotObj(sentence[i]);
            slots.push(slot);
        }
        return slots;
    }

    $(function () {
        LevelSetup();
    });

    function draw() {
            ctx.fillStyle = '#00031a';
            ctx.fillRect(container.x, container.y, container.width, container.height);
            if(checkSuccessFlag)
            {              
                CheckSuccess();
            }
            
            CollisionStrategy(shapes);

            for (var i = 0; i < shapes.length; i++) {
                if(shapes[i].delete)
                {
                     for(var j in shapes)
                    {
                        if(shapes[j].id == shapes[i].id)
                        {
                            shapes.splice(i,1);
                        }
                    }   
                    SetShapesCurrentState();
                    continue;
                }

                ctx.fillStyle = GetColor(shapes[i].color);
                ctx.beginPath();
                switch (shapes[i].type) {
                    case "circle":
                        {
                            ctx.arc(shapes[i].x, shapes[i].y, shapes[i].r, 0, 2 * Math.PI, false);
                            break;
                        }
                    case "square":
                        {                         
                            //ctx.rect(shapes[i].x, shapes[i].y, shapes[i].w, shapes[i].h);
                            var path = new Path2D();
                            ctx.moveTo(shapes[i].x - shapes[i].r, shapes[i].y + shapes[i].r);
                            ctx.lineTo(shapes[i].x + shapes[i].r, shapes[i].y + shapes[i].r);
                            ctx.lineTo(shapes[i].x + shapes[i].r, shapes[i].y - shapes[i].r);
                            ctx.lineTo(shapes[i].x - shapes[i].r, shapes[i].y - shapes[i].r);
                            ctx.closePath();
                            break;
                        }
                    case "triangle":
                        {
                            var path = new Path2D();
                            ctx.moveTo(shapes[i].x - 20, shapes[i].y + 20);
                            ctx.lineTo(shapes[i].x, shapes[i].y - 20);
                            ctx.lineTo(shapes[i].x + 20, shapes[i].y + 20);
                            ctx.closePath();
                            break;
                        }
                }
                ctx.fill();
                var hitWall = false;

                if ((shapes[i].x + shapes[i].vx + shapes[i].r > container.x + container.width) ||
                   (shapes[i].x - shapes[i].r + shapes[i].vx < container.x))          
                   {
                    shapes[i].vx = -shapes[i].vx;
                    hitWall = true;
                }
                if ((shapes[i].y + shapes[i].vy + shapes[i].r > container.y + container.height) ||
                  (shapes[i].y - shapes[i].r + shapes[i].vy < container.y)) 
                   {
                    shapes[i].vy = -shapes[i].vy;
                    hitWall = true;
                }
                if (hitWall == true && shapes[i].hitWallFlag == false) {
                    //HitWallEvent(shapes[i]);
                       sendPlaygoEventData(shapes[i].type, "Shape",
                                            "topWall", "Wall",
                                            "meet", [], i, 'GUI', uniqueUserid);
                }
                else {
                    //check if shape hits other shape
                    for (var j = 0; j < shapes.length; j++) {
                        if (i != j) {
                            if (shapes[i].hitShapeFlag == false && shapes[j].hitShapeFlag == false
                             &&
                             //   shapes[i].hitWallFlag == false && shapes[j].hitWallFlag == false &&
                                hitWall == false) {
                                if (GetDistance(shapes[i].x, shapes[i].y, shapes[j].x, shapes[j].y) > shapes[i].r + shapes[j].r ) {
                                    continue;
                                }
                                else
                                {
                                    //HitTwoShapes(shapes[i], shapes[j]);
                                       sendPlaygoEventData(shapes[i].type, "Shape",
                                            shapes[j].type, "Shape",
                                            "meet", [], 3, 'GUI', uniqueUserid);
                                }
                            }
                        }
                    }
                }
                if(shapes.length > 0)
                {
                    shapes[i].x += shapes[i].vx;
                    shapes[i].y += shapes[i].vy;
                }            
            }          
        pause = requestAnimationFrame(draw);
    }

    let level = null;

    function LevelSetup() {
        $("#open-light").css({ fill: "#898989" });
        var dbRef = firebase.database().ref('levels');

        dbRef.once("value", function (data) {
        level = data.val()[levelNum];
           $("#level_num").text(level.name);
        limitShapes = level.limitShapes == undefined ? 70 : level.limitShapes;        
        $("#win_condition_text").text(level.task);
        
        for (i in level.shapes) {                
            var size = level.shapes[i].size == undefined ? "medium" : level.shapes[i].size;         
            var radius = GetSize(size, level.shapes[i].type).r;  
            var cx = Math.floor(Math.random() * ((container.width  - radius  - radius)+1) + container.x + radius);
            var cy = Math.floor(Math.random() * ((container.height - container.y-container.y - radius)+1) + container.y + radius);
            shapes.push(new Shape(i, level.shapes[i].type, level.shapes[i].color, size, cx, cy, speed, speed));
        }

        SetShapesCurrentState();

        if(levelNum == 0)
        {
            $("#itroduction").show();
            //itroduction
                $("#itroduction").click(function(){
                    $( "#dialog" ).dialog( "close" );
                });

                $( "#dialog" ).dialog({
                    modal: true,
                        open: function() {
                        $('.ui-widget-overlay').addClass('custom-overlay');
                    }
                });            
        }
        else
        {
            //$("#itroduction").hide();
        }
  
        //draw senteces
        InitSentences(level.sentences);
        DrawSentences();

        //draw cards
        cards = level.cards;
        DrawCards();

        //init success criteria object
        successCriterions = level.successCriterions;

        //start animation
        draw();      
        setTimeout(showWinCondition, 1000);
        });
    }

    function AttentionSidebar()
    {
        setTimeout(function () {
            $("#open-light").css({ fill: "#898989" });
        }, 200);
        setTimeout(function () {
            $("#open-light").css({ fill: "#d93f07" });
        }, 400);
    }

    // function HitTwoShapes(shape1, shape2) {
    //     for (var i = 0; i < sentences.length; i++) {
    //         var sentence = sentences[i];
    //         if (sentence.completed == true) {
    //             if (sentence.slots[2].content == "hit" && sentence.slots[3].type == "shape") {

    //                 var whenShape1 = GetSlotOrCard(sentence, 1).content;
    //                 var whenShape2 = GetSlotOrCard(sentence, 3).content;
    //                 if ((shape1.Equal(whenShape1) && shape2.Equal(whenShape2)) ||
    //                     (shape1.Equal(whenShape2) && shape2.Equal(whenShape1))) {
    //                     shape1.hitShapeFlag = true;
    //                     shape2.hitShapeFlag = true;
    //                     setTimeout(function () {
    //                         shape1.hitShapeFlag = false;
    //                         shape2.hitShapeFlag = false;
    //                     }, 500);
    //                     ExecuteAction(sentence, shape1);
    //                 }
    //             }
    //         }
    //     }
    // }

    // function HitWallEvent(shape) {
    
      
    //         //check if there is sentence with hit wall event
    //         for (var i = 0; i < sentences.length; i++) {
    //             var sentence = sentences[i];
    //             if (sentence.completed == true) {
    //                 var whenShape = GetSlotOrCard(sentence, 1).content;
    //                 if (shape.Equal(whenShape)) {
    //                     var whenMethod = GetSlotOrCard(sentence, 2);
    //                     var whenSecondShape = GetSlotOrCard(sentence, 3);
    //                     if (whenMethod.content == "hit" && whenSecondShape.type == "wall") {
    //                         shape.hitWallFlag = true;
    //                         setTimeout(function () {
    //                             shape.hitWallFlag = false;
    //                         }, 200);
    //                         ExecuteAction(sentence, shape);
    //                     }
    //                 }
    //             }
    //         }
       
    // }

    // //shape param is the shape that hitted the wall/ other shape...
    // function ExecuteAction(sentence, shape) {
    //     var whenShape = GetSlotOrCard(sentence, 1).content;
    //     var thenSlotNum = GetThenSlotNumber(sentence);
    //     var thenShape = GetSlotOrCard(sentence, thenSlotNum + 1);
    //     var actionMethod = GetSlotOrCard(sentence, thenSlotNum + 2);

    //     switch (actionMethod.content) {
    //         case "created":
    //             {                  
    //                 var size = thenShape.content.size == undefined ? "medium" : thenShape.content.size;                    
    //                 var radius = GetSize(size, thenShape.content.type).r;
    //                 var newShape = new Shape(shapes.length, thenShape.content.type, thenShape.content.color, 
    //                                          size, shape.x, shape.y, speed, speed);

    //                 newShape.hitWallFlag = true;

    //                 setTimeout(function () {
    //                      newShape.Created();
    //                 }, 200);
                                                                               
    //                 setTimeout(function () {
    //                     newShape.hitWallFlag = false;
    //                 }, 250);
    //                 break;
    //             }
    //             case "deleted":
    //             {  
    //                 if (shape.Equal(thenShape.content)) {  
    //                     shape.Deleted();
    //                 }
    //                 break;
    //             }
    //         case "change_color":
    //             {
    //                 if (shape.Equal(whenShape.content)) {
    //                     var newColor = GetSlotOrCard(sentence, thenSlotNum + 3).content;
    //                     shape.ChangeColor(newColor);
    //                 }
    //                 break;
    //             }
    //     }
    // }

  



    function GetColor(colorName) {
        switch (colorName) {
            case "color1":
                {
                    return "#51af87";
                }
            case "color2":
                {
                    return "#c2c2c2";
                }
            case "color3":
                {
                    return "#737373";
                }
            case "color4":
                {
                    return "#845478";
                    // return "#AA6666";
                }
            case "color5":
                {
                    return "#dd4400";
                }
            case "color6":
                {
                    return "#ffbb00";
                }
            case "color7":
                {
                    return "#ccbb33";
                }
            case "color8":
                {
                    return "#bbbb99";
                }
            case "color9":
                {
                    return "#77ccaa";
                }
             case "color10":
                {
                    return "#bbccdd";
                }
              case "color11":
                {
                    return "#7799bb";
                }
             case "color12":
                {
                    return "#845478";
                }
            case "color13":
                {
                    return "#f1a2b9";
                }
        }
    }


    function GetSize(size, type) {
        var w, h, r;
        if (size == undefined) {
                size = "medium";
        }
        switch (size) {
            case "medium":
                {
                    if(type == "square")
                    {
                                r = 20;
                                w = h = 40;
                        return { r: r, w: w, h: h };
                    }
                    else {// (type == "circle") {
                        w = h = r = 20;
                        return { r: r, w: w, h: h };
                    }
                
                }
        }

    }

    function GetDistance(x1, y1, x2, y2) {
        var diffX = x2 - x1;
        var diffY = y2 - y1;
        return Math.sqrt((diffX * diffX) + (diffY * diffY));
    }

    function CheckSuccess() {
        var isSuccess = true;
        for (var i = 0; i < successCriterions.length; i++) {
            isSuccess = isSuccess && CheckSuccessCriterion(successCriterions[i]);
           
        }
        if (isSuccess == true) {
            checkSuccessFlag = false;

        for (s in sentences) {
            sentences[s].completed = false;
        }

            setTimeout(function () {
                if (checkSuccess == true) {                   
                    checkSuccess = false;                
                    showLevelComplete();
                    cancelAnimationFrame(pause);
                    clearInterval(blinkOpenSidebarLight);
                }
            }, 1000);
        }
    }

    function CheckSuccessCriterion(successCriterion) {

        switch(successCriterion.method)
        {
            case "equal":
                {                  
                    var cnt = 0;
                    if (successCriterion.amount != undefined) {                      
                        if(CountShapes(successCriterion.shape1) == successCriterion.amount)
                        {        
                            return true;
                        }
                        // for (var i = 0; i < shapes.length; i++) {
                        //     if (shapes[i].Equal(successCriterion.shape1)) {
                        //         cnt++;
                        //         if (cnt == successCriterion.amount) {
                        //             for (var j = 0; j < sentences.length; j++) {
                        //                 //sentences[j].completed = false;
                        //             }
                        //             return true;
                        //         }

                        //     }
                        // }
                    }
                    break;
                }
                case "greater-equal":
                {
                       if(CountShapes(successCriterion.shape1) >= successCriterion.amount)
                        {        
                            return true;
                        }
                    break;
                }
            case "greater":
                {
                       if(CountShapes(successCriterion.shape1) > successCriterion.amount)
                        {        
                            return true;
                        }
                    break;
                }
            case "less":
                {
                       if(CountShapes(successCriterion.shape1) < successCriterion.amount)
                        {        
                            return true;
                        }
                    break;
                }
        }
        return false;
    }

    function CountShapes(shape)
    {     
        cnt = 0;
        for(s in shapes)
        {             
           if(shapes[s].Equal(shape))
           {
               cnt++;
           }
        }        
        return cnt;
    }

    // $("#move_to_next_lvl").click(function () {
    //     $("#move_to_next_lvl").hide();
    //     ClearLevel();
    //     levelNum++;
    //     shapes = [];
    //     LevelSetup();
    // });

    function ClearLevel() {
        alert("ClearLevel");
        $("#slots-container div").remove();
        $("#cards-container div").remove();
        ctx.fillStyle = '#00031a';
        ctx.fillRect(container.x, container.y, container.width, container.height);
        sentences = [];
        shapes = [];
        checkSuccess = true;
        $("#task").text("");
        $("#level_name").text("");
        $("#level_num").text("");
        $("#open-light").css({ fill: "#898989" });
    }

    $("#open-btn").click(function () {
        if(closeTaskTray)
        {
                $('.right-sidebar-outer').toggleClass('show-from-right');
                if (IsSidebarOpen()) //open sidebar
                {
                    cancelAnimationFrame(pause);
                    clearInterval(blinkOpenSidebarLight);
                    blurPage();

                    setTimeout(function() {
                        $(".card").effect( "shake", {times: 1}, 200 );
                    }, 300);
                }
                else //close sidebar
                {
                    unBlurPage();
                    checkSuccessFlag = true;
                    if (checkSuccess == true)
                    {
                        setTimeout(function () {
                        if(checkSuccess == true)
                            {
                                blinkOpenSidebarLight = setInterval(AttentionSidebar, 400);
                            }

                        }, 10000);

                    }
                    setTimeout(function () {
                        pause = requestAnimationFrame(draw);
                    }, 500);

                }
        }
    });

    $("#reload-btn").click(function () {
         ClearPlayGoEvents();
         location.reload();
    });

    function IsSidebarOpen() {
        return $("#sidebar").hasClass("show-from-right");
    }

    function GetLevelNum()
    {
        var levelNum = window.location.href.split('=')[1];
        return levelNum == undefined ? 0 : levelNum;
    }

    function showLevelComplete(){        
        //WinAnimation();
        ClearPlayGoEvents();
        $("#move_to_next_lvl").delay(100).animate({
             top: '0px',
        }, 2000);
        $("#move_to_next_lvl_btn").delay(100).animate({
             top: '0px',
        }, 2000);
        blurPage();
    }

    function ClearPlayGoEvents()
    {
        try
        {
            var rules = new Array();
            var rule = new playgoRule();
            rules.push(rule);
            var rulesList = {rules: rules, userid: uniqueUserid};
            //SendRulesToPlayGo(rules);
            SendRulesToPlayGo(rulesList);
        }
        catch(err)
        {
            errCounter++;
        }

    }

    function showWinCondition(){
        $("#win_condition").delay(100).animate({
             top: '0px',
        }, 750);
            $("#win_condition_btn").delay(100).animate({
             top: '0px',
        }, 750);
        setTimeout(function () {            
                setShapesSpeed(1.5);
                blurPage();
            }, 750);
       
    }

function setShapesSpeed(newSpeed)
{
    for(i in shapes){
        shapes[i].vx = shapes[i].vy = newSpeed;
        speed = newSpeed;
    }
}

function blurPage()
{
    canvas.style.webkitFilter = "blur(3px)";
}

function unBlurPage()
{
    canvas.style.webkitFilter = "blur(0px)";
}
 
    var blinkOpenSidebarLight;
    var blinkCloseSidebarLight;

    $("#ok_win_btn").click(function(){
        closeTaskTray = true;
         $("#level_name").text(level.task);      
           $("#win_condition").delay(100).animate({
             top: '-100%',
        }, 750);
           setTimeout(function () {
               blinkOpenSidebarLight = setInterval(AttentionSidebar, 400);
            }, 1500);
       setTimeout(function () {
            setShapesSpeed(3);
            unBlurPage();
        }, 750);
    });

    $("#next_lvl_btn").click(function(){
            levelNum++;
            window.location.href = "levels.html?level=" + levelNum;
    });

        $("#logo-div").click(function () {
        window.location.href = "levels.html?level=" + levelNum;
    });

     function getRandom(min, max) {
       // return min + Math.floor(Math.random() * (max - min + 1));
        return min + Math.random() * (max - min + 1);
    }

    function CalcNewSpeed()
    {
        var shapesCnt = shapes.length;
        if(shapesCnt == 1)
        {

        }
        else if(shapesCnt >= 2 && shapesCnt <= 10)
        {

        }
        else if(shapesCnt >= 11 && shapesCnt <= 30)
        {

        }
        for(i in shapes){
            shapes[i].vx = shapes[i].vy = newSpeed;
            speed = newSpeed;
        }
    }


    /********************************************/
    /*                  PlayGo                  */
    /********************************************/

    //Define event prototype
    function playgoEvent (sourceObject, sourceClass,
            targetObject, targetClass, methodName, args, id, generator, userid) {

        this.sourceObject = sourceObject;
        this.sourceClass = sourceClass;
        this.targetObject = targetObject;
        this.targetClass = targetClass;
        this.methodName = methodName;
        this.args = args;
        this.id = id;
        this.generator = generator;
        this.userid = userid;
        
        this.toString = function() {
            return this.userid + this.generator + this.id + " " +
            this.targetObject + "."+ this.methodName + "(" +
            this.args + ")";
        }	
    }

    errCounter = 0;

    function sendPlaygoEventData(sourceObject, sourceClass, 
		targetObject, targetClass, methodName, args, id, generator, userid) {
        try
        {
            var server = serverUrl + "playgoEvent";
            var pEvent = new playgoEvent(sourceObject, sourceClass, 
                targetObject, targetClass, methodName, args, id, 
                generator, userid);	
        
            $.ajax({
                url: server,
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(pEvent),
                contentType: 'application/json',
                mimeType: 'application/json',
                accept: 'application/json',
        
                success: function (data) { //data is an object  
                    if(data != null && data.length > 1)
                    {     
                        //ExecutePlayGoAction(data[0].id,  data[1].methodName, data[1].targetObject, data[1].args[0]);
                        if(data[0].userid != uniqueUserid) {
                            uniqueUserid = data[0].userid;
                        }
                        ExecutePlayGoAction(data[0].id,  data[1].methodName, data[1].targetObject, data[1].args[0]);
                    }                 
                },
                error:function(data,status,er) {
                    alert("error: "+data+" status: "+status+" er:"+er);
                }
                }); 
            }
            catch(err)
            {
                errCounter++;
            }
    }

    function ExecutePlayGoAction(i, actionMethod, thenShapeType, thenShapeColor)
    {
        var shape = shapes[i];
         switch (actionMethod) {
                case "appear":
                {                  
                    var size ="medium"; //thenShape.size == undefined ? "medium" : thenShape.size;                    
                    var radius = GetSize("medium", thenShapeType).r;// GetSize(size, thenShape.content.type).r;
                    var newShape = new Shape(shapes.length, thenShapeType, thenShapeColor, 
                                             size, shape.x, shape.y, speed, speed);

                    newShape.hitWallFlag = true;
                    setTimeout(function () {
                         newShape.Created();
                    }, 200);
                                                                               
                    setTimeout(function () {
                        newShape.hitWallFlag = false;
                    }, 250);
                    break;
                }
         }
    }

});

   function playgoEventRule(type, sourceObject, sourceClass, targetObject, targetClass, methodName, args, userid) { 
    this.type = type;
	this.sourceObject = sourceObject;
	this.sourceClass = sourceClass; 
	this.targetObject = targetObject;
	this.targetClass = targetClass;
	this.methodName = methodName;
	this.args = args;
    this.userid = userid;
   
   this.toString = function() {
            return this.userid + this.generator + this.id + " " + 
            this.targetObject + "."+ this.methodName + "(" + 
            this.args + ")";
        }	
	// this.toString = function() {
    //         return this.type + " " + 
    //         this.targetObject + "."+
    //         this.targetClass + "." + 
    //         this.methodName + "(" + 
    //         this.args + ")";
    //     }
    }

errCounter = 0;




