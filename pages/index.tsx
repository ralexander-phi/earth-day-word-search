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

  var moveMe = [];
  for (var i = 0; i < 5; i += 1) {
    if (guess[i] == target[i]) {
      labels[i] = 'match';
    } else {
      moveMe.push(target[i]);
    }
  }

  for (var i = 0; i < 5; i += 1) {
    if (labels[i] != 'match') {
      var pos = moveMe.indexOf(guess[i]);
      if (pos >= 0) {
        labels[i] = 'move';
        delete moveMe[pos];
      }
    }
  }

  return labels;
}

function renderGuess(target) {
  return function(guess) {
    var labels = labelGuess(target, guess);
    return (<div>
      { guess.split('').map( (letter, i) => <span className={ labels[i] + " cell" } key={i}>{ letter }</span> ) }
    </div>);
  }
}

function renderInput(input) {
  return (<div>
    { '12345'.split('').map( (_, i) => <span className={ "guess cell" } key={i}>{ input[i] || '?' }</span> ) }
  </div>);
}

const poems = [
  {
    "title": "Blue Home",
    "author": "Robert Alexander",
    "text": `The place we share
              with a common heart
              we love the Earth
              our long-time home`,
  },
];

function randomPoem() {
  return parsePoem(poems[Math.floor(Math.random() * poems.length)]);
}

function parsePoem(p) {
  const words = p.text
    .match(/\b(\w+)\b/g)
    .filter(word => word.length == 5)
    .map(w => w.toUpperCase().trim());
  const uniqueWords = [ ...new Set(words) ];
  const target = uniqueWords[Math.floor(Math.random() * uniqueWords.length)];
  console.log(target);
  return {
    'title': p.title,
    'author': p.author,
    'text': p.text,
    'words': uniqueWords,
    'target': target
  };
}

class Home extends Component {
  state = {
    error: false,
    win: false,
    poem: parsePoem(poems[0]),
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

    if (! this.state.poem.words.includes(guess)) {
      this.setState({
        error: "Guess only words from the poem",
      })
      // TODO: Error: must be in poem
      console.log(this.state.poem.words + " doesn't have " + guess);
      return;
    }

    const win = this.state.poem.target == guess;

    this.setState({
        error: false,
        win: win,
        input: "",
        guesses: [ guess, ...this.state.guesses ],
      },
      () => {
        this.keyboard.clearInput();
      }
    );
  };

  onChangeInput = event => {
    const input = event.target.value;
    this.setState({ input });
    this.keyboard.setInput(input);
  };

  newGame = () => {
    this.setState({
        win: false,
        guesses: [],
        poem: randomPoem(),
        input: "",
      },
      () => {
        this.keyboard.clearInput();
      }
    );
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

          <div className="game">
            <>
              { this.state.win || renderInput(this.state.input) }
            </>
            <>{ this.state.guesses.map(renderGuess(this.state.poem.target)) }</>
          </div>
        </div>

        <div>
          { !this.state.win || 
            <>
              <h2 className="congratulations">Congratulations!</h2>
              <button className="new-game" onClick={ () => { this.newGame() } }>
                New Game
              </button>
            </>
          }
          { !this.state.error ||
            <>
              <span className="error-message">{ this.state.error }</span>
            </>
          }
        </div>

        { this.state.win || 
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
        }
        <p>
        <span className="instructions">Inspired by <a href="https://www.nytimes.com/games/wordle/index.html">Wordle</a> and our home planet.</span>
        </p>
      </div>
    );
  }
}

export default Home

