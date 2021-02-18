package jmnet.moka.web.schedule.mvc.gen.repository;

import java.util.List;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.EntityGraph.EntityGraphType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface GenContentRepository extends JpaRepository<GenContent, Long> {

    /**
     * Gen Content 목록 조회
     *
     * @param usedYn 사용 여부
     * @return Gen Content 목록
     */
    @EntityGraph(attributePaths = {"genTarget", "genStatus"}, type = EntityGraphType.LOAD)
    List<GenContent> findAllByUsedYn(String usedYn);

    /**
     * jobType 에 해당하는 Gen Content 조회.
     *
     * @param usedYn 사용 여부
     * @return Gen Content
     */
    @EntityGraph(attributePaths = {"genTarget", "genStatus"}, type = EntityGraphType.LOAD)
    List<GenContent> findAllByUsedYnAndDelYnAndJobType(String usedYn, String delYn, String jobType);



    /**
     * WorkType에 해당하는 Gen Content 조회. 테이블 변경시 메소드명 변경 필요
     *
     * @param usedYn 사용 여부
     * @return Gen Content
     */
    @EntityGraph(attributePaths = {"genTarget", "genStatus"}, type = EntityGraphType.LOAD)
    GenContent findFirstByCategoryAndUsedYn(String workType, String usedYn);
}
