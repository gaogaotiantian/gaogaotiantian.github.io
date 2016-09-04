//local variable to count the ge requirment



var geStatus =new Array() 
    geStatus["A"] = 0,
    geStatus["B"] = 0,
    geStatus["C"] = 0,
    geStatus["D"] = 0,
    geStatus["E"] = 0,
    geStatus["F"] = 0,
    geStatus["G"] = 0,
    geStatus["H"] = 0,

    geStatus["EUR"] = 0,
    geStatus["WRT"] = 0,
    geStatus["WOR"] = 0,
    geStatus["ETH"] = 0,
    geStatus["DEP"] = 0,
    geStatus["QUR"] = 0


var depth = false


var reqNumber = [
            [2,2,6,1,4,1,1],
            [3,3,3,2,2,1,6,1,1,1],
            [3,2,2,1,1,1,6,1,1],
            [2,2,2,1,1,6,1,1]
 ]

var depthSequence = [
    {sub : "CH ST", number : ["1A",  "1B",  "1C" ]},
    {sub : "C LIT", number : ["30A", "30B", "30C"]},
    {sub : "FR",    number : ["50AX", "50BX", "50CX"]},
    {sub : "HIST",  number : ["2A",  "2B",  "2C" ]},
    {sub : "HIST",  number : ["2AH", "2BH", "2CH"]},
    {sub : "HIST",  number : ["4A",  "4B",  "4C" ]},
    {sub : "HIST",  number : ["4AH", "4BH", "4CH"]},
    {sub : "HIST",  number : ["17A", "17B", "17C"]},
    {sub : "HIST",  number : ["17AH","17BH","17CH"]},
    {sub : "PHIL",  number : ["20A" , "20B", "20C"]},
    {sub : "RG ST", number : ["80A",  "80B", "80C"]},
    {sub : "ARTHI", number : ["6A", "6B", "6C", "6D", "6DS", "6DW", "6E", "6F", "6G", "6H", "6K"]}
]

//all of the possible courses that will fulfill the Area B requirment
var foreignLanguage = [{sub: "GREEK", number : "3"},
                       {sub: "LATIN", number : "3"},
                       {sub: "CHIN",  number : "3"},
                       {sub: "JAPAN", number : "3"},
                       {sub: "GER",   number : "3"},
                       {sub: "HEB",   number : "3"},
                       {sub: "SLAV",  number : "3"},
                       {sub: "FR",    number : "3"},
                       {sub: "ITAL",  number : "3"},
                       {sub: "SPAN",  number : "3"},
                       {sub: "PORT",  number : "3"},
                       {sub: "GLOBL", number : "60C"},
                       {sub: "RG ST", number : "10C"},
                       {sub: "RG ST", number : "11C"},
                       {sub: "RG ST", number : "17C"},
                       {sub: "RG ST", number : "30C"},
                       {sub: "RG ST", number : "57C"},
                       {sub: "RG ST", number : "60C"},
                       {sub: "RG ST", number : "122C"},
                       {sub: "RG ST", number : "157C"},
                       {sub: "RG ST", number : "159C"},
                       ]

//******************
//******************
//******************
//function that will be directly called by main program to valuate the ge status 
//******************
//******************
//******************

