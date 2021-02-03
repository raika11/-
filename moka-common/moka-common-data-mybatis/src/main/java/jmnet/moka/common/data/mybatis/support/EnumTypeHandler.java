package jmnet.moka.common.data.mybatis.support;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import jmnet.moka.common.utils.EnumCode;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.TypeException;
import org.apache.ibatis.type.TypeHandler;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.common.data.mybatis.support
 * ClassName : EnumTypeHandler
 * Created : 2021-01-11 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-11 14:32
 */
public class EnumTypeHandler<E extends Enum<E>> implements TypeHandler<EnumCode> {

    private Class<E> type;

    public EnumTypeHandler(Class<E> type) {
        this.type = type;
    }

    @Override
    public void setParameter(PreparedStatement preparedStatement, int i, EnumCode enumCode, JdbcType jdbcType)
            throws SQLException {
        preparedStatement.setString(i, enumCode.getCode());
    }

    @Override
    public EnumCode getResult(ResultSet resultSet, String s)
            throws SQLException {
        String code = resultSet.getString(s);
        return getCodeEnum(code);
    }

    @Override
    public EnumCode getResult(ResultSet resultSet, int i)
            throws SQLException {
        String code = resultSet.getString(i);
        return getCodeEnum(code);
    }

    @Override
    public EnumCode getResult(CallableStatement callableStatement, int i)
            throws SQLException {
        String code = callableStatement.getString(i);
        return getCodeEnum(code);
    }

    private EnumCode getCodeEnum(String code) {
        try {
            EnumCode[] enumConstants = (EnumCode[]) type.getEnumConstants();
            for (EnumCode codeNum : enumConstants) {
                if (codeNum
                        .getCode()
                        .equals(code)) {
                    return codeNum;
                }
            }
            return null;
        } catch (Exception e) {
            throw new TypeException("Can't make enum object '" + type + "'", e);
        }
    }
}
