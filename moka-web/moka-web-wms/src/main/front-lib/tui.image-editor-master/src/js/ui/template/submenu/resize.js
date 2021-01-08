/**
 * @param {Object} submenuInfo - submenu info for make template
 *   @param {Locale} locale - Translate text
 *   @param {Function} makeSvgIcon - svg icon generator
 * @returns {string}
 */
export default ({ locale, makeSvgIcon }) => `
    <ul class="tui-image-editor-submenu-item">
        <li class="tui-image-editor-newline tui-image-editor-range-wrap">
            <label class="range">${locale.localize('Range')}</label>
            <div class="tie-resize-range"></div>
            <input class="tie-resize-range-value tui-image-editor-range-value" value="0" />
        </li>
        <li class="tui-image-editor-newline tie-resize-edit image-size">
            <input type="number" class="image-width resize-width" />
            <span>X</span>
            <input type="number" class="image-height resize-height" />
        </li>
        <li class="tie-resize-button action">
            <div class="tui-image-editor-button apply">
                ${makeSvgIcon(['normal', 'active'], 'apply')}
                <label>
                    ${locale.localize('Apply')}
                </label>
            </div>
            <div class="tui-image-editor-button cancel">
                ${makeSvgIcon(['normal', 'active'], 'cancel')}
                <label>
                    ${locale.localize('Cancel')}
                </label>
            </div>
        </li>
    </ul>
`;
