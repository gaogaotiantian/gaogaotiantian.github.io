const qqx_data = game_data["qqx"];

class Card {
    constructor(raw, owner = null, position = null) {
        this.season = raw["季节"];
        this.name   = raw["卡牌"];
        this.index  = raw["序号"];
        this.owner  = owner;
        this.position = position;
        this.evaluation = 0;
    }

    render(options = {}) {
        let card = document.createElement("a");
        card.className = `btn m-1 game-card game-card-${this.season}`;
        card.setAttribute("name", this.name);
        if (game.selectedCard && this.index == game.selectedCard.index) {
            card.classList.add("game-card-selected");
        }

        if ("draggable" in options && options["draggable"]) {
            card.classList.add("draggable-card");
        }

        if ("evaluation" in options && options["evaluation"]) {
            card.innerHTML = `${this.name}  (${(this.evaluation*100).toFixed(0)})`;
        } else {
            card.innerHTML = this.name;
        }

        return card;
    }
}

class Combination {
    constructor(raw) {
        this.score = raw["分数"];
        this.cards = raw["卡牌"];
        this.seasons = raw["季节"];
        this.evaluation = 0;
    }

    isPossible(player, opponent, extra_season = null) {
        let seasons = player.getSeasons();

        for (let i = 0; i < this.cards.length; i++) {
            if (opponent.hasCard(this.cards[i])) {
                return false;
            } else if (player.hasCard(this.cards[i])) {
                seasons[qqx_data["season"][this.cards[i]]] += 1;
            }
        }

        for (let season in seasons) {
            if (seasons[season] < this.seasons[season]) {
                return false;
            }
        }

        if (extra_season && seasons[extra_season] <= this.seasons[extra_season]) {
            return false;
        }

        return true;
    }

    hasCard(cardName) {
        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i] == cardName) {
                return true;
            }
        }
        return false;
    }

    evaluate(dealer, pocket_appear_rate, cardName = null) {
        let possibility = 1;
        for (let i = 0; i < this.cards.length; i++) {
            if (cardName && this.cards[i] == cardName) {
                continue;
            } else if (dealer.hasCard(this.cards[i], "hand")) {
                possibility *= 0.5;
            } else if (dealer.hasCard(this.cards[i], "pocket")) {
                possibility *= 0.5*pocket_appear_rate;
            }
        }
        return this.score * possibility;
    }

    render(player, dealer) {
        let container = document.createElement("div");
        let score = document.createElement("span");
        let selected = false;
        container.className = "px-2 my-1";
        score.innerHTML = this.score;
        container.appendChild(score);

        this.cards.sort(function(a, b) {
            if (player.hasCard(a) == player.hasCard(b)) {
                return 0;
            } else if (player.hasCard(a)) {
                return -1;
            } else {
                return 1;
            }
        })
        for (let i = 0; i < this.cards.length; i++) {
            let card = this.cards[i];
            let card_button = document.createElement("a");
            let season = qqx_data["season"][card];
            if (player.hasCard(card)) {
                card_button.className = `btn m-1 game-card game-card-${season}`;
            } else {
                card_button.className = `btn m-1 game-card-inactive game-card-inactive-${season}`;
            }
            card_button.innerHTML = card;
            container.appendChild(card_button);

            if (game.selectedCard && card == game.selectedCard.name) {
                selected = true;
            }
        }

        if (selected == true) {
            container.classList.add("combination-selected");
        }
        return container;
    }
}

class Player {
    constructor(id) {
        this.hand = [];
        this.pocket = [];
        this.id = id;
    }
    
    prepareCards() {
        this.pocket = [];
        for (let i = 0; i < qqx_data["card"].length; i++) {
            this.pocket.push(new Card(qqx_data["card"][i], this.id, "pocket"));
        }
    }

    sortCards() {
        this.pocket.sort(function(a, b){return a.index - b.index});
        this.hand.sort(function(a, b){return a.index - b.index});
    }

    cardClickEvent(card) {
        return function evt(e) {
            if (game.selectedCard) {
                if (game.selectedCard.name == card.name) {
                    keyDownEvent({"keyCode": "double_click"});
                } else {
                    keyDownEvent({"keyCode": "click", "card": card})
                }
            }
            game.selectedCard = card;
            game.display();
        }
    }

    hasCard(cardName, position = null) {
        if (position != "pocket") {
            for (let i = 0; i < this.hand.length; i++) {
                if (this.hand[i].name == cardName) {
                    return true;
                }
            }
        }
        if (position != "hand") {
            for (let i = 0; i < this.pocket.length; i++) {
                if (this.pocket[i].name == cardName) {
                    return true;
                }
            }
        }
        return false;
    }