function ValidGE(){
    UpdateGE()
    var w2 = false, w50 = false //w2 stands for writing 2 and equivalent coures. w50 stand for writing 50 and equivalent coures
    for(course of validCourses){
        if(course.sub == "WRIT"&&parseInt(course.number)=="2"){
            w2 = true
            break
        }
    }
    for(course of validCourses){
        if(course.sub == "WRIT"&&(parseInt(course.number)=="50"||parseInt(course.number)=="109"
          ||parseInt(course.number)=="105"||parseInt(course.number)=="107")){
            w50 = true
            break
        }
        if(course.sub == "ENGL"&&parseInt(course.number)=="10"){
            w50 = true
            break
        }
    }



    if(userData.getype=="ENGR"){
         geFullFillment = [{type : "WRIT 2", status : w2, message : (w2? "1": "0") + "/1"},
                          {type : "WRIT 50", status : w50, message : (w50? "1" : "0")+ "/1"},
                          {type : "Area D,E", status : (geStatus["D"]+geStatus["E"])>=reqNumber[0][0], 
                                 message : (geStatus["D"]+geStatus["E"]) +"/2"},
                          {type : "Area F,G", status : (geStatus["F"]+geStatus["G"])>=reqNumber[0][1], 
                                 message : (geStatus["F"]+geStatus["G"])+"/2"},
                          {type : "Area D,E,F,G,H", status : (geStatus["D"]+geStatus["E"]+geStatus["F"]+geStatus["G"]+geStatus["H"])>=reqNumber[0][2], 
                                 message : (geStatus["D"]+geStatus["E"]+geStatus["F"]+geStatus["G"]+geStatus["H"]) +"/6"},
                          {type : "ETH", status : (geStatus["ETH"])>=reqNumber[0][3], message :(geStatus["ETH"])+"/1"},
                          {type : "WRT", status :(geStatus["WRT"])>=reqNumber[0][4], message : (geStatus["WRT"])+"/4"},
                          {type : "EUR", status : (geStatus["EUR"])>=reqNumber[0][5], message : (geStatus["EUR"])+"/1"},
                          {type : "DEP", status : checkDepth(), message : (checkDepth() ? "1":"0") + "/1"},
        ]
        //console.log("geFullFillment",geFullFillment)
        return 
    }

    else if(userData.getype == "LSBA"){
         geFullFillment = [{type : "WRIT 2", status : w2, message : (w2? "1": "0") + "/1"},
                          {type : "WRIT 50", status : w50, message : (w50? "1" : "0")+ "/1"},
                          {type : "Area B", status : checkAreaB(), message : (checkAreaB()?1:0)+"/1"},
                          {type : "Area C", status :(geStatus["C"]>=reqNumber[1][0]), message :geStatus["C"]+"/3"},
                          {type : "Area D", status :(geStatus["D"]>=reqNumber[1][1]), message :geStatus["D"]+"/3"},
                          {type : "Area E", status :(geStatus["E"]>=reqNumber[1][2]), message :geStatus["E"]+"/3"},
                          {type : "Area F", status :(geStatus["F"]>=reqNumber[1][3]), message :geStatus["F"]+"/2"},
                          {type : "Area G", status :(geStatus["G"]>=reqNumber[1][4]), message :geStatus["G"]+"/2"},
                          {type : "WOR", status : (geStatus["WOR"]>=reqNumber[1][5]), message : geStatus["WOR"]+"/1"},
                          {type : "WRT", status : (geStatus["WRT"])>=reqNumber[1][6], message : geStatus["WRT"]+"/6"},
                          {type : "EUR", status : (geStatus["EUR"]>=reqNumber[1][7]), message : geStatus["EUR"]+"/1"},
                          {type : "QUR", status : (geStatus["QUR"]>=reqNumber[1][8]), message : geStatus["QUR"]+"/1"},
                          {type : "ETH", status : (geStatus["ETH"]>=reqNumber[1][9]), message : geStatus["ETH"]+"/1"}
        ]
        //console.log("geFullFillment",geFullFillment)

        return 

    }

    else if(userData.getype == "LSBS"){
         geFullFillment = [{type : "WRIT 2", status : w2, message : (w2? "1": "0") + "/1"},
                          {type : "WRIT 50", status : w50, message : (w50? "1" : "0")+ "/1"},
                          {type : "Area B", status : checkAreaB(), message : (checkAreaB()?1:0)+"/1"},
                          {type : "Area C", status :(geStatus["C"]>=reqNumber[2][0]), message :geStatus["C"]+"/3"},
                          {type : "Area D", status :(geStatus["D"]>=reqNumber[2][1]), message :geStatus["D"]+"/2"},
                          {type : "Area E", status :(geStatus["E"]>=reqNumber[2][2]), message :geStatus["E"]+"/2"},
                          {type : "Area F", status :(geStatus["F"]>=reqNumber[2][3]), message :geStatus["F"]+"/1"},
                          {type : "Area G", status :(geStatus["G"]>=reqNumber[2][4]), message :geStatus["G"]+"/1"},
                          {type : "WOR", status : (geStatus["WOR"]>=reqNumber[2][5]), message :(geStatus["WOR"])+"/1"},
                          {type : "WRT", status : (geStatus["WRT"])>=reqNumber[2][6], message :(geStatus["WRT"])+"/6"},
                          {type : "QUR", status : (geStatus["QUR"]>=reqNumber[2][7]), message :(geStatus["QUR"])+"/1"},
                          {type : "ETH", status : (geStatus["ETH"]>=reqNumber[2][8]), message :(geStatus["ETH"])+"/1"}
        ]
        //console.log("geFullFillment",geFullFillment)
        return 
    }

    else if(userData.getype == "BMFA"){
         geFullFillment = [{type : "WRIT 2", status : w2, message : (w2? "1": "0") + "/1"},
                          {type : "WRIT 50", status : w50, message : (w50? "1" : "0")+ "/1"},
                          {type : "Area B", status : checkAreaB(), message : (checkAreaB()?1:0)+"/1"},
                          {type : "Area C", status :(geStatus["C"]>=reqNumber[3][0]), message :geStatus["C"]+"/2"},
                          {type : "Area D", status :(geStatus["D"]>=reqNumber[3][1]), message :geStatus["D"]+"/2"},
                          {type : "Area E", status :(geStatus["E"]>=reqNumber[3][2]), message :geStatus["E"]+"/2"},
                          {type : "Area G", status :(geStatus["G"]>=reqNumber[3][3]), message :geStatus["G"]+"/1"},
                          {type : "WOR", status : (geStatus["WOR"]>=reqNumber[3][4]), message :(geStatus["WOR"])+"/1"},
                          {type : "WRT", status : (geStatus["WRT"]>=reqNumber[3][5]), message :(geStatus["WRT"])+"/6"},
                          {type : "QUR", status : (geStatus["QUR"]>=reqNumber[3][6]), message :(geStatus["QUR"])+"/1"},
                          {type : "ETH", status : (geStatus["ETH"]>=reqNumber[3][7]), message :(geStatus["ETH"])+"/1"}
        ]
        return 
    }


}










