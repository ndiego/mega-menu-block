# Mega Menu Block

This plugin registers an **experimental** Mega Menu block.

You can [test the block in your browser](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/ndiego/mega-menu-block/main/_playground/blueprint.json) using Playground. Try adding the Menu Menu block to a Navigation block and configure a menu template in the Settings Sidebar.

## Requirements

- WordPress 6.5+
- PHP 7.0+

## Limitations

This block is experimental, so there are a few limitations, and you will likely run into some oddities on the front end. It's recommended that you use this plugin as a starting point and adapt it to your theme.

- You must be using a block theme. (e.g., Twenty Twenty-Four)
- There is no support for vertically positioned Navigation blocks.
- The width of each mega menu is restricted to either full width or `content` and `wide` width as defined in theme.json.
- Menu template parts are created in the Site Editor. There is no UI in the Navigation block itself.
