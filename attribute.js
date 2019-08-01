const STRENGTH_CONST         = 1700;
const EXPERTISE_CONST_FIRST  = 685;
const EXPERTISE_CONST_SECOND = 1600
const CRITICAL_CONST         = 2090
const FOCUS_CONST            = 2750
const RAPID_CONST            = 1875

const curr_layout = ["col-4", "col-4", "col-4"];
const curr_content = [
    [
        {"type": "p", "val": "属性"},
        {"type": "p", "val": "当前"},
        {"type": "p", "val": "改变"},
    ],
    [
        {"type": "p", "val": "攻击"},
        {"type": "input", "id": "curr-attack-input"},
        {"type": "p", "id": "curr-attack-change"},
    ],
    [
        {"type": "p", "val": "强度"},
        {"type": "input", "id": "curr-strength-input"},
        {"type": "p", "id": "curr-strength-change"},
    ],
    [
        {"type": "p", "val": ""},
        {"type": "p", "val": "0%", "id": "curr-strength-percent-val"},
        {"type": "p", "id": "curr-strength-percent-change"},
    ],
    [
        {"type": "p", "val": "专精"},
        {"type": "input", "id": "curr-expertise-input"},
        {"type": "p", "id": "curr-expertise-change"},
    ],
    [
        {"type": "p", "val": " - 专精第一类"},
        {"type": "p", "val": "0%", "id": "curr-expertise-first-val"},
        {"type": "p", "id": "curr-expertise-first-change"},
    ],
    [
        {"type": "p", "val": " - 专精第二类"},
        {"type": "p", "val": "0%", "id": "curr-expertise-second-val"},
        {"type": "p", "id": "curr-expertise-second-change"},
    ],
    [
        {"type": "p", "val": "会心率%"},
        {"type": "input", "id": "curr-critical-input"},
        {"type": "p", "id": "curr-critical-change"},
    ],
    [
        {"type": "p", "val": "专注率%"},
        {"type": "input", "id": "curr-focus-input"},
        {"type": "p", "id": "curr-focus-change"},
    ],
    [
        {"type": "p", "val": "急速率%"},
        {"type": "input", "id": "curr-rapid-input"},
        {"type": "p", "id": "curr-rapid-change"},
    ],
    [
        {"type": "p", "val": "最终攻击"},
        {"type": "p", "id": "curr-final-val"},
        {"type": "p", "id": "curr-final-change"},
    ],
    [
        {"type": "p"},
        {"type": "p"},
        {"type": "p", "id": "curr-final-percent-change"},
    ],
    [
        {"type": "p"},
        {"type": "p"},
        {"type": "p"},
    ],
    [
        {"type": "p", "val": "第一类攻击占比%"},
        {"type": "input", "id": "curr-first-percent-input"},
        {"type": "p", "id": "curr-first-percent-change"},
    ],
    [
        {"type": "p", "val": "第二类攻击占比%"},
        {"type": "input", "id": "curr-second-percent-input"},
        {"type": "p", "id": "curr-second-percent-change"},
    ],
    [
        {"type": "p", "val": "当前DPS"},
        {"type": "input", "id": "curr-dps-input"},
        {"type": "p", "id": "curr-dps-change"},
    ],
    [
        {"type": "p"},
        {"type": "p"},
        {"type": "p", "id": "curr-dps-percent-change"},
    ],
    [
        {"type": "p"},
        {"type": "button", "id": "save-curr-button", "val": "保存属性", "class": "btn btn-success"},
        {"type": "button", "id": "load-curr-button", "val": "读取属性", "class": "btn btn-primary"},
    ],
];

