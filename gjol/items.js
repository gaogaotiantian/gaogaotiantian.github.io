const attribute_header = [
    "术",
    "攻击",
    "强度",
    "专精",
    "会心",
    "专注",
    "急速",
    "最终攻击",
];

const item_positions = Object.keys(game_data["items"]);

const item_header = [
    "位置",
    "装备",
    "强化",
    "附魔",
    "附魔等级",
    "等级",
    "术",
    "攻击",
    "强度",
    "专精",
    "会心",
    "专注",
    "急速",
];

char_attr = {};

function create_attribute_chart() {
    let container = document.getElementById('item-attribute-container');
    let d = document.createElement('div');
    d.className = "d-flex justify-content-around";

    container.appendChild(d);

    // 面板属性
    for (let i = 0; i < attribute_header.length; i++) {
        let header = attribute_header[i];
        let col = document.createElement('div');
        let attribute_name = document.createElement('div')
        let attribute_data = document.createElement('div')
        let attribute_data_percent = document.createElement('div')
        attribute_name.innerHTML = header
        attribute_data.id = "属性-"+header
        attribute_data.className = "pt-2"
        attribute_data_percent.id = "属性-"+header+"-率"
        attribute_data_percent.className = "pt-2"
        col.appendChild(attribute_name)
        col.appendChild(attribute_data)
        col.appendChild(attribute_data_percent)

        d.appendChild(col);
    }
}

function create_item_chart() {
    // Create the whole form first
    let container = document.getElementById('item-choice-container');
    let d = document.createElement('div');
    d.className = "d-flex justify-content-center";
    for (let i = 0; i < item_header.length; i++) {
        let header = item_header[i];
        let col = document.createElement('div');
        col.id = "装备-"+header
        
        let header_div = document.createElement('div');
        header_div.innerHTML = header;
        col.appendChild(header_div);

        // Create cells for each position
        for (let j = 0; j < item_positions.length; j++) {
            let position = item_positions[j];
            let position_div = document.createElement('div');
            position_div.className = "item-cell"
            if (j % 2 == 1) {
                position_div.className += " item-cell-dark"
            }
            position_div.classList.add(header)
            position_div.classList.add(position)
            if (header == "位置") {
                position_div.innerHTML = position;
            }
            col.appendChild(position_div);
        }

        d.appendChild(col);
    }
    container.appendChild(d);

    // Add selector for the form
    for (let i = 0; i < item_positions.length; i++) {
        let position = item_positions[i];
        if (position in game_data["items"]) {
            // 装备选择
            let name_cell = document.getElementsByClassName("装备 "+position)[0];
            let options = []
            let select_id = position + "-select";
            name_cell.innerHTML = "";
            for (let j = 0; j < game_data["items"][position].length; j++) {
                let data = game_data["items"][position][j];
                options.push(data["装备名"]);
            }
            name_cell.appendChild(create_select(select_id, options));

            // 强化选择
            name_cell = document.getElementsByClassName("强化 "+position)[0];
            name_cell.innerHTML = "";
            select_id = position + "-强化-select";
            options = [];
            for (let j = 0; j <= 5; j++) {
                options.push(j);
            }
            name_cell.appendChild(create_select(select_id, options));

            // 附魔
            if (position in game_data["enchantment"]) {
                // 附魔选择
                name_cell = document.getElementsByClassName("附魔 "+position)[0];
                name_cell.innerHTML = "";
                select_id = position + "-附魔-select";
                options = [];
                for (let attr in game_data["enchantment"][position]) {
                    options.push(attr);
                }
                name_cell.appendChild(create_select(select_id, options));

                // 附魔等级选择
                name_cell = document.getElementsByClassName("附魔等级 "+position)[0];
                name_cell.innerHTML = "";
                select_id = position + "-附魔等级-select";
                options = [];
                for (let j = 0; j <= 4; j++) {
                    options.push(j);
                }
                name_cell.appendChild(create_select(select_id, options));
            }
        }
    }
}

function create_select(select_id, options) {
    let s = document.createElement('select');
    s.className = "form-control";
    s.id = select_id;

    for (let i = 0; i < options.length; i++) {
        let option = document.createElement('option');
        option.value = options[i];
        option.innerHTML = options[i];
        s.appendChild(option);
    }

    return s;
}

function find_item_by_name(name, position = null)
{
    if (position) {
        if (position in game_data["items"]) {
            for (let i = 0; i < game_data["items"][position].length; i++) {
                if (game_data["items"][position][i]["装备名"] == name) {
                    return game_data["items"][position][i];
                }
            }
        }
    } else {
        for (let position in game_data["items"]) {
            for (let i = 0; i < game_data["items"][position].length; i++) {
                if (game_data["items"][position][i]["装备名"] == name) {
                    return game_data["items"][position][i];
                }
            }
        }
    }

    return null;
}

