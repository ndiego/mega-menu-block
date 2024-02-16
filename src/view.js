/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

const { state, actions } = store( 'outermost/mega-menu', {
	state: {
		get isMenuOpen() {
			// The menu is opened if either `click` or `focus` is true.
			return (
				Object.values( state.menuOpenedBy ).filter( Boolean ).length > 0
			);
		},
		get menuOpenedBy() {
			const context = getContext();
			return context.menuOpenedBy;
		},
	},
	actions: {
		toggleMenuOnClick() {
			const context = getContext();
			const { ref } = getElement();
			// Safari won't send focus to the clicked element, so we need to manually place it: https://bugs.webkit.org/show_bug.cgi?id=22261
			if ( window.document.activeElement !== ref ) ref.focus();

			if ( state.menuOpenedBy.click || state.menuOpenedBy.focus ) {
				actions.closeMenu( 'click' );
				actions.closeMenu( 'focus' );
			} else {
				context.previousFocus = ref;
				actions.openMenu( 'click' );
			}
		},
		closeMenuOnClick() {
			actions.closeMenu( 'click' );
			actions.closeMenu( 'focus' );
		},
		handleMenuKeydown( event ) {
			if ( state.menuOpenedBy.click ) {
				// If Escape close the menu.
				if ( event?.key === 'Escape' ) {
					actions.closeMenu( 'click' );
					actions.closeMenu( 'focus' );
					return;
				}
			}
		},
		handleMenuFocusout( event ) {
			const context = getContext();
			const menuContainer = context.megaMenu?.querySelector( '.wp-block-outermost-mega-menu__menu-container');
			// If focus is outside menu, and in the document, close menu
			// event.target === The element losing focus
			// event.relatedTarget === The element receiving focus (if any)
			// When focusout is outside the document,
			// `window.document.activeElement` doesn't change.

			// The event.relatedTarget is null when something outside the navigation menu is clicked. This is only necessary for Safari.
			// TODO: There is still an issue in Safari where clicking on the menu link closes the menu. We don't want this. The toggleMenuOnClick callback should handle this.
			if (
				event.relatedTarget === null ||
				(
					! menuContainer?.contains( event.relatedTarget ) &&
					event.target !== window.document.activeElement 
				)
			) {
				actions.closeMenu( 'click' );
				actions.closeMenu( 'focus' );
			}
		},
		openMenu( menuOpenedOn = 'click' ) {
			state.menuOpenedBy[ menuOpenedOn ] = true;
		},
		closeMenu( menuClosedOn = 'click' ) {
			const context = getContext();
			state.menuOpenedBy[ menuClosedOn ] = false;
			
			// Reset the menu reference and button focus when closed.
			if ( ! state.isMenuOpen ) {
				if ( context.megaMenu?.contains( window.document.activeElement ) ) {
					context.previousFocus?.focus();
				}
				context.previousFocus = null;
				context.megaMenu = null;
			}
		},
	},
	callbacks: {
		initMenu() {
			const context = getContext();
			const { ref } = getElement();

			// Set the menu reference when initialized. 
			if ( state.isMenuOpen ) {
				context.megaMenu = ref;
			}
		},

		initNav() {
			const context = getContext();
			const mediaQuery = window.matchMedia(
				`(max-width: ${ NAVIGATION_MOBILE_COLLAPSE })`
			);

			// Run once to set the initial state.
			context.isCollapsed = mediaQuery.matches;

			function handleCollapse( event ) {
				context.isCollapsed = event.matches;
			}

			// Run on resize to update the state.
			mediaQuery.addEventListener( 'change', handleCollapse );

			// Remove the listener when the component is unmounted.
			return () => {
				mediaQuery.removeEventListener( 'change', handleCollapse );
			};
		},
	},
} );