const adjust_layout = ["col", "col", "col", "col"];
const adjust_content = [
    [
        {"type": "p", "val": "属性"},
        {"type": "p", "val": "变化"},
        {"type": "p", "val": "每点DPS增强"},
        {"type": "p", "val": "总DPS增强"},
    ],
    [
        {"type": "p", "val": "主属性"},
        {"type": "input", "id": "adjust-status-input"},
        {"type": "p", "id": "adjust-status-increment"},
        {"type": "p", "id": "adjust-status-total"},
    ],
    [
        {"type": "p", "val": "强度"},
        {"type": "input", "id": "adjust-strength-input"},
        {"type": "p", "id": "adjust-strength-increment"},
        {"type": "p", "id": "adjust-strength-total"},
    ],
    [
        {"type": "p", "val": "专精"},
        {"type": "input", "id": "adjust-expertise-input"},
        {"type": "p", "id": "adjust-expertise-increment"},
        {"type": "p", "id": "adjust-expertise-total"},
    ],
    [
        {"type": "p", "val": "会心"},
        {"type": "input", "id": "adjust-critical-input"},
        {"type": "p", "id": "adjust-critical-increment"},
        {"type": "p", "id": "adjust-critical-total"},
    ],
    [
        {"type": "p", "val": "专注"},
        {"type": "input", "id": "adjust-focus-input"},
        {"type": "p", "id": "adjust-focus-increment"},
        {"type": "p", "id": "adjust-focus-total"},
    ],
];
function init_page() {
    let curr_container   = document.getElementById("current-attribute-container");
    let adjust_container = document.getElementById("adjust-attribute-container");

    write_page(curr_container, curr_layout, curr_content);
    write_page(adjust_container, adjust_layout, adjust_content);

}

function write_page(container, layout, content) {
    for (let i = 0; i < content.length; i++) {
        let row_container = document.createElement("div");
        row_container.className = "row";
        for (let j = 0; j < content[i].length; j++) {
            let elem = create(content[i][j]);
            elem.classList.add(layout[j]);
            row_container.appendChild((elem));
        }
        container.appendChild(row_container)
    }
}

function create(data) {
    let elem = document.createElement("p");
    if (data.type == "p") {
        elem = document.createElement("p");
    } else if (data.type == "input") {
        elem = document.createElement("input");
        elem.className = "form-control";
    } else if (data.type == "button") {
        elem = document.createElement("button");
    }
    
    if (data.val) {
        elem.innerHTML = data.val;
    }

    if (data.id) {
        elem.id = data.id;
    }

    if (data.class) {
        elem.className += data.class;
    }

    return elem;
}

