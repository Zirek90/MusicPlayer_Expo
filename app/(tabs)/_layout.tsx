import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
}) {
  return <MaterialCommunityIcons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs>
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
          tabBarIcon: ({ color }) => <TabBarIcon name="bookmark-music" color={color} />,
        }}
      />
    </Tabs>
  );
}
