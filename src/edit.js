/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { useEntityRecords } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { createInterpolateElement } from '@wordpress/element';
import {
	ComboboxControl,
	PanelBody,
	Notice,
	TextControl,
	TextareaControl,
	ToggleControl,
	__experimentalHStack as HStack, // eslint-disable-line
	__experimentalToggleGroupControl as ToggleGroupControl, // eslint-disable-line
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon, // eslint-disable-line
} from '@wordpress/components';
import {
	alignNone,
	justifyLeft,
	justifyCenter,
	justifyRight,
	stretchWide,
	stretchFullWidth,
} from '@wordpress/icons';

/**
 * Internal dependencies
 */
import './edit.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Properties passed to the function.
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function that updates individual attributes.
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		label,
		menuSlug,
		title,
		description,
		disableWhenCollapsed,
		collapsedUrl,
		justifyMenu,
		width,
	} = attributes;

	// Get the Url for the template part screen in the Site Editor.
	const siteUrl = useSelect( ( select ) => select( 'core' ).getSite()?.url );
	const menuTemplateUrl = siteUrl
		? siteUrl +
		  '/wp-admin/site-editor.php?path=%2Fpatterns&categoryType=wp_template_part&categoryId=menu'
		: '';

	// Get the layout settings.
	const layout = useSelect(
		( select ) =>
			select( 'core/editor' ).getEditorSettings()?.__experimentalFeatures
				?.layout
	);

	// Fetch all template parts.
	const { hasResolved, records } = useEntityRecords(
		'postType',
		'wp_template_part',
		{
			per_page: -1,
		}
	);

	let menuOptions = [];

	// Filter the template parts for those in the 'menu' area.
	if ( hasResolved ) {
		menuOptions = records
			.filter( ( item ) => item.area === 'menu' )
			.map( ( item ) => ( {
				label: item.title.rendered,
				value: item.slug,
			} ) );
	}

	const hasMenus = menuOptions.length > 0;
	const selectedMenuAndExists = menuSlug
		? menuOptions.some( ( option ) => option.value === menuSlug )
		: true;

	// Notice for when no menus have been created.
	const noMenusNotice = (
		<Notice status="warning" isDismissible={ false }>
			{ createInterpolateElement(
				__(
					'No menu templates could be found. Create a new one in the <a>Site Editor</a>.',
					'mega-menu-block'
				),
				{
					a: (
						<a // eslint-disable-line
							href={ menuTemplateUrl }
							target="_blank"
							rel="noreferrer"
						/>
					),
				}
			) }
		</Notice>
	);

	// Notice for when the selected menu template no longer exists.
	const menuDoesntExistNotice = (
		<Notice status="warning" isDismissible={ false }>
			{ __(
				'The selected menu template no longer exists. Choose another.',
				'mega-menu-block'
			) }
		</Notice>
	);

	// Modify block props.
	const blockProps = useBlockProps( {
		className:
			'wp-block-navigation-item wp-block-outermost-mega-menu__toggle',
	} );

	const justificationOptions = [
		{
			value: 'left',
			icon: justifyLeft,
			label: __( 'Justify menu left', 'mega-menu-block' ),
		},
		{
			value: 'center',
			icon: justifyCenter,
			label: __( 'Justify menu center', 'mega-menu-block' ),
		},
		{
			value: 'right',
			icon: justifyRight,
			label: __( 'Justify menu right', 'mega-menu-block' ),
		},
	];

	const widthOptions = [
		{
			value: 'content',
			icon: alignNone,
			label: sprintf(
				// translators: %s: container size (i.e. 600px etc)
				__( 'Content width (%s wide)', 'mega-menu-block' ),
				layout.contentSize
			),
		},
		{
			value: 'wide',
			icon: stretchWide,
			label: sprintf(
				// translators: %s: container size (i.e. 600px etc)
				__( 'Wide width (%s wide)', 'mega-menu-block' ),
				layout.wideSize
			),
		},
		{
			value: 'full',
			icon: stretchFullWidth,
			label: __( 'Full width', 'mega-menu-block' ),
		},
	];

	return (
		<>
			<InspectorControls group="settings">
				<PanelBody
					className="outermost-mega-menu__settings-panel"
					title={ __( 'Settings', 'mega-menu-block' ) }
					initialOpen={ true }
				>
					<TextControl
						label={ __( 'Label', 'mega-menu-block' ) }
						type="text"
						value={ label }
						onChange={ ( value ) =>
							setAttributes( { label: value } )
						}
						autoComplete="off"
					/>
					<ComboboxControl
						label={ __( 'Menu Template', 'mega-menu-block' ) }
						value={ menuSlug }
						options={ menuOptions }
						onChange={ ( value ) =>
							setAttributes( { menuSlug: value } )
						}
						help={
							hasMenus &&
							createInterpolateElement(
								__(
									'Create and modify menu templates in the <a>Site Editor</a>.',
									'mega-menu-block'
								),
								{
									a: (
									<a // eslint-disable-line
											href={ menuTemplateUrl }
											target="_blank"
											rel="noreferrer"
										/>
									),
								}
							)
						}
					/>
					{ ! hasMenus && noMenusNotice }
					{ hasMenus &&
						! selectedMenuAndExists &&
						menuDoesntExistNotice }
					<TextareaControl
						className="settings-panel__description"
						label={ __( 'Description', 'mega-menu-block' ) }
						type="text"
						value={ description || '' }
						onChange={ ( descriptionValue ) => {
							setAttributes( { description: descriptionValue } );
						} }
						help={ __(
							'The description will be displayed in the menu if the current theme supports it.',
							'mega-menu-block'
						) }
						autoComplete="off"
					/>
					<TextControl
						label={ __( 'Title', 'mega-menu-block' ) }
						type="text"
						value={ title || '' }
						onChange={ ( titleValue ) => {
							setAttributes( { title: titleValue } );
						} }
						help={ __(
							'Additional information to help clarify the purpose of the link.',
							'mega-menu-block'
						) }
						autoComplete="off"
					/>
					<ToggleControl
						label={ __(
							'Disable in navigation overlay',
							'mega-menu-block'
						) }
						checked={ disableWhenCollapsed }
						onChange={ () => {
							setAttributes( {
								disableWhenCollapsed: ! disableWhenCollapsed,
							} );
						} }
						help={ __(
							'When the navigation options are displayed in an overlay, typically on mobile devices, disable the mega menu.',
							'mega-menu-block'
						) }
					/>
					{ disableWhenCollapsed && (
						<TextControl
							label={ __( 'Url', 'mega-menu-block' ) }
							type="text"
							value={ collapsedUrl || '' }
							onChange={ ( collapsedUrlValue ) => {
								setAttributes( {
									collapsedUrl: collapsedUrlValue,
								} );
							} }
							help={ __(
								'When the navigtion menu is collapsed, link to this URL instead.',
								'mega-menu-block'
							) }
							autoComplete="off"
						/>
					) }
				</PanelBody>
				<PanelBody
					className="outermost-mega-menu__layout-panel"
					title={ __( 'Layout', 'mega-menu-block' ) }
					initialOpen={ true }
				>
					<HStack alignment="top" justify="space-between">
						<ToggleGroupControl
							className="block-editor-hooks__flex-layout-justification-controls"
							label={ __( 'Justification', 'mega-menu-block' ) }
							value={ justifyMenu }
							onChange={ ( justificationValue ) => {
								setAttributes( {
									justifyMenu: justificationValue,
								} );
							} }
							isDeselectable={ true }
						>
							{ justificationOptions.map(
								( { value, icon, iconLabel } ) => {
									return (
										<ToggleGroupControlOptionIcon
											key={ value }
											value={ value }
											icon={ icon }
											label={ iconLabel }
										/>
									);
								}
							) }
						</ToggleGroupControl>
						<ToggleGroupControl
							className="block-editor-hooks__flex-layout-justification-controls"
							label={ __( 'Width', 'mega-menu-block' ) }
							value={ width || 'content' }
							onChange={ ( widthValue ) => {
								setAttributes( {
									width: widthValue,
								} );
							} }
							__nextHasNoMarginBottom
						>
							{ widthOptions.map(
								( { value, icon, iconLabel } ) => {
									return (
										<ToggleGroupControlOptionIcon
											key={ value }
											value={ value }
											icon={ icon }
											label={ iconLabel }
										/>
									);
								}
							) }
						</ToggleGroupControl>
					</HStack>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<button className="wp-block-navigation-item__content wp-block-outermost-mega-menu__toggle">
					<RichText
						identifier="label"
						className="wp-block-navigation-item__label"
						value={ label }
						onChange={ ( labelValue ) =>
							setAttributes( {
								label: labelValue,
							} )
						}
						aria-label={ __(
							'Mega menu link text',
							'mega-menu-block'
						) }
						placeholder={ __( 'Add label…', 'mega-menu-block' ) }
						allowedFormats={ [
							'core/bold',
							'core/italic',
							'core/image',
							'core/strikethrough',
						] }
					/>
					<span className="wp-block-outermost-mega-menu__toggle-icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="12"
							height="12"
							viewBox="0 0 12 12"
							fill="none"
							aria-hidden="true"
							focusable="false"
						>
							<path
								d="M1.50002 4L6.00002 8L10.5 4"
								strokeWidth="1.5"
							></path>
						</svg>
					</span>
					{ description && (
						<span className="wp-block-navigation-item__description">
							{ description }
						</span>
					) }
				</button>
			</div>
		</>
	);
}
