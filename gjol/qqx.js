const qqx_data = game_data["qqx"];

class Card {
    constructor(raw, owner = null, position = null) {
        this.season = raw["季节"];
        this.name   = raw["卡牌"];
        this.index  = raw["序号"];
        this.owner  = owner;
        this.position = position;
    }

    render() {
        let card = document.createElement("button");
        card.className = `m-1 game-card game-card-${this.season}`;
        if (game.selectedCard && this.index == game.selectedCard.index) {
            card.classList.add("game-card-selected");
        }
        card.innerHTML = this.name;
        return card;
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
            game.selectedCard = card;
            game.display();
        }
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
            card.addEventListener("click", this.cardClickEvent(this.hand[i]));
            hand.appendChild(card);
        }
        for (let i = 0; i < this.pocket.length; i++) {
            let card = this.pocket[i].render();
            card.addEventListener("click", this.cardClickEvent(this.pocket[i]));
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
    }

    display() {
        let table_div = document.getElementById("qqx-card-table-div");
        table_div.innerHTML = "";
        table_div.appendChild(this.opponent.render());
        table_div.appendChild(this.dealer.render());
        table_div.appendChild(this.player.render());
    }

}
var game;
function keyDownEvent(e) {
    if (game.selectedCard) {
        let card = game.selectedCard;
        console.log(card)
        if (card.owner == "dealer" && card.position == "pocket") {
            switch (e.keyCode) {
                case 37: //left
                    break;
                case 38: //up
                    game.dealer.lostCard(card)
                    game.opponent.getCard(card, "pocket")
                    break;
                case 39: //right
                    break;
                case 40: //down
                    break;
            }
        }
    }
    game.selectedCard = null;
    game.display();
}

$(function() {
    game = new Game();

    document.onkeydown = keyDownEvent;
    game.display();
})
