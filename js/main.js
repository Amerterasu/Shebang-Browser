$('body').append('<div class="bash moveable"></div>');
$('.bash').append('<div class="window"></div>');
$('.bash .window').append('<div class="header"></div>');

$('.bash .window .header').append('<a href="#" class="bash-button close"></a>');
$('.bash .window .header').append(
  '<a href="#" class="bash-button disabled min"></a>'
);
$('.bash .window .header').append('<a href="#" class="bash-button max"></a>');
$('.bash .window .header').append('<br/>');
$('.bash .window').append('<div class="terminal"></div>');

$('.bash').hide();

var movable = document.querySelector('.bash.moveable');
var historyText = [];
function dragMoveListener(event) {
  var target = event.target,
    // keep the dragged position in the data-x/data-y attributes
    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform = target.style.transform =
    'translate(' + x + 'px, ' + y + 'px)';

  // update the posiion attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

// target elements with the "draggable" class
interact(movable).draggable({
  // enable inertial throwing
  inertia: true,
  // keep the element within the area of it's parent
  restrict: {
    restriction: 'parent',
    endOnly: true,
    elementRect: {
      top: 0,
      left: 0,
      bottom: 1,
      right: 1
    }
  },
  // enable autoScroll
  autoScroll: true,

  // call this function on every dragmove event
  onmove: dragMoveListener
});

var container = document.querySelector('.bash');

// list of commands
var commands = {
  grunt: function(bash, next) {
    bash.post(
      'Running "jshint:gruntfile" (jshint) task',
      0,
      false,
      true,
      bash.post(
        '>> 1 file lint free.',
        500,
        false,
        true,
        bash.post(
          '&nbsp;',
          600,
          false,
          true,
          bash.post(
            'Running "uglify:dist" (uglify) task',
            700,
            false,
            true,
            bash.post(
              'Running "uglify:dist" (uglify) task',
              700,
              false,
              true,
              bash.post(
                'File "dist/scripts.min.js" created.',
                1600,
                false,
                true,
                bash.post(
                  'Uncompressed size: 389 bytes.',
                  1800,
                  false,
                  true,
                  bash.post(
                    '&nbsp;',
                    1900,
                    false,
                    true,
                    bash.post(
                      'Done, without errors.',
                      2000,
                      false,
                      true,
                      function() {
                        return next();
                      }
                    )
                  )
                )
              )
            )
          )
        )
      )
    );
  },
  ls: function(bash, next) {
    bash.post(
      'Documents Pictures		VirtualBox		VM Desktop\n Google Drive		Music			Udemy			curc-bench		nltk_data',
      0,
      false,
      true,
      function() {
        return next();
      }
    );
  },
  'touch test.txt': function(bash, next) {
    bash.post(
      'Documents Pictures		VirtualBox		VM Desktop\n Google Drive		Music			Udemy			curc-bench		nltk_data\n test.txt',
      0,
      false,
      true,
      function() {
        return next();
      }
    );
  },
  'rm test.txt': function(bash, next) {
    bash.post(
      'Documents Pictures		VirtualBox		VM Desktop\n Google Drive		Music			Udemy			curc-bench		nltk_data',
      0,
      false,
      true,
      function() {
        return next();
      }
    );
  }
};

// new bash instance
var bsh = new Bash(container, {
  name: 'grunt',
  prompt: '$',
  commandList: commands
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.show) {
    $('.bash').show();
  }
  // make sure that the request is being executed inside of terminal
  var text = request.text;
  if (text in commands) {
    // get the corresponding response
    var commandFunction = commands[text];
    commandFunction(bsh, function() {
      bsh.reset();
    });
    chrome.storage.sync.get('history', function(response) {
      historyText = response.history;
    });
    historyText.push(text);
    chrome.storage.sync.set({ history: historyText });
  } else {
    bsh.reset();
  }
  sendResponse({
    status: 'Ok'
  });
});

$('.bash-button.close').click(function() {
  $('.bash').hide();
});

$('.bash-button.max').click(function() {
  $('.bash').hide();
  // something to transfer the bash history
  // terminal_tab = chrome.extension.getURL('terminal_tab.html');
  // console.log(chrome.extension.getURL('terminal_tab.html'));
  // window.open(terminal_tab);
  // send a message to background.js saying to open a new tab
  // background.js will open terminal_tab.html
  // somehow either terminal_tab (main.js) or background.js will pull chrome.storage.sync the bash history
  chrome.runtime.sendMessage(
    {
      tabOpened: true
    },
    function() {
      console.log('sending message to open new tab');
    }
  );
});
