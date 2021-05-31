import React from 'react'
import { Provider } from 'mobx-react'
import {Progress, ProgressStore } from '../components/alert/progress'
import { Toast, ToastStore } from '../components/alert/toast'
import { Dialog, DialogStore } from '../components/alert/dialog'
import GlobalStore from '../storage/GlobalStore'
import { EventHandler } from './Event'
import DBManager from '../db/DBManager'
import Rest from '../network'
const progress = new ProgressStore()
const toast = new ToastStore()
const global = new GlobalStore()
const dialog = new DialogStore()
class WrapProvider extends React.PureComponent {
    preRender:Boolean = false

    async componentDidMount() {
        EventHandler.addEventListener(DBManager.Instance())
        EventHandler.addEventListener(Rest.Instance())
        this.preRender = true
        this.setState({})
    }

    componentWillUnmount() {
        EventHandler.dispose()
    }

    render() {
        return (
            <Provider progress={progress} toast={toast} dialog={dialog} global={global}>
                { this.preRender && this.props.children }
                <Progress/>
                <Toast/>
                <Dialog/>
            </Provider>
        )
    }
}

export default WrapProvider