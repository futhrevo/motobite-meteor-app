'use strict';

import React, {Component} from 'react';
import {ActivityIndicator, InteractionManager, Navigator, StatusBar, StyleSheet, View , WebView} from 'react-native';
import {connect} from 'react-redux';

import MBHeader from '../../common/MBHeader';

class AboutScreen extends Component{
    props: {
        navigator: Navigator;
        dispatch: () => void;
    };

    render(){
        return(
            <View style={styles.container}>
                <StatusBar
                  translucent={true}
                  backgroundColor="rgba(0, 0, 0, 0.2)"
                  barStyle="default"
                 />
                <MBHeader
                    style={styles.header}
                    foreground="dark"
                    title="About"
                    leftItem={{
                        icon: require('../../common/img/back.png'),
                        title: 'Back',
                        layout: 'icon',
                        onPress: () => this.props.navigator.pop(),
                      }}
                />
                <Loading>
                  <WebView
                    style={styles.webview}
                    source={{uri: 'file:///android_res/raw/about.html'}}
                  />
                </Loading>
            </View>
        )
    }
}

class Loading extends Component {
    state = {
        loaded: false,
    };

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => this.setState({loaded: true}));
    }

    render() {
        if (this.state.loaded) {
          return React.Children.only(this.props.children);
        }
        return (<ActivityIndicator  animating = {true}/>);
      }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        backgroundColor: '#47BFBF',
    },
    webview: {
        flex: 1,
      },
});

export default connect()(AboutScreen);
