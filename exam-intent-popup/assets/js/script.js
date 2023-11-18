/**
 * Utilities
 **/
function addClass($el) {
	const args = Array.from(arguments);
	const classNames = args.slice(1);

	if ($el !== null) {
		if ($el.classList) {
			classNames.forEach((v) => $el.classList.add(v));
		} else {
			$el.className += ' ' + classNames.join(' ');
		}
	}
}

function removeClass($el, className) {
	if ($el !== null && hasClass($el, className)) {
		if ($el.classList) {
			$el.classList.remove(className);
		} else {
			$el.className = $el.className.replace(
				new RegExp(
					'(^|\\b)' + className.split(' ').join('|') + '(\\b|$)',
					'gi'
				),
				' '
			);
		}
	}
}

function hasClass($el, className) {
	if ($el !== null) {
		if ($el.classList) {
			return $el.classList.contains(className);
		}
		return new RegExp('(^| )' + className + '( |$)', 'gi').test(
			$el.className
		);
	}

	return false;
}

const debounce = (fn, delay, ...args) => {
	let id = null;
	return (...fnArgs) => {
		clearTimeout(id);
		id = setTimeout(fn, delay, ...fnArgs, ...args);
	};
};

/**
 * Start
 **/
const defaultOptions = {
	exitIntentPopup: 'js-exit-intent-popup',
	exitIntentPopupCloseBtn: 'js-exit-intent-popup-close',
	isOpenClass: 'is-exit-intent-popup-open',
	openPopup: 'open-popup',
	localStorageStatus: 'exitIntentPopup_s',
	bodyDataset: 'data-exitIntentPopup',
}

let useCookie = false;

function init() {
	if ( isClosed() ) {
		return false;
	}

	initLocalStorage();
	closeBtnHandler();
	cursorHandler();

}

/**
 * initialize local storage
 * exitIntentPopup_s = status (1/0) - where 1 if user closed the popup
 */
function initLocalStorage() {
	const { localStorageStatus, } = defaultOptions;
	const browser = navigator.userAgent.toLowerCase();
	const isSafari =
		browser.indexOf('safari') !== -1 &&
		browser.indexOf('chrome') === -1;
	const isIE =
		browser.indexOf('msie ') > -1 || browser.indexOf('trident/') > -1;

	if (isSafari || isIE) {
		useCookie = true;

		if (!hasCookie(localStorageStatus)) {
			setStatus(0);
		}

		return false;
	}

	if (
		localStorage.getItem(localStorageStatus) === null &&
		!useCookie
	) {
		setStatus(0);
	}

	return true;
}

const showPopup = () => {
	if (
		isPopupActive() ||
		isClosed()
	) {

		return false;
	}

	const {
		exitIntentPopup,
		isOpenClass,
		openPopup,
	} = defaultOptions;
	const $exitIntentPopup = document.querySelector('.' + exitIntentPopup);
	const $body = document.body;

	if ($exitIntentPopup) {
		addClass($body, isOpenClass);
		addClass($exitIntentPopup, openPopup);
	}

	return true;
};

function closeBtnHandler() {
	const { exitIntentPopupCloseBtn, } = defaultOptions;
	const $exitIntentPopupCloseBtn = document.querySelector(
		'.' + exitIntentPopupCloseBtn
	);

	if ($exitIntentPopupCloseBtn) {
		$exitIntentPopupCloseBtn.addEventListener(
			'click',
			() => {
				this.closePopup();
			},
			{ passive: true, }
		);
	}
}

function closePopup() {
	const { exitIntentPopup, isOpenClass, openPopup, } = defaultOptions;
	const $exitIntentPopup = document.querySelector('.' + exitIntentPopup);
	const $body = document.body;

	removeClass($exitIntentPopup, openPopup);
	removeClass($body, isOpenClass);
	setStatus(1);
}

/**
 * check if cursor is inside the page
 * display popup if not
 */
function cursorHandler() {
	console.log("cursor handler");
	document.addEventListener('mouseleave', debounce(showPopup, 300));

	document.addEventListener(
		'mouseout',
		debounce((e) => {
			if (
				e.clientX < 15 ||
				e.clientX > window.innerWidth - 20 ||
				e.clientY < 15 ||
				e.clientY > window.innerHeight - 20
			) {
				showPopup();
				console.log("user is about to close");
			}
		}, 300)
	);
}

/**
 * set status closed = 1
 * set status open = 0
 */
function setStatus(status) {
	const { localStorageStatus, } = defaultOptions;

	if (useCookie) {
		setCookie(localStorageStatus, status);
	} else {
		localStorage.setItem(localStorageStatus, status);
	}
}

function isPopupActive() {
	const { isOpenClass, } = defaultOptions;

	return hasClass(document.body, isOpenClass);
}


function isClosed() {
	const { localStorageStatus, } = defaultOptions;

	return useCookie
		? getCookie(localStorageStatus) === '1'
		: localStorage.getItem(localStorageStatus) === '1';
}


/**
 * check if cookie exist
 *
 * @param {String} name
 * @return boolean
 */
function hasCookie(name) {
	const value = '; ' + document.cookie;
	const parts = value.split('; ' + name + '=');
	return parts.length === 2;
}

/**
 * set cookie
 * with 1 day expiration
 *
 * @param {String} name
 * @param {String} value
 */
function setCookie(name, value) {
	const date = new Date();

	date.setDate(date.getDate() + 30);
	date.setHours(0, 0, 0, 0);

	const expires = 'expires=' + date.toUTCString();
	document.cookie = name + '=' + value + ';' + expires + ';path=/';
}

/**
 * get cookie by name
 *
 * @param {String} name
 * @return string
 */
function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	return parts.length === 2 ? parts.pop().split(';').shift() : 0;
}

init();