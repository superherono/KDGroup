function testWebP(callback) {
	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
	if (support === true) {
		document.querySelector('html').classList.add('_webp');
	} else {
		document.querySelector('html').classList.add('_no-webp');
	}
});


//======================IBG===============
function ibg() {

	let ibg = document.querySelectorAll(".ibg");
	for (var i = 0; i < ibg.length; i++) {
		if (ibg[i].querySelector('img')) {
			ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
		}
	}
}

ibg();
//=======================================================================По клику обьект в контейнере с обьктами вешает кллас ну нажатый обьект=================================================================================

// const container = document.querySelector('.gallery__controls');

// container.addEventListener('click', function (e) {
// 	const arrows = document.querySelectorAll('.gallery__arrow');
// 	const arrowCenter = document.querySelector('._arrow_center');
// 	const target = e.target;
// 	Array.from(arrows).forEach(arrow => {
// 		arrow.classList.remove('_active');
// 	});
// 	target.classList.add('_active');
	
// 	Array.from(arrows).forEach(arrow => {
// 		arrow.classList.remove('_active');
// 	});
// 	setTimeout(arrowCenter.classList.add('_active'), 888000);
// });
//==================Smooth Scroll========================
const anchors = document.querySelectorAll('a[href*="#"]');

for (let anchor of anchors) {
	anchor.addEventListener('click', function (e) {
		e.preventDefault()

		const blockID = anchor.getAttribute('href').substr(1);

		document.getElementById(blockID).scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});
	});
}
//=============Печетание текста=================================================
const t = [
	'Дизайн и сайты </br>',
	'под ключ'
];

function typeText() {
	let line = 0;
	let count = 0;
	let out = '';
	let htmlOut = document.querySelector('.out');

	function typeLine() {
		let interval = setTimeout(function () {
			out += t[line][count];
			htmlOut.innerHTML = out + '|';
			count++;

			if (count >= t[line].length) {
				count = 0;
				line++;
				if (line == t.length) {
					clearTimeout(interval);
					htmlOut.innerHTML = out;
					return true;
				}
			}
			typeLine();
		}, 150);
	}

	typeLine();
}
typeText();

//======================

document.addEventListener("DOMContentLoaded", function () {
	let header = document.querySelector('.header');
	header.classList.add('_active');
});
"use strict";

// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle



function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();
let menuParents = document.querySelectorAll('.menu-page__parent');

for (let index = 0; index < menuParents.length; index++) {
    const menuParent = menuParents[index];
    menuParent.addEventListener("mouseenter", function(e) {
        menuParent.classList.add('_active');
    });
    menuParent.addEventListener("mouseleave", function(e) {
        menuParent.classList.remove('_active');
    });
}
//BildSlider
let sliders = document.querySelectorAll('._swiper');
if (sliders) {
    for (let index = 0; index < sliders.length; index++) {
        let slider = sliders[index];
        if (!slider.classList.contains('swiper-bild')) {
            let slider_items = slider.children;
            if (slider_items) {
                for (let index = 0; index < slider_items.length; index++) {
                    let el = slider_items[index];
                    el.classList.add('swiper-slide');
                }
            }
            let slider_content = slider.innerHTML;
            let slider_wrapper = document.createElement('div');
            slider_wrapper.classList.add('swiper-wrapper');
            slider_wrapper.innerHTML = slider_content;
            slider.innerHTML = '';
            slider.appendChild(slider_wrapper);
            slider.classList.add('swiper-bild');
        }
        if (slider.classList.contains('_gallery')) {
            //slider.data('lightGallery').destroy(true);
        }
    }
    sliders_bild_callback();
}

function sliders_bild_callback(params) {}

// if (document.querySelector('.gallery')) {
//     let mainslider = new Swiper('.gallery__slider', {
//         /*
//             effect: 'fade',
//             autoplay: {
//                 delay: 3000,
//                 disableOnInteraction: false,
//             },
//             */
//         observer: true,
//         observeParents: true,
//         slidesPerView: 3,
//         spaceBetween: 0,
//         autoHeight: true,
//         speed: 800,
//         //touchRatio: 0,
//         simulateTouch: false,
//         loop: true,
//         //preLoadImages: false,
//         //Lazy: true,
//         //Dotts
//         // pagination: {
//         //     el: '.gallery__dotts',
//         //     clickable: true,
//         // },
//         //Arrows
//         navigation: {
//             nextEl: '._arrow_next',
//             prevEl: '._arrow_prev',
//         },
//         breakpoints: {
//             320: {
//                 slidesPerView: 1,
//                 spaceBetween: 10,
//                 autoHeight: true,
//             },
//             640: {
//                 slidesPerView: 2,
//                 spaceBetween: 10,
//                 autoHeight: true,
//             },
//             768: {
//                 slidesPerView: 2,
//                 spaceBetween: 20,
//             },
//             992: {
//                 slidesPerView: 3,
//                 spaceBetween: 40,
//             },
//             1268: {
//                 slidesPerView: 3,
//                 spaceBetween: 45,
//             },
//         },
//         on: {
//             lazyImageReady: function () {
//                 ibg();
//             },
//         }
//         //And if we need scrollbar
//         //scrollbar: {
//         //el: '.swiper-scrollbar',
//         //},
//     });

