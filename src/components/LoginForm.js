import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { CONSTANTS } from '../server/Constants';

const randomPlaceholder = () => {
	const randNames = [
		'VeryCleverNickNameThatsProbablyAlreadyTaken',
		'Rocket69',
		'MadDog33',
		'L4ser9374',
		'UmmmMyName134',
		'YouDontNayOmi',
		'SimpleName',
		'SexyCat99',
		'LightYear111'
	];
	return randNames[Math.floor(Math.random() * 3000) % randNames.length];
};

const LoginForm = ({ socket, setUser }) => {
	const [nickname, setNickname] = useState('Love');
	const [error, setError] = useState('');
	const textInput = useRef(null);

	const handleSubmit = (event) => {
		event.preventDefault();
		socket.emit(CONSTANTS.VERIFY_USER, nickname, (response) => {
			if (!response.isUser) {
				setUser(response);
			} else {
				setError('User name taken.');
			}
		});
	};

	const handleChange = (event) => {
		setNickname(event.target.value);
	};

	const focusNicknameInput = useCallback(() => {
		textInput.current.focus();
	}, [textInput]);

	useEffect(() => {

		focusNicknameInput()
	}, [focusNicknameInput, textInput])


	return (
		<div className="login">
			<form onSubmit={handleSubmit} className="login-form">
				<label htmlFor="nickname">
					<h1 style={{ textAlign: 'center' }}>Got a nickname?</h1>
				</label>
				<input
					ref={textInput}
					id="nickname"
					type="text"
					value={nickname}
					onChange={handleChange}
					placeholder={randomPlaceholder()}
				/>
				<div className="error">{error ? error : ''}</div>
			</form>
		</div>
	);
};

LoginForm.propTypes = {
	socket: PropTypes.object,
	setUser: PropTypes.func.isRequired
};

export default LoginForm;
