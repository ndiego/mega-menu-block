/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, RichText, useBlockProps } from '@wordpress/block-editor';
import { useEntityRecords } from '@wordpress/core-data';
import {
	PanelBody,
	SelectControl,
	TextControl,
	TextareaControl,
} from '@wordpress/components';

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
	const { label, menuSlug, title, description } = attributes;
	const blockProps = useBlockProps( { 
		className: 'wp-block-navigation-item'
	} );

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

	return (
		<>
			<InspectorControls group="settings">
				<PanelBody
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
					<SelectControl
						label={ __( 'Menu Template', 'mega-menu-block' ) }
						value={ menuSlug }
						options={ menuOptions }
						onChange={ ( value ) =>
							setAttributes( { menuSlug: value } )
						}
					/>
					{ ! menuOptions && (
						<div>
							TODO: Add notice for when there are no menu
							templates. This should link to template part creator
							in Site Editor
							Need to also detect if the chosen menu template still exists or not
						</div>
					) }
					<TextareaControl
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
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<a className='wp-block-navigation-item__content'>
					<RichText
						//ref={ ref }
						identifier="label"
						className="wp-block-navigation-item__label"
						value={ label }
						onChange={ ( labelValue ) =>
							setAttributes( {
								label: labelValue,
							} )
						}
						aria-label={ __(
							'Mega menu link text'
						) }
						placeholder={ __( 'Add label…', 'mega-menu-block' ) }
						allowedFormats={ [
							'core/bold',
							'core/italic',
							'core/image',
							'core/strikethrough',
						] }
					/>
					{ description && (
						<span className="wp-block-navigation-item__description">
							{ description }
						</span>
					) }
				</a>
			</div>
		</>
	);
}
