// app.js

//–– 1) Global filter state ––
var categoryFilter = '*',
    techFilter     = '*',
    $container;

//–– 2) Builds and applies the combined filter to Isotope ––
function applyCombinedFilters() {
  var filterString;
  if (categoryFilter === '*' && techFilter === '*') {
    filterString = '*';
  } else if (categoryFilter === '*') {
    filterString = techFilter;
  } else if (techFilter === '*') {
    filterString = categoryFilter;
  } else {
    // combine each tech in the selected category
    filterString = techFilter
      .split(',')
      .map(function(t) { return categoryFilter + t; })
      .join(',');
  }

  // count how many real projects match
  var matchCount = $container
    .find('.portfolio-item')
    .not('.no-results')
    .filter(filterString)
    .length;

  // filter: show real items that match, or only the “no-results” placeholder
  $container.isotope({
    filter: function() {
      var $this = $(this);
      if ($this.is('.no-results')) {
        return matchCount === 0;
      }
      return $this.is(filterString);
    }
  });
}

//–– 3) Initialize Isotope on the container ––
function initIsotope() {
  $container = $('.portfolio-container').isotope({
    itemSelector: '.portfolio-item',
    layoutMode:   'fitRows',
    transitionDuration: '0.4s'
  });

  // once Isotope is ready, do an initial filter
  applyCombinedFilters();
}

//–– 4) Fetch data, build cards, insert a “no-results” placeholder, then init Isotope ––
document.addEventListener('DOMContentLoaded', function() {
  var portfolioContainer = document.querySelector('.portfolio-container');
  var noProjectsMessage  = document.getElementById('no-projects');

  // load projects.json (your data.json)
  fetch('data.json')
    .then(res => res.json())
    .then(data => {
      // clear existing DOM
      portfolioContainer.innerHTML = '';

      if (data.projects && data.projects.length) {
        noProjectsMessage.style.display = 'none';

        // create a card per project
        data.projects.forEach(function(project) {
          portfolioContainer.appendChild(createProjectCard(project));
        });

        // add a hidden “no-results” item
        var noResults = document.createElement('div');
        noResults.className = 'portfolio-item no-results col-lg-4 col-md-6 mb-4';
        noResults.style.display = 'none';
        noResults.innerHTML = `
				<div id="no-projects" class="col-12 portfolio-item no-results">
					<div class="text-center py-5">
						<i class="fas fa-folder-open fa-3x mb-3 text-muted"></i>
						<h4 class="text-muted">Oops! No projects found</h4>
					</div>
				</div>`;
        portfolioContainer.appendChild(noResults);

        // init Isotope + combined filters
        initIsotope();

				// Click the first filter to show all projects
				setTimeout(() => {
					document.querySelector('#portfolio-flters li').click();
				}, 50);
      } else {
        // no projects at all
        noProjectsMessage.style.display = 'block';
      }
    })
    .catch(function(err) {
      console.error('Error loading portfolio data:', err);
      noProjectsMessage.style.display = 'block';
    });
});

//–– 5) Filter UI event bindings ––
// Category single-select
$('#portfolio-flters').on('click', 'li', function() {
  $('#portfolio-flters li').removeClass('active');
  $(this).addClass('active');

  categoryFilter = $(this).data('filter');
  applyCombinedFilters();
});

// Tech-stack multi-select
$('#tech-flters').on('click', 'li', function() {
  var $el = $(this),
      val = $el.data('filter');

  if (val === '*') {
    // “All” clicked → reset techFilter
    $('#tech-flters li').removeClass('active');
    $el.addClass('active');
    techFilter = '*';
  } else {
    // toggle this tech badge
    $el.toggleClass('active');
    // ensure “All” is off
    $('#tech-flters li[data-filter="*"]').removeClass('active');

    // build comma-list of selected techs
    var active = $('#tech-flters li.active')
      .map(function(){ return $(this).data('filter'); })
      .get();

    techFilter = active.length ? active.join(',') : '*';

    // if nothing left, re-activate “All”
    if (techFilter === '*') {
      $('#tech-flters li[data-filter="*"]').addClass('active');
    }
  }

  applyCombinedFilters();
});

