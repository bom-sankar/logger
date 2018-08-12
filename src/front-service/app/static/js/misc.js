(function($) {
  'use strict';
  setTimeout(function() {
            $('#flashMessages').fadeOut('fast');
            }, 5000);

  /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .form-control');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        return check;
    });


    setTimeout(function() {
            $('#flashMessages').fadeOut('fast');
            }, 5000);

    $('.validate-form .form-control').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else if($(input).attr('type') == 'ph_no' || $(input).attr('name') == 'ph_no') {
                if($(input).val().trim().match(/^[7-9]{1}[0-9]{9}$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();
        console.log(thisAlert)
        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();
        console.log(thisAlert)
        $(thisAlert).removeClass('alert-validate');
    }

  $(function() {
    var body = $('body');
    var contentWrapper = $('.content-wrapper');
    var scroller = $('.container-scroller');
    var footer = $('.footer');
    var sidebar = $('.sidebar');

    //Add active class to nav-link based on url dynamically
    //Active class can be hard coded directly in html file also as required
    var current_temp = location.pathname.split("/")
    var current = current_temp[current_temp.length-2].replace(/^\/|\/$/g, '');
    $('.nav li a', sidebar).each(function(){
        var $this = $(this);
        if(current === "dashboard") {
          //for root url
          if($this.attr('href').indexOf("/dashboard/") !== -1){
              $(this).parents('.nav-item').last().addClass('active');
              console.log($(this).parents('.nav-item').last());
              if ($(this).parents('.sub-menu').length) {
                $(this).closest('.collapse').addClass('show');
                $(this).addClass('active');
              }
          }
        }
        else {
          //for other url
          if($this.attr('href').indexOf(current) !== -1){
              $(this).parents('.nav-item').last().addClass('active');
              console.log('inside ther url');
              console.log($(this).parents('.nav-item').last());
              if ($(this).parents('.sub-menu').length) {
                $(this).closest('.collapse').addClass('show');
                $(this).addClass('active');
              }
          }
        }
    })

    //Close other submenu in sidebar on opening any

    sidebar.on('show.bs.collapse','.collapse', function() {
      sidebar.find('.collapse.show').collapse('hide');
    });


    //Change sidebar and content-wrapper height
    applyStyles();
    function applyStyles() {

      //setting content wrapper height
      if(!(body.hasClass("horizontal-menu") && window.matchMedia('(min-width: 992px)').matches)) {
        setTimeout(function(){
          if(contentWrapper.outerHeight() < (sidebar.outerHeight() - footer.outerHeight())) {
            contentWrapper.css({
              'min-height':sidebar.outerHeight() - footer.outerHeight()
            });
          }

          if(sidebar.outerHeight() < (contentWrapper.outerHeight() + footer.outerHeight())) {
            sidebar.css({
              'min-height':contentWrapper.outerHeight() + footer.outerHeight()
            });
          }

        }, 1000);
      }
      else {
        contentWrapper.css({
          'min-height':'100vh'
        });
      }

      //Applying perfect scrollbar
      if(!body.hasClass("rtl")) {
        $('.settings-panel .tab-content .tab-pane.scroll-wrapper, ul.chats, .product-chart-wrapper').perfectScrollbar();
        if(body.hasClass("sidebar-fixed")) {
          $('#sidebar .nav').perfectScrollbar();
        }
      }
    }

    $('.sidebar [data-toggle="collapse"]').on("click", function(event) {
      if(!(body.hasClass('sidebar-icon-only')||body.hasClass('horizontal-menu'))) {
        //Updating content wrapper height to sidebar height on expanding a menu in sidebar
        var clickedItem = $(this);
        console.log(clickedItem);
        if(clickedItem.attr('aria-expanded') === 'false') {
          var scrollTop = scroller.scrollTop() - 20;
        }
        else {
          var scrollTop = scroller.scrollTop() - 100;
        }
        setTimeout(function(){
            if(contentWrapper.outerHeight()+ footer.outerHeight()!== sidebar.outerHeight()) {
              applyStyles();
              scroller.animate({ scrollTop: scrollTop }, 350);
            }
        }, 400);
      }
      else {
        //Disable click on sidebar menu item when sidebar icon only mode or horizontal menu mode is in use
        //to avoid ambiguity of mixed hover and click on menu item
        return false;
      }
    })
    $('[data-toggle="minimize"]').on("click", function () {
      if((body.hasClass('sidebar-toggle-display'))||(body.hasClass('sidebar-absolute'))) {
        body.toggleClass('sidebar-hidden');
        applyStyles();
      }
      else {
        body.toggleClass('sidebar-icon-only');
        applyStyles();
      }
    });

    //checkbox and radios
    $(".form-check label,.form-radio label").append('<i class="input-helper"></i>');

    //fullscreen
    $("#fullscreen-button").on("click",function toggleFullScreen() {
      if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
          if (document.documentElement.requestFullScreen) {
              document.documentElement.requestFullScreen();
          } else if (document.documentElement.mozRequestFullScreen) {
              document.documentElement.mozRequestFullScreen();
          } else if (document.documentElement.webkitRequestFullScreen) {
              document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
          } else if (document.documentElement.msRequestFullscreen) {
              document.documentElement.msRequestFullscreen();
          }
      }
      else {
          if (document.cancelFullScreen) {
              document.cancelFullScreen();
          } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
          } else if (document.webkitCancelFullScreen) {
              document.webkitCancelFullScreen();
          } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
          }
      }
    })
  });

  /*==================================================================
    [ Show pass ]*/
    var showPass = 0;
    $('.btn-show-pass').on('click', function(){
        if(showPass == 0) {
            $(this).next('input').attr('type','text');
            $(this).find('i').removeClass('mdi-eye');
            $(this).find('i').addClass('mdi-eye-off');
            showPass = 1;
        }
        else {
            $(this).next('input').attr('type','password');
            $(this).find('i').addClass('mdi-eye');
            $(this).find('i').removeClass('mdi-eye-off');
            showPass = 0;
        }

    });
})(jQuery);
