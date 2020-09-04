package jmnet.moka.common.template.merge;

/**
 * 
 * <pre>
 * 머지 옵션을 지정한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * @since 2019. 9. 4. 오후 5:59:14
 * @author kspark
 */
public class MergeOptions {
	private boolean debug;
    private boolean preview;
    private boolean previewResource;
	private boolean wrapItem;
	private String showItem;
	private String showItemId;
	
	public MergeOptions() {
		this.debug = false;
	}
	public MergeOptions(boolean debug, boolean wrapItem) {
		this.debug = debug;
		this.wrapItem = wrapItem;
	}

	public boolean isDebug() {
		return debug;
	}

	public void setDebug(boolean debug) {
		this.debug = debug;
	}
	public boolean isWrapItem() {
		return wrapItem;
	}
	public void setWrapItem(boolean wrapItem) {
		this.wrapItem = wrapItem;
	}
	public String getShowItem() {
		return showItem;
	}
	public void setShowItem(String showItem) {
		this.showItem = showItem;
	}
	public String getShowItemId() {
		return showItemId;
	}
	public void setShowItemId(String highlightElementId) {
		this.showItemId = highlightElementId;
	}

    public boolean isPreviewResource() {
        return previewResource;
    }

    public void setPreviewResource(boolean preview) {
        this.previewResource = preview;
    }

    public boolean isPreview() {
        return preview;
    }

    public void setPreview(boolean preview) {
        this.preview = preview;
    }
	
}
