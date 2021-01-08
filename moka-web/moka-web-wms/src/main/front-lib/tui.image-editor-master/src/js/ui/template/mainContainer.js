export default ({
    locale,
    title,
    headerStyle,
    downloadButtonStyle,
    applyButtonStyle,
    submenuStyle,
    text,
}) => `
    <div class="tui-image-editor-main-container">
        <div class="tui-image-editor-header" style="${headerStyle}">
            <div class="tui-image-editor-header-logo">
                <span>${title}</span>
            </div>
            <div class="tui-image-editor-header-buttons">
                <button class="tui-image-editor-download-btn" style="${downloadButtonStyle}">
                    ${locale.localize(text.download)}
                </button>
                <button class="tui-image-editor-apply-btn" style="${applyButtonStyle}">
                    ${locale.localize(text.apply)}
                </button>
                <button class="tui-image-editor-cancel-btn" >
                    ${locale.localize(text.close)}
                </button>
            </div>
        </div>
        <div class="tui-image-editor-main">
            <div class="tui-image-editor-submenu">
                <div class="tui-image-editor-submenu-style" style="${submenuStyle}"></div>
            </div>
            <div class="tui-image-editor-zoom-wrap active">
                <label class="range">${locale.localize('Zoom')}</label>
                <div class="tie-zoom-range"></div>
                <input class="tie-zoom-range-value tui-image-editor-vertical-range-value" value="1" />
            </div>
            <div class="tui-image-editor-wrap">
                <div class="tui-image-editor-size-wrap">
                    <div class="tui-image-editor-align-wrap">
                        <div class="tui-image-editor"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
