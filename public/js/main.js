
(function ($) {
    "use strict";

    /*[ Load page ]
    ===========================================================*/
    $(".animsition").animsition({
        inClass: 'fade-in',
        outClass: 'fade-out',
        inDuration: 1500,
        outDuration: 800,
        linkElement: '.animsition-link',
        loading: true,
        loadingParentElement: 'html',
        loadingClass: 'animsition-loading-1',
        loadingInner: '<div data-loader="ball-scale"></div>',
        timeout: false,
        timeoutCountdown: 5000,
        onLoadEvent: true,
        browser: [ 'animation-duration', '-webkit-animation-duration'],
        overlay : false,
        overlayClass : 'animsition-overlay-slide',
        overlayParentElement : 'html',
        transition: function(url){ window.location.href = url; }
    });
    
    /*[ Back to top ]
    ===========================================================*/
    var windowH = $(window).height()/2;

    $(window).on('scroll',function(){
        if ($(this).scrollTop() > windowH) {
            $("#myBtn").css('display','flex');
        } else {
            $("#myBtn").css('display','none');
        }
    });

    $('#myBtn').on("click", function(){
        $('html, body').animate({scrollTop: 0}, 300);
    });


    /*[ Show header dropdown ]
    ===========================================================*/
    $('.js-show-header-dropdown').on('click', function(){
        $(this).parent().find('.header-dropdown')
    });

    var menu = $('.js-show-header-dropdown');
    var sub_menu_is_showed = -1;

    for(var i=0; i<menu.length; i++){
        $(menu[i]).on('click', function(){ 
            
                if(jQuery.inArray( this, menu ) == sub_menu_is_showed){
                    $(this).parent().find('.header-dropdown').toggleClass('show-header-dropdown');
                    sub_menu_is_showed = -1;
                }
                else {
                    for (var i = 0; i < menu.length; i++) {
                        $(menu[i]).parent().find('.header-dropdown').removeClass("show-header-dropdown");
                    }

                    $(this).parent().find('.header-dropdown').toggleClass('show-header-dropdown');
                    sub_menu_is_showed = jQuery.inArray( this, menu );
                }
        });
    }

    $(".js-show-header-dropdown, .header-dropdown").click(function(event){
        event.stopPropagation();
    });

    $(window).on("click", function(){
        for (var i = 0; i < menu.length; i++) {
            $(menu[i]).parent().find('.header-dropdown').removeClass("show-header-dropdown");
        }
        sub_menu_is_showed = -1;
    });


     /*[ Fixed Header ]
    ===========================================================*/
    var posWrapHeader = $('.topbar').height();
    var header = $('.container-menu-header');

    $(window).on('scroll',function(){

        if($(this).scrollTop() >= posWrapHeader) {
            $('.header1').addClass('fixed-header');
            $(header).css('top',-posWrapHeader); 

        }  
        else {
            var x = - $(this).scrollTop(); 
            $(header).css('top',x); 
            $('.header1').removeClass('fixed-header');
        } 

        if($(this).scrollTop() >= 200 && $(window).width() > 992) {
            $('.fixed-header2').addClass('show-fixed-header2');
            $('.header2').css('visibility','hidden'); 
            $('.header2').find('.header-dropdown').removeClass("show-header-dropdown");
            
        }  
        else {
            $('.fixed-header2').removeClass('show-fixed-header2');
            $('.header2').css('visibility','visible'); 
            $('.fixed-header2').find('.header-dropdown').removeClass("show-header-dropdown");
        } 

    });
    
    /*[ Show menu mobile ]
    ===========================================================*/
    $('.btn-show-menu-mobile').on('click', function(){
        $(this).toggleClass('is-active');
        $('.wrap-side-menu').slideToggle();
    });

    var arrowMainMenu = $('.arrow-main-menu');

    for(var i=0; i<arrowMainMenu.length; i++){
        $(arrowMainMenu[i]).on('click', function(){
            $(this).parent().find('.sub-menu').slideToggle();
            $(this).toggleClass('turn-arrow');
        })
    }

    $(window).resize(function(){
        if($(window).width() >= 992){
            if($('.wrap-side-menu').css('display') == 'block'){
                $('.wrap-side-menu').css('display','none');
                $('.btn-show-menu-mobile').toggleClass('is-active');
            }
            if($('.sub-menu').css('display') == 'block'){
                $('.sub-menu').css('display','none');
                $('.arrow-main-menu').removeClass('turn-arrow');
            }
        }
    });


    /*[ remove top noti ]
    ===========================================================*/
    $('.btn-romove-top-noti').on('click', function(){
        $(this).parent().remove();
    })



    /* Find category to highlight and highlight
    ===========================================================*/
    let url = window.location.href;
    if (url.includes('clearance')) { $('a[href*="/category/clearance"]').addClass('active-category') }
    if (url.includes('bestsellers')) { $('a[href*="/category/bestsellers"]').addClass('active-category') }
    if (url.includes('appliances')) { $('a[href*="/category/appliances"]').addClass('active-category') }
    if (url.includes('auto')) { $('a[href*="/category/auto"]').addClass('active-category') }
    if (url.includes('baby')) { $('a[href*="/category/baby"]').addClass('active-category') }
    if (url.includes('clothing')) { $('a[href*="/category/clothing"]').addClass('active-category') }
    if (url.includes('computers')) { $('a[href*="/category/computers"]').addClass('active-category') }
    if (url.includes('electronics')) { $('a[href*="/category/electronics"]').addClass('active-category') }
    if (url.includes('games')) { $('a[href*="/category/games"]').addClass('active-category') }
    if (url.includes('health')) { $('a[href*="/category/health"]').addClass('active-category') }
    if (url.includes('home')) { $('a[href*="/category/home"]').addClass('active-category') }
    if (url.includes('jewelry')) { $('a[href*="/category/jewelry"]').addClass('active-category') }
    if (url.includes('kitchen')) { $('a[href*="/category/kitchen"]').addClass('active-category') }
    if (url.includes('pets')) { $('a[href*="/category/pets"]').addClass('active-category') }
    if (url.includes('smarthome')) { $('a[href*="/category/smarthome"]').addClass('active-category') }
    if (url.includes('sports')) { $('a[href*="/category/sports"]').addClass('active-category') }
    if (url.includes('toys')) { $('a[href*="/category/toys"]').addClass('active-category') }

     /* Change sort order
    ===========================================================*/
    const $sortBox = $('.sorting');
    // find the position of the last /, the sort order is the number just before; either 0 or 1
    const sortOrderPosition = url.lastIndexOf('/') - 1; 
    const currentSortOrder = url[sortOrderPosition];
    const priceRangePosition = url.lastIndexOf('/') - 3; 
    const currentPriceRange = url[priceRangePosition];
    let newUrl = url;

    $sortBox.change(() => {

      let sortBoxText = $('.sorting option:selected').text();

      if (sortBoxText.includes('%') && !(currentSortOrder === '0')) {
        newUrl = url.substr(0, sortOrderPosition) + `0` + '/1';     
        window.location.href = newUrl;
      }

      if (sortBoxText.includes('$') && !(currentSortOrder === '1')) {
        newUrl = url.substr(0, sortOrderPosition) + `1` + '/1';     
        window.location.href = newUrl;
      }
    });

    /* Change price range
    ===========================================================*/
    const $priceBox = $('.price');

    $priceBox.change(() => {
      
      let priceRangeText = $('.price option:selected').text();

      if (priceRangeText.includes('Price') && !(currentPriceRange === '0')) {
        newUrl = url.substr(0, priceRangePosition) + `0/${currentSortOrder}` + '/1';     
        window.location.href = newUrl;
      }
      if (priceRangeText.includes('$0.00') && !(currentPriceRange === '1')) {
        newUrl = url.substr(0, priceRangePosition) + `1/${currentSortOrder}` + '/1';     
        window.location.href = newUrl;
      }
      if (priceRangeText.includes('$20.00 -') && !(currentPriceRange === '2')) {
        newUrl = url.substr(0, priceRangePosition) + `2/${currentSortOrder}` + '/1';     
        window.location.href = newUrl;
      }
      if (priceRangeText.includes('$50.00 -') && !(currentPriceRange === '3')) {
        newUrl = url.substr(0, priceRangePosition) + `3/${currentSortOrder}` + '/1';     
        window.location.href = newUrl;
      }
      if (priceRangeText.includes('$100.00 -') && !(currentPriceRange === '4')) {
        newUrl = url.substr(0, priceRangePosition) + `4/${currentSortOrder}` + '/1';     
        window.location.href = newUrl;
      }
      if (priceRangeText.includes('$200.00+') && !(currentPriceRange === '5')) {
        newUrl = url.substr(0, priceRangePosition) + `5/${currentSortOrder}` + '/1';     
        window.location.href = newUrl;
      }
    });

    $('.search').on('submit', (evt) => {
      evt.preventDefault();
      console.log('prevented!');

    });
    

})(jQuery);