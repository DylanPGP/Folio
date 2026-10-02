import React, { useRef } from 'react';
import { Animated, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

interface Props extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
}

/** Animación sutil de escala al pulsar (feedback táctil). */
export default function PressableScale({ children, style, scaleTo = 0.92, ...rest }: Props) {
  const v = useRef(new Animated.Value(1)).current;
  const to = (x: number) =>
    Animated.spring(v, { toValue: x, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
  return (
    <Pressable {...rest} onPressIn={() => to(scaleTo)} onPressOut={() => to(1)}>
      <Animated.View style={[style, { transform: [{ scale: v }] }]}>{children as any}</Animated.View>
    </Pressable>
  );
}
