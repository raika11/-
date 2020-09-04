package jmnet.moka.core.tms.merge.item;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.core.common.ItemConstants;

public abstract class MergeItem extends HashMap<String, Object> {
	private static final long serialVersionUID = 3472818244092408354L;
    private long lastLoaded;

    public MergeItem() {
        this.lastLoaded = System.currentTimeMillis();
    }

	public Object put(String key, Object value) {
        if (value instanceof List || value instanceof Map) {
            super.put(key, value);
        } else if (value instanceof String == false && value != null) {
			String stringValue = value.toString();
            super.put(key, stringValue);
			return stringValue;
        } else {
            super.put(key, value);
		}
		return value;
	}
	
    public String getString(String key) {
        Object value = this.get(key);
        if (value instanceof String) {
            return (String) value;
        } else {
            return value == null ? null : value.toString();
        }
    }

    public int getInt(String key) {
        Object value = this.get(key);
        if (value instanceof Integer) {
            return ((Integer) value).intValue();
        } else if (value instanceof String) {
            return Integer.parseInt((String) value);
        }
        return Integer.MIN_VALUE;
    }

    public long getLastLoaded() {
        return this.lastLoaded;
    }

    public void resetLastLoad() {
        this.lastLoaded = System.currentTimeMillis();
    }

    public boolean getBool(String key) {
        Object value = this.get(key);
        if (value instanceof Boolean) {
            return ((Boolean) value).booleanValue();
        } else {
            return false;
        }
    }

    public boolean getBoolYN(String key) {
        String value = this.getString(key);
        if (value.equals("Y")) {
            return true;
        } else {
            return false;
        }
    }

    public boolean equalsModified(MergeItem item) {
        String currentModified = this.getString(ItemConstants.ITEM_MODIFIED);
        String newModified = item.getString(ItemConstants.ITEM_MODIFIED);
        if (currentModified == null) {
            if (newModified == null) {
                return true;
            } else {
                return false;
            }
        } else if (newModified == null) {
            return false; // 현재 템플릿의 modified가 null 이 아닌 상태에서 최신 템플릿의 modified가 null인 경우는 없지만
        } else if (currentModified.equals(newModified)) {
            return true;
        }
        return false;
    }


    public abstract String getItemType();

    public abstract String getItemId();

    //	public String getItemType() {
    //        if (this.containsKey(ItemConstants.get(ItemConstants.COMPONENT_ID))) {
    //			return MspConstants.ITEM_COMPONENT;
    //        } else if (this.containsKey(ItemConstants.get(ItemConstants.TEMPLATE_ID))) {
    //			return MspConstants.ITEM_TEMPLATE;
    //        } else if (this.containsKey(ItemConstants.get(ItemConstants.CONTAINER_ID))) {
    //			return MspConstants.ITEM_CONTAINER;
    //        } else if (this.containsKey(ItemConstants.get(ItemConstants.PAGE_ID))) {
    //			return MspConstants.ITEM_PAGE;
    //        } else if (this.containsKey(ItemConstants.get(ItemConstants.SKIN_ID))) {
    //            return MspConstants.ITEM_SKIN;
    //		} else {
    //			return MspConstants.ITEM_UNKNOWN;
    //		}
    //	}
    //	
    //	public String getItemId() {
    //		String itemType = getItemType();
    //		if ( itemType.equals(MspConstants.ITEM_COMPONENT)) {
    //            return (String) this.get(ItemConstants.get(ItemConstants.COMPONENT_ID));
    //		} else if ( itemType.equals(MspConstants.ITEM_TEMPLATE)) {
    //            return (String) this.get(ItemConstants.get(ItemConstants.TEMPLATE_ID));
    //		} else if ( itemType.equals(MspConstants.ITEM_CONTAINER)) {
    //            return (String) this.get(ItemConstants.get(ItemConstants.CONTAINER_ID));
    //		} else if ( itemType.equals(MspConstants.ITEM_PAGE)) {
    //            return (String) this.get(ItemConstants.get(ItemConstants.PAGE_ID));
    //		} else {
    //			return null;
    //		}
    //	}

}
