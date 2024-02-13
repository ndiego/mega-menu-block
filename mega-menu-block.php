<?php
/**
 * Plugin Name:       Mega Menu Block
 * Description:       An exploratory mega menu block
 * Requires at least: 6.5
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Nick Diego
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       mega-menu-block
 *
 * @package           mega-menu-block
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function mega_menu_block_init() {
	register_block_type( __DIR__ . '/build' );

	if ( function_exists( 'wp_enqueue_script_module' ) ) {
		wp_enqueue_script_module(
			'mega_menu_block__view',
			plugin_dir_url( __FILE__ ) . 'src/view.js',
			array( '@wordpress/interactivity' ),
			'0.1.0'
		);
	}
}
add_action( 'init', 'mega_menu_block_init' );


function mega_menu_block_template_part_areas( array $areas ) {
	$areas[] = array(
		'area'        => 'menu',
		'area_tag'    => 'div',
		'label'       => __( 'Menu', 'mega-menu-block' ),
		'description' => __( 'Menu templates are used to create sections of a mega menu.', 'mega-menu-block' ),
		'icon'        => 'sidebar'
	);

	return $areas;
}
add_filter( 'default_wp_template_part_areas', 'mega_menu_block_template_part_areas' );
