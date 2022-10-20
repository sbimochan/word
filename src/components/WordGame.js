import React, { Component } from "react";
import { Row, Col, Spin, PageHeader, Layout, Button, Modal } from "antd";
import { Github } from "react-social-github";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import { checkDictionary } from "src/services/dictionaryServices";
import * as constants from "src/constants";

import "antd/dist/antd.css";
import "src/App.css";

export default class WordGame extends Component {
  state = {
    isLoading: false,
    score: 0,
    validWords: [],
    isCurrentWordValid: false,
    currentWord: "",
    randomLetters: [],
    status: "",
    isTimeUp: false,
    isModalOpen: false,
    timerDuraion: 180,
    isNewGame: false,
  };

  isLoading = (isLoading) => {
    this.setState({ isLoading });
  };

  checkWord = async () => {
    if (this.state.isTimeUp) {
      return;
    }
    this.isLoading(true);
    try {
      const response = await checkDictionary(this.state.currentWord);
      const responseData = (response && response.data) || [];
      this.setState({ isCurrentWordValid: responseData.isValidWord });
    } catch (error) {
      this.setState({ status: "Something wrong with server." });
    }
    if (this.state.isCurrentWordValid) {
      this.collectWords();
    } else {
      this.setState({ status: "Invalid word" });
    }
    this.isLoading(false);
    this.resetWord();
  };

  /**
   * Prevent repetitions
   */
  collectWords = () => {
    if (!this.state.validWords.includes(this.state.currentWord)) {
      this.setState({
        validWords: [...this.state.validWords, this.state.currentWord],
        score: this.state.score + this.state.currentWord.length,
        status: "",
      });
    } else {
      this.setState({ status: "You tried same twice. I got you!" });
    }
  };

  /**
   * Credit: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
   */
  generateLetters = (length) => {
    let result = new Set();
    let characters = "abcdefghijklmnopqrstuvwxyz";
    let charactersLength = characters.length;
    this.isLoading(true);
    while (result.size < length) {
      result.add(
        characters.charAt(Math.floor(Math.random() * charactersLength))
      );
    }
    this.setState({
      randomLetters: [...result], //Converting Set to array
    });
    this.isLoading(false);
  };

  saveCurrentLetter = (key) => {
    if (this.state.isTimeUp) {
      return;
    }
    this.setState({
      currentWord: this.state.currentWord.concat(key),
    });
  };

  resetWord = () => {
    this.setState({ currentWord: "" });
  };

  doBackspace = (event) => {
    switch (event.keyCode) {
      case constants.BACKSPACE_KEYCODE:
        this.setState({
          currentWord: this.state.currentWord.slice(0, -1),
        });
        break;
      case constants.ENTER_KEYCODE:
        this.checkWord();
        break;
      default:
        break;
    }
    this.handleShortcutKeys(event.key);
  };

  handleShortcutKeys = (key) => {
    if (this.state.randomLetters.includes(key)) {
      this.saveCurrentLetter(key);
    }
  };

  endGame = () => {
    this.setState({
      isTimeUp: true,
      isModalOpen: true,
    });
    this.componentWillUnmount();
  };

  closeModal = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  renderTime = (value) => {
    if (value === 0) {
      return <div className="timer">Too late...</div>;
    }

    return (
      <div className="timer">
        <div className="text">Remaining</div>
        <div className="value">{value}</div>
        <div className="text">seconds</div>
      </div>
    );
  };

  reset = () => {
    this.setState({
      isLoading: false,
      score: 0,
      validWords: [],
      isCurrentWordValid: false,
      currentWord: "",
      randomLetters: [],
      status: "",
      isTimeUp: false,
      isModalOpen: false,
      timerDuraion: 10,
      isNewGame: true,
    });
    this.componentDidMount();
  };
  componentDidMount() {
    this.generateLetters(constants.NUMBER_OF_FACES);
    document.addEventListener("keydown", this.doBackspace, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.doBackspace, false);
  }

  render() {
    return (
      <Layout>
        <PageHeader
          title="Word Game"
          ghost={false}
          avatar={{
            src: "https://avatars1.githubusercontent.com/u/8186664?s=460&v=4",
          }}
        />
        <Layout.Content
          style={{
            height: "100vh",
          }}
        >
          <Row gutter={[36, 36]} className="pd-20">
            <Col span={8}>
              <h2>Status</h2>
              <div className="message-block pd-20">{this.state.status}</div>
              <div className="valid-word-list pd-20">
                <ul>
                  {this.state.validWords.map((word, index) => (
                    <li key={index}>{word}</li>
                  ))}
                </ul>
              </div>
              <CountdownCircleTimer
                isPlaying
                durationSeconds={this.state.timerDuraion}
                renderTime={this.renderTime}
                onComplete={() => {
                  this.endGame();
                  return [this.state.isNewGame, 0];
                }}
                colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
              />
            </Col>
            <Col span={6} align="middle">
              <div className="pd-20">
                <input type="text" value={this.state.currentWord} disabled />
                <Button
                  type="primary"
                  className="md-20"
                  onClick={this.resetWord}
                >
                  Reset
                </Button>
              </div>
              <div className="grid">
                {this.state.randomLetters.map((letter, index) => (
                  <div
                    key={index}
                    className="cell"
                    onClick={(e) => this.saveCurrentLetter(e.target.innerText)}
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <Button
                type="primary"
                onClick={this.checkWord}
                className="word-submit"
              >
                It is a word
              </Button>
              <div>
                <Spin size="large" spinning={this.state.isLoading} />
              </div>
            </Col>
            <Col span={4}>
              <h2>Scores</h2>
              <div className="score">{this.state.score}</div>
              <div>
                <Button
                  type="primary"
                  onClick={() =>
                    this.generateLetters(constants.NUMBER_OF_FACES)
                  }
                >
                  Shuffle word
                </Button>
              </div>
            </Col>
            <Col span={4}>
              <Github user="sbimochan" repo="word"></Github>
            </Col>
          </Row>
          <Modal
            title="Game Over"
            visible={this.state.isModalOpen}
            onOk={this.reset}
            onCancel={this.closeModal}
          >
            <p>
              Your score is <strong>{this.state.score}</strong>
            </p>
            <p>Do you wanna reset game?</p>
          </Modal>
        </Layout.Content>
      </Layout>
    );
  }
}
