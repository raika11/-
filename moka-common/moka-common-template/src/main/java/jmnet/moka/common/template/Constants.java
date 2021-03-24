package jmnet.moka.common.template;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import jmnet.moka.common.ApiResult;

/**
 * 
 * <pre>
 * 템플릿 처리를 위한 상수와 함수를 포함한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * @since 2019. 9. 4. 오후 4:16:07
 * @author kspark
 */
public class Constants {
	/* Custom Tag */
	public final static String PREFIX = "tems:";
	public final static String ELEMENT_MERGER_PACKAGE = "jmnet.moka.common.template.merge.element";
	public final static String ELEMENT_MERGER_POSTFIX = "Merger";
	public final static String EL_CT = PREFIX + "ct";
    public final static String EL_CP = PREFIX + "cp";
	public final static String EL_TP = PREFIX + "tp";
    public final static String EL_AD = PREFIX + "ad";
	public final static String EL_LOOP = PREFIX + "loop";
	public final static String EL_CASE = PREFIX + "case";
	public final static String EL_SET = PREFIX + "set";
	public final static String EL_DATA = PREFIX + "data";
	public final static String EL_PRESERVE = PREFIX + "preserve";
	public final static String EL_SCRIPT = PREFIX + "script";
	public final static String EL_PARAM = PREFIX + "param";
	public final static String EL_PAGING = PREFIX + "paging";
	public final static String EL_PREV_PAGE = PREFIX + "prevPage";
	public final static String EL_OTHER_PAGE = PREFIX + "otherPage";
	public final static String EL_CURRENT_PAGE = PREFIX + "currentPage";
	public final static String EL_NEXT_PAGE = PREFIX + "nextPage";
    public final static String EL_CHOOSE = PREFIX + "choose";
    public final static String EL_OTHERWISE = PREFIX + "otherwise";
    public final static String EL_SPLIT = PREFIX + "split";
	public final static String NODE_ROOT = "ROOT";
	public final static String NODE_TEXT = "TEXT";
	public final static String NODE_TOKEN = "TOKEN";

	/* Custom Tag Attribute */
	public final static String ATTR_ID = "id";
	public final static String ATTR_DATA = "data";
    public final static String ATTR_DATA_ID = "dataId";
	public final static String ATTR_START = "start";
	public final static String ATTR_COUNT = "count";
	public final static String ATTR_SELECT = "select";
    public final static String ATTR_FILTER = "filter";
    public final static String ATTR_STEP = "step";
	public final static String ATTR_IF = "if";
	public final static String ATTR_API = "api";
	public final static String ATTR_URL = "url";
	public final static String ATTR_NAME = "name";
	public final static String ATTR_VALUE = "value";
//	public final static String ATTR_DESC = "desc";
	public final static String ATTR_VAR = "var";
	public final static String ATTR_FILL = "fill";
    public final static String ATTR_TOKEN = "token";
    public final static String ATTR_SEPARATOR = "separator";

	/* Template Kind */
	public final static String ITEM_PAGE = "PG"; 		// 페이지
    public final static String ITEM_CONTAINER = "CT";	// 컨테이너
	public final static String ITEM_COMPONENT = "CP";	// 컴포넌트
	public final static String ITEM_TEMPLATE = "TP"; 	// 템플릿
    public final static String ITEM_AD = "AD"; 	// 광고
	
	/* for Template Parser */
	public final static short ELEMENT_START = 1;
	public final static short ELEMENT_END = 2;
	public final static short ELEMENT_WHOLE = 3;
	public final static short ELEMENT_NONE = 4;
	public final static char TOKEN_1 = '$';
	public final static char TOKEN_2 = '{';
	public final static char TOKEN_3 = '}';
	public final static String TOKEN_START = Character.toString(TOKEN_1) + Character.toString(TOKEN_2);
	public final static String TOKEN_END = Character.toString(TOKEN_3);
	public final static String START_PREFIX = "<" + PREFIX;
	public final static String END_PREFIX = "</" + PREFIX;
	public final static int START_PREFIX_LENGTH = START_PREFIX.length();
	public final static int END_PREFIX_LENGTH = END_PREFIX.length();