function save() {
    let data = {};
    $("input").each(function() {
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

function refresh() {
    // 属性
    let adjust_status = getFVal('adjust-status-input');

    // 攻击
    let curr_attack   = getFVal('curr-attack-input');
    let adjust_attack = 0.3 * adjust_status;
    let total_attack  = curr_attack + adjust_attack;

    $('#curr-attack-change').text(adjust_attack.toFixed(1));

    // 强度
    let curr_strength   = getFVal('curr-strength-input') / STRENGTH_CONST;
    let adjust_strength = (getFVal('adjust-strength-input') + adjust_status * 0.7) / STRENGTH_CONST;
    let total_strength  = curr_strength + adjust_strength;

    $('#curr-strength-change').text((adjust_strength * STRENGTH_CONST).toFixed(1));
    $('#curr-strength-percent-val').text((curr_strength*100).toFixed(3) + '%');
    $('#curr-strength-percent-change').text((adjust_strength*100).toFixed(3) + '%');

    // 专精
    let curr_expertise   = getFVal('curr-expertise-input');
    let curr_expertise_first = curr_expertise / EXPERTISE_CONST_FIRST;
    let curr_expertise_second = curr_expertise / EXPERTISE_CONST_SECOND;
    let adjust_expertise = getFVal('adjust-expertise-input');
    let adjust_expertise_first = adjust_expertise / EXPERTISE_CONST_FIRST;
    let adjust_expertise_second = adjust_expertise / EXPERTISE_CONST_SECOND;

    let total_expertise  = curr_expertise + adjust_expertise;
    let total_expertise_first = total_expertise / EXPERTISE_CONST_FIRST;
    let total_expertise_second = total_expertise / EXPERTISE_CONST_SECOND;

    $('#curr-expertise-change').text((adjust_expertise));
    $('#curr-expertise-first-val').text((curr_expertise_first * 100).toFixed(3) + "%");
    $('#curr-expertise-second-val').text((curr_expertise_second * 100).toFixed(3) + "%");

    $('#curr-expertise-first-change').text((adjust_expertise_first * 100).toFixed(3) + "%");
    $('#curr-expertise-second-change').text((adjust_expertise_second * 100).toFixed(3) + "%");

    // 会心
    let curr_critical = getFVal('curr-critical-input') / 100;
    let adjust_critical = (getFVal('adjust-critical-input') + 0.5 * adjust_status) / CRITICAL_CONST;
    let total_critical  = curr_critical + adjust_critical;

    $('#curr-critical-change').text((adjust_critical * 100).toFixed(3) + "%");

    // 专注 
    let curr_focus = getFVal('curr-focus-input') / 100;
    let adjust_focus = getFVal('adjust-focus-input') / FOCUS_CONST;
    let total_focus = curr_focus + adjust_focus;

    $('#curr-focus-change').text((adjust_focus * 100).toFixed(3) + "%");

    // 最终攻击
    let curr_final_attack = curr_attack * (1 + curr_strength);
    let total_final_attack = total_attack * (1 + total_strength);
    let adjust_final_attack = total_final_attack - curr_final_attack;

    $('#curr-final-val').text(curr_final_attack.toFixed(0));
    $('#curr-final-change').text(adjust_final_attack.toFixed(0));
    $('#curr-final-percent-change').text((adjust_final_attack / curr_final_attack * 100).toFixed(2) + "%");

    // 输出
    let real_curr_focus = Math.min(1, curr_focus);
    let real_total_focus = Math.min(1, total_focus);
    let curr_damage  = curr_final_attack * (1 + curr_critical * 0.6) * (real_curr_focus * 0.7 + 0.3);
    let total_damage = total_final_attack * (1 + total_critical * 0.6) * (real_total_focus * 0.7 + 0.3);

    // DPS
    let curr_dps = getFVal('curr-dps-input');
    let first_percent = getFVal('curr-first-percent-input') / 100;
    let second_percent = getFVal('curr-second-percent-input') / 100;
    let total_expertise_damage = 
            1 + 
            (adjust_expertise_first / (1 + curr_expertise_first) * first_percent) + 
            (adjust_expertise_second / (1 + curr_expertise_second) * second_percent) 
    let total_first_percent = ((1 + adjust_expertise_first / (1 + curr_expertise_first)) * first_percent) / total_expertise_damage;
    let total_second_percent = ((1 + adjust_expertise_second / (1 + curr_expertise_second)) * second_percent) / total_expertise_damage;
    let total_dps = (total_damage / curr_damage) * total_expertise_damage * curr_dps;
    
    $('#curr-first-percent-change').text(((total_first_percent - first_percent) * 100).toFixed(2) + "%");
    $('#curr-second-percent-change').text(((total_second_percent - second_percent) * 100).toFixed(2) + "%");
    $('#curr-dps-change').text((total_dps - curr_dps).toFixed(1));
    $('#curr-dps-percent-change').text(((total_dps / curr_dps - 1 )* 100).toFixed(2));

    // 每点增强计算
    let per_attack   = 1 / total_attack
    let per_strength = 1 / STRENGTH_CONST / (1 + total_strength);
    let per_critical = 0.6 / CRITICAL_CONST / (1 + total_critical * 0.6);
    let per_focus    = 0.7 / FOCUS_CONST / (0.3 + total_focus * 0.7);
    let per_status   = 0.3 * per_attack + 0.7 * per_strength + 0.5 * per_critical
    let per_expertise = 1 / EXPERTISE_CONST_FIRST / (1 + total_expertise_first) * total_first_percent + 
                        1 / EXPERTISE_CONST_SECOND / (1 + total_expertise_second) * total_second_percent

    $('#adjust-status-increment').text((per_status * 100).toFixed(5) + "%");
    $('#adjust-strength-increment').text((per_strength * 100).toFixed(5) + "%");
    $('#adjust-critical-increment').text((per_critical * 100).toFixed(5) + "%");
    $('#adjust-focus-increment').text((per_focus * 100).toFixed(5) + "%");
    $('#adjust-expertise-increment').text((per_expertise * 100).toFixed(5) + "%");

}

function getFVal(id) {
    return eval($('#'+id).val()) || 0;
}

$(function() {
    init_page();
    refresh();
    $('body').on('blur', 'input', refresh);
    $('body').on('click', '#save-curr-button', save);
    $('body').on('click', '#load-curr-button', load);
})
