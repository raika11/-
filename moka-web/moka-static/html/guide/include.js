var include = {
	meta: function () {
		document.write('<meta name="robots" content="noindex, nofollow">');
		document.write('<meta name="viewport" content="width=device-width, initial-scale=1">');
		document.write('<meta name="description" content="">');
		document.write('<meta name="author" content="">');
		document.write('<title>퍼블 가이드 - 중앙일보</title>');
		document.write('<meta property="og:image" content="https://static.joins.com/joongang_15re/profile_joongang_200.png">');
	},
	head: function () {
		document.write('<link rel="canonical" href="">');
		document.write('<link href="https://getbootstrap.com/docs/5.0/dist/css/bootstrap.min.css" rel="stylesheet">');
		document.write('<link href="https://static.joins.com/html/guide/guide.css" rel="stylesheet">');
		document.write('<link rel="apple-touch-icon-precomposed" href="https://images.joins.com/ui_mobile/joongang/icon/ios_114.png">');
		document.write('<link href="https://images.joins.com/ui_mobile/joongang/icon/favicon.ico" rel="shortcut icon">');
	},
	header: function () {
		document.write('<div class="skippy overflow-hidden">');
		document.write('<div class="container-xl">');
		document.write('<a class="visually-hidden-focusable d-inline-flex p-2 m-1" href="#content">Skip to main content</a>');
		document.write('<a class="visually-hidden-focusable d-none d-md-inline-flex p-2 m-1" href="#bd-docs-nav">Skip to docs navigation</a>');
		document.write('</div>');
		document.write('</div>');
		document.write('<header class="navbar navbar-expand-md navbar-dark bd-navbar">');
		document.write('<nav class="container-xxl flex-wrap flex-md-nowrap">');
		document.write('<div class="collapse navbar-collapse" id="bdNavbar">');
		document.write('<ul class="navbar-nav flex-row flex-wrap bd-navbar-nav pt-2 py-md-0">');
		document.write('<li class="nav-item col-6 col-md-auto"><a class="nav-link p-2 active" href="https://static.joins.com/html/guide/">중앙일보 퍼블가이드</a></li>');
		document.write('<li class="nav-item col-6 col-md-auto"><a class="nav-link p-2" href="https://static.joins.com/html/guide/html.html">Html</a></li>');
		document.write('<li class="nav-item col-6 col-md-auto"><a class="nav-link p-2" href="https://static.joins.com/html/guide/css.html">Css</a></li>');
		document.write('<li class="nav-item col-6 col-md-auto"><a class="nav-link p-2" href="https://static.joins.com/html/guide/sass.html">Sass</a></li>');
		document.write('<li class="nav-item col-6 col-md-auto"><a class="nav-link p-2" href="https://static.joins.com/html/guide/font.html">Font</a></li>');
		document.write('<li class="nav-item col-6 col-md-auto"><a class="nav-link p-2" href="https://static.joins.com/html/guide/image.html">Image</a></li>');
		document.write('<li class="nav-item col-6 col-md-auto"><a class="nav-link p-2" href="https://static.joins.com/html/guide/accessibility.html">웹접근성</a></li>');
		document.write('<li class="nav-item col-6 col-md-auto"><a class="nav-link p-2" href="https://static.joins.com/html/guide/seo.html">SEO</a></li>');
		document.write('</ul>');
		document.write('</div>');
		document.write('<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#bdNavbar" aria-controls="bdNavbar" aria-expanded="false" aria-label="Toggle navigation">');
		document.write('<svg class="bi" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">');
		document.write('<path fill-rule="evenodd" d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"></path>');
		document.write('</svg>');
		document.write('</button>');
		document.write('<button class="btn bd-sidebar-toggle d-md-none py-0 px-1 ms-3 order-3 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#bd-docs-nav" aria-controls="bd-docs-nav" aria-expanded="false" aria-label="Toggle docs navigation">');
      document.write('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="bi bi-expand" viewBox="0 0 16 16">');
  document.write('<path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zM7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10z"/>');
document.write('</svg>');
      document.write('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="bi bi-collapse" viewBox="0 0 16 16">');
  document.write('<path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zm7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0zm-.5 11.707l-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0v-3.793z"/>');
document.write('</svg>');

    document.write('</button>');
		document.write('</nav>');
		document.write('</header>');
	},
	aside: {
		init : function(){
			this.menu0();
		},
		menu0: function () {
			document.write('<aside class="bd-sidebar">');
			document.write('<nav class="collapse bd-links" id="bd-docs-nav" aria-label="Docs navigation">');
			document.write('<ul class="list-unstyled mb-0 py-3 pt-md-1">');
			document.write('<li class="mb-1">');
			document.write('<button class="btn d-inline-flex align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#layout-collapse" aria-expanded="false">Layout</button>');
			document.write('<div class="collapse" id="layout-collapse">');
			document.write('<ul class="list-unstyled fw-normal pb-1 small">');
			document.write('<li><a href="https://static.joins.com/html/guide/html/breakpoints.html" class="d-inline-flex align-items-center rounded">Breakpoints</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/layout.html" class="d-inline-flex align-items-center rounded">Containers</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/grid.html" class="d-inline-flex align-items-center rounded">Grid</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/section.html" class="d-inline-flex align-items-center rounded">Section</a></li>');
			//document.write('<li><a href="gutters.html" class="d-inline-flex align-items-center rounded">Gutters</a></li>');
			document.write('</ul>');
			document.write('</div>');
			document.write('</li>');
			document.write('<li class="mb-1">');
			document.write('<button class="btn d-inline-flex align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#content-collapse" aria-expanded="false">Content </button>');
			document.write('<div class="collapse" id="content-collapse">');
			document.write('<ul class="list-unstyled fw-normal pb-1 small">');
			document.write('<li><a href="https://static.joins.com/html/guide/html/images.html" class="d-inline-flex align-items-center rounded">Images</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/tables.html" class="d-inline-flex align-items-center rounded">Tables</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/figures.html" class="d-inline-flex align-items-center rounded">Figures</a></li>');
			document.write('</ul>');
			document.write('</div>');
			document.write('</li>');
			document.write('<li class="mb-1">');
			document.write('<button class="btn d-inline-flex align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#forms-collapse" aria-expanded="false">Forms </button>');
			document.write('<div class="collapse" id="forms-collapse">');
			document.write('<ul class="list-unstyled fw-normal pb-1 small">');
			document.write('<li><a href="https://static.joins.com/html/guide/html/form-control.html" class="d-inline-flex align-items-center rounded">Form control</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/select.html" class="d-inline-flex align-items-center rounded">Select</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/checks-radios.html" class="d-inline-flex align-items-center rounded">Checks &amp; radios</a></li>');
			//document.write('<li><a href="https://static.joins.com/html/guide/html/input-group.html" class="d-inline-flex align-items-center rounded">Input group</a></li>');
			document.write('</ul>');
			document.write('</div>');
			document.write('</li>');
			document.write('<li class="mb-1">');
			document.write('<button class="btn d-inline-flex align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#components-collapse" aria-expanded="false">Components</button>');
			document.write('<div class="collapse" id="components-collapse">');
			document.write('<ul class="list-unstyled fw-normal pb-1 small">');
			document.write('<li><a href="https://static.joins.com/html/guide/html/accordion.html" class="d-inline-flex align-items-center rounded">Accordion</a></li>');
			//document.write('<li><a href="alerts/" class="d-inline-flex align-items-center rounded">Alerts</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/badge.html" class="d-inline-flex align-items-center rounded">Badge</a></li>');
			//document.write('<li><a href="breadcrumb/"class="d-inline-flex align-items-center rounded">Breadcrumb</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/buttons.html" class="d-inline-flex align-items-center rounded">Buttons</a></li>');
			//document.write('<li><a href="button-group/" class="d-inline-flex align-items-center rounded">Button group</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/card.html" class="d-inline-flex align-items-center rounded">Card</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/carousel.html" class="d-inline-flex align-items-center rounded">Carousel</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/close-button.html" class="d-inline-flex align-items-center rounded">Close button</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/collapse.html" class="d-inline-flex align-items-center rounded">Collapse</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/comments.html" class="d-inline-flex align-items-center rounded">Comments</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/dropdowns.html" class="d-inline-flex align-items-center rounded">Dropdowns</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/list_group.html" class="d-inline-flex align-items-center rounded">List group</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/modal.html" class="d-inline-flex align-items-center rounded">Modal</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/navs_tabs.html" class="d-inline-flex align-items-center rounded">Navs &amp; tabs</a></li>');
			//document.write('<li><a href="navbar/" class="d-inline-flex align-items-center rounded">Navbar</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/pagination.html" class="d-inline-flex align-items-center rounded">Pagination</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/popovers.html" class="d-inline-flex align-items-center rounded">Popovers</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/progress.html" class="d-inline-flex align-items-center rounded">Progress</a></li>');
			//document.write('<li><a href="https://static.joins.com/html/guide/html/scrollspy.html" class="d-inline-flex align-items-center rounded">Scrollspy</a></li>');
			//document.write('<li><a href="spinners/" class="d-inline-flex align-items-center rounded">Spinners</a></li>');
			//document.write('<li><a href="https://static.joins.com/html/guide/html/tooltips.html" class="d-inline-flex align-items-center rounded">Tooltips</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/sticky.html" class="d-inline-flex align-items-center rounded">Sticky</a></li>');
			document.write('</ul>');
			document.write('</div>');
			document.write('</li>');
			document.write('<li class="mb-1">');
			document.write('<button class="btn d-inline-flex align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#helpers-collapse" aria-expanded="false">Helpers</button>');
			document.write('<div class="collapse" id="helpers-collapse">');
			document.write('<ul class="list-unstyled fw-normal pb-1 small">');
			document.write('<li><a href="https://static.joins.com/html/guide/html/clearfix.html" class="d-inline-flex align-items-center rounded">Clearfix</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/position.html" class="d-inline-flex align-items-center rounded">Position</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/visually-hidden.html" class="d-inline-flex align-items-center rounded">Visually hidden</a></li>');
			//document.write('<li><a href="stretched-link/" class="d-inline-flex align-items-center rounded">Stretched link</a></li>');
			//document.write('<li><a href="text-truncation/" class="d-inline-flex align-items-center rounded">Text truncation</a></li>');
			document.write('</ul>');
			document.write('</div>');
			document.write('</li>');
			document.write('<li class="mb-1">');
			document.write('<button class="btn d-inline-flex align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#utilities-collapse" aria-expanded="false">Utilities</button>');
			document.write('<div class="collapse" id="utilities-collapse">');
			document.write('<ul class="list-unstyled fw-normal pb-1 small">');
			document.write('<li><a href="https://static.joins.com/html/guide/html/borders.html" class="d-inline-flex align-items-center rounded">Borders</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/colors.html" class="d-inline-flex align-items-center rounded">Colors</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/float.html" class="d-inline-flex align-items-center rounded">Float</a></li>');
			//document.write('<li><a href="overflow.html" class="d-inline-flex align-items-center rounded">Overflow</a></li>');
			//document.write('<li><a href="position.html" class="d-inline-flex align-items-center rounded">Position</a></li>');
			//document.write('<li><a href="shadows.html" class="d-inline-flex align-items-center rounded">Shadows</a></li>');
			//document.write('<li><a href="sizing.html" class="d-inline-flex align-items-center rounded">Sizing</a></li>');
			//document.write('<li><a href="spacing.html" class="d-inline-flex align-items-center rounded">Spacing</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/text.html" class="d-inline-flex align-items-center rounded">Text</a></li>');
			//document.write('<li><a href="vertical-align.html" class="d-inline-flex align-items-center rounded">Vertical align</a></li>');
			//document.write('<li><a href="visibility.html" class="d-inline-flex align-items-center rounded">Visibility</a></li>');
			document.write('<li><a href="https://static.joins.com/html/guide/html/flex.html" class="d-inline-flex align-items-center rounded">Flex</a></li>');
			document.write('</ul>');
			document.write('</div>');
			document.write('</li>');
			document.write('</ul>');
			document.write('</nav>');
			document.write('</aside>');
		},
	},
	footer: function () {
		document.write('<footer class="bd-footer p-3 p-md-5 mt-5 bg-light text-center text-sm-start">');
		document.write('<div class="container">');
		document.write('<p class="mb-0">Copyright by <a href="https://joongang.joins.com/" target="_blank">JoongAng Ilbo</a> Co., Ltd. All Rights Reserved</p>');
		document.write('</div>');
		document.write('</footer>');
	},
}