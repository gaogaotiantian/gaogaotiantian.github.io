function Refresh(){
$("td[val_type='percent']").each(function() {
    p = $(this).parent()
    total = 0.0
    total += parseFloat(p.find("td[val_type = 'hw']").html())
    total += parseFloat(p.find("td[val_type = 'pa']").html())
    challenge = parseInt(p.find("td[val_type = 'challenge']").html())
    if (!isNaN(challenge)) {
        total += challenge
    }  
    total += parseInt(p.find("td[val_type = 'midterm']").html())/77.*25
    total += parseInt(p.find("td[val_type = 'final']").find('input').val())/100.*25
    total = total.toFixed(1)
    $(this).html(total)
})
$("td[val_type='grade']").each(function() {
    g = parseFloat($(this).parent().find("td[val_type = 'percent']").html())
    grade = ""
    if (g >= 93)
        grade = "A"
    else if (g >= 90)
        grade = "A-"
    else if (g >= 87)
        grade = "B+"
    else if (g >= 83)
        grade = "B"
    else if (g >= 80)
        grade = "B-"
    else if (g >= 77)
        grade = "C+"
    else if (g >= 73)
        grade = "C"
    else if (g >= 70)
        grade = "C-"
    else if (g >= 67)
        grade = "D+"
    else if (g >= 63)
        grade = "D"
    else if (g >= 60)
        grade = "D-"
    else
        grade = "F"
    $(this).html(grade)
})
}

function Init() {
    $('input').each(function() {
        $(this).val(0)
    })
}
$(function() {
    Init()
    Refresh()
    $('input').change(function() {
        Refresh()
    })
})
