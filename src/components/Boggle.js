import React, { Component } from 'react';
import { Row, Col, Spin, PageHeader, Layout } from 'antd';
import { Github } from 'react-social-github';

import { checkDictionary } from 'src/services/dictionaryServices';
import * as constants from 'src/constants';

import 'antd/dist/antd.css';
import 'src/App.css';
export default class Boggle extends Component {
	state = {
		isLoading: false,
		score: 0,
		validWords: [],
		isCurrentWordValid: false,
		currentWord: '',
		randomLetters: [],
		status: ''
	};

	isLoading = isLoading => {
		this.setState({
			isLoading
		});
	};

	checkWord = async () => {
		this.isLoading(true);
		try {
			const response = await checkDictionary(this.state.currentWord);
			const responseData = (response && response.data) || [];
			this.setState({
				isCurrentWordValid: responseData.isValidWord
			});
		} catch (error) {
			console.log('Something went wrong');
		}
		if (this.state.isCurrentWordValid) {
			this.setState({
				score: this.state.score + this.state.currentWord.length,
				currentWord: ''
			});
		}
		this.isLoading(false);
	};

	/**
	 * Credit: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
	 */
	generateLetters = length => {
		let result = new Set();
		let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		let charactersLength = characters.length;
		this.isLoading(true);
		while (result.size < length) {
			result.add(
				characters.charAt(Math.floor(Math.random() * charactersLength))
			);
		}
		this.setState({
			randomLetters: [...result] //Converting Set to array
		});
		this.isLoading(false);
	};

	saveCurrentLetter = event => {
		event.stopPropagation();
		this.setState({
			currentWord: this.state.currentWord.concat(event.target.innerText)
		});
	};

	resetWord = () => {
		this.setState({
			currentWord: ''
		});
	};

	componentDidMount() {
		this.generateLetters(constants.NUMBER_OF_FACES);
	}

	render() {
		return (
			<Layout>
				<PageHeader>Boggle Game</PageHeader>
				<Layout>
					<Row gutter={[16, 16]}>
						<Col span={8}>
							<input type="text" value={this.state.currentWord} disabled />
							{!this.state.isCurrentWordValid && <div>Invalid word</div>}
							<button onClick={this.resetWord}>Reset</button>
						</Col>
						<Col span={6} align="middle">
							<div className="grid">
								{this.state.randomLetters.map((letter, index) => (
									<div
										key={index}
										className="cell"
										onClick={this.saveCurrentLetter}
									>
										{letter}
									</div>
								))}
							</div>
							<button onClick={this.checkWord} className="word-submit">
								It is a word
							</button>
						</Col>
						<Col span={4}>
							<div>Scores</div>
							<Spin size="large" spinning={this.state.isLoading} />
							<div>{this.state.score}</div>
						</Col>
						<Col span={4}>
							<Github user="sbimochan" repo="boggle"></Github>
						</Col>
					</Row>
				</Layout>
			</Layout>
		);
	}
}
