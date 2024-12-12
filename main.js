// **Instructions main.js**
$(function() {

  // **Parameters**
  function set_settings() {
    window.settings = [];

    // **Number of Avatar Images**
    settings.numberofavatars = 37;

    // **Task length (in ms)**
    settings.tasklength = 180000;

    // **Number of likes**
    settings.condition_1_likes = [12000, 9999999]; // Condition 1 (Exclusion)
    settings.condition_2_likes = [10000, 15000, 35000, 80000, 1320000, 150000]; // Condition 2 (Inclusion)

    // **Others' likes**
    settings.condition_1_adjusted_likes = [12000, 14000, 15000, 35000, 80000, 100000, 110000, 150000, 20000];
    settings.condition_2_adjusted_likes = [12000, 14000, 15000, 35000];

    // **Likes by**
    settings.likes_by = ['John','Anna','Sarah','Felix','Janine','Georg','Niki','Lisa','Ky'];
  }

  // **Intro Slide**
  function init_intro() {
    $('#intro').show();
    $('#submit_intro').on('click',function() {
        $('#intro').hide();
        init_name();
    });
  }

  // **Username Slide**
  function init_name() {
    $('#name').show();

    $('#submit_username').on('click',function() {
        var error = 0;
        var uname = $('#username').val();

        if(uname == "") {
            error = 1;
            errormsg = 'Bitte Text eingeben';
            uname = "undefined";
        }
        if(not_alphanumeric(uname)) {
            error = 1;
            errormsg = 'Bitte nur Buchstaben (keine Leerzeichen)';
        }

        if(error == 0) {
            $('#name').hide();
            window.username = $('#username').val();
            init_avatar();
        } else {
            alertify.log(errormsg,"error");
        }
    });
  }

  // **Avatar Selection Slide**
  function init_avatar() {
    $('#avatar').show();

    var avatars = window.settings.numberofavatars;    
    for(var i=1; i<avatars; i++) { 
        $('.avatars').append('<img id="avatar_' + i+ '" src="avatars/avatar_' + i + '.png" class="avatar" />');
    }

    $('.avatar').on('click', function() {
        $('.avatar').removeClass('selected');
        $(this).addClass('selected');
    });

    $('#submit_avatar').on('click',function() {
        if($('.selected').length == 1) {
            $('#avatar').hide();
            window.avatar = $('.selected').attr('id');
            window.avatarexport = /avatar_([^\s]+)/.exec(window.avatar)[1];
            init_text();
        } else {
            alertify.log("Bitte wählen Sie einen Avatar aus","error");
        }
    });
  }

  // **Text Input Slide**
  function init_text() {
    $('#text').show();

    $("#description").keyup(function(){
        $("#count").text("Characters left: " + (400 - $(this).val().length));
    });

    $('#submit_text').on('click',function() {
        var error = 0;
        if($('#description').val() == "") {
            error = 1;
            errormsg = 'Bitte Text eingeben...';
        }
        if($('#description').val() !== "" && $('#description').val().length < 140) {
            error = 1;
            errormsg = 'Schreibe etwas mehr';
        }
        if($('#description').val().length > 401) {
            error = 1;
            errormsg = 'Bitte weniger Text';
        }
        if(error == 0) {
            $('#text').hide();
            window.description = $('#description').val();
            init_fb_intro();
        } else {
            alertify.log(errormsg,"error");
        }
    });
  }

  // **Experiment Task Slide**
  function init_task() {
    $('#task').show();
    shortcut.add("Backspace",function() {});

    jQuery("#countdown").countDown({
        startNumber: window.settings.tasklength / 1000,
        callBack: function(me) {
            console.log('over');
            $('#timer').text('00:00');
        }
    });

    // Handle likes in the task
    $('.userslikes').each(function() {
        var that = $(this);
        var usernames = $(this).data('usernames').split(",");
        var times = $(this).data('likes').split(",");

        for(var i=0; i<times.length; i++) { 
            times[i] = +times[i];
            themsg = usernames[i] + " liked your post";

            setTimeout(function(themsg) {
                that.text(parseInt(that.text()) + 1);
                alertify.success(themsg)
            }, times[i], themsg);
        }
    });

    // When the user clicks "Continue" at the end of the experiment
    $('#final-continue').on('click', function() {
        console.log("Continue button clicked. Closing the tab.");

        // **Schließen des Tabs ohne Weiterleitung**
        window.close(); // Dies schließt das aktuelle Experiment-Tab
    });

    // Timing and countdown for the task
    setTimeout(function() {
        $('#final-continue').show();
    }, window.settings.tasklength);
  }

  // **Finish Experiment:**
  function finishExperiment() {
    setTimeout(() => {
        if (window.opener && !window.opener.closed) {
            // **Schließen des Tabs ohne Weiterleitung**
            window.close(); // Schließt das Experiment-Tab
        }
    }, 1000); // 1 Sekunde Verzögerung für Sicherheit
  }

  // Helper function for alphanumeric validation
  function not_alphanumeric(inputtxt) {
    var letterNumber = /^[0-9a-zA-Z]+$/;
    if(inputtxt.match(letterNumber)) {
        return false;
    } else { 
        return true; 
    }
  }

  // Initialize the intro slide
  init_intro();

});
