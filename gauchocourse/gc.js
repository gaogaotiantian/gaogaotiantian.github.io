//******************
//******************
//******************
//All global variable you should provide
/*global variable you should provide
var user = {
    major : "CMPSC",
    majorType : "ENGR"
}

var geFullFillment //status and message for every ge area and special requirment


var validCourses = [] // list of all valid courses

var invalidData = [] // array of invalidData as object, each object has three variable. 1.name 2.semester 3.message

var invalidGrad = [] //array of unfulfilled graduation requirment

var totalUnit = 0 // totoal units of the current courses add up
*/
//******************
//******************
//******************



var addedCourses = [] //list of all inputed courses as a object of course and semester

var schedule = [] //sorted schedule, index represent the semester. ex: schedule[0] is the array of all input courses in freshman summer quarter

var ignoreTable = [] // a table to ignore the error of some courses, matching the schedule

var totalUnit = 0 // totoal units of the current courses add up

var quarterUnit = [] // unit for each quarter, ex: quarterUnit[0] represent the unit of the freshman summer quarter

var invalidCourse = [] //those course that did not fulfill the requirment

var usedCourse = []


//******************
//******************
//******************
//main function that caller should provide the argument to run the validation
//******************
//******************
//******************
function ValidateAllInput(input){
    addedCourses = []
    schedule = []
    invalidData = [] 
    validCourses = []
    usedCourse = []
    invalidCourse = []
    invalidGrad = []
    AddAllCourses(input)
    SortAllCourseBySemester()
    CountUnit()
    console.log("schedule",schedule)
    for(var i=0; i<16; i++){
        for(var course of schedule[i]){
            CheckThisCourse(course,i)
        }
    }
    checkRequiredCourses()
    checkChoiceCourses()
    console.log("used course", usedCourse)
    console.log("added:", addedCourses)
    console.log("valid:", validCourses)
    console.log("invalid", invalidData)
    console.log("invalidGrad", invalidGrad)
}


function IsValid(name){
    if(name == "") return true
    for(course of validCourses){
        if(name == course.label)
            return true
    }
    return false
}

function GetErrorMessage(name){
    if(name == "") return true
    for(er of invalidData){
        if(er.name ==name)
            return er.message
    }
    return ""
}

function GetCredit(name){
    if (!IsValid(name))
        return "0";
    else {
        for (course of validCourses) {
            if (name == course.label) {
                return course.units
            }
        }
    }
    return "0"
}













//******************
//******************
//******************
//function starts here is for my own use
//******************
//******************
//******************
semesters = ["freshman_summer", "freshman_fall", "freshman_winter", "freshman_spring",
          "sophomore_summer", "sophomore_fall", "sophomore_winter", "sophomore_spring",
          "junior_summer", "junior_fall", "junior_winter", "junior_spring",
          "senior_summer", "senior_fall", "senior_winter", "senior_spring"]
function SemToNum(semester){
    return semesters.indexOf(semester)
}

function NumToSem(num){
    return semesters[num]
}


function CountUnit(){
    var tempunit = 0
    for(qt of schedule){
        for(course of qt){
            tempunit+=Math.round(course.units)
        }
        quarterUnit.push(tempunit)
        totalUnit+=tempunit
        tempunit = 0
    }
}

function countUnitBeforeSem(sem){
    var units = 0
    for(var s = 0; s<sem; s++){
        units+=quarterUnit[s]
    }
    return units
}


  
//add all the input courses to the addedCourses
function AddAllCourses(input){
    var existence = false
    var tempname
    for(i=0; i<input.length; i++){
        for(j=0; j<courseData.length; j++){
            var temp = (courseData[j].label);
            if(temp == input[i].course){
                for(z in addedCourses){
                    tempname = (addedCourses[z].course.label)
                    if(tempname == input[i].name){
                        existence = true
                        break
                    }
                }
                if(existence){
                    existence = false
                    break
                }
                addedCourses.push({course : courseData[j], semester : SemToNum(input[i].semester), ignore:input[i].ignore})
                break
            }
        }
    }

}

