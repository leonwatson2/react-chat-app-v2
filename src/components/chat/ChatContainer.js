import React, { useState, useEffect, useCallback } from 'react';
import SideBar from './SideBar';
import Messages from '../messaging/Messages';
import MessageInput from '../messaging/MessageInput';
import ChatHeading from './ChatHeading';
import { CONSTANTS } from '../../server/Constants';

export default function ChatContainer({
	socket,
	logout,
	user: newUser,
}) {

	const [chats, setChats] = useState([]);
	const [activeChat, setActiveChat] = useState(null);
	const [socketEvents, setSocketEvents] = useState([]);


	const addMessageToChat = useCallback((chatId, message) => {

		let newChats = chats.map((chat) => {
			if (chat.id === chatId) chat.messages.push(message);
			return chat;
		});
		console.log({ newChats, chats })
		setChats(newChats);

	}, [chats, setChats]);

	const addChat = useCallback((chat, reset) => {

		const newChats = reset ? [chat] : [...chats, chat];

		setChats(newChats);

		const messageEvent = `${CONSTANTS.MESSAGE_RECIEVED}-${chat.id}`;
		const typingEvent = `${CONSTANTS.TYPING}-${chat.id}`;
		console.log({ messageEvent, typingEvent, chat, newChats });
		socket.on(messageEvent, (chatId, message) => addMessageToChat(chatId, message));
		socket.on(typingEvent, updateTypingInChat(chat.id));

		setSocketEvents([...socketEvents, messageEvent, typingEvent]);
	}, [setChats, socketEvents, setSocketEvents, chats]);

	const resetChat = useCallback((chat) => {

		addChat(chat, true);
		setActiveChat(chat);
	}, [addChat]);


	//temp
	useEffect(() => {
		console.log({ chats, activeChat, socketEvents });
	}, [chats, activeChat, socketEvents]);


	const updateTypingInChat = (chatId) => {
		return ({ isTyping, user: newUser }) => {
			if (newUser !== newUser.name) {

				const newChats = chats.map((chat) => {
					if (chat.id === chatId) {
						if (isTyping && !chat.typingUsers.includes(newUser)) {
							chat.typingUsers.push(newUser);
						}
						else if (!isTyping && chat.typingUsers.includes(newUser)) {
							chat.typingUsers = chat.typingUsers.filter((u) => u !== newUser)
						};
					}
					return chat;
				});
				setChats(newChats);

			}
		};
	};

	const sendMessage = (chatId, message) => {
		socket.emit(CONSTANTS.MESSAGE_SENT, { chatId, message });
	};

	const sendTyping = (chatId, isTyping) => {
		socket.emit(CONSTANTS.TYPING, { chatId, isTyping });
	};

	useEffect(() => {
		socket.emit(CONSTANTS.COMMUNITY_CHAT, resetChat);
	}, [socket])

	useEffect(() => {
		socket.on('connect', () => {
			socket.emit(CONSTANTS.COMMUNITY_CHAT, resetChat);
			console.log('connected');
		});

		return () => {
			socketEvents.forEach((event) => {
				socket.off(event);
			})
		}
	}, [socket, resetChat]);


	return (
		<div className="container">
			<SideBar logout={logout}
				chats={chats}
				user={newUser}
				activeChat={activeChat}
				setActiveChat={setActiveChat} />
			<main className="chat-room-container">
				{!activeChat ? (
					<ChatHeading />
				) : (
					<ChatHeading name={activeChat.name} />
				)}
				{!activeChat ? (
					<Messages />
				) : (
					<Messages
						messages={activeChat.messages}
						user={newUser}
						typingUsers={activeChat.typingUsers}
					/>
				)}
				{activeChat && (
					<MessageInput
						sendMessage={(message) =>
							sendMessage(activeChat.id, message)
						}
						sendTyping={(isTyping) =>
							sendTyping(activeChat.id, isTyping)
						}
					/>
				)}
			</main>
		</div>
	);
}

