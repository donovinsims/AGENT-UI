import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button, Panel } from "./ui"

export class ErrorBoundary extends Component<{ children: ReactNode }, {
  failed: boolean
}> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(_error: Error, _info: ErrorInfo) {}
  render() {
    if (this.state.failed)
      return (
        <div className="h-full grid place-items-center p-6">
          <Panel className="max-w-md p-5 text-center">
            <h1 className="text-[16px] title">Unable to load this area</h1>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Try again. Your preview data has not been changed.
            </p>
            <Button
              className="mt-4"
              onClick={() => this.setState({ failed: false })}
            >
              Try again
            </Button>
          </Panel>
        </div>
      )
    return this.props.children
  }
}
