function hide_all(show_div) {
    $('.nav-tab-div').addClass("d-none");
    $(show_div).removeClass("d-none");
}
$(function() {
    $('#nav-attribute').click(function() {
        hide_all('#attribute-div');
    })
    $('#nav-item').click(function() {
        hide_all('#items-div');
    })
})
