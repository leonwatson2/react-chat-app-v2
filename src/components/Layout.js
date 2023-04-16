import React, { useCallback, useEffect, useState } from 'react';
import LoginForm from './LoginForm';
import ChatContainer from './chat/ChatContainer';
import { CONSTANTS } from '../server/Constants';
import io from 'socket.io-client';

const serverURI = process.env.REACT_APP_SERVER_URL;

export const Layout = () => {
	const [socket, setSocket] = useState(null);
	const [user, setUser] = useState(null);
	const [, setError] = useState('');

	/*
	*	Sets the current user logged in
	*	@param user response  object {isUser:boolean user:{id:number, name:string}}
	*/
	const handleSetUser = useCallback((responseUser) => {
		if (!responseUser.isUser) {
			setUser(responseUser.user);
			socket.emit(CONSTANTS.USER_CONNECTED, responseUser.user);
		} else {
			setError("User name taken.");
		}
	}, [socket]);


	/*
	*	Connects user info back to the server.
	*	If the user name is already logged in.
	*/
	const reconnectUserInfo = useCallback(() => {
		if (user != null) {
			socket.emit(CONSTANTS.USER_CONNECTED, user);
		}
	}, [socket, user]);

	/*
	 *	Initializes socket event callbacks
	 */
	useEffect(() => {

		if (socket) {
			socket.on('connect', reconnectUserInfo);

			if (user) {
				handleSetUser({ isUser: false, user: user })
			}
		}
		return () => {
			if (socket)
				socket.off('connect', reconnectUserInfo)
		}
	}, [socket, reconnectUserInfo, handleSetUser, user]);

	useEffect(() => {
		const newSocket = io(serverURI);
		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
		};
	}, []);



	/*
	 *	Sets the user to null.
	 */
	const handleLogout = () => {
		socket.emit(CONSTANTS.LOGOUT);
		setUser(null);
	};

	return (
		<div className="container">
			{!user ? (
				<LoginForm socket={socket} setUser={handleSetUser} verified={handleSetUser} />
			) : (
				<ChatContainer socket={socket} logout={handleLogout} user={user} />
			)}
		</div>
	);
};

export default Layout;
