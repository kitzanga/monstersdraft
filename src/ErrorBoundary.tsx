import { Component } from 'react'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          fontFamily: 'Inter, sans-serif',
        }}>
          <div style={{
            background: '#F2ECDE',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '400px',
            width: '100%',
          }}>
            <h1 style={{ color: '#C0392B', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#1A3630', fontSize: '13px', wordBreak: 'break-word' }}>
              {this.state.error?.message || 'Unknown error'}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '16px',
                background: '#D4A72C',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Reload
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
