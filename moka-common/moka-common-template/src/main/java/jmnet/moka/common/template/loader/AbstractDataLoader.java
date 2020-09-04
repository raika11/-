package jmnet.moka.common.template.loader;

import java.util.Map;

import org.json.simple.parser.ParseException;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.template.exception.DataLoadException;

public abstract class AbstractDataLoader implements DataLoader {
	
	@Override
	public JSONResult getJSONResult(String url, Map<String, Object> parameterMap, boolean isApi) throws DataLoadException {
		try {
			return JSONResult.parseJSON(getRawData(url, parameterMap, isApi));
		} catch (ParseException e) {
			throw new DataLoadException("Can't Parse Loaded Json : " + e.getMessage() , e);
		}
	}
	
//	@SuppressWarnings("unchecked")
//	protected Map<String,Object> jsonParse(String rawData) throws DataLoadException  {
//		try {
//			JSONParser jsonParser = new JSONParser();
//			Object object = jsonParser.parse(rawData);
//			return (Map<String,Object>)object;
//			if ( object instanceof JSONObject) {
//				JSONArray jsonArray = (JSONArray)((JSONObject)object).get(select);
//				return jsonToListHashMap(jsonArray);
//			} else {
//				return null;
//			}
//		} catch (ParseException e) {
//			throw new DataLoadException("Can't Parse Loaded Json : " + e.getMessage() , e);
//		}
//	}
	
//	@SuppressWarnings("unchecked")
//	protected List<HashMap<String,Object>> jsonToListHashMap(JSONArray jsonArray) {
//		List<HashMap<String,Object>> result = new ArrayList<HashMap<String,Object>>(); 
//		if ( jsonArray != null) {
//			Iterator<?> iterator = jsonArray.iterator();
//			while ( iterator.hasNext()) {
//				JSONObject json = (JSONObject)iterator.next();
//				result.add((HashMap<String,Object>)json);
//			}
//		}
//		return result;
//	}
}
