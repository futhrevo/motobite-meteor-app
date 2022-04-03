// @ flow

import React, {Component} from 'react';
import { Animated, Dimensions, Platform, View } from 'react-native';

import MBHeader from './MBHeader';
import {create} from './MBStyleSheet';
import ParallaxBackground from './ParallaxBackground';
import type {Item as HeaderItem} from 'MBHeader';

type Props = {
  title: string;
  leftItem?: HeaderItem;
  rightItem?: HeaderItem;
  extraItems?: Array<HeaderItem>;
  backgroundImage: number;
  backgroundColor: string;
  parallaxContent: ?ReactElement;
  children: any;
};

const EMPTY_CELL_HEIGHT = Dimensions.get('window').height > 600 ? 200 : 150;

class EmptyContainer extends Component{
    props: Props;

    constructor(props: Props) {
        super(props);

        this.state = ({
          anim: new Animated.Value(0),
        }: State);


        this.handleShowMenu = this.handleShowMenu.bind(this);

        this._refs = [];
      }
    render(){
        var leftItem = this.props.leftItem;
        if (!leftItem && Platform.OS === 'android') {
          leftItem = {
            title: 'Menu',
            icon: this.context.hasUnreadNotifications
              ? require('./img/hamburger-unread.png')
              : require('./img/hamburger.png'),
            onPress: this.handleShowMenu,
          };
        }
        return(
            <View style={styles.container}>
                <View style={styles.headerWrapper}>
                    <MBHeader
                      title={this.props.title}
                      leftItem={leftItem}
                      rightItem={this.props.rightItem}
                      extraItems={this.props.extraItems}>
                      {this.renderHeaderTitle()}
                    </MBHeader>
                </View>
                {this.props.children}
            </View>
        );
    }

    renderHeaderTitle(): ?ReactElement {
        if (Platform.OS === 'android') {
          return null;
        }
        var transform;
        if (!this.props.parallaxContent) {
          var distance = EMPTY_CELL_HEIGHT - this.state.stickyHeaderHeight;
          transform = {
            opacity: this.state.anim.interpolate({
              inputRange: [distance - 20, distance],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            })
          };
        }
        return (
          <Animated.Text style={[styles.headerTitle, transform]}>
            {this.props.title}
          </Animated.Text>
        );
      }
      handleShowMenu() {
          this.context.openDrawer();
      }

}
EmptyContainer.defaultProps = {
  selectedSectionColor: 'white',
};

EmptyContainer.contextTypes = {
  openDrawer: React.PropTypes.func,
  hasUnreadNotifications: React.PropTypes.number,
};
var styles = create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerWrapper: {
    android: {
      elevation: 2,
      backgroundColor: '#47BFBF',
      // FIXME: elevation doesn't seem to work without setting border
      borderRightWidth: 1,
      marginRight: -1,
      borderRightColor: 'transparent',
    }
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
 });
export default EmptyContainer;
