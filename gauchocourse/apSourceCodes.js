
//API*********************************************
//***
var run_AP_analysis;//;;return an object which has units, valid, area, apList
//**
//********************************************




var isValidAP ; 
var addGE;
var raw2apData;
var computeAP;


var validateAP = function(arr){

    for( var i = 0 ; i < arr.length ; i++)
        for( var j = 0 ; j < arr.length; j++){
            if(i==j)continue;
            if (arr[i].label==arr[j].label){
                return false
            }
        }

    return true;

}





raw2apData = function(arr){
    /*
     *arr is an array of course label and the score of the user
     *return the full infos from apData and add the score of user
     *
     */
    var res = [];
    for(var i = 0; i < arr.length ; i++){
        var label = arr[i].label;
        var foo;
        for(var idx in apData){
            //console.log(key);
            if(label == apData[idx].label){
                foo = apData[idx];
                //console.log("found");
                break;
            }
        }
        //console.log(foo)
        foo.user_score = arr[i].score;
        res.push(foo);
        //console.log(res);
    }
    return res;

}

addGE = function(geareas,area){
    if (area=="none")return;
    if (area in geareas) {
        geareas[area] += 1
    } else {
        geareas[area] = 1
    }
}
computeAP = function(arr){


    /*
     * arr is the return type of raw2apData
      
      A maximum of 8 units EACH in art studio, English, mathematics, and physics is allowed.
    */
    
    
    var total_units = 0;
    var ge_areas = {};
    var art = 0;
    var physics = 0;
    var math = 0;
    var english = 0;
    for(var i = 0 ; i < arr.length ; i++){
        if(arr[i].user_score<3){
            continue;
        }
        if(!arr[i].multi_scores){
            //console.log(arr[i])
            var label = arr[i].label;
            var units = parseInt(arr[i].units);
            var ge_area = arr[i].ge.area;
            var subject = arr[i].subject;
            var bar;
            switch(subject){
            case "physics":
                physics+=units;
                bar = physics;
                break;
            case "art":
                art+=units;
                bar = art;
                break;
            case "math":
                math+=units;
                bar = math;
                break
            case "english":
                english+=units;
                bar = english;
                break
            default:
                break

            }
            if(bar > 8){
                continue;
            }
            addGE(ge_areas,ge_area);
            total_units += units;
            
        }
        else{
            var foo = arr[i][arr[i]["user_score"]];
            var label = arr[i].label;
            var units = parseInt(foo.units);
            var ge_area = foo.ge.area;
            var subject = arr[i].subject;
            switch(subject){
            case "physics":
                physics+=units;
                bar = physics;
                break;
            case "art":
                art+=units;
                bar = art;
                break;
            case "math":
                math+=units;
                bar = math;
                break
            case "english":
                english+=units;
                bar = english;
                break
            default:
                break

            }
            //console.log(bar)
            //console.log(subject)
            if(bar > 8){
                continue;
            }
            if(label != "English Language and Composition or Literature and Composition")
                addGE(ge_areas,ge_area);
            else{
                addGE(ge_areas,"A1");
                addGE(ge_areas,"A2");
            }
            total_units += units;
        }
    }
    
    return { "units":total_units , "area":ge_areas};
}




run_AP_analysis = function(arr){
    /*
     *This is the API you should use!!!!!!!!!!
     *
     */
    var res = {};
    var flag = validateAP(arr);
    if(!flag){
        res.valid = false;
        res.units = 0;
        res.area = {};
        res.apList = [];
        return res
    }
    arr = raw2apData(arr);
    res = computeAP(arr);
    res.valid = true;
    res.apList = arr;
    return res;
    
}






/*
var arr = [

{"label":"European History","score":3}
,
{"label":"Physics  C (Electricity and Magnetism)","score":3}
,
{"label":"Music  Theory","score":5}
,
{"label":"English Language and Composition or Literature and Composition","score":3}
,
{"label":"Physics  C (Electricity and Magnetism)","score":5}
,
{"label":"European History","score":3}
,
{"label":"U.S. History","score":3}
,
{"label":"English Language and Composition or Literature and Composition","score":4}
,
{"label":"Physics  C (Mechanics)","score":4}
,
{"label":"French Language and Culture","score":3}
,
{"label":"U.S. Government and Politics","score":3}
,
{"label":"Statistics","score":5}
,
{"label":"German Language and Culture","score":3}
,
{"label":"Economics  Macroeconomics","score":4}
,
{"label":"Art Studio Drawing","score":3}
,
{"label":"Human Geography","score":4}
,
{"label":"Physics  B","score":4}
,
{"label":"World History","score":5}
,
{"label":"Economics  Microeconomics","score":4}
,
{"label":"English Language and Composition or Literature and Composition","score":5}
];
arr = raw2apData(arr)
var res = computeAP(arr)
/*

/*
var obj = {
    "label":"English Language and Composition or Literature and Composition",
    "score":3
}


var arr = [obj,obj,obj];
arr = raw2apData(arr);
res = computeAP(arr)

*/
/*
var obj =     {
        "scores": [
            3,
            4,
            5
        ],
        "3": {
            "units": "8",
            "course_equivalent": "German 1-3",
            "score": 3,
            "ge": {
                "area": "B"
            }
        },
        "4": {
            "units": "8",
            "course_equivalent": "German 1-4",
            "score": 4,
            "ge": {
                "area": "B"
            }
        },
        "5": {
            "units": "8",
            "course_equivalent": "German 1-5",
            "score": 5,
            "ge": {
                "area": "B"
            }
        },
        "label": "German Language and Culture",
    "multi_scores": true,
    "user_score":4
    } 

var arr = [obj];
var res = computeAP(arr);


*/

//a simple test
/*
var obj = {
        label :"phy",
        units:3,
        ge:{area:"e",score:3}
        }


var arr = [obj]
computeAP(arr)
*/