	/* Node Type */
	public final static short TYPE_ROOT = 0;
	public final static short TYPE_CT = 1;
	public final static short TYPE_CP = 2;
	public final static short TYPE_TP = 3;
    public final static short TYPE_AD = 4;
    public final static short TYPE_TEXT = 5;
    public final static short TYPE_TOKEN = 6;
    public final static short TYPE_STATEMENT = 7;
	public final static short TYPE_UNKNOWN = -1;
	
	/* Info Key Names ( except attrs )*/
	public final static String INFO_NODE_NAME = "nodeName";
	public final static String INFO_NAME = "name";
	public final static String INFO_LINE= "line";
	public final static String INFO_TEXT= "text";
	public final static String INFO_LEVEL= "level";
	public final static String INFO_CONTENT= "content";
    public final static String INFO_CUSTOM = "custom";
	public final static String INFO_ERROR= "error";
		
	/* Component JSON */
	public final static String COMPONENT_ID = "componentId";
	public final static String COMPONENT_NAME = "name";
	public final static String COMPONENT_TEMPLATE_ID = "templateId";
	public final static String COMPONENT_API = "api";
	public final static String COMPONENT_PARAM = "param";
	
	public final static String RESERVED_VARIABLE_PREFIX = "_";
	/* Context Entry Name  */
	public final static String MERGE_OPTIONS = RESERVED_VARIABLE_PREFIX +"mergeOptions";
	public final static String CURRENT_INDENT = RESERVED_VARIABLE_PREFIX +"currentIndent";
	public final static String PREV_HAS_TAIL_SPACE = RESERVED_VARIABLE_PREFIX +"prevHasTailSpace";
	
	/* Context Entry Name & Reserved Variables in Template */
    public final static String PARENT = "parent";	// parent Context 참조
    public final static String DEFAULT_DATA_NAME = RESERVED_VARIABLE_PREFIX + "RESULT";
    public final static String DEFAULT_LOOP_DATA_SELECT = ApiResult.MAIN_DATA;
    public final static String DEFAULT_LOOP_DATA_SIZE = RESERVED_VARIABLE_PREFIX+ "DATA_SIZE";
    public final static String CURRENT_DATA_ID = RESERVED_VARIABLE_PREFIX + "CURRENT_DATA_ID"; // dataId 지정
	public final static String LOOP_INDEX = RESERVED_VARIABLE_PREFIX +"INDEX";  // loop의 index
	public final static String LOOP_TOTAL_INDEX = RESERVED_VARIABLE_PREFIX +"TOTAL_INDEX";  // (페이지-1)*건수 + loop의 index
	public final static String LOOP_START = RESERVED_VARIABLE_PREFIX +"START";  // loop의 start
	public final static String LOOP_COUNT = RESERVED_VARIABLE_PREFIX +"COUNT";  // loop의 count
	public final static String LOOP_DATA_ROW = RESERVED_VARIABLE_PREFIX +"ROW";
	public final static String LOOP_DATA_FILL = RESERVED_VARIABLE_PREFIX +"FILL";
    public final static String SPLIT_TOKEN = RESERVED_VARIABLE_PREFIX + "TOKEN";
	public final static String TRAVERSE_INDENT = "  ";

	/* Reserved Parameter (maybe Http) */
    public final static String PARAM = "param";  // request parameter
    public final static String PARAM_PAGE = "page";  // request 페이지 인덱스 parameter
    public final static String PARAM_COUNT = "count";  // request 리스트 당 건수 parameter
    public final static String PARAM_SORT = "sort";  // request 정렬 parameter
	public final static int PARAM_PAGE_DEFAULT = 1;
    public final static int PARAM_COUNT_DEFAULT = 10;
	public final static String PAGE_NO_TOKEN_NAME = "pageNo";
	public final static String COUNT_TOKEN_NAME = "pageCount";
	public final static String NO_PREV_TOKEN_NAME = "noPrev";
	public final static String NO_NEXT_TOKEN_NAME = "noNext";

