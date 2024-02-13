<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

$unique_id = uniqid( 'p-' );
//echo print_r( $attributes ); 

// Enqueue the view file.
if ( function_exists( 'wp_enqueue_script_module' ) ) {
	wp_enqueue_script_module( 'mega_menu_block__view' );
}

if ( ! $attributes['label'] ) {
	return null;	
}	
?>

<div
	<?php echo get_block_wrapper_attributes(); ?>
	data-wp-interactive='{ "namespace": "mega-menu-block" }'
	data-wp-context='{  "isOpen": false }'
	data-wp-effect="callback.menuIsOpen"
>
	<a
		data-wp-on--click="actions.toggle"
		data-wp-bind--aria-expanded="context.isOpen"
		aria-controls="p-<?php echo esc_attr( $unique_id ); ?>"
	>
		<?php echo $attributes['label'] ?>
	</a>

	<div
		class="mega-menu-container"
		id="p-<?php echo esc_attr( $unique_id ); ?>"
		data-wp-bind--hidden="!context.isOpen"
	>
		<?php echo block_template_part( $attributes['menuSlug'] ); ?>
	</div>
</div>
