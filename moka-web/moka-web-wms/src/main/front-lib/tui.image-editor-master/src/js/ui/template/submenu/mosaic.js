/**
 * @param {Object} submenuInfo - submenu info for make template
 *   @param {Locale} locale - Translate text
 *   @param {Function} makeSvgIcon - svg icon generator
 * @returns {string}
 */
export default ({ locale, makeSvgIcon }) => `
    <ul class="tui-image-editor-submenu-item">
        <li class="tie-mosaic-button">
            <div class="tui-image-editor-button rect">
                <div>
                    ${makeSvgIcon(['normal', 'active'], 'shape-rectangle', true)}
                </div>
                <label> ${locale.localize('Rectangle')} </label>
            </div>
            <div class="tui-image-editor-button circle">
                <div>
                    ${makeSvgIcon(['normal', 'active'], 'shape-circle', true)}
                </div>
                <label> ${locale.localize('Circle')} </label>
            </div>
        </li>
        <li class="tui-image-editor-partition only-left-right">
            <div></div>
        </li>
        <li class="tui-image-editor-newline tui-image-editor-range-wrap">
            <label class="range">${locale.localize('Mosaic')}</label>
            <div class="tie-mosaic-range"></div>
            <input class="tie-mosaic-range-value tui-image-editor-range-value" value="0" />
        </li>
    </ul>
`;