//add the courses from addedCourses into schedule in the semester order
function SortAllCourseBySemester(){
    for(i=0; i<16; i++) {
        ignoreTable.push({})
        schedule.push([])
    }
    for(i=0; i<addedCourses.length; i++){
        schedule[addedCourses[i].semester].push(addedCourses[i].course)
        ignoreTable[addedCourses[i].semester][addedCourses[i].course.label] = addedCourses[i].ignore
    }
}

//giving a course name, it will return the course object corresponing to this name
function GetCourseByName(name){
    var tpname
    for(var course of courseData){
        tpname = (course.label)
        if(tpname == name)
            return course
    }
}




//function to check if taking certian course in certain semester is allowed
function CheckThisCourse(course, sem){
    // if we ignore the error, just put it into valid course
    if (ignoreTable[sem][course.label] == "true") {
        console.log("ignore", course.label)
        validCourses.push(course)
    }
    for(var c of validCourses){
        if(c.label == course.label)
            return
    }

    for(var c of invalidCourse){
        if(c.label == course.label)
            return
    }


    if(course.majorlimit.length!=0){
        var inmajor = false

        for(major of course.majorlimit){
            if(major == userData.major){
                inmajor = true
                break
            }
        }

        if(!inmajor){
            invalidCourse.push(course)
            invalidData.push({name:(course.label), semester : NumToSem(sem), message : "course only offer to certain major"})
        }
    }


    if(course.levellimit!=""){
        var units = countUnitBeforeSem(sem)
        switch(course.levellimit){
            case "U":
                if(units<90) 
                    invalidData.push({name:(course.label), semester : NumToSem(sem), message : "This course is for Junior and Senior only"})
                invalidCourse.push(course)
                return
            case "Z":
                if(units<45)
                    invalidData.push({name:(course.label), semester : NumToSem(sem), message : "This course is not open for Freshman"})
                invalidCourse.push(course)
                return
            case "S":
                if(units<135)
                    invalidData.push({name:(course.label), semester : NumToSem(sem), message : "This course is for Senior Only"})
                invalidCourse.push(course)
                return
            case "A":
                if(units>44.9)
                    invalidData.push({name:(course.label), semester : NumToSem(sem), message : "This course is for Freshman only"})
                invalidCourse.push(course)
                return
        }
    }



    var timecheck = true
    switch(sem%4){
        case 0 :
            if(course.semester.indexOf("summer")<0)
                timecheck = false;
            break
        case 1 :
            if(course.semester.indexOf("fall")<0)
                timecheck = false;
            break
        case 2 :
            if(course.semester.indexOf("winter")<0)
                timecheck = false;
            break
        case 3 :
            if(course.semester.indexOf("spring")<0)
                timecheck = false;
            break
    }
    if(!timecheck){
        invalidData.push({name:(course.label), semester : NumToSem(sem), message : "course not offer in this quarter"})
        invalidCourse.push(course)
        return
    }
    
    var incompletedPreReq = []
    for(n in course.prereq){
            var found = false
            for(var p in course.prereq[n]){
                found = false
                var range = sem-1
                var id = course.prereq[n][p].id


                // We check AP list first
                if (userData.ap.valid == true) {
                    var tempcourse = courseData[id]
                    for (var ap of userData.ap.apList) {
                        if (Array.isArray(ap.course_equivalent)) {
                            for (var eq of ap.course_equivalent) {
                                if (eq.sub == tempcourse.sub && 
                                        eq.number == tempcourse.number) {
                                    found = true
                                    break
                                }
                            }
                            if(found) break
                        }
                    }
                    if(found) continue
                }
                if(course.prereq[n][p].concur == "m"){
                    for(var q in schedule[sem]){
                        if(id == schedule[sem][q].id){
                            var tempcourse = courseData[id]
                            CheckThisCourse(tempcourse,s)
                            for(var h of validCourses){
                                if(h.label == tempcourse.label){
                                    found = true
                                    break
                                }
                            }
                        }
                        if(found) break
                    }
                    continue
                }



                if(course.prereq[n][p].concur == "y")
                    range+=1
                    for(var s=0; s<=range; s++){
                        for(var q in schedule[s]){
                            if(id == schedule[s][q].id){
                                var tempcourse = courseData[id]
                                CheckThisCourse(tempcourse,s)
                                for(var h of validCourses){
                                    if(h.label == tempcourse.label){
                                        found = true
                                        break
                                    }
                                }
                            }
                            if(found) break
                        }
                    if(found) break
                    }
                                
                if(found) break
            }
            if(!found){
                incompletedPreReq.push(course.prereq[n])
            }
        
    }

    if(incompletedPreReq.length>0){
        console.log("incompletedPreReq",incompletedPreReq)
        invalidCourse.push(course)
        var tempstring=""
        for(var courses of incompletedPreReq){
            for(var cou of courses)
                tempstring+=(courseData[parseInt(cou.id)].sub+courseData[parseInt(cou.id)].number  + " or ")
            tempstring = tempstring.slice(0,tempstring.length-3)
            tempstring+= "and "
        }
        tempstring = tempstring.slice(0,tempstring.length-4)
        invalidData.push({name : course.label, semester : NumToSem(sem), message : "Does not fulfill following preReq: \n"+tempstring})
        return
    }
    validCourses.push(course)
}