    getSeasons() {
        let ret = {"春": 0, "夏": 0, "秋": 0, "冬": 0};
        for (let i = 0; i < this.hand.length; i++) {
            ret[this.hand[i].season] += 1;
        }
        return ret;
    }

    lostCard(card, position = null) {
        let arr = [];
        if (!position) {
            position = card.position;
        }
        if (position == "hand") {
            arr = this.hand;
        } else if (position == "pocket") {
            arr = this.pocket;
        }

        for (let i = 0; i < arr.length; i++) {
            if (arr[i].index == card.index) {
                arr.splice(i, 1);
                break;
            }
        }
    }

    getCard(card, position) { 
        let arr = [];
        if (position == "hand") {
            arr = this.hand;
        } else if (position == "pocket") {
            arr = this.pocket;
        }
        arr.push(card);
        card.owner = this.id;
        card.position = position;
        this.sortCards();
    }

    render() {
        let container = document.createElement("div");
        let pocket    = document.createElement("div");
        let hand      = document.createElement("div");
        let hand_title    = document.createElement("div");
        let pocket_title  = document.createElement("div");

        container.className = "row p-1";
        pocket.className    = "col-6 mx-1 game-card-section";
        hand.className      = "col-5 mx-1 game-card-section";

        container.id        = `qqx-card-table-${this.id}-div`;
        pocket.id           = `qqx-card-table-pocket-${this.id}-div`;
        hand.id             = `qqx-card-table-hand-${this.id}-div`;

        pocket.setAttribute("player", this.id);
        pocket.setAttribute("position", "pocket");

        hand.setAttribute("player", this.id);
        hand.setAttribute("position", "hand");

        switch (this.id) {
            case "dealer":
                hand_title.innerHTML = "场上牌"
                pocket_title.innerHTML = "牌库";
                break;
            case "player":
                hand_title.innerHTML = "玩家手牌"
                pocket_title.innerHTML = "玩家得分区";
                break;
            case "opponent":
                hand_title.innerHTML = "对方牌"
                pocket_title.innerHTML = "对方得分区";
                break;
        }
        hand_title.className = "subtitle";
        pocket_title.className = "subtitle";
        hand.appendChild(hand_title);
        pocket.appendChild(pocket_title);

        for (let i = 0; i < this.hand.length; i++) {
            let card = this.hand[i].render({"draggable": true});
            if (this.id == "dealer") {
                card = this.hand[i].render({"evaluation": true, "draggable": true});
            }
            card.addEventListener("click", this.cardClickEvent(this.hand[i]));
            if (i > 0 && this.hand[i].season != this.hand[i-1].season) {
                hand.appendChild(document.createElement("br"));
            }
            hand.appendChild(card);
        }
        for (let i = 0; i < this.pocket.length; i++) {
            let card = this.pocket[i].render({"draggable": true});
            card.addEventListener("click", this.cardClickEvent(this.pocket[i]));
            if (i > 0 && this.pocket[i].season != this.pocket[i-1].season) {
                pocket.appendChild(document.createElement("br"));
            }
            pocket.appendChild(card);
        }

        container.appendChild(pocket);
        container.appendChild(hand);
        return container;
    }

}

class Game {
    constructor() {
        this.restart();
    }

    restart() {
        this.opponent = new Player("opponent");
        this.player   = new Player("player");
        this.dealer   = new Player("dealer");
        this.selectedCard = null;
        this.draggedCard  = null;
        this.draggedCardDom = null;
        this.dealer.prepareCards();
        this.combinations = this.loadCombinations();
        this.possibleCombinations = [];
    }

    loadCombinations() {
        let ret = []
        for (let i = 0; i < qqx_data["combination"].length; i++) {
            ret.push(new Combination(qqx_data["combination"][i]))
        }
        return ret;
    }

    findCardByName(cardName) {
        let g = this;
        for (let player of ["opponent", "dealer", "player"]) {
            for (let position of ["hand", "pocket"]) {
                for (let card of g[player][position]) {
                    if (card.name == cardName) {
                        return card;
                    }
                }
            }
        }
        return null;
    }

    moveCard(from, to, pos, card) {
        from.lostCard(card);
        to.getCard(card, pos);
    }

