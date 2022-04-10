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
              with common heart
              we love the Earth
              our long-time home.`,
  },
  {
    "title": "Until I Saw the Sea",
    "author": "Lilian Moore",
    "text": `Until I saw the sea
              I did not know
              that wind
              could wrinkle water so.

              I never knew
              that sun
              could splinter a whole sea of blue.

              Nor
              did I know before,
              a sea breathes in and out
              upon a shore.`,
  },
  {
    "title": "Maytime Magic",
    "author": "Mabel Watts",
    "text": `A little seed
              For me to sow…

              A little earth
              To make it grow…
              A little hole,
              A little pat…
              A little wish,
              And that is that.

              A little sun,
              A little shower…
              A little while,
              And then – a flower!`,
  },
  {
    "title": "Mother Earth",
    "author": "Sophia E. Valdez",
    "text": `The land is in a constant state of birth,
              Giving life to all who live on Earth.
              Our carelessness and fears
              Have taken a toll over the years.
              Her land is parched and scorched
              As man continues to light the torch.
              We continue a want of speed and ease,
              All while our pesticides kill off our bees.
              It's time to wake up and see Mother Earth's pain.
              Humanity's selfishness is becoming insane.
              Soon her cries will turn to gloom,
              And man will cause its own doom.`,
  },
];

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
    nextPoem: 1,
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
    var guess = this.state.input.toUpperCase().trim();
    const target = this.state.poem.target;

    guess = guess.slice(0, 5);

    if (! this.state.poem.words.includes(guess)) {
      this.setState({
        input: "",
        error: "Guess only words from the poem",
      },
      () => {
        this.keyboard.clearInput();
      }
      )
      // TODO: Error: must be in poem
      console.log(this.state.poem.words + " doesn't have " + guess);
      return;
    }

    const win = this.state.poem.target == guess;

    this.setState({
        error: false,
        win: win,
        input: "",
        guesses: [ ...this.state.guesses, guess ],
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
        nextPoem: (this.state.nextPoem + 1) % poems.length,
        poem: parsePoem(poems[this.state.nextPoem]),
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
          <>{ this.state.guesses.map(renderGuess(this.state.poem.target)) }</>
          <>
            { this.state.win || renderInput(this.state.input) }
          </>
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

