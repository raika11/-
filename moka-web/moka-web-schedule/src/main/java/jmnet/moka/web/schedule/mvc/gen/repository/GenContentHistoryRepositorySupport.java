package jmnet.moka.web.schedule.mvc.gen.repository;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.gen.repository
 * ClassName : GenContentHistoryRepositorySupport
 * Created : 2021-02-23 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-23 13:13
 */
public interface GenContentHistoryRepositorySupport {

    /**
     * 예약 설정 되어 있는 동일 jobTaskId 건수
     *
     * @param jobTaskId task id
     * @return 건수
     */
    long countByJobTaskId(String jobTaskId);
}
