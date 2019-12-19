import React, { Component } from 'react';
import { Row, Col, Spin,PageHeader, Layout } from 'antd';
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

	componentDidMount() {
		this.generateLetters(constants.NUMBER_OF_FACES);
	}
	render() {
		return (
      <Layout>
        <PageHeader>Boggle Game</PageHeader>
        <Layout>
				<Row gutter={[16, 16]}>
					<Col span={4}></Col>
					<Col span={16}>
						<Spin size="large" spinning={this.state.isLoading}/>
					</Col>
					<Col span={4}></Col>
				</Row>
        </Layout>
      </Layout>
		);
	}
}
