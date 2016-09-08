function Refresh(){
$("td[val_type='hw_total']").each(function() {
    p = $(this).parent()
    total = 0
    p.find("td[val_type ^= hw]").each(function() {
        if ($(this).attr('val_type') != 'hw_total') {
            total += parseInt($(this).html())  
        }
    })
    $(this).html(total)
})
$("td[val_type='pa_total']").each(function() {
    p = $(this).parent()
    total = 0
    p.find("td[val_type ^= pa]").each(function() {
        if ($(this).attr('val_type') != 'pa_total') {
            if ($(this).attr('val_type') == 'pa5') {
                total += parseInt($(this).find('input').val())
                console.log($(this).find('input').val())
            } else {
                total += parseInt($(this).html())
            }
        }
    })
    console.log(total)
    $(this).html(total)
})
$("td[val_type='percent']").each(function() {
    p = $(this).parent()
    total = 0.0
    total += parseInt(p.find("td[val_type = 'hw_total']").html())/304.*20
    total += parseInt(p.find("td[val_type = 'pa_total']").html())/50.*30
    total += parseInt(p.find("td[val_type = 'challenge']").find('input').val())
    total += parseInt(p.find("td[val_type = 'mid_term']").html())/77.*25
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