    getPossibleCombinations(player, opponent) {
        let ret = [];
        for (let i = 0; i < this.combinations.length; i++) {
            if (this.combinations[i].isPossible(player, opponent)) {
                this.combinations[i].evaluation = this.combinations[i].evaluate(this.dealer, this.getPocketChance())
                ret.push(this.combinations[i]);
            }
        }
        ret.sort(function(a, b){return b.evaluation - a.evaluation});

        return ret;
    }

    getPocketChance() {
        return (1 / this.dealer.pocket.length) * 2 * this.player.hand.length;
    }

    getSeasonOpportunityCost(seasons) {
        let hand = this.dealer.hand;
        let pocket = this.dealer.pocket;
        let ret = {"春":0, "夏":0, "秋":0, "冬":0};

        let data = {"春":[], "夏":[], "秋":[], "冬":[]};
        let temp = {};

        for (let season in seasons) {
            temp[season] = [];
            for (let i = 0; i < seasons[season]; i++) {
                // [Evaluation, Chance]
                temp[season].push([0,0]);
            }
        } 

        for (let i = 0; i < hand.length; i++) {
            data[hand[i].season].push([hand[i], 0.5]);
        }
        for (let i = 0; i < pocket.length; i++) {
            data[pocket[i].season].push([pocket[i], 0.5 * this.getPocketChance()]);
        }

        // 先对所有的排按照价值排序，然后计算手里最后有1张、2张.. 季节牌时的期望(temp[season])和保持在这个状态的概率
        // 然后从1张开始向上补充概率，求出至少有k张牌时的evaluation期望，然后减！
        for (let season in seasons) {
            if (seasons[season] > 0) {
                data[season].sort(function(a, b){return b[0].evaluation - a[0].evaluation});
                for (let i = 0; i < data[season].length; i++) {
                    let card_data = data[season][i];
                    let card_eval = card_data[0].evaluation;
                    let card_chance = card_data[1];
                    for (let j = temp[season].length - 1; j > 0; j--) {
                        let next_data = temp[season][j];
                        let prev_data = temp[season][j-1];
                        let new_card_chance = prev_data[1] * (1 - next_data[1]) * card_chance;
                        if (prev_data[1] > 0) {
                            next_data[0] += new_card_chance * (prev_data[0] / prev_data[1] + card_eval);
                            next_data[1] += new_card_chance;
                        }
                    }
                    temp[season][0][0] += card_chance * (1-temp[season][0][1]) * card_eval;
                    temp[season][0][1] += card_chance * (1-temp[season][0][1]);
                }

                for (let i = 1; i < temp[season].length; i++) {
                    temp[season][i][0] += (1-temp[season][i][1]) * temp[season][i-1][0];
                }
                ret[season] = Math.max(0, temp[season][temp[season].length - 1][0] - 
                        (temp[season][temp[season].length - 2] || [0])[0]);
            }
        }
        return ret;
    }

    refresh() {
        this.possibleCombinations = this.getPossibleCombinations(this.player, this.opponent);
        for (let i = 0; i < this.dealer.hand.length; i++) {
            this.dealer.hand[i].evaluation = 0;
        }
        for (let i = 0; i < this.dealer.pocket.length; i++) {
            this.dealer.pocket[i].evaluation = 0;
        }

        let playerSeasons = this.player.getSeasons();
        let pocket_appear_rate = this.getPocketChance();
        for (let i = 0; i < this.possibleCombinations.length; i++) {
            let comb = this.possibleCombinations[i];
            for (let j = 0; j < this.dealer.hand.length; j++) {
                if (comb.hasCard(this.dealer.hand[j].name)) {
                    this.dealer.hand[j].evaluation += comb.evaluate(this.dealer, pocket_appear_rate, this.dealer.hand[j].name);
                } 
            }
            for (let j = 0; j < this.dealer.pocket.length; j++) {
                if (comb.hasCard(this.dealer.pocket[j].name)) {
                    this.dealer.pocket[j].evaluation += comb.evaluate(this.dealer, pocket_appear_rate, this.dealer.pocket[j].name);
                } 
            }
        }

        let seasonOpportunityCost = this.getSeasonOpportunityCost(playerSeasons);

        for (let i = 0; i < this.dealer.hand.length; i++) {
            this.dealer.hand[i].evaluation -= seasonOpportunityCost[this.dealer.hand[i].season];
        }
        for (let i = 0; i < this.dealer.pocket.length; i++) {
            this.dealer.pocket[i].evaluation -= seasonOpportunityCost[this.dealer.pocket[i].season];
        }
        this.display();
    }

