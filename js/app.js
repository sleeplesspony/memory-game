document.addEventListener('DOMContentLoaded', function(event) {

    const totalCardsNum = 16; // total number of cards

    let openedCards = []; 
    let matchCardsNum = 0; // current number of matched cards
    let container = document.querySelector('.container');

    // shuffle cards and display on deck
    startGame();

    // handle clicks on cards
    container.addEventListener('click', function(event) {
        let target = event.target;
        while (target != this) {
            if (target.nodeName === 'LI' && target.className == 'card') {               
                openCard(target); 
                break;
            }
            target = target.parentNode;
        }
    });

    function openCard(card) {
        card.classList.add('open');
        openedCards.push(card);

        if (openedCards.length == 2) {
            if (openedCards[0].getAttribute('data-card') === openedCards[1].getAttribute('data-card')) {            
                console.log("match cards");
                openedCards = [];
            } else {
                console.log("not match cards");
                openedCards = [];
            }
        }
    }

    function startGame() {
        let cards = getCards();
        let ulDeck = getCardsList(cards);    
        container.appendChild(ulDeck);
    }

    function getCards() {
        let cards = [
            'anchor',
            'bicycle',
            'bolt',
            'bomb',
            'cube',
            'diamond',
            'leaf',
            'paper-plane-o'
        ];
        cards = cards.concat(cards);
        cards = shuffle(cards);
        return cards;
    }

    // create ul-list of shuffled cards
    function getCardsList(cards) {
        let ulDeck = document.createElement('ul');
        ulDeck.classList.add('deck');

        for (const card of cards) {
            let liCard = document.createElement('li');
            liCard.classList.add('card');
            liCard.setAttribute('data-card', card);
            let iCard = document.createElement('i');
            let iClassName = `fa-${card}`;
            iCard.classList.add('fa', iClassName);
            liCard.appendChild(iCard);
            ulDeck.appendChild(liCard);
        }

        return ulDeck;
    }
});


function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

