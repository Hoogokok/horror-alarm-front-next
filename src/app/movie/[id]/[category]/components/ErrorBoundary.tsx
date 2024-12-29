'use client';

import { Component, ReactNode } from 'react';
import styles from '../error.module.css';

interface ErrorBoundaryProps {
    children: ReactNode;
    componentName?: string;
}

interface ErrorBoundaryState {
    error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { error };
    }

    componentDidCatch(error: Error) {
        console.error(`${this.props.componentName} 에러:`, error);
    }

    render() {
        if (this.state.error) {
            return (
                <div className={styles.errorContainer}>
                    <h2>오류가 발생했습니다</h2>
                    <p>{this.state.error.message || `${this.props.componentName}를 불러오는 중 문제가 발생했습니다.`}</p>
                    <button onClick={() => this.setState({ error: null })} className={styles.resetButton}>
                        다시 시도
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
} 