    display() {
        let table_div = document.getElementById("qqx-card-table-div");
        table_div.innerHTML = "";
        table_div.appendChild(this.opponent.render());
        table_div.appendChild(this.dealer.render());
        table_div.appendChild(this.player.render());

        let combination_div = document.getElementById("qqx-card-status-div");
        let combination_title = document.createElement('div')
        combination_div.innerHTML = "";
        combination_title.innerHTML = "可能组合";
        combination_title.classList = "subtitle";
        combination_div.appendChild(combination_title);
        for (let i = 0; i < this.possibleCombinations.length; i++) {
            combination_div.appendChild(this.possibleCombinations[i].render(this.player, this.dealer));

        }
    }

}
var game;
const move_position = {
    "dealer": {
        "pocket": {
            "double_click": "right",
            "up"   : ["opponent", "hand"],
            "down" : ["player"  , "hand"],
            "right": ["dealer"  , "hand"]
        },
        "hand": {
            "double_click": "down",
            "up"   : ["opponent", "pocket"],
            "down" : ["player"  , "pocket"],
            "left" : ["dealer"  , "pocket"]
        }
    },
    "opponent": {
        "pocket": {
            "double_click": "down",
            "down":  ["dealer"  , "pocket"],
            "right": ["opponent", "hand"]
        }, 
        "hand": {
            "double_click": "down",
            "down": ["dealer"  , "pocket"],
            "left": ["opponent", "pocket"]
        }
    },
    "player": {
        "pocket": {
            "double_click": "right",
            "up"   : ["dealer", "pocket"],
            "right": ["player", "hand"]
        },
        "hand": {
            "double_click": "left",
            "up":  ["dealer", "pocket"],
            "left":["player", "pocket"] 
        }
    }
};

function keyDownEvent(e) {
    if (game.selectedCard) {
        let card = game.selectedCard;
        let data = move_position[card.owner][card.position];
        let key = "";
        switch (e.keyCode) {
            case 37: //left
                key = "left";
                break;
            case 38: //up
                key = "up";
                break;
            case 39: //right
                key = "right";
                break;
            case 40: //down
                key = "down";
                break;
            case "double_click":
                key = data["double_click"];
                break;
            case "click":
                key = "click";
                break;
        }
        if (key && key in data) {
            game.moveCard(game[card.owner], game[data[key][0]], data[key][1], card);
        }

        if (key == "click") {
            if (game.selectedCard.owner == "player" && e.card.owner == "dealer" && e.card.position == "hand" && game.selectedCard.season == e.card.season) {
                game.moveCard(game[card.owner], game.player, "pocket", card);
                game.moveCard(game[e.card.owner], game.player, "pocket", e.card);
            }
        }
    }
    game.selectedCard = null;
    game.refresh();
}

function mouseDownEvent(e) {
    if (e.target.classList.contains("draggable-card")) {
        game.draggedCard = game.findCardByName(e.target.getAttribute("name"));
        game.draggedCardDom = e.target;
        game.draggedCardDom.style.zIndex = 15;
    }
}

function mouseUpEvent(e) {
    if (game.draggedCard) {
        for (let id of ["opponent", "dealer", "player"]) {
            for (let position of ["pocket", "hand"]) {
                let d = document.getElementById(`qqx-card-table-${position}-${id}-div`);
                if (d.offsetLeft <= e.clientX && e.clientX <= d.offsetLeft + d.offsetWidth &&
                    d.offsetTop  <= e.clientY && e.clientY <= d.offsetTop + d.offsetHeight) {
                    if (game.draggedCard.owner != id || game.draggedCard.position != position) {
                        game.moveCard(game[game.draggedCard.owner], game[id], position, game.draggedCard);
                        game.selectedCard = null;
                        game.refresh();
                    }
                }
            }
        } 
        game.draggedCard = null;
        game.draggedCardDom = null;
    }
}

function mouseMoveEvent(e) {
    if (game.draggedCard) {
        let x = e.clientX;
        let y = e.clientY;
        let d = game.draggedCardDom;

        d.style.position = "fixed";
        d.style.left = (x - d.offsetWidth/2) + "px";
        d.style.top = (y - d.offsetHeight/2) + "px";

    }
}

$(function() {
    game = new Game();

    document.onkeydown = keyDownEvent;
    document.getElementById("restart-button").onclick = function() {
        game.restart();
        game.display();
    };

    document.onclick = function(e){
        if (e.target.tagName == "DIV") {
            game.selectedCard = null;
            game.display();
        }
    };

    document.onmousedown = mouseDownEvent;
    document.onmouseup = mouseUpEvent;
    document.onmousemove = mouseMoveEvent;
    game.display();
})
