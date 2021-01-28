let blackjackGame = {
    'you':{'scoreSpan':'#your-blackjack-result','div':'#your-box','score':0},
    'dealer':{'scoreSpan':'#dealer-blackjack-result','div':'#dealer-box','score':0},
    'cards':['2','3','4','5','6','7','8','9','10','A','Q','K','J'],
    'cardsMap':{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'Q':10,'K':10,'J':10,'A':[1,11]},
    'wins':0,
    'losses':0,
    'draws':0,
    'isHit':false,
    'isStand':false,
    'turnsOver':false,
}

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];

const hitSound = new Audio('./sounds/swish.m4a');
const winSound = new Audio('./sounds/cash.mp3');
const lostSound = new Audio('./sounds/aww.mp3');


document.querySelector("#blackjack-hit-button").addEventListener("click",blackjackHit);
document.querySelector("#blackjack-stand-button").addEventListener("click",dealerLogic);
document.querySelector("#blackjack-deal-button").addEventListener("click",blackjackDeal);


function blackjackHit(){
    if(!blackjackGame['isStand']){
        let card = randomCard();
        showCard(card,YOU);
        updateScore(card,YOU);
        showScore(YOU);
        blackjackGame['isHit'] =true;
    }
}

function updateScore(card,activePlayer){
    if(card=='A'){
        if(activePlayer['score'] + 11 <=21){
            activePlayer['score'] +=11;
        }else{
            activePlayer['score'] +=1;
        }
    }else{
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
}

function showScore(activePlayer){
    if(activePlayer['score'] > 21){
        document.querySelector(activePlayer['scoreSpan']).innerText = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color ='red';
        
    }else{
        document.querySelector(activePlayer['scoreSpan']).innerText = activePlayer['score'];
    }
}


function randomCard(){
    let randomIndex = Math.floor(Math.random()*13);
    return blackjackGame['cards'][randomIndex];
}

function showCard(card,activePlayer){
   if(activePlayer['score']<21){
        let cardImage = document.createElement("img");
        cardImage.src = `./images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
   }
}

function blackjackDeal(){
    if(blackjackGame['turnsOver']){
        let yourImages = document.querySelector("#your-box").querySelectorAll("img");
        let dealerImages = document.querySelector("#dealer-box").querySelectorAll("img");
    
        yourImages.forEach(item=>item.remove());
        dealerImages.forEach(item=>item.remove());
    
        YOU['score'] = 0;
        DEALER['score'] = 0 ;
        
        document.querySelector(YOU['scoreSpan']).innerText = 0;
        document.querySelector(DEALER['scoreSpan']).innerText = 0;
        document.querySelector(YOU['scoreSpan']).style.color = 'white';
        document.querySelector(DEALER['scoreSpan']).style.color = 'white';
    
        document.querySelector("#blackjack-result").textContent = 'Let\'s Play';
        document.querySelector("#blackjack-result").style.color = 'black';
        blackjackGame['isHit'] = false;
        blackjackGame['isStand'] = false;
        blackjackGame['turnsOver'] = false;
    }
}

function sleep(ms){
    return new Promise(resolve =>setTimeout(resolve,ms));
}



async function dealerLogic(){
    if(blackjackGame['isHit']){
        blackjackGame['isStand'] = true;
        while(DEALER['score']<16){
            const card =  randomCard();
            showCard(card,DEALER);
            updateScore(card,DEALER);
            showScore(DEALER);
            await sleep(700);
        }
        blackjackGame['turnsOver'] = true;
        showResult(computeWinner());
    }
}

function computeWinner(){
    let winner;

    if(YOU['score']<=21){
        if(YOU['score']>DEALER['score'] || DEALER['score']>21){
            winner = 'you';
        }else if(YOU['score']<DEALER['score']){
            winner = 'dealer';
        }else if(YOU['score'] === DEALER['score']){
            winner = 'none'
        }
    }else if(YOU['score']>21 && DEALER['score']<=21){
        winner = 'dealer'
    }else if(YOU['score']>21 && DEALER['score']>21){
        winner ='none';
    }
    return winner;
}


function showResult(winner){
    let message, messageColor;
    if(winner==='you'){
        message = 'YOU WON!';
        messageColor="green";
        winSound.play();
        blackjackGame['wins']++;
    }
    else if(winner==='dealer'){
        message = 'YOU LOST!';
        messageColor = 'red';
        lostSound.play();
        blackjackGame['losses']++;
    }
    else{
        message = 'YOU DREW!';
        messageColor = 'grey';
        blackjackGame['draws']++;
    }

    document.querySelector("#blackjack-result").textContent = message;
    document.querySelector("#blackjack-result").style.color  = messageColor;
    document.querySelector("#wins").innerText = blackjackGame['wins'];
    document.querySelector("#losses").innerText = blackjackGame['losses'];
    document.querySelector("#draws").innerText = blackjackGame['draws'];

}