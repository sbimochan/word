import React, { Component } from 'react';
import { Row, Col, Spin, PageHeader, Layout } from 'antd';
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
		randomLetters: []
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
		this.isLoading(false);
		if (this.state.isCurrentWordValid) {
			this.setState({
				score: this.state.score + this.state.currentWord.length
			})
		}
		this.setState({
			currentWord: ''
		})
	};

	/**
	 * Credit: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
	 */
	generateLetters = length => {
		let result = [];
		let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		let charactersLength = characters.length;
		this.isLoading(true);
		for (let i = 0; i < length; i++) {
			result.push(
				characters.charAt(Math.floor(Math.random() * charactersLength))
			);
		}
		this.setState({
			randomLetters: result
		});
		this.isLoading(false);
	};

	saveCurrentLetter = event => {
		event.stopPropagation();
		this.setState({
			currentWord: this.state.currentWord.concat(event.target.innerText)
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
						</Col>
						<Col span={6} align="middle">
							<div className="grid">
								{this.state.randomLetters.map((letter, index) => (
									<div key={index} className="cell" onClick={this.saveCurrentLetter}>{letter}</div>
								))}
							</div>
							<button onClick={this.checkWord}>It is a word</button>
						</Col>
						<Col span={8}>
						<div>Scores</div>
							<Spin size="large" spinning={this.state.isLoading} />
						<div>{this.state.score}</div>
						</Col>
					</Row>
				</Layout>
			</Layout>
		);
	}
}
