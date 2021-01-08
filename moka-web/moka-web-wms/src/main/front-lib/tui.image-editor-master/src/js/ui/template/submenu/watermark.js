/**
 * @param {Object} submenuInfo - submenu info for make template
 *   @param {Locale} locale - Translate text
 *   @param {Function} makeSvgIcon - svg icon generator
 * @returns {string}
 */
export default ({ locale, makeSvgIcon }) => `
    <ul class="tui-image-editor-submenu-item">
        <li class="tie-watermark-add-button">
            <div class="tui-image-editor-button" style="margin:0">
                <div>
                    <input type="file" accept="image/*" class="tie-watermark-image-file">
                    ${makeSvgIcon(['normal', 'active'], 'watermark-load', true)}
                </div>
                <label>
                    ${locale.localize('Watermark load')}
                </label>
            </div>
        </li>
        <li class="tui-image-editor-partition">
            <div></div>
        </li>
        <li class="tui-image-editor-newline tui-image-editor-range-wrap">
            <label class="range">${locale.localize('opacity')}</label>
            <div class="tie-opacity-range"></div>
            <input class="tie-opacity-range-value tui-image-editor-range-value" value="1" />
        </li>
        <li class="tui-image-editor-partition hidden-partition">
            <div></div>
        </li>
        <li class="tui-image-add-button">
            <select class="tui-image-editor-selectbox"></select>
        </li>
        <li class="tui-image-editor-partition">
            <div></div>
        </li>
        <li class="tie-image-watermarks-wrap">
            <div tui-image-add-button></div>
        </li>
    </ul>
`;
