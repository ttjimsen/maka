import React from 'react'
import appLoader from '@makajs/app-loader'
import { navigate } from '@makajs/utils'

export default class Root extends React.PureComponent {
    constructor(props) {
        super(props)

        navigate.listen(this.listen)
        var currentApp,
            location = navigate.getLocation(),
            full = location.pathname + location.search

        if (!full || full == '/') {
            currentApp = props.appName
        }
        else {
            full = full.substr(0, 1) == '/' ? full.substr(1) : full
            currentApp = full.split('/')[0]
        }

        this.state = {
            currentApp
        }

        if(!full || full == '/')
            navigate.redirect('/' + currentApp)
        else
            navigate.redirect('/' + full)
    }

    listen = ({location, action}) => {
        if(history.state && history.state.orginalUrl){
            history.replaceState(history.state.orginalUrl)
        }

        var full = location.pathname + location.search

        if ((!full || full == '/') && this.props.appName == this.state.currentApp){
            navigate.redirect(this.state.currentApp)
            return
        }
        

        full = full.substr(0, 1) == '/' ? full.substr(1) : full
        var target = full.split('/')[0]
        if(!target){
            return
        }

        if (target == this.state.currentApp)
            return

        this.setState({ currentApp: target })
    }

    componentWillUnmount() {
        navigate.unlisten(this.listen)
    }

    render() {
        var _notClearAppState = location.hash.indexOf('_notClearAppState') != -1
        return (
            <appLoader.AppLoader key={this.state.currentApp} name={this.state.currentApp} _notClearAppState={_notClearAppState} />
        );
    }
}