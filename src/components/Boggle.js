import React, { Component } from 'react';
import { Row, Col, Spin, PageHeader, Layout, Button, Content } from 'antd';
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
			this.setState({
				status: 'Something wrong with server.'
			});
		}
		if (this.state.isCurrentWordValid) {
			this.setState({
				score: this.state.score + this.state.currentWord.length,
				currentWord: ''
			});
		} else {
			this.setState({
				status: 'Invalid word'
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

	doBackspace = event => {
		if (event.keyCode === constants.BACKSPACE_KEYCODE) {
			this.setState({
				currentWord: this.state.currentWord.slice(0, -1)
			});
		}
	};

	componentDidMount() {
		this.generateLetters(constants.NUMBER_OF_FACES);
		document.addEventListener('keydown', this.doBackspace, false);
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.doBackspace, false);
	}

	render() {
		return (
			<Layout>
				<PageHeader
					title="Boggle Game"
					ghost={false}
					avatar={{
						src: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4'
					}}
				/>
				<Layout.Content>
					<Row gutter={[36, 36]} className="pd-20">
						<Col span={8}>
							<div className="message-block pd-20">{this.state.status}</div>
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
										onClick={this.saveCurrentLetter}
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
							<div>Scores</div>
							<div className="score">{this.state.score}</div>
						</Col>
						<Col span={4}>
							<Github user="sbimochan" repo="boggle"></Github>
						</Col>
					</Row>
				</Layout.Content>
			</Layout>
		);
	}
}
