/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import './style.scss';
import './view.scss';
import Edit from './edit';
import metadata from './block.json';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
registerBlockType( metadata.name, {
	icon: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="24"
			height="24"
			aria-hidden="true"
			focusable="false"
		>
			<path d="M12.5 14.5h-1V16h1c2.2 0 4-1.8 4-4s-1.8-4-4-4h-1v1.5h1c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5zm-4 1.5v-1.5h-1C6.1 14.5 5 13.4 5 12s1.1-2.5 2.5-2.5h1V8h-1c-2.2 0-4 1.8-4 4s1.8 4 4 4h1zm-1-3.2h5v-1.5h-5v1.5zM18 4H9c-1.1 0-2 .9-2 2v.5h1.5V6c0-.3.2-.5.5-.5h9c.3 0 .5.2.5.5v12c0 .3-.2.5-.5.5H9c-.3 0-.5-.2-.5-.5v-.5H7v.5c0 1.1.9 2 2 2h9c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"></path>
		</svg>
	),
	edit: Edit,
} );

/**
 * Make the Mega Menu Block available to Navigation blocks.
 *
 * @since 0.1.0
 *
 * @param {Object} blockSettings The original settings of the block.
 * @param {string} blockName     The name of the block being modified.
 * @return {Object} The modified settings for the Navigation block or the original settings for other blocks.
 */
const addToNavigation = ( blockSettings, blockName ) => {
	if ( blockName === 'core/navigation' ) {
		return {
			...blockSettings,
			allowedBlocks: [
				...( blockSettings.allowedBlocks ?? [] ),
				'outermost/mega-menu',
			],
		};
	}
	return blockSettings;
};
addFilter(
	'blocks.registerBlockType',
	'outermost-mega-menu-add-to-navigation',
	addToNavigation
);
