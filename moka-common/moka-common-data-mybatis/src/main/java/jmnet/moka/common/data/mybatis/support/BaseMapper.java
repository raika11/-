package jmnet.moka.common.data.mybatis.support;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.session.RowBounds;

/**
 * <pre>
 * Mybatis Base Mapper
 * 2017. 4. 21. ince 최초생성
 * </pre>
 *
 * @param <T>
 * @author ince
 * @since 2017. 4. 21. 오후 3:31:33
 */
public interface BaseMapper<T, P> {

    String TOTAL_ROWCOUNT = "TOTAL_CNT";

    /**
     * <pre>
     * 신규 데이타 생성 또는 기존 데이타 갱신 처리
     * </pre>
     *
     * @param model
     * @throws RuntimeException
     */
    void save(P model)
            throws RuntimeException;

    /**
     * <pre>
     * 신규 데이타 생성 처리
     * </pre>
     *
     * @param model
     * @throws RuntimeException
     */
    int add(P model)
            throws RuntimeException;

    /**
     * <pre>
     * 데이타 갱신 처리
     * </pre>
     *
     * @param model
     * @throws RuntimeException
     */
    int modify(P model)
            throws RuntimeException;

    /**
     * <pre>
     * 데이타 삭제 처리
     * </pre>
     *
     * @param model Model
     * @throws RuntimeException
     */
    int delete(P model)
            throws RuntimeException;

    /**
     * <pre>
     * 데이타 삭제 처리
     * </pre>
     *
     * @param id
     * @throws RuntimeException
     */
    int deleteById(Object id)
            throws RuntimeException;

    /**
     * <pre>
     * 데이타 비활성화(사용 안함) 상태 처리
     * </pre>
     *
     * @param id
     * @throws RuntimeException
     */
    void disable(Object id)
            throws RuntimeException;

    /**
     * <pre>
     * 모델 T 에 관한 Key 에 해당하는 데이타 조회
     * </pre>
     *
     * @param id
     * @return 모델 T
     * @throws RuntimeException
     */
    T findById(Object id)
            throws RuntimeException;

    /**
     * <pre>
     * 모델 T 에 관한 param값에 해당하는 데이타 조회
     * </pre>
     *
     * @param param
     * @return 모델 T
     * @throws RuntimeException
     */
    T findOne(P param)
            throws RuntimeException;

    /**
     * <pre>
     * 모델 T 에 관한 목록 조회
     * </pre>
     *
     * @param map
     * @return List<T>
     * @throws RuntimeException
     */
    List<T> findAll(Map<String, Object> map)
            throws RuntimeException;

    /**
     * <pre>
     * 모델 T 에 관한 페이징 목록 조회
     * </pre>
     *
     * @param map
     * @param bounds
     * @return List<T>
     */
    List<T> findAll(Map<String, Object> map, RowBounds bounds);


    /**
     * <pre>
     * 모델 T 에 관한 목록 조회
     * </pre>
     *
     * @param param
     * @return List<T>
     * @throws RuntimeException
     */
    List<T> findAll(P param)
            throws RuntimeException;

    /**
     * <pre>
     * 모델 T 에 관한 페이징 목록 조회
     * </pre>
     *
     * @param param
     * @param bounds
     * @return List<T>
     */
    List<T> findAll(P param, RowBounds bounds);

    /**
     * <pre>
     * 건수 조회
     * </pre>
     *
     * @param param
     * @return long
     * @throws RuntimeException
     */
    long count(P param)
            throws RuntimeException;

    /**
     * <pre>
     * 건수 조회
     * </pre>
     *
     * @param map
     * @return long
     * @throws RuntimeException
     */
    long count(Map<String, Object> map)
            throws RuntimeException;


    /**
     * <pre>
     * 조회 조건에 해당하는 Map 데이타 조회
     * </pre>
     *
     * @param id
     * @return Map<String, Object>
     * @throws RuntimeException
     */
    Map<String, Object> findByIdForMap(Object id)
            throws RuntimeException;

    /**
     * <pre>
     * 목록형 Map 데이타 조회
     * </pre>
     *
     * @param map 조회 조건에 사용 될 파라미터 Map
     * @return 목록형 Map 데이타
     * @throws RuntimeException
     */
    List<Map<String, Object>> findAllForMap(Map<String, Object> map)
            throws RuntimeException;

    /**
     * <pre>
     * 목록형 Map 데이타에 관한 페이징 목록 조회
     * </pre>
     *
     * @param map
     * @param bounds
     * @return List
     */
    List<Map<String, Object>> findAllForMap(Map<String, Object> map, RowBounds bounds);
}
