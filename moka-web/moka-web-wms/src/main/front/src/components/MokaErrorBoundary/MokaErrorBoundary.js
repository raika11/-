import React from 'react';
import MokaErrorFallback from './MokaErrorFallback';

/**
 * 빌드 후 요청하는 chunks가 변경되어도, 새로고침 하지 않아 이전의 chunks를 계속 요청하는 경우,
 * 즉 lazy loading하는 컴포넌트의 로드 실패 시 강제로 새로고침한다.
 * Suspense 사용 전에 반드시 해당 컴포넌트를 선언한다.
 * @see https://satisfactoryplace.tistory.com/194
 * @see https://ko.reactjs.org/docs/error-boundaries.html
 */
class MokaErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트 합니다.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Catch errors in any components below and re-render with error message
        this.setState({
            error: error,
            errorInfo: errorInfo,
        });
        // You can also log error messages to an error reporting service here
    }

    render() {
        if (this.state.hasError) {
            // Error path
            return <MokaErrorFallback />;
        }
        // Normally, just render children
        return this.props.children;
    }
}

export default MokaErrorBoundary;
