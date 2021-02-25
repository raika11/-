package jmnet.moka.web.schedule.mvc.gen.repository;

import jmnet.moka.web.schedule.mvc.gen.entity.GenStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GenStatusRepository extends JpaRepository<GenStatus, Long> {
}
