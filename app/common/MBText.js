'use strict';

import React from 'react';
import { Dimensions, StyleSheet, Text} from 'react-native';
import MBColors from './MBColors';

export function NormalText({style, ...props}: Object): ReactElement {
    return <Text style={[styles.font, style]} {...props} />;
}

export function Heading1({style, ...props}: Object): ReactElement {
  return <Text style={[styles.font, styles.h1, style]} {...props} />;
}

export function Paragraph({style, ...props}: Object): ReactElement {
  return <Text style={[styles.font, styles.p, style]} {...props} />;
}

const scale = Dimensions.get('window').width / 375;

function normalize(size: number): number {
  return Math.round(scale * size);
}

const styles = StyleSheet.create({
  font: {
    fontFamily: undefined,
  },
  h1: {
    fontSize: normalize(24),
    lineHeight: normalize(27),
    color: MBColors.darkText,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  p: {
    fontSize: normalize(15),
    lineHeight: normalize(23),
    color: MBColors.lightText,
  },
});
