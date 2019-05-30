import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableNativeFeedback,
  Dimensions,
  Animated
} from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { suggestions } from '../util/suggestions';
const { width } = Dimensions.get('window');

export default class AutoSuggest extends Component {
  constructor() {
    super();
    this.animatedHeight = new Animated.Value(0);
  }
  state = {
    email: '',
    filteredSuggestions: []
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevState.filteredSuggestions.length !==
      this.state.filteredSuggestions.length
    )
      this.animateHeight();
  }

  // Animates the height of email suggestion list
  animateHeight = () => {
    Animated.spring(this.animatedHeight, {
      toValue: Math.min(this.state.filteredSuggestions.length * 45, 135),
      duration: 500
    }).start();
  };

  onChangeText = email => {
    this.setState({ email });
    this.props.onChangeText(email);

    if (email) this.filterSuggestions(email);
    // Reset the state if the email is empty
    else this.setState({ filteredSuggestions: [] });
  };

  filterSuggestions = email => {
    // Index of @ sign in the email
    const atLocation = email.indexOf('@');

    // Only show suggestions once the user types @
    if (atLocation === -1 || atLocation === 0)
      return this.setState({ filteredSuggestions: [] });

    // Grab the domain name from the user's entry
    const domainName = this.escapeRegExp(email.substring(atLocation + 1));

    // Filter out the suggestions that don't match the domain name
    let filteredSuggestions = suggestions.filter(suggestion => {
      const regex = new RegExp(`^@${domainName}.+`);
      return regex.test(suggestion.value);
    });

    // Combine the user's email entry with the domain name suggestion
    filteredSuggestions = filteredSuggestions.map(suggestion => {
      return {
        key: suggestion.key,
        value: email.slice(0, atLocation) + suggestion.value,
        userInput: email
      };
    });

    this.setState({ filteredSuggestions });
  };

  //  Escapes user input that is to be treated as a literal string within a
  //  regular expression—that would otherwise be mistaken for a special character
  escapeRegExp = string => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string

  renderListItem = ({ item }) => (
    // Native Android Touchable
    <TouchableNativeFeedback
      key={item.value}
      onPress={() => this.onChangeText(item.value)}
      background={TouchableNativeFeedback.SelectableBackground()}
    >
      <View>
        <Text
          style={{
            padding: 10,
            fontSize: 17,
            fontWeight: 'normal'
          }}
        >
          {item.userInput}
          <Text
            style={{
              padding: 10,
              fontSize: 17,
              fontWeight: 'bold'
            }}
          >
            {/* Make the piece of the suggestion that the user is missing bold */}
            {item.value.substring(item.userInput.length)}
          </Text>
        </Text>
      </View>
    </TouchableNativeFeedback>
  );

  render() {
    const { filteredSuggestions, email } = this.state;

    const suggestionListStyles = {
      backgroundColor: 'white',
      height: this.animatedHeight,
      width: width * 0.7,
      elevation: 5
    };

    return (
      <View style={styles.inputContainer}>
        <TextField
          ref={ref => this.props.inputRef(ref)}
          label={'Email Address'}
          value={email}
          keyboardType="email-address"
          onChangeText={this.onChangeText}
          fontSize={24}
          titleFontSize={14}
          labelFontSize={14}
          lineWidth={2}
          disabled={this.props.disabled}
          error={filteredSuggestions.length === 0 ? this.props.error : ''}
        />
        {filteredSuggestions.length > 0 && (
          <View>
            <Animated.View style={suggestionListStyles}>
              <FlatList
                data={filteredSuggestions}
                keyboardShouldPersistTaps="always"
                renderItem={this.renderListItem}
              />
            </Animated.View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    width: width * 0.7
  }
});