	public final static String WRAP_ITEM_TYPE = "itemType";
	public final static String WRAP_ITEM_ID = "itemId";
	public final static String WRAP_ITEM_START = "<div data-mte-type=\"${"+WRAP_ITEM_TYPE+"}\" data-mte-id=\"${"+WRAP_ITEM_ID+"}\">";
	public final static String WRAP_ITEM_END = "</div>";
	public static HashMap<String,Short> name2NodeTypeMap = new HashMap<String, Short>();
	public static HashMap<String,String> name2ItemMap = new HashMap<String, String>();
	public static List<String> RESERVED_VARIABLES = new ArrayList<String>(64);
	
	static {
		name2NodeTypeMap.put(EL_CT, TYPE_CT);
		name2NodeTypeMap.put(EL_TP, TYPE_TP);
		name2NodeTypeMap.put(EL_CP, TYPE_CP);
        name2NodeTypeMap.put(EL_AD, TYPE_AD);
		name2NodeTypeMap.put(EL_LOOP, TYPE_STATEMENT);
		name2NodeTypeMap.put(EL_CASE, TYPE_STATEMENT);
		name2NodeTypeMap.put(EL_SET, TYPE_STATEMENT);
		name2NodeTypeMap.put(EL_DATA, TYPE_STATEMENT);
		name2NodeTypeMap.put(EL_SCRIPT, TYPE_STATEMENT);
		name2NodeTypeMap.put(EL_PARAM, TYPE_STATEMENT);
		name2NodeTypeMap.put(EL_PAGING, TYPE_STATEMENT);
		name2NodeTypeMap.put(EL_PREV_PAGE, TYPE_STATEMENT);
		name2NodeTypeMap.put(EL_OTHER_PAGE, TYPE_STATEMENT);
		name2NodeTypeMap.put(EL_CURRENT_PAGE, TYPE_STATEMENT);
		name2NodeTypeMap.put(EL_NEXT_PAGE, TYPE_STATEMENT);
        name2NodeTypeMap.put(EL_CHOOSE, TYPE_STATEMENT);
        name2NodeTypeMap.put(EL_OTHERWISE, TYPE_STATEMENT);
		name2NodeTypeMap.put(NODE_ROOT, TYPE_ROOT);
		name2NodeTypeMap.put(NODE_TEXT, TYPE_TEXT);
		name2NodeTypeMap.put(NODE_TOKEN, TYPE_TOKEN);
		
		RESERVED_VARIABLES.addAll(Arrays.asList(new String[]{MERGE_OPTIONS, CURRENT_INDENT, PREV_HAS_TAIL_SPACE, LOOP_INDEX, PARENT}));
		
		name2ItemMap.put(EL_CP, ITEM_COMPONENT);
		name2ItemMap.put(EL_TP, ITEM_TEMPLATE);
		name2ItemMap.put(EL_CT, ITEM_CONTAINER);
        name2ItemMap.put(EL_AD, ITEM_AD);
	}
	
	/**
	 * 
	 * <pre>
	 * 노드이름으로 노드 타입을 가져온다.
	 * </pre>
	 * @param name 노드이름
	 * @return Node Type
	 */
	public static short nodeType(String name) {
		Short type = name2NodeTypeMap.get(name);
		if ( type == null ) return TYPE_UNKNOWN;
		return type;
	}
	
	/**
	 * <pre>
	 * 템플릿을 가지고 있는 Node Type 여부를 반환한다.
	 * </pre>
	 * @param type Node Type
	 * @return 템플릿 여부
	 */
    public static boolean hasTemplate(short type) {
        return type == TYPE_TP || type == TYPE_CP || type == TYPE_CT || type == TYPE_AD;
	}
	
	/**
	 * <pre>
	 * 하위 텍스트를 그대로 유지한다. 즉, token을 파싱하지 않는다.
	 * </pre>
	 * @param element 엘리먼트
	 * @return 하위 텍스트 보존여부
	 */
	public static boolean preserveChildText(String element) {
		return element.equals(EL_SCRIPT)||element.equals(EL_PRESERVE);
	}
	
}
