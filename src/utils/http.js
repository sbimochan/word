import { axios } from "axios";

const baseURI = process.env.REACT_APP_BASE_URI;

const http = axios.create({
	baseURL: baseURI,
	headers: {
		'Content-Type': 'application/json'
	}
});

export default http;