function refresh_item_data() {
    // Update item data based on selected item
    for (let i = 0; i < item_positions.length; i++) {
        let position = item_positions[i];
        let select = document.getElementById(position+"-select");
        if (select) {
            let item_name = select.options[select.selectedIndex].value;
            let data = find_item_by_name(item_name);
            if (data) {
                // Do not change "装备" and "位置"
                for (let j = 5; j < item_header.length; j++) {
                    let header = item_header[j];
                    let cell = document.getElementsByClassName(header + ' ' + position)[0];
                    if (header in data) {
                        cell.innerHTML = data[header];
                    } else {
                        cell.innerHTML = 0;
                    }
                }
            }
        }

        let enchantment_select = document.getElementById(position+"-附魔-select");
        let enchantment_level_select = document.getElementById(position+"-附魔等级-select");

        if (enchantment_select && enchantment_level_select && enchantment_level_select.options[enchantment_level_select.selectedIndex].value > 0) {
            let selected_enchantment = enchantment_select.options[enchantment_select.selectedIndex].value;
            let selected_value = enchantment_level_select.options[enchantment_level_select.selectedIndex].value;
            let cell = document.getElementsByClassName(selected_enchantment + ' ' +position)[0];
            
            cell.innerHTML = parseFloat(cell.innerHTML) || 0 + parseFloat(game_data["enchantment"][position][selected_enchantment][selected_value - 1]);
        }
    }

    // Update total attributes based on items
    for (let i = 0; i < attribute_header.length; i++) {
        let attr = attribute_header[i];
        let total_attr_points = attr_base(attr);
        if (item_header.indexOf(attr) > -1) {
            Array.prototype.forEach.call(document.getElementsByClassName(attr), function(el) {
                let val = parseFloat(el.innerHTML);
                if (val) {
                    total_attr_points += val
                    if (el.classList.contains("戒指") || el.classList.contains("佩饰")) {
                        total_attr_points += val
                    }
                }
            })
        }
        char_attr[attr] = total_attr_points;
    }

    update_attr();

    // Write attributes to webpage
    for (let i = 0; i < attribute_header.length; i++) {
        let attr = attribute_header[i];
        document.getElementById("属性-" + attr).innerHTML = char_attr[attr].toFixed(1);
        document.getElementById("属性-" + attr + "-率").innerHTML = attr_percent(attr);
    }
    document.getElementById("战力").innerHTML = char_attr["最终战力"].toFixed(1);
    
}

function attr_base(attr) {
    switch (attr) {
        case "术": 
            return 76;
        case "攻击":
            return 22;
        case "专注":
            return 20;
    }
    return 0;
}

function attr_percent(attr) {
    switch (attr) {
        case "强度":
            return (char_attr["强度率"] * 100).toFixed(1) + "%";
        case "专精":
            return (char_attr["专精率一"] * 100).toFixed(1) + "% / " + (char_attr["专精率二"] * 100).toFixed(1) + "%";
        case "会心":
            return (char_attr["会心率"] * 100).toFixed(1) + "%";
        case "专注":
            return (char_attr["专注率"] * 100).toFixed(1) + "%";
        case "急速":
            return (char_attr["急速率"] * 100).toFixed(1) + "%";
        default:
            return ""

    }
}

function update_attr() {
    char_attr["攻击"] += char_attr["术"] * 0.4;
    char_attr["强度"] += char_attr["术"] * 0.6;
    char_attr["会心"] += char_attr["术"] * 0.3;

    // 各种率
    char_attr["强度率"]   = char_attr["强度"] / STRENGTH_CONST
    char_attr["专精率一"] = char_attr["专精"] / EXPERTISE_CONST_FIRST
    char_attr["专精率二"] = char_attr["专精"] / EXPERTISE_CONST_SECOND
    char_attr["会心率"]   = char_attr["会心"] / CRITICAL_CONST
    char_attr["专注率"]   = 0.8 + char_attr["专注"] / FOCUS_CONST
    char_attr["急速率"]   = char_attr["急速"] / RAPID_CONST

    char_attr["最终攻击"] = char_attr["攻击"] * (1 + char_attr["强度"] / STRENGTH_CONST);

    // 计算最终战力
    let first_percent = (document.getElementById("character-status-first-percent").value || 0) / 100;
    let second_percent = (document.getElementById("character-status-second-percent").value || 0) / 100;
    let other_percent = 1 - first_percent - second_percent
    char_attr["最终战力"] = char_attr["最终攻击"] * 
            (1   + 0.6 * char_attr["会心率"]) * 
            (0.3 + 0.7 * char_attr["专注率"]) * 
            (1 + first_percent * char_attr["专精率一"] + second_percent * char_attr["专精率二"]);
    
}

$(function() {
    create_attribute_chart();
    create_item_chart();
    refresh_item_data();

    $('body').on('change', 'select', refresh_item_data);
    $('body').on('blur', 'input', refresh_item_data);

})
