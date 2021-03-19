import React from 'react';

const MokaErrorFallback = () => {
    return (
        <div>
            <h2>Something went wrong.</h2>
            <details style={{ whiteSpace: 'pre-wrap' }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
            </details>
        </div>
    );
};

export default MokaErrorFallback;
