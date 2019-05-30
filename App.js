import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { AutoSuggest, LoadingButton } from './components';
import { validateDeliverability } from './api/validateDeliverability';
import { validateFormat } from './util/validateFormat';
const { width } = Dimensions.get('window');

export default class App extends Component {
  state = { email: '', error: '', validFormat: false, loading: false };

  onChangeText = email => {
    this.setState({ email });
    if (email) this.validateFormat(email);
    else this.setState({ error: '' });
  };

  // Validates the email's format
  validateFormat = email => {
    const { error, validFormat } = validateFormat(email);
    this.setState({ error, validFormat });
  };

  // Checks that an email is real and deliverable
  validateDeliverability = async () => {
    const { email } = this.state;
    const error = await validateDeliverability(email);
    this.setState({ error });
  };

  onPress = () => {
    this.input.blur();
    this.setState({ loading: true });
    this.validateDeliverability();
  };

  render() {
    const { error, validFormat, loading } = this.state;
    return (
      <View style={styles.container}>
        <View styles={styles.inputContainer}>
          <AutoSuggest
            inputRef={ref => (this.input = ref)}
            onChangeText={this.onChangeText}
            error={loading ? '' : error}
            disabled={loading}
          />
        </View>
        <View style={styles.buttonContainer}>
          <LoadingButton
            title="Submit"
            onPress={this.onPress}
            disabled={!validFormat}
            success={!error}
            error={error}
            onFinish={() => this.setState({ loading: false })}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 150
  },
  inputContainer: {
    height: 150
  },
  buttonContainer: {
    position: 'absolute',
    height: 100,
    width: width,
    top: 280
  }
});
