import { Component } from 'react'

export class SubscribedComponent extends Component {
  componentDidMount() {
    const { subscribeToNewBooks } = this.props
    subscribeToNewBooks()
  }

  render() {
    console.log(this.props)
    const { render, ...rest } = this.props
    return this.props.render({ ...rest })
  }
}

export default SubscribedComponent