function checkRequiredCourses(){
    var index 
    var unFinishedReq = []
    var found = false
    for(var t in majorReq){
        if(userData.major == majorReq[t].major){
            index = t
            break
        }
    }

    for(var reqCourse of majorReq[index].requiredCourses){
        for(course of validCourses){
            if(reqCourse.sub == course.sub && reqCourse.number == course.number){
                found = true
                usedCourse.push(course.sub+course.number)
                break
            }
        }
        if(!found){
            unFinishedReq.push(reqCourse.sub+" "+reqCourse.number)
        }
        found =false
    }
    console.log("unFinishedReq",unFinishedReq)

    if(unFinishedReq.length>0){
        var tempstring = "You need to take following courses for your major requirment : \n"
        for(var c of unFinishedReq){
            tempstring+=(c+" | ")
        }
        invalidGrad.push({name : "Required Courses", message : tempstring})
    }
}


function checkChoiceCourses(){
    var index 
    var currentUnits = 0
    var insideUnits = 0
    var failedChoices = []
    for(var t in majorReq){
        if(userData.major == majorReq[t].major){
            index = t
            break
        }
    }
    for(choices of majorReq[index].choiceCourses){
        currentUnits = 0
        insideUnits=0
        for(var c of choices.courses){
            if(c.sub!=undefined){
                if(usedCourse.indexOf(c.sub+c.number)!=(-1)){
                    console.log("success", (c.sub+c.number))
                    continue
                }
                for(var vc of validCourses){
                    if(c.sub==vc.sub && c.number==vc.number){
                        usedCourse.push(c.sub+c.number)
                        currentUnits+=parseInt(vc.units)
                        //console.log("currentUnits first add",currentUnits)
                        break
                    }
                }
                if(currentUnits>= parseInt(choices.units))
                    break
            }
            else{
                insideUnits=0
                for(var ic of c.courses){
                    if(usedCourse.indexOf(ic.sub+ic.num)!=(-1)){
                        console.log("success", (ic.sub+ic.number))
                        continue
                    }
                    for(var vc of validCourses){
                        if(ic.sub == vc.sub && ic.number == vc.number){
                            insideUnits+=parseInt(vc.units)
                            console.log("choice fullfilled by", (vc.sub+vc.number))
                            break
                        }
                    }
                    if(insideUnits>=parseInt(c.units)){
                        currentUnits+=parseInt(c.units)
                        break
                    }
                }
                
            }
        }
        //console.log("currentUnits",currentUnits)
        //console.log("requirment unit",choices.units)
        if(currentUnits< parseInt(choices.units)){
            var tempstring = "You must take "
            tempstring+=(parseInt(choices.units) - currentUnits)
            tempstring+=(" more units from the following courses: \n")
            for(var c of choices.courses){
                if(c.sub!=undefined)
                    tempstring+=(c.sub+" "+c.number+" | ")
                else{
                    for(var ic of c.courses){
                        tempstring+=(ic.sub+" "+ic.number+" or ")
                    }
                    tempstring = tempstring.slice(0,tempstring.length-3)
                    tempstring+=" | "
                }
            }
            invalidGrad.push({name: "Choice Courses", message :tempstring})
        }
    }

}




