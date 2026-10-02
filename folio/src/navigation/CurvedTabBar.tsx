import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../context/SettingsContext';
import { useLibrary } from '../context/LibraryContext';
import PressableScale from '../components/PressableScale';

const H = 64;      // alto de la barra
const NR = 38;     // radio de la muesca central
const R = 22;      // esquinas redondeadas
const BTN = 56;    // diámetro del botón "+"
const TOP = 28;    // espacio para que el botón sobresalga

export default function CurvedTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors } = useSettings();
  const { importBook } = useLibrary();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const W = width - 32;
  const cx = W / 2;

  const d = [
    `M${R},0`,
    `H${cx - NR - 14}`,
    `C${cx - NR},0 ${cx - NR + 2},${NR} ${cx},${NR}`,
    `C${cx + NR - 2},${NR} ${cx + NR},0 ${cx + NR + 14},0`,
    `H${W - R}`, `Q${W},0 ${W},${R}`,
    `V${H - R}`, `Q${W},${H} ${W - R},${H}`,
    `H${R}`, `Q0,${H} 0,${H - R}`,
    `V${R}`, `Q0,0 ${R},0 Z`,
  ].join(' ');

  const go = (name: string) => {
    const route = state.routes.find((r) => r.name === name)!;
    const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (!e.defaultPrevented) navigation.navigate(name as never);
  };

  const Item = ({ name, icon, iconOn }: { name: string; icon: string; iconOn: string }) => {
    const active = state.routes[state.index].name === name;
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <PressableScale onPress={() => go(name)} scaleTo={0.8} style={{ padding: 12, alignItems: 'center' }}>
          <Ionicons name={(active ? iconOn : icon) as any} size={26} color={active ? colors.primary : colors.sub} />
        </PressableScale>
      </View>
    );
  };

  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', left: 16, width: W, height: H + TOP, bottom: Math.max(insets.bottom, 12) }}>
      <Svg width={W} height={H} style={{ position: 'absolute', top: TOP }}>
        <Path d={d} fill={colors.bar} stroke={colors.border} strokeWidth={1} />
      </Svg>

      <View style={{ position: 'absolute', top: TOP, height: H, width: W, flexDirection: 'row', alignItems: 'center' }}>
        <Item name="Home" icon="home-outline" iconOn="home" />
        <View style={{ width: NR * 2 }} />
        <Item name="History" icon="book-outline" iconOn="book" />
      </View>

      <PressableScale
        onPress={importBook}
        scaleTo={0.88}
        style={{
          position: 'absolute', left: cx - BTN / 2, top: 4, width: BTN, height: BTN, borderRadius: BTN / 2,
          backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
          elevation: 8, shadowColor: colors.primary, shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
        }}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </PressableScale>
    </View>
  );
}