//–– 6) Card builder + icon helpers ––
// Updated createProjectCard with conditional rendering
function createProjectCard(project) {
  const div = document.createElement('div');
  // Base classes always applied
  div.className = [
    'col-lg-4', 'col-md-6', 'mb-4',
    'portfolio-item',
    project.category || '',
    ...(project.technologies || [])
  ].join(' ').trim();

  // Image block (only if project.image exists)
	let imgHtml = '';
	if (project.image) {
		imgHtml = `
			<div class="position-relative">
				<img src="${project.image}"
						 class="card-img-top img-fluid rounded-top"
						 alt="${project.title || ''}">
				<hr class="m-0 p-0"/>
				<div class="portfolio-btn rounded-top d-flex align-items-center justify-content-center">`;
	
		if (project.links?.demo || project.links?.github) {
			imgHtml += `
					<a href="${project.links.github || project.links.demo}" target="_blank">
						<i class="fas fa-eye text-white fa-3x"></i>
					</a>`;
		}
	
		imgHtml += `</div></div>`;
	}
	

  // "New!" badge (only if isNew flag is truthy)
  const newBadge = project.isNew ? '<span class="badge badge-primary">New!</span>' : '';

  // Description (only if exists)
  const descHtml = project.description
    ? `<p class="card-text small text-muted mb-2">${project.description}</p>`
    : '';

  // Technology badges (only if technologies array has items)
  let techBadges = '';
	if (project.technologies && project.technologies.length) {
		const badgesHtml = project.technologies.map(tech => `
			<span class="badge badge-pill badge-light border mr-1 mb-1 text-muted">
				<i class="${getTechIconClass(tech)} ${getTechIconColor(tech)} mr-1"></i>
				<small>${tech.toUpperCase()}</small>
			</span>
		`).join('');
	
		techBadges = `
			<div class="d-flex justify-content-start align-items-center flex-wrap" style="height:100%;">
				${badgesHtml}
			</div>
		`;
	}
	

  // Demo and GitHub buttons (only if links exist)
  let demoButton = '';
  let githubButton = '';
  let detailsButton = '';
  if (project.links) {
    if (project.links.demo) {
      demoButton = `
        <a href="${project.links.demo}" target="_blank" rel="noopener"
           class="btn btn-sm btn-primary mr-2 mb-2 px-3 py-1">
          <i class="fas fa-link"></i> Live Demo
        </a>`;
    }
		if (project.links.details) {
      detailsButton = `
        <a href="${project.links.details}" target="_blank" rel="noopener"
					class="btn btn-sm  btn-outline-dark mr-2 mb-2 px-2 py-1">
					<i class="fas fa-info-circle"></i> Details
				</a>`;
    }

    if (project.links.github) {
      githubButton = `
        <a href="${project.links.github}" target="_blank" rel="noopener"
					class="btn btn-sm  btn-outline-dark mr-2 mb-2  px-2 py-1">
					<i class="fab fa-github"></i> GitHub
				</a>`;
    }
  }
  const footerButtons = (demoButton || githubButton || detailsButton)
    ? `
      <div class="card-footer bg-white border-0 pt-3 pb-4">
        <div class="d-flex flex-wrap align-items-center">
          ${demoButton}
          ${detailsButton}
          ${githubButton}
        </div>
      </div>`
    : '';

  // Final card HTML
	div.innerHTML = (() => {
		const hasDemo = Boolean(project.links?.demo);
		const titleContent = hasDemo
			? `<a href="${project.links.demo}" target="_blank" class="text-dark">
					 ${project.title || ''}
					 <i class="fas fa-link ml-1" style="font-size: 0.8em;"></i>
				 </a>`
			: `${project.title || ''}`;
	
		return `
			<div class="card border-0 shadow-lg h-100">
				${imgHtml}
				<div class="card-body pb-0">
					<div class="d-flex flex-wrap justify-content-between">
						<h5 class="card-title mb-2">
							${titleContent}
						</h5>
						${newBadge}
					</div>
					${descHtml}
					${techBadges}
				</div>
				${footerButtons}
			</div>
		`;
	})();
	

  return div;
}


function getTechIconClass(tech) {
  var icons = {
    html5:     'fab fa-html5',
    css3:      'fab fa-css3-alt',
    js:        'fab fa-js-square',
    javascript:'fab fa-js-square',
    react:     'fab fa-react',
    nodejs:    'fab fa-node-js',
    python:    'fab fa-python',
    angular:   'fab fa-angular',
    vuejs:     'fab fa-vuejs',
    docker:    'fab fa-docker',
    nextjs:    'fab fa-nextjs',         // Closest match; no official icon
    laravel:   'fab fa-laravel text-danger',       // Requires Font Awesome Pro; otherwise use 'fas fa-code'
    mysql:     'fas fa-database',
    restapi:   'fas fa-project-diagram text-danger',
    php:       'fab fa-php',
    mongodb:       'fab fa-mongodb',
    extension: 'fab fa-chrome',
		wordpress: 'fab fa-wordpress',
		"aws-s3": 'fab fa-aws',
		"aws": 'fab fa-aws ',
  };
  return icons[tech] || 'fas fa-code';
}


function getTechIconColor(tech) {
  var colors = {
    html5:  'text-danger',
    css3:   'text-primary',
    js:     'text-warning',
    react:  'text-info',
    nodejs: 'text-success',
    python: 'text-primary',
    angular:'text-danger',
    vuejs:  'text-success',
    docker: 'text-info'
  };
  return colors[tech] || '';
}
