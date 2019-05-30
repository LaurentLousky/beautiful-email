import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated } from 'react-native';
import { Feather, Entypo, MaterialIcons } from '@expo/vector-icons';

export default class LoadingButton extends Component {
  state = {
    widthAnimation: new Animated.Value(200),
    fontAnimation: new Animated.Value(15),
    iconAnimation: new Animated.Value(0),
    stage: 'pending', // Current stage in the animation
    buttonColor: '#3EA5FE',
    iconCircleColor: '#2184E7',
    disabled: this.props.disabled
  };

  componentDidUpdate(prevProps) {
    if (prevProps.disabled !== this.props.disabled)
      this.setState({ disabled: this.props.disabled });
  }

  startAnimation = () => {
    this.props.onPress();
    this.setState({ stage: 'loading' });
    this.loadingAnimation();
  };

  loadingAnimation = () => {
    Animated.parallel([
      Animated.timing(this.state.widthAnimation, {
        toValue: 45,
        duration: 400
      }),
      Animated.spring(this.state.fontAnimation, {
        toValue: 0,
        duration: 400
      }),
      Animated.loop(
        Animated.timing(this.state.iconAnimation, {
          toValue: 1,
          duration: 500
        }),
        {
          iterations: 3
        }
      )
    ]).start(() => {
      if (this.props.success) this.successAnimation();
      else if (this.props.error) this.errorAnimation();
      // Repeat the loading animation until it recieves an error or success
      else this.loadingAnimation();
    });
  };

  successAnimation = () => {
    this.setState({
      stage: 'success',
      buttonColor: '#21D03A',
      iconCircleColor: '#00AE32'
    });

    setTimeout(() => {
      this.props.onFinish();
      Animated.parallel([
        Animated.spring(this.state.widthAnimation, {
          toValue: 200,
          duration: 500
        }),
        Animated.spring(this.state.fontAnimation, {
          toValue: 15,
          duration: 500
        })
      ]).start(() => {
        setTimeout(() => {
          this.setState({
            buttonColor: '#3EA5FE',
            iconCircleColor: '#2184E7',
            stage: 'pending'
          });
        }, 500);
      });
    }, 500);
  };

  errorAnimation = () => {
    this.setState({
      stage: 'error',
      buttonColor: '#B4654A',
      iconCircleColor: '#96533D'
    });

    setTimeout(() => {
      this.props.onFinish();
      Animated.parallel([
        Animated.spring(this.state.widthAnimation, {
          toValue: 200,
          duration: 500
        }),
        Animated.spring(this.state.fontAnimation, {
          toValue: 15,
          duration: 500
        })
      ]).start(() => {
        setTimeout(() => {
          this.setState({
            buttonColor: '#3EA5FE',
            iconCircleColor: '#2184E7',
            stage: 'pending'
          });
        }, 500);
      });
    }, 500);
  };

  // Returns icon that corresponds with the current animation
  renderIcon = stage => {
    switch (stage) {
      case 'pending':
        return <Feather name="arrow-right" color="white" size={20} />;
      case 'loading':
        return <Entypo name="cycle" color="white" size={20} />;
      case 'success':
        return <MaterialIcons name="check" color="white" size={20} />;
      case 'error':
        return <MaterialIcons name="error-outline" color="white" size={20} />;
    }
  };

  buttonText = stage => {
    if (stage === 'pending') return 'Submit';
    if (stage === 'success') return 'Success';
    if (stage === 'error') return 'Error';
    if (stage === 'loading') return '';
  };

  render = () => {
    const {
      widthAnimation,
      fontAnimation,
      iconAnimation,
      stage,
      iconCircleColor,
      disabled,
      buttonColor
    } = this.state;

    const animatedButton = {
      width: widthAnimation
    };
    const animatedFont = {
      fontSize: fontAnimation
    };
    const touchable = {
      height: 45,
      borderRadius: 22.5,
      justifyContent: 'center',
      backgroundColor: buttonColor,
      opacity: disabled && stage === 'pending' ? 0.5 : 1
    };

    const rotateInterpolate = iconAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

    const animatedIcon = {
      transform: [
        {
          rotate: rotateInterpolate
        }
      ],
      backgroundColor: iconCircleColor
    };

    return (
      <View style={styles.buttonContainer}>
        <Animated.View
          style={animatedButton}
          pointerEvents={this.props.disabled ? 'none' : 'auto'}
        >
          <TouchableOpacity
            style={touchable}
            onPress={this.startAnimation}
            disabled={disabled || stage !== 'pending'}
          >
            <Animated.Text style={[styles.buttonText, animatedFont]}>
              {this.buttonText(stage)}
            </Animated.Text>
            <Animated.View style={[styles.iconContainer, animatedIcon]}>
              {this.renderIcon(stage)}
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };
}
const styles = StyleSheet.create({
  buttonText: {
    textAlign: 'center',
    color: 'white'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconContainer: {
    position: 'absolute',
    right: 2.5,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
