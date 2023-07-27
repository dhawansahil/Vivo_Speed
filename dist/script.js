;(function($) {

  // Function to handle file upload
  function handleFileUpload(fileInput) {
    const files = fileInput[0].files;
    // Here, you can perform actions with the selected files, such as uploading them to a server or displaying their names in the UI.
    // For demonstration purposes, let's display the selected file names in an element with the class 'file-names'.
    const $fileNamesElement = $('.file-names');
    $fileNamesElement.empty(); // Clear previous file names
    for (let i = 0; i < files.length; i++) {
      $fileNamesElement.append('<p>' + files[i].name + '</p>');
    }
  }

  // Function to handle the animation
  function playChartAnimation() {
    $('.bars li .bar').each(function (key, bar) {
      let percentage = $(this).data('percentage');
      $(this).animate({
        'height': percentage + '%'
      }, 1000);
      console.log(percentage);
    });
  }

  // Intersection Observer callback function
  function handleIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        playChartAnimation();
        observer.unobserve(entry.target); // Stop observing once the chart is visible
      }
    });
  }

  // Intersection Observer options
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // Percentage of visibility required to trigger the callback
  };

  // Create the Intersection Observer instance
  const chartObserver = new IntersectionObserver(handleIntersection, options);

  $.fn.customFile = function() {
    return this.each(function() {
      var $file = $(this).addClass('custom-file-upload-hidden'),
          $wrap = $('<div class="file-upload-wrapper">'),
          $input = $('<input type="text" class="file-upload-input" />'),
          $button = $('<button type="button" class="file-upload-button">Upload</button>'),
          $label = $('<label class="file-upload-button" for="'+ $file[0].id +'">Select a File</label>');

      $file.css({
        position: 'absolute',
        left: '-9999px'
      });

      $wrap.insertAfter( $file )
        .append( $file, $input, $button );

      $file.attr('tabIndex', -1);
      $button.attr('tabIndex', -1);

      $button.click(function () {
        $file.focus().click();
        
      });

      $file.change(function() {
        $input.val(this.value); // Set the value (filename) in the input text field
        $input.attr('title', this.value); // Show filename in the title tooltip
        $input.focus(); // Regain focus
        handleFileUpload($file); // Call the handleFileUpload function to process the selected files
      });

      $input.on({
        blur: function() { $file.trigger('blur'); },
        keydown: function( e ) {
          if ( e.which === 13 ) { // Enter
            $file.trigger('click');
          } else if ( e.which === 8 || e.which === 46 ) { // Backspace & Del
            // On some browsers the value is read-only
            // with this trick we remove the old input and add
            // a clean clone with all the original events attached
            $file.replaceWith( $file = $file.clone( true ) );
            $file.trigger('change');
            $input.val('');
          } else if ( e.which === 9 ) { // TAB
            return;
          } else { // All other keys
            return false;
          }
        }
      });

      chartObserver.observe(document.getElementById('myChart')); // Observe the chart container
    });
  };

  $( document ).on('change', 'input.customfile', function() {
    var $this = $(this),
      uniqId = 'customfile_'+ (new Date()).getTime(),
      $wrap = $this.parent(),
      $inputs = $wrap.siblings().find('.file-upload-input')
        .filter(function() { return !this.value }),
      $file = $('<input type="file" id="'+ uniqId +'" name="'+ $this.attr('name') +'"/>');

    setTimeout(function() {
      if ($this.val()) {
        if (!$inputs.length) {
          $wrap.after($file);
          $file.customFile();
        }
      } else {
        $inputs.parent().remove();
        $wrap.appendTo($wrap.parent());
        $wrap.find('input').focus();
      }
    }, 1);
  });

  $('input[type=file]').customFile();

})(jQuery);