//     //     let mainsliderImages = document.querySelectorAll('.gallery__slide');
//     //     let mainsliderDotts = document.querySelectorAll('.gallery__controls .swiper-pagination-bullet');

//     //     for (let index = 0; index < mainsliderImages.length; index++) {
//     //         const mainsliderImage = mainsliderImages[index].querySelector('img').getAttribute('src');
//     //         mainsliderDotts[index].style.backgroundImage = "url('" + mainsliderImage + "')";
//     //     }
// }

//=====================================================

let gallerySlider;
let allSlides = document.querySelector('.gallery ._fraction__all');
let allCurrentSlide = document.querySelector('.gallery ._fraction__current');
const allSlidesCounter = document.querySelectorAll('.gallery__slide').length;

gallerySlider = new Swiper('.gallery__slider', {
    observer: true,
    observeParents: true,
    slidesPerView: 3,
    spaceBetween: 30,
    watchSlidesVisibility: true,
    speed: 800,
    loop: true,
    //preloadImages: false,
    //lazy: true,
    // Dotts
    navigation: {
        nextEl: '.gallery__controls .arrow-right',
        prevEl: '.gallery__controls .arrow-left',
    },
    pagination: {
        el: '.gallery__progress',
        type: 'progressbar',
    },
    breakpoints: {
        // when window width is >= 320px
        320: {
            slidesPerView: 1.1,
            spaceBetween: 15,
            //autoHeight: true,
        },
        // when window width is >= 480px
        550: {
            slidesPerView: 2,
            spaceBetween: 30
        },
        // when window width is >= 640px
        992: {
            slidesPerView: 3,
            spaceBetween: 30
        }
    },
    on: {
        lazyImageReady: function () {
            ibg();
        },
        init: function (slider) {
            allSlides.innerHTML = setZeroFormat(allSlidesCounter);
        },
        slideChange: function (slider) {
            let currentSlide = ++slider.realIndex;
            allCurrentSlide.innerHTML = setZeroFormat(currentSlide);
        },
    }
});


//=====================================================


function setZeroFormat(item) {
    let result = item >= 10 ? item : "0" + item;
    return result;
}
//===============Animation on scroll====================

const animItems = document.querySelectorAll('._anim-items');

if (animItems.length > 0) {
    window.addEventListener('scroll', animOnScroll);

    function animOnScroll() {
        for (let index = 0; index < animItems.length; index++) {
            const animItem = animItems[index];
            const animItemHeight = animItem.offsetHeight;
            const animItemOffset = offset(animItem).top;
            const animStart = 4;

            let animItemPoint = window.innerHeight - animItemHeight / animStart;
            if (animItemHeight > window.innerHeight) {
                animItemPoint = window.innerHeight - window.innerHeight / animStart;
            }

            if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
                animItem.classList.add('_active'); //Попробовать сюда добавить вызов функции запуска счетчика

            } else {
                if (!animItem.classList.contains('_anim-no-hide')) { //Добавить к обьекту, к которому не будет применяться постоянная анимация
                    animItem.classList.remove('_active');
                }
            }
        }
    }

    function offset(el) {
        const rect = el.getBoundingClientRect(),
            scrollLeft = window.pageYOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return {
            top: rect.top + scrollTop,
            left: rect.left + scrollLeft
        };
    }
    //Устонавливаем задержку перед исполнением
    setTimeout(() => {
        animOnScroll();
    }, 300);

}
//=================================================
//===========BURGER==================================================
const burger = document.querySelector('.header__burger');
const mobileMenu = document.querySelector('.menu-header');

const classNameActive = '_active';
const classNameLock = 'lock';
const elements = [burger, mobileMenu]

function toggleClass(elements, classNameActive, classNameLock) {
    elements.forEach(element => element.classList.toggle(classNameActive));
    document.querySelector('body').classList.toggle(classNameLock);
}

//Закрываем бурег по клику на ссылку внутри
function burgerClose() {
    elements.forEach(element => element.classList.toggle(classNameActive));
    document.querySelector('body').classList.remove(classNameLock);
}

const links = document.querySelectorAll('.menu-header__link');
if (links.length > 0) {
    for (let index = 0; index < links.length; index++) {
        const el = links[index];
        el.addEventListener('click', function (e) {
            burgerClose(el.closest('.menu-header'));
            e.preventDefault();
        });
    }
}

burger.onclick = () => toggleClass(elements, classNameActive, classNameLock)
links.onclick = () => toggleClass(elements, classNameActive, classNameLock)