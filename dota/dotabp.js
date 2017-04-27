var heroList;
var selfTeam = [];
var enemyTeam = [];
var heroData;

// Input of the function is -1 to 1
// If it's not, it will be saturated
function RateToColor(rate) {
    colorStr = "rgb("
    if (rate > 1) {
        rate = 1;
    } else if (rate < -1) {
        rate = -1;
    }
    if (rate >= 0) {
        colorStr += Math.round((1-rate)*255).toString();
        colorStr += ",255,";
        colorStr += Math.round((1-rate)*255).toString();
        colorStr += ")"
    } else {
        rate = -rate;
        colorStr += "255,";
        colorStr += Math.round((1-rate)*255).toString();
        colorStr += ",";
        colorStr += Math.round((1-rate)*255).toString();
        colorStr += ")"
    }
    return colorStr;
}
// heroName has to be Valid!
function AddHero(heroName) {
    if (heroName.toLowerCase() != heroName) {
        heroName = HeroLocalToOfficial(heroName);
    }
    var html = "";
    var imgSrc = 'http://cdn.dota2.com/apps/dota2/images/heroes/' + heroName.toLowerCase() + '_lg.png'
    html += '<div class="hero" heroName="' + heroName + '">';
    html += '<img src="' + imgSrc + '">';
    html += '<div class="hero_data" heroName="' + heroName + '">';
    html += GetHeroDataHtml(heroName);
    html += '</div>'
    html += '</div>';
    return html
}
function GetHeroDataHtml(heroName) {
    html = $("<p>");
    var d = GetHeroData(heroName);
    var team = d[0];
    var opp = -d[1];
    var self_corr = d[2];
    var enemy_corr = d[3];
    var $t = $("<span>");
    var team_color_sat = 255 - Math.min(255, Math.round(Math.abs(team/5*255))).toString();
    var opp_color_sat = 255 - Math.min(255, Math.round(Math.abs(opp/5*255))).toString();
    if (team > 0) {
        $t.text("Team +" + team + "%");
        $t.css({"color":"rgb(" +team_color_sat+",255,"+team_color_sat+")"});
    } else {
        $t.text("Team " + team + "%");
        $t.css({"color":"rgb(255,"+team_color_sat+","+team_color_sat+")"});
    }
    html.append($t);
    html.append("<br>");
    $t = $("<span>")
    if (self_corr > 0) {
        $t.text("Corr +" + self_corr + "%");
    } else {
        $t.text("Corr " + self_corr + "%");
    }
    $t.css({"color":RateToColor(self_corr/10)});
    html.append($t);
    html.append("<br>")
    $t = $("<span>");
    if (opp > 0) {
        $t.text("Opp +" + opp + "%");
        $t.css({"color":"rgb(" +opp_color_sat+",255,"+opp_color_sat+")"});
    } else {
        $t.text("Opp " + opp + "%");
        $t.css({"color":"rgb(255,"+opp_color_sat+","+opp_color_sat+")"});
    }
    html.append($t);
    html.append("<br>");
    $t = $("<span>")
    if (enemy_corr > 0) {
        $t.text("Corr +" + enemy_corr + "%");
    } else {
        $t.text("Corr " + enemy_corr + "%");
    }
    $t.css({"color":RateToColor(enemy_corr/10)});
    html.append($t);
    return html.html()
}
function GetHeroData(heroName) {
    var old_rate = GetWinRate();
    var self_rate = 0;
    var enemy_rate = 0;
    var self_corr = 0;
    var enemy_corr = 0;
    var selfIdx = selfTeam.indexOf(heroName);
    var enemyIdx = enemyTeam.indexOf(heroName);
    // Pretend self choose this hero, if team full, ignore
    if (selfIdx != -1) {
        selfTeam.splice(selfIdx, 1);
        self_rate = old_rate - GetWinRate();
        selfTeam.splice(selfIdx, 0, heroName);
        self_corr = GetCorr(heroName, true);
    } else if (enemyIdx != -1) {
        enemyTeam.splice(enemyIdx, 1);
        enemy_rate = old_rate - GetWinRate();
        enemyTeam.splice(enemyIdx, 0, heroName);
        enemy_corr = GetCorr(heroName, false);
    } else {
        if (selfTeam.length < 5) {
            selfTeam.push(heroName);
            self_rate = GetWinRate() - old_rate;
            selfTeam.pop();
            self_corr = GetCorr(heroName, true);
        }
        if (enemyTeam.length < 5) {
            enemyTeam.push(heroName);
            enemy_rate = GetWinRate() - old_rate;
            enemyTeam.pop();
            enemy_corr = GetCorr(heroName, false);
        }
    }
    return [self_rate.toFixed(2), enemy_rate.toFixed(2), self_corr.toFixed(2), enemy_corr.toFixed(2)]
}
function GetWinRate() {
    var win_self = 1;
    var adv_team = 1;
    var win_enemy = 1;
    var adv_enemy = 1;
    // Calculate self team 
    for (var i = 0; i < selfTeam.length; i++) {
        var name = selfTeam[i];
        win_self = win_self * GetHeroRate(name);
        for (var j = i+1; j < selfTeam.length; j++) {
            if (selfTeam[j] != name)
                win_self = win_self * (GetTeamMate(name, selfTeam[j]));
        }
        for (var j = 0; j < enemyTeam.length; j++) {
            if (enemyTeam[j] != name)
                win_self = win_self * (GetMatchUp(name, enemyTeam[j]));
        }
    }
    for (var i = 0; i < enemyTeam.length; i++) {
        var name = enemyTeam[i];
        win_enemy = win_enemy * GetHeroRate(name);
        for (var j = i+1; j < enemyTeam.length; j++) {
            if (enemyTeam[j] != name)
                win_enemy = win_enemy * (GetTeamMate(name, enemyTeam[j]));
        }
    }
    return (win_self/(win_self+win_enemy)*100).toFixed(2);
}
function GetCorr(heroName, isSelf) {
    var corr = 1;
    for (var i = 0; i < selfTeam.length; i++) {
        if (selfTeam[i] != heroName) {
            if (isSelf) {
                corr = corr * GetTeamMate(heroName, selfTeam[i]);
            } else {
                corr = corr * GetMatchUp(heroName, selfTeam[i]);
            }
        }
    }

    for (var i = 0; i < enemyTeam.length; i++) {
        if (enemyTeam[i] != heroName) {
            if (isSelf) {
                corr = corr * GetMatchUp(heroName, enemyTeam[i]);
            } else {
                corr = corr * GetTeamMate(heroName, enemyTeam[i]);
            }
        }
    }
    return 100*(corr-1);
}
// Win rate calculation functions
function GetMatchUp(heroName1, heroName2) {
    if (heroData)
        return heroData[heroName1]["matchup"][heroName2];
    return 1;
}
function GetTeamMate(heroName1, heroName2) {
    if (heroData)
        return heroData[heroName1]["teammate"][heroName2];
    return 1;
}
function GetHeroRate(heroName) {
    if (heroData) {
        return heroData[heroName]["rate"];
    }
    return 1;
}
function RefreshHeroDiv(d) {
    d.empty();
    d.html(AddHero('spectre'));
}
function HeroLocalToOfficial(localName) {
    if (localName == "") {
        return "";
    }
    for (var i = 0; i < heroList.length; i++) {
        if (heroList[i]["localized_name"] == localName) {
            return heroList[i]["name"];
        } 
    }
    alert("There's no hero named "+localName)
}
function RefreshPage() {
    $('#on_stage_hero_self_div').empty();
    $('#on_stage_hero_enemy_div').empty();
    for (i = 0; i < 5; i++) {
        if (i < selfTeam.length) {
            $('#on_stage_hero_self_div').append($("<div>", {"class":"col on_stage_hero self_on_stage_hero"}).append(AddHero(selfTeam[i])));
        } else {
            $('#on_stage_hero_self_div').append($("<div>", {"class":"col on_stage_hero self_on_stage_hero"}));
        }
        if (i < enemyTeam.length) {
            $('#on_stage_hero_enemy_div').append($("<div>", {"class":"col on_stage_hero enemy_on_stage_hero"}).append(AddHero(enemyTeam[i])));
        } else {
            $('#on_stage_hero_enemy_div').append($("<div>", {"class":"col on_stage_hero enemy_on_stage_hero"}));
        }
    }
    // Update win rate here
    $('#win_rate_p').text("Win Rate: " + GetWinRate().toString() + "%");

    // Refresh hero rate
    $(".hero_data").each(function() {
        $(this).html(GetHeroDataHtml($(this).attr("heroName")));
    });
}
$(document).ready(function() {
    // Put all heros
    var heroStr = ["Axe", "Earthshaker", "Pudge", "Sand King", "Sven", "Tiny", "Kunkka", "Slardar", "Tidehunter", "Beastmaster", "Wraith King", "Dragon Knight", "Clockwerk", "Lifestealer", "Omniknight", "Huskar", "Night Stalker", "Doom", "Spirit Breaker", "Alchemist", "Lycan", "Brewmaster", "Chaos Knight", "Treant Protector", "Undying", "Io", "Centaur Warrunner", "Magnus", "Timbersaw", "Bristleback", "Tusk", "Abaddon", "Elder Titan", "Legion Commander", "Earth Spirit", "Underlord", "Phoenix"].sort();
    var heroAgi = ["Anti-Mage", "Bloodseeker", "Drow Ranger", "Juggernaut", "Mirana", "Morphling", "Shadow Fiend", "Phantom Lancer", "Razor", "Vengeful Spirit", "Riki", "Sniper", "Venomancer", "Faceless Void", "Phantom Assassin", "Templar Assassin", "Viper", "Luna", "Clinkz", "Broodmother", "Bounty Hunter", "Weaver", "Spectre", "Ursa", "Gyrocopter", "Lone Druid", "Meepo", "Nyx Assassin", "Naga Siren", "Slark", "Medusa", "Troll Warlord", "Ember Spirit", "Terrorblade", "Arc Warden", "Monkey King"].sort();
    var heroInt = ["Bane", "Crystal Maiden", "Puck", "Storm Spirit", "Windranger", "Zeus", "Lina", "Lion", "Shadow Shaman", "Witch Doctor", "Lich", "Enigma", "Tinker", "Necrophos", "Warlock", "Queen of Pain", "Death Prophet", "Pugna", "Dazzle", "Leshrac", "Nature's Prophet", "Dark Seer", "Enchantress", "Jakiro", "Batrider", "Chen", "Ancient Apparition", "Invoker", "Silencer", "Outworld Devourer", "Shadow Demon", "Ogre Magi", "Rubick", "Disruptor", "Keeper of the Light", "Visage", "Skywrath Mage", "Techies", "Oracle", "Winter Wyvern"].sort();
    // Read all json data
    $.getJSON("hero_list.json", function(data) {
        // Deep copy here
        heroList = JSON.parse(JSON.stringify(data["heroes"]));
    })
    .done(function() {
        for (i = 0; i < 20; i++) {
            $('#off_stage_hero_div_str_1').append($("<div>", {"class":"col off_stage_hero"}).append(AddHero(HeroLocalToOfficial(heroStr[i]))));
            $('#off_stage_hero_div_agi_1').append($("<div>", {"class":"col off_stage_hero"}).append(AddHero(HeroLocalToOfficial(heroAgi[i]))));
            $('#off_stage_hero_div_int_1').append($("<div>", {"class":"col off_stage_hero"}).append(AddHero(HeroLocalToOfficial(heroInt[i]))));
            if (20 + i < heroStr.length) {
                $('#off_stage_hero_div_str_2').append($("<div>", {"class":"col off_stage_hero"}).append(AddHero(HeroLocalToOfficial(heroStr[i+20]))));
            } else {
                $('#off_stage_hero_div_str_2').append($("<div>", {"class":"col off_stage_hero"}));
            }
            if (20 + i < heroAgi.length) {
                $('#off_stage_hero_div_agi_2').append($("<div>", {"class":"col off_stage_hero"}).append(AddHero(HeroLocalToOfficial(heroAgi[i+20]))));
            } else {
                $('#off_stage_hero_div_agi_2').append($("<div>", {"class":"col off_stage_hero"}));
            }
            if (20 + i < heroInt.length) {
                $('#off_stage_hero_div_int_2').append($("<div>", {"class":"col off_stage_hero"}).append(AddHero(HeroLocalToOfficial(heroInt[i+20]))));
            } else {
                $('#off_stage_hero_div_int_2').append($("<div>", {"class":"col off_stage_hero"}));
            }
        }
    });

    $.getJSON("hero_data.json", function(data) {
        heroData = JSON.parse(JSON.stringify(data));
    })
    .done(function() {
        RefreshPage();
    });
    // Setup the on stage slots
    $('body')
    .on('click', 'img', function(e) {
        if ($(this).parent().parent().hasClass("self_on_stage_hero")) {
            var name = $(this).parent().attr("heroName");
            selfTeam.splice(selfTeam.indexOf(name), 1);
        } else if ($(this).parent().parent().hasClass("enemy_on_stage_hero")) {
            var name = $(this).parent().attr("heroName");
            enemyTeam.splice(enemyTeam.indexOf(name), 1);
        } else if ($(this).parent().parent().hasClass("off_stage_hero")) {
            var name = $(this).parent().attr("heroName");
            if (selfTeam.indexOf(name) == -1 && enemyTeam.indexOf(name) == -1) {
                if (e.offsetX < e.target.width/2 && selfTeam.length < 5) {
                    selfTeam.push(name);
                } else if (e.offsetX >= e.target.width/2 && enemyTeam.length < 5){
                    enemyTeam.push(name);
                }
            }
        }
        RefreshPage()
    })
    .on('mousemove', 'img', function(e) {
        if ($(this).parent().parent().hasClass("off_stage_hero")) {
            var name = $(this).parent().attr("heroname");
            if (e.offsetX < e.target.width/2) {
                $(".self_on_stage_hero").each(function() {
                    $(this).find("img").css({"border-color":RateToColor((GetTeamMate(name, $(this).find(".hero").attr("heroname")) - 1)/0.05)});
                });
                $(".enemy_on_stage_hero").each(function() {
                    $(this).find("img").css({"border-color":RateToColor((GetMatchUp(name, $(this).find(".hero").attr("heroname")) - 1)/0.05)});
                });
                $(this).css({"border-color":"green"});
            } else {
                $(".enemy_on_stage_hero").each(function() {
                    $(this).find("img").css({"border-color":RateToColor((GetTeamMate(name, $(this).find(".hero").attr("heroname")) - 1)/0.05)});
                });
                $(".self_on_stage_hero").each(function() {
                    $(this).find("img").css({"border-color":RateToColor((GetMatchUp(name, $(this).find(".hero").attr("heroname")) - 1)/0.05)});
                });
                $(this).css({"border-color":"red"});
            }
        }
    })
    .on('mouseleave', 'img', function(e) {
        if ($(this).parent().parent().hasClass("off_stage_hero")) {
            $(this).css({"border-color":"transparent"});
            $(".on_stage_hero").find("img").css({"border-color":"transparent"});
        }
    });
});
