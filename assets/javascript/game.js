game = {
    key             :"",
    wins            : 0,
    losses          : 0,
    tries           : 0,
    winsInRow       : 0,
    stage           : 0,                // 0:initial-point, 1:game-setting, 2:user-guessing, 3:win-lose
    emptySpace      : "_",
    gameWords       : [ "tomato","potato","ginger","broccoli","beans","cucumber",
                        "lettuce","cabbage","okra","eggplant","carrot","zucchini",
                        "cawflower","onion","corn","pepper","garlic","radish",
                        "turnip","Beet","parsley","mint","rosemary","thyme",
                        "pumpkin","spinach","mushrooms","cinnamon","chickpea"],
    playedWords     : [],               //indexes of all played words
    guessWord       : "",
    guessLetters    : [],
    triedLetters    : [],
    revealedLetters : [],
    disable_btn     : false,
    container       : document.createElement("div"),
    heading         : document.createElement("p"),
    wordBox         : document.createElement("p"),
    img             : document.createElement("div"),
    info            : {
        box     : document.createElement("div"),
        class   : ["info-content"],
        id      : ["tries","wins","winsInRow","losses","triedLetters"],
        obj     : [],
    },
    difficulty      :{
        value   : 1,
        box     : document.createElement("div"),
        obj     : [],
        name    : ["Hard", "Medium", "Easy"],
        class : ["difficulty-option hard-clr","difficulty-option medium-clr","difficulty-option easy-clr"],
    },
    getRandom           : function(max){
        return Math.floor(Math.random() * Math.floor(max));
    },
    defineGameElements  : function(){
        //adding classes to the game elements
        this.container.setAttribute("class", "main-container");
        this.heading.setAttribute("class", "heading");
        this.heading.innerText = "Vegetable Guessing Game!";
        this.wordBox.setAttribute("class", "word-box");
        //img definition
        this.img.setAttribute("class", "game-img");
        this.img.style.backgroundImage = "url(./assets/images/vegetables" + (this.getRandom(9)) + ".jpg)";
        //infoBox definition
        this.info.box.setAttribute("class", "info-box");
        //difficultyBox definition
        this.difficulty.box.setAttribute("class", "difficulty-box");
        for(var i=0; i<this.info.id.length; i++){
            this.info.obj[i] = document.createElement("p");
            this.info.obj[i].setAttribute("class", this.info.class);
            this.info.obj[i].setAttribute("id", this.info.id[i]);
            this.info.obj[i].innerText = this.info.id[i] + ": " + this[this.info.id[i]];
            this.info.box.appendChild(this.info.obj[i]);
        }
        for(var i=0; i<3; i++){
            this.difficulty.obj[i] = document.createElement("button");
            this.difficulty.obj[i].setAttribute("class", this.difficulty.class[i]);
            this.difficulty.obj[i].innerText = this.difficulty.name[i];
            this.difficulty.obj[i].setAttribute("onclick", "game.updateDifficulty(this.innerText);");
            this.difficulty.box.appendChild(this.difficulty.obj[i]);
        }
        this.container.appendChild(this.heading);
        this.container.appendChild(this.img);
        this.container.appendChild(this.wordBox);
        this.container.appendChild(this.difficulty.box);
        this.container.appendChild(this.info.box);
        document.body.prepend(this.container);
    },
    reset           : function(reset_the_game){
        if(reset_the_game){
            this.playedWords = [];
            this.wins       = 0;
            this.losses     = 0;
            this.winsInRow  = 0;
        }
        this.heading.innerHTML = "Vegetable Guessing Game!<p>Select Difficulty >>> Press ENTER To Start</p>";
        this.heading.setAttribute("class", "heading");
        this.updateDifficulty();
        this.getNewWord();
        this.updateInfo();
        this.disable_btn = false;
        this.stage      = 1;
    },
    updateDifficulty    : function(text){
        //[value,tries]---> Hard:[1,10] , Medium:[2,15], Easy:[3,20]
        if(this.disable_btn === false){
            if(typeof(text) === "undefined"){
                var selected_difficulty = this.difficulty.name[this.difficulty.value];
            }else{
                var selected_difficulty = text;
            }
            for(var i=0; i<3; i++){
                if(selected_difficulty[0].toLowerCase() === this.difficulty.name[i][0].toLowerCase()){
                    this.difficulty.obj[i].setAttribute("class", this.difficulty.class[i] + " selected");
                    this.difficulty.value = i;
                }else{
                    this.difficulty.obj[i].setAttribute("class", this.difficulty.class[i]);
                }
            }
                this.tries = (this.difficulty.value + 2)*5;
                this.updateInfo();
        }
    },
    getNewWord      : function(){
        if(this.revealedLetters.length > 0 || this.stage === 0){
            this.guessWord = this.gameWords[this.getRandom(this.gameWords.length)].toLowerCase();
            this.playedWords[this.playedWords.length] = this.gameWords.indexOf(this.guessWord);
            this.explodeWord();
            this.triedLetters = [];
            this.revealedLetters = [];
            if(this.difficulty.value === 2){    //for easy mode
                this.triedLetters[0] = this.guessLetters[0];
            }
        }
    },
    explodeWord     : function(){
        this.guessLetters = [];
        for(var i = 0; i < this.guessWord.length; i++){
            this.guessLetters[this.guessLetters.length] = this.guessWord[i];
        }
    },
    checkLetter     : function(){
        if(this.key.charCodeAt(0) >= 97 && this.key.charCodeAt(0) <= 122 && this.key.length === 1){
            if(this.triedLetters.indexOf(this.key) === -1){
                this.triedLetters[this.triedLetters.length] = this.key;
                if(this.guessLetters.indexOf(this.key) === -1 && this.tries > 0){
                    this.tries--;
                }
            }
        }
        this.key = "";
    },
    updateInfo   : function(){
        for(var i=0; i<this.info.id.length; i++){
                this.info.obj[i].innerText = this.info.id[i] + ": " + this[this.info.id[i]];
        }
        var content = "";
        for(var i=0; i<this.guessLetters.length; i++){
            if(this.triedLetters.indexOf(this.guessLetters[i]) === -1){
                this.revealedLetters[i] = this.emptySpace;
            }else{
                this.revealedLetters[i] = this.guessLetters[i];
            }
            content += this.revealedLetters[i];
        }
        this.wordBox.innerText = content;

    },
    is_revealed     : function(){
        return (this.revealedLetters.indexOf(this.emptySpace) === -1 && this.revealedLetters.length > 0) ? true : false;
    },
    run             : function(){
        switch(this.stage){

            case 1://setting-up the game
                if(this.key.toLowerCase() === 'enter'){
                    this.heading.setAttribute("class", "heading");
                    this.heading.innerHTML = "Vegetable Guessing Game<br/>Guessing Time!";
                    if(this.tries === 0){
                        this.updateDifficulty();
                    }
                    this.disable_btn = true;
                    this.getNewWord();
                    this.updateInfo();
                    this.stage = 2;
                }else{
                    if(this.key.toLowerCase() === 'escape' && this.playedWords.length > 0){
                        this.reset();
                    }
                }
                break;

            case 2://In-guessing mode of the game
                this.checkLetter();
                this.updateInfo();
                
                if(this.is_revealed() === true){      // User got the word correctly!
                    this.wins++;
                    this.winsInRow++;
                    this.updateInfo();
                    this.heading.innerHTML = "You Just Got it Right!<br/>ENTER to continue | ESC to reset!";
                    this.heading.setAttribute("class", "heading success-mode");
                    this.stage = 1;
                }
                if(this.tries === 0){               // User didn't get the word correctly!
                    this.losses++;
                    this.winsInRow = 0;             // reset the in-row wins
                    this.updateInfo();
                    this.heading.innerHTML = "Oops, You didn't guess it<br> it's " + this.guessWord + "<br/>ENTER to continue | ESC to reset!";
                    this.heading.setAttribute("class", "heading fail-mode");
                    this.disable_btn = false;
                    this.stage = 1;
                }
                break;
        }
    },
}
document.onkeyup = function(event) {
    game.key = event.key.toLowerCase();
    game.run();
};
game.defineGameElements();
game.reset();