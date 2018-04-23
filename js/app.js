document.addEventListener('DOMContentLoaded', function(event) {

    const totalCardsNum = 16; // total number of cards
    const twoStarsScore = 18; // number of moves for 2 stars rating 
    const oneStarScore = 30; // number of moves for 1 star rating 
    let currentStars = 3; // current stars rating
    let openedCards = []; // buffer for opened cards
    let matchCardsNum = 0; // current number of matched cards
    let movesNum = 0; // number of user attempts to find a match
    let container = document.querySelector('.container');
    let moves = document.querySelector('.moves');
    let activeStars = document.querySelectorAll('.stars li.active');
    let restartBut = document.querySelector('.restart');
    let winRestartBut = document.querySelector('.win-restart');
    let timer = document.querySelector('.timer');
    let gameTimer;

    startGame();

    /** handles clicks on cards */
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

    /** handles click on restart button */
    restartBut.addEventListener('click', function() {
        clearInterval(gameTimer);  
        restartGame();
    });

    /** handles click on restart button in modal window */
    winRestartBut.addEventListener('click', function() {
        closeWinMessage();
        restartGame();
    });

    /**
    * @description Restarts game: clears cards ul-list and adds new shuffled one, resets scores
    */
    function restartGame() {
        let deck = document.querySelector('ul.deck');
        deck.remove();        
        openedCards = [];
        matchCardsNum = 0;
        resetScore();       
        startGame();
    }
    
    /**
    * @description Resets scores and star rating for new game
    */
    function resetScore() {
        movesNum = 0;
        moves.innerHTML = movesNum + ' Moves';
        activeStars[1].classList.add('active');
        activeStars[2].classList.add('active');
        currentStars = 3;           
    }

    /**
    * @description Opens card, adds it in buffer, checks if there are 2 matched cards in the buffer, handles matching and not matching opened cards
    * @param {object} card - li card element
    */
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

    /**
    * @description Locks matched cards with animated effect, stops the game if all cards matched: stops timer, shows winner message
    */
    function matchCards() {
        for (const card of openedCards) {
            card.classList.remove('open');
            card.classList.add('match', 'animated', 'rubberBand');                          
        }
        openedCards = [];
        matchCardsNum += 2;
        if (matchCardsNum == totalCardsNum) {
            clearInterval(gameTimer);
            showWinMessage();
        }
    }

    /**
    * @description Closes not matched cards with animated effect
    */
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

    /**
    * @description Starts game: add cards on the page, start timer
    */
    function startGame() {
        let cards = getCards();
        let ulDeck = getCardsList(cards);    
        container.appendChild(ulDeck);
        startTimer();
    }

    /**
    * @description Creates array with shuffled cards string values
    */
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

    /**
    * @description Creates ul-list of shuffled cards
    * @param {array} cards - Array of string cards values
    * @returns {object} ul-list element
    */
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

    /**
    * @description Updates scores info: numbers of moves for each pair of opened cards and star rating depending on number of moves 
    */
    function updateScore() {
        movesNum++;
        moves.innerHTML = movesNum + ' Moves';
        if (movesNum == twoStarsScore) {            
            activeStars[2].classList.remove('active');
            currentStars = 2;
        }
        if (movesNum == oneStarScore) {
            activeStars[1].classList.remove('active');
            currentStars = 1;
        }
    }

    /**
    * @description Show modal window with message for winner, including scores info and game time
    */
    function showWinMessage() {
        let winScore = document.querySelector('.win-score');
        winScore.innerHTML = `With ${movesNum} moves and ${currentStars} stars!`; 
        let winTime = document.querySelector('.win-time');
        winTime.innerHTML = timer.innerHTML; 
        let message = document.querySelector('.win-modal');
        message.classList.add('win-modal-active');
    }

    /**
    * @description Close modal window with winner message
    */
    function closeWinMessage() {
        let message = document.querySelector('.win-modal');
        message.classList.remove('win-modal-active');
    }

    /**
    * @description Creates and starts timer. Saves timer in gameTimer variable to be able to stop it later. Timer updates every second.
    */
    function startTimer () {
        let hour = 0;
        let min = 0; 
        let sec = 0;

        timer.innerHTML = '00:00:00';

        gameTimer = setInterval(function() {
            sec++;
            if (sec == 60) {
                sec = 0;
                min++;
                if (min == 60) {
                    min = 0;
                    hour++;
                }
            }
            let secStr = (sec < 10) ? '0' + sec : sec;
            let minStr = (min < 10) ? '0' + min : min;
            let hourStr = (hour < 10) ? '0' + hour : hour;
            let time = hourStr + ':' + minStr + ':' + secStr;            
            timer.innerHTML = time;
        }, 1000);
    }
});

/**
* @description Shuffles array values
* @param {array} array
* @returns {array} Shuffled array
*/
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

