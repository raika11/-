package jmnet.moka.core.tps.mvc.user.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import jmnet.moka.core.tps.mvc.user.entity.User;

public interface UserRepository extends JpaRepository<User, String> {

    // public Optional<User> findByUserIdAndUserPassword(String userId, String userPassword);
    public Optional<User> findByUserId(String userId);
}
