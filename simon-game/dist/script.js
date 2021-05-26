$(document).ready(function(){
  var jsGame = function(){
    var stepCountToWin = 20;
    var switchedOn = false;
    var started = false;
    var strictMode = false;
    var notes;
    var sounds = [
      "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",
      "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",
      "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",
      "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
    ]
    sounds = sounds.map(function(url){
      var audio = new Audio(url);
      return audio;
    })
    var disableNotes = function(){
      for(var i = 0; i < notes.length; i++){
        notes[i].addClass("disabled");
      }
    }
    var enableNotes = function(){
      for(var i = 0; i < notes.length; i++){
        notes[i].removeClass("disabled");
      }
    }
    var playing = false;
    var playSound = function(number){
      sounds[number].play();
    }
    var showNote = function(number){
      notes[number].toggleClass("on");
      playSound(number);
      var delay = setTimeout(function(){
        notes[number].toggleClass("on");
      },500);
    };
    var steps = [];
    var playerSteps = [];
    var generateNextStep = function(){
      steps.push(Math.floor(Math.random() * 4));
    };
    var playSequence = function(){
      playing = true;
      var i = 0;
      var repeat 
      repeat = setInterval(function(){
        if (i < steps.length){
          showNote(steps[i++]);
        }
        else{
          clearInterval(repeat);
          playing=false;
          enableNotes();
        }
      },800);
    };
    var refreshCounter = function(){
      var count = steps.length;
      if (count < 10){
        count= "0"+count;
      }
      $(".counter .value").text(count);
    };
    var wrongSequence = function(){
      var i = 0;
      var blink = function (i){
        if(started){
          $(".counter .wrongvalue").fadeIn({
            complete: function(){
              if(started){
                $(".counter .wrongvalue").fadeOut({
                  complete: function(){
                    if(started && i < 3){
                      i++;
                      blink(i);
                    }
                  }
                });
              }
            }
          });
        }
      };
      blink(i);
    };
    var next = function(){
      generateNextStep();
      refreshCounter()
      playSequence();
    }
    var reset = function(){
      started = false;
      steps = [];
      playerSteps=[];
      $(".counter .value").text("--");
      $(".counter .wrongvalue").hide();
    }
    var check = function(number){
      disableNotes();
      showNote(number);
      playerSteps.push(number);
      var rightNotesCount = playerSteps.reduce(function(result, value, index){
        if (value == steps[index]){
          return result+1;
        }
        return result;
      }, 0);
      if (rightNotesCount == stepCountToWin){
        setTimeout(function(){
          $(".winner").fadeIn();
          setTimeout(function(){
              reset();
              $(".winner").fadeOut();
            },2000);
          }, 1000);
      }
      else if(rightNotesCount == steps.length){
        playerSteps=[];
        setTimeout(next, 1200);
      }
      else if (rightNotesCount!=playerSteps.length){
        wrongSequence();
        playerSteps=[];
        if(strictMode){
          steps = [];
          setTimeout(next, 1200);
        }
        else {
          setTimeout(playSequence, 1200);
        }
      }
      else{
        enableNotes();
      }
    }
    
    
    this.start = function(){
      next();
      enableNotes();
      started = !started;
    };
    this.strict = function(){
      strictMode = !strictMode;
    }
    this.switch = function(){
      switchedOn = !switchedOn;
      if (!switchedOn){
        reset();
      }
    }
    this.isOn = function(){
      return switchedOn;
    }
    this.isStarted = function(){
      return started;
    }
    this.play = check;
    this.setNotes = function(value){
      notes = $(value);
    }
  }
  var game = new jsGame();
  game.setNotes([$(".game .note#0"), $(".game .note#1"), $(".game .note#2"), $(".game .note#3")]);
  $(".switch").click(function(){
    game.switch();
    $(".counter").toggleClass("on");
    $(".switch").toggleClass("on");
  });
  $(".start .button").click(function(){
    if(game.isOn() && !game.isStarted()){
      game.start();
    }
  });
  $(".strict .button").click(function(){
    if(game.isOn()){
      $(".strict .lamp").toggleClass("on");
      game.strict();
    }
  });
  
  $(".game .note").click(function(){
    if(!$(this).hasClass("disabled")){
      game.play($(this).attr("id"));
    }
  });
});