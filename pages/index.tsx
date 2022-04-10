import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'


import React, { Component } from "react";
import { render } from "react-dom";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

function labelGuess(target, guess) {
    var labels = ['miss', 'miss', 'miss', 'miss', 'miss'];
    for (var i = 0; i < 5; i += 1) {
      if (target.includes(guess[i])) {
        labels[i] = 'move';
      }
    }

    for (var i = 0; i < 5; i += 1) {
      if (guess[i] == target[i]) {
        labels[i] = 'match';
      }
    }

    return labels;
}

function renderGuess(target) {
  return function(guess) {
    var labels = labelGuess(target, guess);
    return (<div>
        { guess.split('').map( (letter, i) => <span className={ labels[i] + " cell" }>{ letter }</span> ) }
        </div>);
  }
}


class Home extends Component {
  state = {
    layoutName: "default",
    poem: {
      "text": `The place we share
               with a common heart
               we love the Earth
               our long-time home`,
      "title": "Blue Home",
      "author": "Robert Alexander",
      "target": "EARTH",
    },
    guesses: [],
    input: "",
  };

  onChange = input => {
    this.setState({ input });
    console.log("Input changed", input);
  };

  onKeyPress = button => {
    console.log("Button pressed", button);

    if (button === "{guess}") this.handleEnter();
  };

  handleEnter = () => {
    const guess = this.state.input.toUpperCase().trim();
    const target = this.state.poem.target;

    console.log("guess " + guess);

    // TODO: Checks:
    // length
    // in poem
    // only letters
    if (guess.length != 5) {
      return;
    }

    this.setState({
      input: "",
      guesses: [ ...this.state.guesses, guess ],
    });
  };

  onChangeInput = event => {
    const input = event.target.value;
    this.setState({ input });
    this.keyboard.setInput(input);
  };

  render() {
    return (
      <div>
        <h1>Earth Day Word Guess</h1>
        <p>
        <span className="instructions">Guess the hidden word using words from a poem.</span>
        </p>

        <div className="flex-container">
          <div className="poemBlock">
          <p className="poem">
          <span className="poemTitle">{this.state.poem.title}</span>
          <br />
          <span className="poemAuthor">By {this.state.poem.author}</span>
          <br /><br />
          <span className="poemText">{this.state.poem.text}</span>
          <br /><br />
          </p>
          </div>

          <div className="game">{ this.state.guesses.map(renderGuess(this.state.poem.target)) }</div>
        </div>

        <input
          value={this.state.input}
          placeholder={"Tap on the virtual keyboard to start"}
          onChange={this.onChangeInput}
        />
        <Keyboard
          keyboardRef={r => (this.keyboard = r)}
          layout={{
            'default': [
              'Q W E R T Y U I O P {bksp}',
              'A S D F G H J K L',
              'Z X C V B N M {guess}',
            ]
          }}
          display={{
            '{bksp}': "⇦",
            '{guess}': "Guess",
          }}
          onChange={this.onChange}
          onKeyPress={this.onKeyPress}
          buttonTheme={[
            {
              class: "hg-guess",
              buttons: "{guess}",
            },
            {
              class: "hg-bksp",
              buttons: "{bksp}",
            }
          ]}
        />
        <p>
        <span className="instructions">Inspired by <a href="https://www.nytimes.com/games/wordle/index.html">Wordle</a> and our home planet.</span>
        </p>
      </div>
    );
  }
}

export default Home

