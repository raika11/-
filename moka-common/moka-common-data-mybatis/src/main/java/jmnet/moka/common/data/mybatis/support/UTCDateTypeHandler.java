package jmnet.moka.common.data.mybatis.support;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

import org.apache.ibatis.type.DateTypeHandler;
import org.apache.ibatis.type.JdbcType;

/**
 * 
 * <pre>
 * Mybatis UTCDateTypeHandler
 * 2017. 4. 21. ince 최초생성
 * </pre>
 * @since 2017. 4. 21. 오후 3:32:22
 * @author ince
 */
public class UTCDateTypeHandler extends DateTypeHandler {
	private static final String TIME_ZONE = "UTC";

	/**
	 * 
	 * <pre>
	 * 널 처리 후 파라미터 설정
	 * </pre>
	 * @param ps PreparedStatement
	 * @param i 컬럼 인덱스
	 * @param parameter 파라미터 값
	 * @param jdbcType JDBC type
	 * @throws SQLException
	 * @see org.apache.ibatis.type.DateTypeHandler#setNonNullParameter(java.sql.PreparedStatement, int, java.util.Date, org.apache.ibatis.type.JdbcType)
	 */
	@Override
	public void setNonNullParameter(PreparedStatement ps, int i, Date parameter, JdbcType jdbcType)
			throws SQLException {
		Timestamp stamp = new Timestamp((parameter).getTime());
		// ps.setTimestamp( i, stamp );
		Calendar cal = Calendar.getInstance(TimeZone.getTimeZone(TIME_ZONE));
		ps.setTimestamp(i, stamp, cal);
	}

	/**
	 * 
	 * <pre>
	 *  컬럼 값을 널처리 후 전달
	 * </pre>
	 * @param rs ResultSet
	 * @param columnName 컬럼 명
	 * @return 컬럼 값
	 * @throws SQLException
	 * @see org.apache.ibatis.type.DateTypeHandler#getNullableResult(java.sql.ResultSet, java.lang.String)
	 */
	@Override
	public Date getNullableResult(ResultSet rs, String columnName) throws SQLException {
		// Timestamp sqlTimestamp = rs.getTimestamp( columnName );
		Calendar cal = Calendar.getInstance(TimeZone.getTimeZone(TIME_ZONE));
		Timestamp sqlTimestamp = rs.getTimestamp(columnName, cal);
		if (sqlTimestamp != null) {
			return new Date(sqlTimestamp.getTime());
		}
		return null;
	}

	/**
	 * 
	 * <pre>
	 * 컬럼 값을 널처리 후 전달
	 * </pre>
	 * @param rs ResultSet
	 * @param columnIndex 컬럼 인덱스
	 * @return 컬럼 값
	 * @throws SQLException
	 * @see org.apache.ibatis.type.DateTypeHandler#getNullableResult(java.sql.ResultSet, int)
	 */
	@Override
	public Date getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
		// Timestamp sqlTimestamp = rs.getTimestamp( columnIndex );
		Calendar cal = Calendar.getInstance(TimeZone.getTimeZone(TIME_ZONE));
		Timestamp sqlTimestamp = rs.getTimestamp(columnIndex, cal);
		if (sqlTimestamp != null) {
			return new Date(sqlTimestamp.getTime());
		}
		return null;
	}

	/**
	 * 
	 * <pre>
	 * 컬럼 값을 널처리 후 전달
	 * </pre>
	 * @param cs CallableStatement
	 * @param columnIndex 컬럼 인덱스
	 * @return 컬럼 값
	 * @throws SQLException
	 * @see org.apache.ibatis.type.DateTypeHandler#getNullableResult(java.sql.CallableStatement, int)
	 */
	@Override
	public Date getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
		// Timestamp sqlTimestamp = cs.getTimestamp( columnIndex );
		Calendar cal = Calendar.getInstance(TimeZone.getTimeZone(TIME_ZONE));
		Timestamp sqlTimestamp = cs.getTimestamp(columnIndex, cal);
		if (sqlTimestamp != null) {
			return new Date(sqlTimestamp.getTime());
		}
		return null;
	}
}