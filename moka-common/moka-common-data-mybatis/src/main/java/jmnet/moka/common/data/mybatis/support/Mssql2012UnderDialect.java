package jmnet.moka.common.data.mybatis.support;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 
 * <pre>
 * Mybatis Mssql2012UnderDialect
 * 2020. 10. 3. ohtah 최초생성
 * </pre>
 * @since 2020. 10. 3. 오후 3:32:12
 * @author ohtah
 */
public class Mssql2012UnderDialect implements Dialect {

	public final static String SELECT = "select";

	public final static String DISTINCT = "distinct";

	public final static String TOP = "top";

	/**
	 * 
	 * <pre>
	 * 페이징 쿼리 적용 여부
	 * </pre>
	 * @return 적용 여부
	 */
	@Override
	public boolean supportsLimit() {
		return true;
	}

	/**
	 * 
	 * <pre>
	 * 페이징 쿼리 적용 여부
	 * </pre>
	 * @return 적용 여부
	 */
	@Override
	public boolean supportsLimitOffset() {
		return true;
	}
	
	/**
	 * 
	 * <pre>
	 * 전달받은 쿼리 문을 페이징 쿼리 적용하여 리턴
	 * </pre>
	 * @param sql sql문
	 * @param offset offset
	 * @param scale scale
	 * @return 페이징 쿼리 적용 된 쿼리 문
	 */
	private String getSQL(String sql, int offset, int scale) {
		int start = offset + 1;
		int end = offset + scale;
		
		StringBuffer buf = new StringBuffer();
		buf.append(NL).append("select * from (");
		buf.append(NL).append(getRowNumber(sql, scale));
		buf.append(NL).append(") OQ WHERE row_num BETWEEN ").append(start).append(" AND ").append(end);
		return buf.toString();
	}

	/**
	 * 
	 * <pre>
	 * 전달받은 쿼리 문을 페이징 쿼리 적용하여 리턴
	 * </pre>
	 * @param sql sql문
	 * @param offset offset
	 * @param scale scale
	 * @return 페이징 쿼리 적용 된 쿼리 문
	 */
	@Override
	public String getLimitedSQL(String sql, int offset, int scale) {
		sql = sql.trim();
		return getSQL(sql, offset, scale);
	}

	/**
	* sql의 select 문자 앞에 row_number 쿼리를 추가한다.
    * @param sql SQL
    * @return convert SQL
    */
	private String getRowNumber(String sql, int scale) {
		StringBuffer sqlBuffer = new StringBuffer(sql);
		int startOfSelect = getSelectPrefixIdx(sql);
		if(startOfSelect > -1) {
			StringBuffer rownumber = new StringBuffer(50)
					.append(" TOP ").append(scale).append(" ROW_NUMBER() OVER(");
			int orderByIndex = sql.toLowerCase().lastIndexOf("order by");
			if (orderByIndex > 0) {
				rownumber.append(sql.substring(orderByIndex));
				sqlBuffer = new StringBuffer(sqlBuffer.substring(0, orderByIndex));
			} else {
				rownumber.append(" ORDER BY (SELECT 1)");
			}
			rownumber.append(") AS row_num,");

			sqlBuffer.insert(startOfSelect, rownumber);
		}
		return sqlBuffer.toString();
	}

	/**
	 *
	 * <pre>
	 * row_number 쿼리를 삽입 할 위치를 찾는다.
	 * </pre>
	 * @param sql sql문
	 * @return row_number 쿼리가 위치 할 index
	 */
	private int getSelectPrefixIdx(String sql) {
//		Pattern pattern = Pattern.compile("^\\s++"+SELECT+"(\\s++"+DISTINCT+")?+(\\s++"+TOP+"\\s++\\d*)?+", Pattern.CASE_INSENSITIVE);
		Pattern pattern = Pattern.compile("^\\s*"+SELECT+"(\\s*"+DISTINCT+")*(\\s*"+TOP+"\\s*\\d*)?", Pattern.CASE_INSENSITIVE);
		Matcher matcher = pattern.matcher(sql);

		return matcher.find() ? matcher.end() : -1;
	}
}
