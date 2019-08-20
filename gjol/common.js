function hide_all(show_div) {
    $('.nav-tab-div').addClass("d-none");
    $(show_div).removeClass("d-none");
}

function save() {
    let data = {};
    $("input").each(function() {
        data[$(this).attr("id")] = $(this).val();
    })
    $("select").each(function() {
        data[$(this).attr("id")] = $(this).val();
    })
    localStorage.setItem("attribute", JSON.stringify(data));
}

function load() {
    let raw = localStorage.getItem("attribute");
    if (raw) {
        let data = JSON.parse(raw);
        for (let id in data) {
            $('#' + id).val(data[id]);
        }
    }
}
$(function() {
    init_page();
    refresh();
    create_attribute_chart();
    create_item_chart();
    refresh_item_data();

    $('body').on('change', 'select', refresh_item_data);
    $('body').on('blur', 'input', function() {
        refresh();
        refresh_item_data(); 
    });

    $('body').on('click', '.save-curr-button', save);
    $('body').on('click', '.load-curr-button', load);

    $('#nav-attribute').click(function() {
        hide_all('#attribute-div');
    })
    $('#nav-item').click(function() {
        hide_all('#items-div');
    })
})
