(function ($) {
	"use strict";

	// Navbar on scrolling
	$(window).scroll(function () {
		if ($(this).scrollTop() > 200) {
			$('.navbar-home').fadeIn('slow').css('display', 'flex');
		} else {
			$('.navbar-home').fadeOut('slow').css('display', 'none');
		}
	});


	// Smooth scrolling on the navbar links
	$(".navbar-nav a").on('click', function (event) {
		if (this.hash !== "") {
			event.preventDefault();

			$('html, body').animate({
				scrollTop: $(this.hash).offset().top - 45
			}, 1500, 'easeInOutExpo');

			if ($(this).parents('.navbar-nav').length) {
				$('.navbar-nav .active').removeClass('active');
				$(this).closest('a').addClass('active');
			}
		}
	});


	// Typed Initiate
	if ($('.typed-text-output').length == 1) {
		var typed_strings = $('.typed-text').text();
		var typed = new Typed('.typed-text-output', {
			strings: typed_strings.split(', '),
			typeSpeed: 100,
			backSpeed: 20,
			smartBackspace: false,
			loop: true
		});
	}


	// Modal Video
	$(document).ready(function () {
		var $videoSrc;
		$('.btn-play').click(function () {
			$videoSrc = $(this).data("src");
		});
		console.log($videoSrc);

		$('#videoModal').on('shown.bs.modal', function (e) {
			$("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
		})

		$('#videoModal').on('hide.bs.modal', function (e) {
			$("#video").attr('src', $videoSrc);
		})
	});


	// Scroll to Bottom
	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			$('.scroll-to-bottom').fadeOut('slow');
		} else {
			$('.scroll-to-bottom').fadeIn('slow');
		}
	});


	// Skills
	$('.skill').waypoint(function () {
		$('.progress .progress-bar').each(function () {
			$(this).css("width", $(this).attr("aria-valuenow") + '%');
		});
	}, { offset: '80%' });

  var categoryFilter = '*', techFilter = '*';
  var $container = $('.portfolio-container').isotope({
    itemSelector: '.portfolio-item',
    layoutMode: 'fitRows',
    transitionDuration: '0.4s'
  });

  function applyCombinedFilters() {
    // build filter selector for projects
    var filterString;
    if (categoryFilter === '*' && techFilter === '*') filterString = '*';
    else if (categoryFilter === '*') filterString = techFilter;
    else if (techFilter === '*') filterString = categoryFilter;
    else filterString = techFilter.split(',').map(function(t) {
      return categoryFilter + t;
    }).join(',');

    // count matching project items (exclude no-results)
    var matchCount = $container.find('.portfolio-item').not('.no-results').filter(filterString).length;

    // use isotope filter function to show projects and conditionally show no-results
    $container.isotope({
      filter: function() {
        var $this = $(this);
        if ($this.is('.no-results')) {
          // show only when no projects match
          return matchCount === 0;
        }
        return $this.is(filterString);
      }
    });
  }

  // Category filter click
  $('#portfolio-flters').on('click', 'li', function() {
    $('#portfolio-flters li').removeClass('active');
    $(this).addClass('active');
    categoryFilter = $(this).data('filter');
    applyCombinedFilters();
  });

  // Tech stack multi-select
  $('#tech-flters').on('click', 'li', function() {
    var $this = $(this), val = $this.data('filter');
    if (val === '*') {
      $('#tech-flters li').removeClass('active');
      $this.addClass('active'); techFilter = '*';
    } else {
      $this.toggleClass('active');
      $('#tech-flters li[data-filter="*"]').removeClass('active');
      var active = $('#tech-flters li.active').map(function(){ return $(this).data('filter'); }).get();
      techFilter = active.length ? active.join(',') : '*';
      if (techFilter === '*') $('#tech-flters li[data-filter="*"]').addClass('active');
    }
    applyCombinedFilters();
  });

  // initial layout
  $(window).on('load', applyCombinedFilters);


	// Back to top button
	$(window).scroll(function () {
		if ($(this).scrollTop() > 200) {
			$('.back-to-top').fadeIn('slow');
		} else {
			$('.back-to-top').fadeOut('slow');
		}
	});
	$('.back-to-top').click(function () {
		$('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
		return false;
	});


	// Testimonials carousel
	$(".testimonial-carousel").owlCarousel({
		autoplay: true,
		smartSpeed: 1500,
		dots: true,
		loop: true,
		items: 1
	});





})(jQuery);