//******************
//******************
//******************
//function beyond here will be called by ValidGE
//******************
//******************
//******************

//this function will update the geStatus based on validCourses
function UpdateGE(){
    for(i in geStatus)
        geStatus[i] = 0
    for (a in userData.ap.area) {
        geStatus[a] += userData.ap.area[a]
    }

    for(course of validCourses){
        for(ge of course.gearea)
            geStatus[ge]+=1
    }
    console.log("ge",geStatus)

    if(userData.getype=="ENGR"){
        checkDepth()
    }
}



//this function will check the depth requirment for ENGR student
function checkDepth(){
    var count = 0
    for(seq of depthSequence){
        for(course of validCourses){
            if(course.sub == seq.sub){
                for(number of seq.number){
                    if(course.number == number){
                        count+=1
                        break
                    }
                }
            }
        }
        if(count>=3){
            return true
        }
        count = 0
    }

    count = 0
    var firstUpper = ""
    for(course of validCourses){
        if(parseInt(course.number)>99){
            if(course.gearea.indexOf("D")>-1 || course.gearea.indexOf("E")>-1 ||course.gearea.indexOf("F")>-1 
                ||course.gearea.indexOf("G")>-1 ||course.gearea.indexOf("H")>-1){
                if(count==0||course.sub!=firstUpper){
                    count++
                    firstUpper = course.sub
                }
            }
        }
        if(count>=2){
            return true
        }
    }
    return false

}



//this function will check the Area B requirment 
function checkAreaB(){
    if (userData["nonNativeSpeaker"] == true)
        return true
    for(course of validCourses){
            for(language of foreignLanguage){
                if(language.sub==course.sub && language.number == course.number)
                    return true
            }
        
    }
    return false
}










