import * as React from "react";
import {
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  FlatListProps,
  ListRenderItemInfo,
} from "react-native";

export interface FlatListCubeProps<ItemT> extends FlatListProps<ItemT> {
  prerenderNumber: number;
  pageSize: {
    width: number;
    height: number;
  };
  rotateYDeg: number;
}

export interface FlatListCubeState {
  currentPage: number;
}

export class FlatListCube<ItemT> extends React.Component<
  FlatListCubeProps<ItemT>,
  FlatListCubeState
> {
  scrollOffset = new Animated.Value(0);

  constructor(props: FlatListCubeProps<ItemT>) {
    super(props);

    this.state = {
      currentPage: 0,
    };
  }

  renderItem = (info: ListRenderItemInfo<ItemT>) => {
    const { index } = info;
    const { pageSize, prerenderNumber, rotateYDeg } = this.props;
    const needRender =
      index >= this.state.currentPage - prerenderNumber &&
      index <= this.state.currentPage + prerenderNumber;

    const offset = index * pageSize.width;
    const animateRange = [offset - pageSize.width, offset + pageSize.width];
    const rotateY = this.scrollOffset.interpolate({
      inputRange: animateRange,
      outputRange: [`${rotateYDeg}deg`, `-${rotateYDeg}deg`],
      extrapolate: "clamp",
    });
    const translateX = this.scrollOffset.interpolate({
      inputRange: animateRange,
      outputRange: [-pageSize.width / 2, pageSize.width / 2],
      extrapolate: "clamp",
    });

    const reverseTranslateX = this.scrollOffset.interpolate({
      inputRange: animateRange,
      outputRange: [pageSize.width / 2, -pageSize.width / 2],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={{
          width: pageSize.width,
          height: pageSize.height,
          transform: [
            {
              perspective: pageSize.width,
            },
            {
              translateX,
            },
            {
              rotateY,
            },
            {
              translateX: reverseTranslateX,
            },
          ],
        }}
      >
        {needRender ? this.props.renderItem(info) : null}
      </Animated.View>
    );
  };

  updateCurrentPage = ({
    nativeEvent: {
      contentOffset: { x },
    },
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { pageSize } = this.props;
    const currentPage = Math.floor(x / pageSize.width);
    this.setState({
      currentPage,
    });
  };

  render() {
    return (
      <Animated.FlatList
        {...this.props}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: this.scrollOffset,
                },
              },
            },
          ],
          {
            useNativeDriver: true,
          }
        )}
        horizontal={true}
        pagingEnabled={true}
        renderItem={this.renderItem}
        onMomentumScrollEnd={this.updateCurrentPage}
      />
    );
  }
}
