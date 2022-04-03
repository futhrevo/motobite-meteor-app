'use strict';

import React, {Component} from 'react';
import {Image, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import MBColors from '../common/MBColors';
import {NormalText} from '../common/MBText';
import MBTouchable from '../common/MBTouchable';

class MenuItem extends Component{
    props: {
        icon: string;
        selectedIcon: string;
        selected: boolean;
        title: string;
        badge: ?string;
        onPress: () => void;
      };

      render(){
          var icon = this.props.selected ? this.props.selectedIcon : this.props.icon;
            var selectedTitleStyle = this.props.selected && styles.selectedTitle;
            var badge;
            if (this.props.badge) {
              badge = (
                <View style={styles.badge}>
                  <NormalText style={styles.badgeText}>
                    {this.props.badge}
                  </NormalText>
                </View>
              );
            }
            return(
                <MBTouchable onPress={this.props.onPress}>
                    <View style={styles.container}>
                    <Icon style={styles.icon} name={icon} size={30}/>
                      <NormalText style={[styles.title, selectedTitleStyle]}>
                        {this.props.title}
                      </NormalText>
                      {badge}
                    </View>
                </MBTouchable>
            );
      }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 20,
  },
  title: {
    flex: 1,
    fontSize: 17,
    color: MBColors.lightText,
  },
  selectedTitle: {
    color: MBColors.darkText,
  },
  badge: {
    backgroundColor: '#DC3883',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    color: 'white',
  },
});

export default MenuItem;
