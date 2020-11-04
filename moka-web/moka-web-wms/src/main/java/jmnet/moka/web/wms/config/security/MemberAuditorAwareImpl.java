package jmnet.moka.web.wms.config.security;

import java.util.Optional;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class MemberAuditorAwareImpl implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {
        // Spring Security를 통한 Auditor 매핑
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.ofNullable("");
        }

        return Optional.ofNullable(authentication.getName());
    }

}
