package jmnet.moka.common.data.mybatis.support;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.stream.Collectors;
import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.MappedStatement.Builder;
import org.apache.ibatis.mapping.ParameterMapping;
import org.apache.ibatis.mapping.SqlSource;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.plugin.Signature;
import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.RowBounds;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 
 * <pre>
 * Mybatis PaginationInterceptor
 * 2017. 4. 21. ince 최초생성
 * </pre>
 * 
 * @since 2017. 4. 21. 오후 3:32:17
 * @author ince
 */
@Intercepts({@Signature(type = Executor.class, method = "query",
        args = {MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class})})
public class PaginationInterceptor implements Interceptor {
    private final transient Logger log = LoggerFactory.getLogger(PaginationInterceptor.class);

    private final static int MAPPED_STATEMENT_INDEX = 0;

    private final static int PARAMETER_INDEX = 1;

    private final static int ROWBOUNDS_INDEX = 2;

    private final static int MAX_VALUE_CONDITION = RowBounds.NO_ROW_LIMIT;

    private Dialect dialect;

    /**
     * 
     * <pre>
     * 쿼리 실행 전 처리
     * </pre>
     * 
     * @param invocation org.apache.ibatis.plugin.Invocation
     * @return 쿼리 요청 정보
     * @throws Throwable
     * @see org.apache.ibatis.plugin.Interceptor#intercept(org.apache.ibatis.plugin.Invocation)
     */
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        final Object[] queryArgs = invocation.getArgs();
        if (queryArgs[ROWBOUNDS_INDEX] != null) {
            final RowBounds rowBounds = (RowBounds) queryArgs[ROWBOUNDS_INDEX];
            if (rowBounds.getLimit() < MAX_VALUE_CONDITION) {
                processIntercept(invocation.getArgs());
            }
        }
        queryArgs[ROWBOUNDS_INDEX] = org.apache.ibatis.session.RowBounds.DEFAULT;
        return invocation.proceed();
    }

    /**
     * 
     * <pre>
     * 파라미터 중 페이징 쿼리 전용 파라미터가 있을 경우
     * 페이징 쿼리 적용
     * </pre>
     * 
     * @param queryArgs 쿼리 정보
     */
    private void processIntercept(final Object[] queryArgs) {
        MappedStatement ms = (MappedStatement) queryArgs[MAPPED_STATEMENT_INDEX];
        Object parameter = queryArgs[PARAMETER_INDEX];
        final RowBounds rowBounds = (RowBounds) queryArgs[ROWBOUNDS_INDEX];
        if (rowBounds != null) {
            int offset = rowBounds.getOffset();
            int limit = rowBounds.getLimit();
            if (dialect.supportsLimit()
                    && (offset != RowBounds.NO_ROW_OFFSET || limit != RowBounds.NO_ROW_LIMIT)) {
                log.debug("Pagination query prepare ...");
                BoundSql boundSql = ms.getBoundSql(parameter);
                String sql = boundSql.getSql().trim();
                if (dialect.supportsLimitOffset()) {
                    sql = dialect.getLimitedSQL(sql, offset, limit);
                    offset = RowBounds.NO_ROW_OFFSET;
                } else {
                    sql = dialect.getLimitedSQL(sql, 0, limit);
                }
                BoundSql newBoundSql = copyFromBoundSql(ms, boundSql, sql);
                log.debug("Mybatis Page Search：" + sql);
                MappedStatement newMs =
                        copyFromMappedStatement(ms, new BoundSqlSqlSource(newBoundSql));
                queryArgs[MAPPED_STATEMENT_INDEX] = newMs;
            }
        }
        queryArgs[ROWBOUNDS_INDEX] = RowBounds.DEFAULT;
    }

    /**
     * 페이징 처리 쿼리에 대한 파라미터 처리
     * 
     * @param ms MappedStatement
     * @param boundSql BoundSql
     * @param sql 변경 할 쿼리문
     * @return BoundSql
     */
    private BoundSql copyFromBoundSql(MappedStatement ms, BoundSql boundSql, String sql) {
        List<ParameterMapping> mappings = boundSql.getParameterMappings();
        List<ParameterMapping> newMappings = null;

        if (mappings.isEmpty()) {
            newMappings = new ArrayList<>();
        } else {
            newMappings = mappings.stream().filter(item -> {
                return !item.getProperty().equals("limit") && !item.getProperty().equals("offset");
            }).collect(Collectors.toList());
        }

        BoundSql newBoundSql = new BoundSql(ms.getConfiguration(), sql, newMappings,
                boundSql.getParameterObject());
        for (ParameterMapping mapping : newMappings) {
            String prop = mapping.getProperty();
            if (boundSql.hasAdditionalParameter(prop)) {
                newBoundSql.setAdditionalParameter(prop, boundSql.getAdditionalParameter(prop));
            }
        }

        return newBoundSql;
    }

    /**
     * 
     * <pre>
     * 페이지 쿼리 적용 후 MappedStatement 재 생성
     * </pre>
     * 
     * @param ms MappedStatement
     * @param newSqlSource SqlSource
     * @return MappedStatement
     */
    private MappedStatement copyFromMappedStatement(MappedStatement ms, SqlSource newSqlSource) {
        Builder builder = new MappedStatement.Builder(ms.getConfiguration(), ms.getId(),
                newSqlSource, ms.getSqlCommandType());
        builder.resource(ms.getResource());
        builder.fetchSize(ms.getFetchSize());
        builder.statementType(ms.getStatementType());
        builder.keyGenerator(ms.getKeyGenerator());
        if (ms.getKeyProperties() != null && ms.getKeyProperties().length > 0) {
            builder.keyProperty(ms.getKeyProperties()[0]);
        }
        builder.timeout(ms.getTimeout());
        builder.parameterMap(ms.getParameterMap());
        builder.resultMaps(ms.getResultMaps());
        builder.resultSetType(ms.getResultSetType());
        builder.cache(ms.getCache());
        builder.flushCacheRequired(ms.isFlushCacheRequired());
        builder.statementType(ms.getStatementType());
        MappedStatement newMs = builder.build();
        return newMs;
    }

    @Override
    public Object plugin(Object target) {
        return Plugin.wrap(target, this);
    }

    /**
     * 
     * <pre>
     * org.apache.ibatis.mapping.BoundSql 구현 객체
     * 2018. 1. 5. 차상인 최초생성
     * </pre>
     * 
     * @since 2018. 1. 5. 오후 3:01:44
     * @author 차상인
     */
    public static class BoundSqlSqlSource implements SqlSource {
        BoundSql boundSql;

        public BoundSqlSqlSource(BoundSql boundSql) {
            this.boundSql = boundSql;
        }

        @Override
        public BoundSql getBoundSql(Object parameterObject) {
            return boundSql;
        }
    }

    /**
     * 
     * <pre>
     * mybatis-config 파일을 읽어 dialectClass 설정
     * </pre>
     * 
     * @param props Properties
     * @see org.apache.ibatis.plugin.Interceptor#setProperties(java.util.Properties)
     */
    @Override
    public void setProperties(Properties props) {
        String dialectClass = props.getProperty("dialectClass");
        try {
            dialect = (Dialect) Class.forName(dialectClass).newInstance();
        } catch (Exception e) {
            throw new IllegalArgumentException(dialectClass + " : can not init!");
        }
    }
}
