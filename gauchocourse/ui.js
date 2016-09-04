// Global Variables
var apData = []
var courseData = []
var majorReq = []
var invalidData = []
// Array of unfulfilled graduation requirement
var invalidGrad = [] 
var validCourses = []
var userData = {"major":"", "getype":"", "ap":{"valid":false, "units":"0", "apList":[]}, "totalUnits":"0"}
var geFullFillment = []
// Initialization, only run once for this function
$(document).ready(function(){
    // Course Database
    $.getJSON("courseData.json", function(data) {
        courseData = data
    })
    .fail(function(d, text, error){alert("error in getJson!" + text + error)})

    // Ap Database
    $.getJSON("apdata.json", function(data) {
        apData = data
    })
    .fail(function(d, text, error){alert("error in get apdata!" + text + error)})

    // Graduation Requirement Database
    $.getJSON("gradreq.json", function(data) {
        majorReq = data
    })
    .fail(function(d, text, error){alert("error in get grad req data!" + text + error)})
    .success(function(){
        console.log(majorReq)
        for (idx in majorReq) {
            maj = majorReq[idx]
            $("#sel_major").append("<option>" + maj["major"] + "</option>") 
        }
        $("#sel_major").trigger('change')
    })    
});

$(function() {
$("#sel_major").change(function() {
    userData["major"] = $(this).val()
    for (req of majorReq) {
        if (req["major"] == userData["major"]) {
            userData["getype"] = req["getype"]
            break
        }
    }
    RefreshInputs()
})
$(".inputform")
.on("mouseenter", ".courseInputSection", function() {
    if ($(this).find(".courseInput").attr("valid") == "false" || 
        $(this).find(".courseInput").attr("ignore") == "true") {
        $(this).find(".courseInputErrMsg").css("display", "block")
        $(this).find(".courseInputErrMsg").css("width", $(this).find(".courseInput").css("width"))
        var err_msg = GetErrorMessage($(this).find(".courseInput").val())
        if ($(this).find(".courseInput").attr("ignore") == "true") {
            $(this).find(".courseInputErrMsg").find(".errMsg").text("Error is ignored!")
        } else {
            $(this).find(".courseInputErrMsg").find(".errMsg").text(err_msg)
        }
    }
})
.on("mouseleave", ".courseInputSection", function() {
    $(this).find(".courseInputErrMsg").css("display", "none")
})
.on("blur", ".courseInputSection", function() {
    if ($(this).find(".courseInput").val() == "") {
        $(this).find(".courseInput").attr("valid", "na")
    } else {
        $(this).find(".courseInput").attr("valid", "true")
    }
    RefreshInputs()
})
.on("focus", ".courseInput", function() {
    $(".courseInput").autocomplete(
        //by Andrew Whitaker at stactoverflow.com
        {source: function (request, response) {
            var term = $.ui.autocomplete.escapeRegex(request.term), 
            startsWithMatcher = new RegExp("^" + term, "i")
            ,
            startsWith = $.grep(courseData, function(value) {
                return startsWithMatcher.test(value.label || value.value || value);
            })
            ,
            containsMatcher = new RegExp(term, "i")
            ,
            contains = $.grep(courseData, function (value) {
                return $.inArray(value, startsWith) < 0 && containsMatcher.test(value.label || value.value || value);
            });
            response(startsWith.concat(contains));
        }, minLength: 3})
})
.on("click", ".courseInputRemove", function() {
    $(this).parent().remove()
    RefreshInputs()
})

// ignore check box behavior
// if it's checked, ignore the error.
.on("click", ".ignoreCheckBox", function() {
    if ($(this).is(":checked")) {
        $(this).parent().parent().find(".courseInput").attr("ignore", "true")
    } else {
        $(this).parent().parent().find(".courseInput").attr("ignore", "false")
    }
})

$(".addInputButton").click(function() {
    var newInput = '<div class="courseInputWrapper">' +
                   '<a href="javascript:;" class="courseInputRemove"><img src=image/remove.png class="remove_button"></a>' +
                   '<span class="courseCredit singleCredit">0</span>' +
                       '<div class="courseInputSection">' +
                           '<input class="courseInput" type="text" ignore="false">' +
                           '<div class="courseInputErrMsg">' +
                               '<input type="checkbox" class="ignoreCheckBox"><span>Ignore This Error</span>' +
                               '<p class="errMsg">This is error message</p>' +
                           '</div>' +
                       '</div>' +
                   '</div>'
    $(this).parent().find("form").append(newInput)  
})

function UpdateRequirementDiv(){
    text = "<div id='grad_requirement'>"
    for (req of geFullFillment) {
        text += "<p>"
        text += req.type + " : " + req.message
        text += "</p>"
    }

    text += "<p>Total Credit : " + userData["totalUnits"] + "</p>"
    text += "</div>"
    $("#requirement_div").html(text)
}
function RefreshInputs(){
    var curData = []
    $(".courseInput").each(function(){
        if ($(this).val() != '') {
            var tempdata = {course:$(this).val(), semester:$(this).closest("form").attr("semester"), ignore:$(this).attr("ignore")}
            curData.push(tempdata)
        }
    })
    ValidateAllInput(curData)
    var totalUnits = parseInt(userData.ap.units)
    $(".courseInput").each(function() {
        $(this).parent().parent().find(".courseCredit").text("0")
        if (IsValid($(this).val())) {
            if ($(this).attr("ignore") == "false") {
                $(this).attr("valid", "true")
            }
            $(this).parent().parent().find(".courseCredit").text(GetCredit($(this).val()))
            totalUnits += parseInt(GetCredit($(this).val()))
        } else {
            $(this).attr("valid", "false")
            console.log("false" + $(this).val())
        }
    })
    userData["totalUnits"] = totalUnits.toString()
    $(".inputform").each(function() {
        var totalCredit = 0
        $(this).find(".singleCredit").each(function() {
            totalCredit = totalCredit + parseInt($(this).text())
        })
        $(this).find(".totalCredit").text(totalCredit)
    })
    ValidGE()
    UpdateRequirementDiv()
    console.log("userData", userData)
    console.log("geFullFillment",geFullFillment)
}

function UpdateUserAP() {
    var selectedAp = []
    $("#ap_form").find('.apInputWrapper').each(function() {
        var apName = $(".apCourseSelect :selected").text()
        var apScore = $(".apScoreSelect :selected").text()
        var ap_i
        for (ap of apData) {
            if (ap.label == apName) {
                ap_i = ap
            }
        }
        ap_i["user_score"] = parseInt(apScore)
        selectedAp.push(ap_i)
    })
    userData.ap = run_AP_analysis(selectedAp)
    console.log(userData)
}
// This is all AP form
var apForm,
apForm = $("#ap_form").dialog({
    autoOpen: false,
    height:600,
    width:800,
    modal: true,
    close: function() {
        UpdateUserAP()
        RefreshInputs()
    }
})
$("#ap_form_button").button().on("click", function(){
    apForm.dialog("open")
})
$("#ap_form")
.on("click", ".addApSelectButton", function() {
    var newInput = "<div class='apInputWrapper'><a href='javascript:;' class='apInputRemove'><img src='image/remove.png' class='ap_remove_button'></a>"
    newInput += "<label>Course</label>"
    newInput += "<select class='apCourseSelect' name=''>"
    for (ap of apData) {
        if (ap.score == "NA" || ap.score == "5")
        newInput += "<option>"
        newInput += ap.label
        newInput += "</option>"
    }
    newInput += "</select>"
    newInput += "<label>Score</label>"
    newInput += "<select class='apScoreSelect'><option>3</option><option>4</option><option>5</option></select>"
    newInput += "</div>"
    console.log(newInput)
    $(this).parent().find("form").append(newInput) 
})
.on("click", ".apInputRemove", function(){
    $(this).parent().remove()
})
})
