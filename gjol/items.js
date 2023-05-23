const attribute_header = [
    "来源",
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
    "镶嵌一",
    "镶嵌一等级",
    "镶嵌二",
    "镶嵌二等级",
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
    d.className = "d-flex justify-content-center text-center";

    container.appendChild(d);

    // 面板属性
    for (let i = 0; i < attribute_header.length; i++) {
        let header = attribute_header[i];
        let col    = document.createElement('div');
        let attribute_name         = document.createElement('div')
        let attribute_data_xy      = document.createElement('div')
        let attribute_data_item    = document.createElement('div')
        let attribute_data_total   = document.createElement('div')
        let attribute_data_percent = document.createElement('div')
        attribute_name.innerHTML = header
        attribute_name.className = "title"
        if (header == "来源") { 
            attribute_data_xy.innerHTML = "星蕴";
            attribute_data_xy.className = "pt-2 attribute-cell"
            attribute_data_item.innerHTML = "装备";
            attribute_data_item.className = "pt-2 attribute-cell"
            attribute_data_total.innerHTML = "总计";
            attribute_data_total.className = "pt-2 attribute-cell"
        } else {
            let attribute_data_xy_input = document.createElement('input');
            attribute_data_xy_input.id = "星蕴-属性-"+header
            attribute_data_xy_input.className = "attribute-input text-center";
            attribute_data_xy.appendChild(attribute_data_xy_input);
            attribute_data_xy.className = "pt-2 attribute-cell"
            attribute_data_item.id = "装备-属性-"+header
            attribute_data_item.className = "pt-2 attribute-cell"
            attribute_data_total.id = "总计-属性-"+header
            attribute_data_total.className = "pt-2 attribute-cell attribute-cell-dark"
            attribute_data_percent.id = "属性-"+header+"-率"
            attribute_data_percent.className = "pt-2 attribute-cell attribute-cell-dark"
        }
        col.appendChild(attribute_name)
        col.appendChild(attribute_data_xy)
        col.appendChild(attribute_data_item)
        col.appendChild(attribute_data_total)
        col.appendChild(attribute_data_percent)

        d.appendChild(col);
    }
}

function create_item_chart() {
    // Create the whole form first
    let container = document.getElementById('item-choice-container');
    let d = document.createElement('div');
    d.className = "d-flex justify-content-center text-center";
    for (let i = 0; i < item_header.length; i++) {
        let header = item_header[i];
        let col = document.createElement('div');
        col.id = "装备-"+header
        
        let header_div = document.createElement('div');
        if (header.includes("等级")) {
            header_div.innerHTML = "等级";
        } else {
            header_div.innerHTML = header;
        }
        header_div.className = "title";
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

            // 镶嵌
            ["一", "二"].forEach(function(num) {
                if (position + num in game_data["gem"]) {
                    // 镶嵌选择
                    name_cell = document.getElementsByClassName("镶嵌"+num+' '+position)[0];
                    name_cell.innerHTML = "";
                    select_id = position + "-镶嵌"+num+"-select";
                    options = [];
                    for (let gem in game_data["gem"][position+num]) {
                        options.push(gem);
                    }
                    name_cell.appendChild(create_select(select_id, options));

                    name_cell = document.getElementsByClassName("镶嵌"+num+"等级"+' '+position)[0];
                    name_cell.innerHTML = "";
                    select_id = position + "-镶嵌"+num+"等级-select";
                    options = [];
                    for (let j = 0; j <= 8; j++) {
                        options.push(j);
                    }
                    name_cell.appendChild(create_select(select_id, options));
                }
            })
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
                for (let j = item_header.indexOf("等级"); j < item_header.length; j++) {
                    let header = item_header[j];
                    let cell = document.getElementsByClassName(header + ' ' + position)[0];
                    if (header in data) {
                        if (header != "等级") {
                            let enhance_select = document.getElementById(position+"-强化-select");
                            let enhance = parseFloat(enhance_select.value || 0);
                            let value   = (data[header] * (1+enhance*0.03));
                            if (value) {
                                cell.innerHTML = value.toFixed(1);
                            } else {
                                cell.innerHTML = "";
                            }
                        }
                    } else {
                        cell.innerHTML = 0;
                    }
                }
            }
        }

        // Enchantment changes
        let enchantment_select = document.getElementById(position+"-附魔-select");
        let enchantment_level_select = document.getElementById(position+"-附魔等级-select");

        if (enchantment_select && enchantment_level_select && enchantment_level_select.options[enchantment_level_select.selectedIndex].value > 0) {
            let selected_enchantment = enchantment_select.options[enchantment_select.selectedIndex].value;
            let selected_value = enchantment_level_select.options[enchantment_level_select.selectedIndex].value;
            let cell = document.getElementsByClassName(selected_enchantment + ' ' +position)[0];
            
            cell.innerHTML = (parseFloat(cell.innerHTML) || 0) + parseFloat(game_data["enchantment"][position][selected_enchantment][selected_value - 1]);

        }

        // Gem changes
        ["一", "二"].forEach(function(num) {
            let gem_select = document.getElementById(position+"-镶嵌"+num+"-select");
            let gem_level_select = document.getElementById(position+"-镶嵌"+num+"等级-select");
            if (gem_select && gem_level_select && gem_level_select.options[gem_level_select.selectedIndex].value > 0) {
                let selected_gem   = gem_select.options[gem_select.selectedIndex].value;
                let selected_level = gem_level_select.options[gem_level_select.selectedIndex].value;
                for (let attr in game_data["gem"][position+num][selected_gem]) {
                    let selected_value = game_data["gem"][position+num][selected_gem][attr][selected_level-1];
                    let cell = document.getElementsByClassName(attr+ ' ' +position)[0];

                    cell.innerHTML = (parseFloat(cell.innerHTML) || 0) + parseFloat(selected_value);
                }
            }

        })
    }

    // Update total attributes based on items
    for (let i = attribute_header.indexOf("术"); i < attribute_header.length; i++) {
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

    // Write item attributes to webpage
    for (let i = attribute_header.indexOf("术"); i < attribute_header.length; i++) {
        let attr = attribute_header[i];
        document.getElementById("装备-属性-" + attr).innerHTML = char_attr[attr].toFixed(1);
    }

    // Update total attributes based on xy
    for (let i = attribute_header.indexOf("术"); i < attribute_header.length; i++) {
        let attr = attribute_header[i];
        let attr_xy = parseFloat(document.getElementById("星蕴-属性-"+attr).value) || 0;
        char_attr[attr] += attr_xy;
    }

    update_attr();

    // Write total attributes to webpage
    for (let i = attribute_header.indexOf("术"); i < attribute_header.length; i++) {
        let attr = attribute_header[i];
        document.getElementById("总计-属性-" + attr).innerHTML = char_attr[attr].toFixed(1);
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
    char_attr["强度率"]   =  0.1 + char_attr["强度"] / STRENGTH_CONST 
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
})
