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

    render(evaluation = false) {
        let card = document.createElement("a");
        card.className = `btn m-1 game-card game-card-${this.season}`;
        if (game.selectedCard && this.index == game.selectedCard.index) {
            card.classList.add("game-card-selected");
        }
        if (evaluation) {
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

    isPossible(player, opponent) {
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
        return true;
    }

    evaluate(player, dealer, pocket_appear_rate) {
        let possibility = 1;
        for (let i = 0; i < this.cards.length; i++) {
            if (dealer.hasCard(this.cards[i], "hand")) {
                possibility *= 0.6;
            } else if (dealer.hasCard(this.cards[i], "pocket")) {
                possibility *= 0.6*pocket_appear_rate;
            }
        }
        this.evaluation = this.score * possibility;
        return this.score * possibility;
    }

    render(player, dealer) {
        let container = document.createElement("div");
        let score = document.createElement("span");
        let selected = false;
        score.innerHTML = this.score;
        container.appendChild(score);
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
        container.className = "row";
        pocket.className    = "col-6";
        hand.className      = "col-6";

        container.id        = `qqx-card-table-${this.id}-div`;
        pocket.id           = `qqx-card-table-pocket-${this.id}-div`;
        hand.id             = `qqx-card-table-hand-${this.id}-div`;

        for (let i = 0; i < this.hand.length; i++) {
            let card = this.hand[i].render();
            if (this.id == "dealer") {
                card = this.hand[i].render(true);
            }
            card.addEventListener("click", this.cardClickEvent(this.hand[i]));
            if (i > 0 && this.hand[i].season != this.hand[i-1].season) {
                hand.appendChild(document.createElement("br"));
            }
            hand.appendChild(card);
        }
        for (let i = 0; i < this.pocket.length; i++) {
            let card = this.pocket[i].render();
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

    moveCard(from, to, pos, card) {
        from.lostCard(card);
        to.getCard(card, pos);
    }

    getPossibleCombinations(player, opponent) {
        let ret = [];
        let curr_round = 10 - this.player.hand.length;
        let pocket_appear_rate = 1 / (qqx_data["card"].length - 30 - curr_round*2) * (10 - curr_round);
        for (let i = 0; i < this.combinations.length; i++) {
            if (this.combinations[i].isPossible(player, opponent)) {
                this.combinations[i].evaluate(this.player, this.dealer, pocket_appear_rate)
                ret.push(this.combinations[i]);
            }
        }
        ret.sort(function(a, b){return b.evaluation - a.evaluation});

        return ret;
    }

    refresh() {
        this.possibleCombinations = this.getPossibleCombinations(this.player, this.opponent);
        for (let i = 0; i < this.dealer.hand.length; i++) {
            this.dealer.hand[i].evaluation = 0;
        }

        for (let i = 0; i < this.possibleCombinations.length; i++) {
            let comb = this.possibleCombinations[i];
            for (let j = 0; j < comb.cards.length; j++) {
                let card = comb.cards[j];
                for (let k = 0; k < this.dealer.hand.length; k++) {
                    if (card == this.dealer.hand[k].name) {
                        this.dealer.hand[k].evaluation += comb.evaluation;
                    }
                }
            }
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
        combination_div.innerHTML = "";
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
    game.display();
})
