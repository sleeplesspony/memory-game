document.addEventListener('DOMContentLoaded', function(event) {

    const totalCardsNum = 16; // total number of cards
    const twoStarsScore = 18;
    const oneStarScore = 30;
    let currentStars = 3;
    let openedCards = []; 
    let matchCardsNum = 0; // current number of matched cards
    let movesNum = 0; // number of user attempts to find a match
    let container = document.querySelector('.container');
    let moves = document.querySelector('.moves');
    let activeStars = document.querySelectorAll('.stars li.active');
    let restartBut = document.querySelector('.restart');
    let winRestartBut = document.querySelector('.win-restart');

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

    restartBut.addEventListener('click', function() {
        restartGame();
    });

    winRestartBut.addEventListener('click', function() {
        closeWinMessage();
        restartGame();
    });

    function restartGame() {
        let deck = document.querySelector('ul.deck');
        deck.remove();
        openedCards = [];
        matchCardsNum = 0;
        resetScore();       
        startGame();
    }

    function resetScore() {
        movesNum = 0;
        moves.innerHTML = movesNum;
        activeStars[1].classList.add('active');
        activeStars[2].classList.add('active');
        currentStars = 3;
    }

    function openCard(card) {
        card.classList.add('open');
        openedCards.push(card);

        if (openedCards.length == 2) {
            updateScore();
            if (openedCards[0].getAttribute('data-card') === openedCards[1].getAttribute('data-card')) {            
                matchCards();
            } else {
                closeCards();
            }
        }
    }

    // lock matched cards
    function matchCards() {
        for (const card of openedCards) {
            card.classList.remove('open');
            card.classList.add('match', 'animated', 'rubberBand');                          
        }
        openedCards = [];
        matchCardsNum += 2;
        if (matchCardsNum == totalCardsNum) {
            showWinMessage();
        }
    }

    // close not matched cards
    function closeCards() {
        for (const card of openedCards) {
            card.classList.remove('open'); 
            card.classList.add('notmatch', 'animated', 'tada');            
        }
        let tempOpened = openedCards;
        openedCards = []; 
        setTimeout(function() {
            for (const card of tempOpened) {
                card.classList.remove('notmatch', 'animated', 'tada');              
            }                   
        }, 1000);
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

    function updateScore() {
        movesNum++;
        moves.innerHTML = movesNum;
        if (movesNum == twoStarsScore) {            
            activeStars[2].classList.remove('active');
            currentStars = 2;
        }
        if (movesNum == oneStarScore) {
            activeStars[1].classList.remove('active');
            currentStars = 1;
        }
    }

    function showWinMessage() {
        let winScore = document.querySelector('.win-score');
        winScore.innerHTML = `With ${movesNum} moves and ${currentStars} stars!`; 
        let message = document.querySelector('.win-modal');
        message.classList.add('win-modal-active');
    }

    function closeWinMessage() {
        let message = document.querySelector('.win-modal');
        message.classList.remove('win-modal-active');
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

