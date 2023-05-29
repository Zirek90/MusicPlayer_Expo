import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { COLORS } from '@global';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
  opacity?: number;
}) {
  return <MaterialCommunityIcons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.background_secondary,
        },
        headerTitleAlign: 'center',
        headerTintColor: COLORS.white,
        tabBarStyle: {
          backgroundColor: COLORS.black,
        },
      }}>
      <Tabs.Screen
        name="album"
        options={{
          title: 'Albums',
          tabBarIcon: ({ color }) => <TabBarIcon name="folder-music" color={color} />,
        }}
      />
      <Tabs.Screen
        name="player"
        options={{
          title: 'Music Player',
          tabBarIcon: ({ color }) => <TabBarIcon name="account-music" color={color} />,
        }}
      />
      <Tabs.Screen
        name="playlist"
        options={{
          title: 'Playlists',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="bookmark-music" color={color} opacity={0.5} />
          ),
        }}
        listeners={{
          tabPress: (e: Event) => {
            e.preventDefault();
          },
        }}
      />
    </Tabs>
  );
}
