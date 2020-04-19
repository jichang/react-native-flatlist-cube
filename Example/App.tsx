import React from "react";
import { StyleSheet, Dimensions, View, ListRenderItemInfo } from "react-native";
import { FlatListCube } from "react-native-flatlist-cube";

const windowDimension = Dimensions.get("window");

export interface IProps { }

export interface IState { }

export default class App extends React.Component<IProps, IState> {
  renderItem = (info: ListRenderItemInfo<{ key: string; value: string }>) => {
    return <View style={[styles.item, { backgroundColor: info.item.value }]}></View>;
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatListCube
          pageSize={{
            width: windowDimension.width,
            height: windowDimension.height,
          }}
          prerenderNumber={2}
          rotateYDeg={360 * 0.2}
          data={[
            {
              key: '0',
              value: "blue",
            },
            {
              key: '1',
              value: "red",
            },
            {
              key: '2',
              value: "green",
            },
            {
              key: '3',
              value: "blue",
            },
          ]}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flex: 1,
  },
});
