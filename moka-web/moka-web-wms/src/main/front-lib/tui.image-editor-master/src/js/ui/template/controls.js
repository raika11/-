export default ({ locale, title, loadButtonStyle, downloadButtonStyle }) => `
    <div class="tui-image-editor-controls">
        <div class="tui-image-editor-controls-logo">
            <span>${title}</span>
        </div>
        <ul class="tui-image-editor-menu"></ul>

        <div class="tui-image-editor-controls-buttons">
            <div style="${loadButtonStyle}">
                ${locale.localize('Load')}
                <input type="file" class="tui-image-editor-load-btn" />
            </div>
            <button class="tui-image-editor-download-btn" style="${downloadButtonStyle}">
                ${locale.localize('Download')}
            </button>
        </div>
    </div>
`;
