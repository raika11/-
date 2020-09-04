package jmnet.moka.common.data.mybatis.support;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

/**
 * 
 * <pre>
 * Mybatis CharacterTypeHandler
 * 2017. 4. 21. ince 최초생성
 * </pre>
 * @since 2017. 4. 21. 오후 3:32:02
 * @author ince
 */
public class CharacterTypeHandler extends BaseTypeHandler<Object> {
	public void setNonNullParameter(PreparedStatement ps, int i, Character parameter,
			JdbcType jdbcType) throws SQLException {
		ps.setString(i, parameter.toString());
	}

	/**
	 * 
	 * <pre>
	 * 컬럼명에 해당하는 결과값 널 처리 후 리턴
	 * </pre>
	 * @param rs ResultSet
	 * @param columnName 컬럼명
	 * @return 컬럼 값
	 * @throws SQLException
	 * @see org.apache.ibatis.type.BaseTypeHandler#getNullableResult(java.sql.ResultSet, java.lang.String)
	 */
	@Override
	public String getNullableResult(ResultSet rs, String columnName) throws SQLException {
		return rs.getString(columnName);
	}

	/**
	 * 
	 * <pre>
	 * 컬럼 인덱스에 해당하는 결과값 널 처리 후 리턴
	 * </pre>
	 * @param cs CallableStatement
	 * @param columnIndex 컬럼 인덱스
	 * @return 컬럼 값
	 * @throws SQLException
	 * @see org.apache.ibatis.type.BaseTypeHandler#getNullableResult(java.sql.CallableStatement, int)
	 */
	@Override
	public String getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
		return cs.getString(columnIndex);
	}

	/**
	 * 
	 * <pre>
	 * 파라미터 설정
	 * </pre>
	 * @param ps PreparedStatement
	 * @param i 인덱스
	 * @param parameter 파라미터
	 * @param jdbcType jdbc 타입
	 * @throws SQLException
	 * @see org.apache.ibatis.type.BaseTypeHandler#setNonNullParameter(java.sql.PreparedStatement, int, java.lang.Object, org.apache.ibatis.type.JdbcType)
	 */
	@Override
	public void setNonNullParameter(PreparedStatement ps, int i, Object parameter,
			JdbcType jdbcType) throws SQLException {
		ps.setString(i, parameter.toString());
	}

	/**
	 * 
	 * <pre>
	 * 컬럼 인덱스에 해당하는 결과값 널 처리 후 리턴
	 * </pre>
	 * @param rs ResultSet
	 * @param columnIndex 컬럼 인덱스
	 * @return 컬럼 값
	 * @throws SQLException
	 * @see org.apache.ibatis.type.BaseTypeHandler#getNullableResult(java.sql.ResultSet, int)
	 */
	@Override
	public String getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
		return rs.getString(columnIndex);
	}
}