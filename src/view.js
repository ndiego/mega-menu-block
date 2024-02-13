/**
 * WordPress dependencies
 */
import { store, getContext } from '@wordpress/interactivity';

store( 'mega-menu-block', {
	actions: {
		toggle: () => {
			const context = getContext();
			context.isOpen = ! context.isOpen;
		},
	},
	effects: {
		logIsOpen: () => {
			const { isOpen } = getContext();
			// Log the value of `isOpen` each time it changes.
			console.log( `Is open: ${ isOpen }` );
		},
	},
} );
