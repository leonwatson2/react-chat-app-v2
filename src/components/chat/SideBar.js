import { useRef } from 'react';
import { FaChevronDown, FaSearch } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';
import { MdEject } from 'react-icons/md';

function SideBar({ chats, activeChat, user, setActiveChat, logout }) {
	const usersRef = useRef(null);

	return (
		<div id="side-bar">
			<div className="heading">
				<div className="app-name">Leon's Chat <FaChevronDown /></div>
				<div className="menu">
					<FiMenu />
				</div>
			</div>
			<div className="search">
				<i className="search-icon"><FaSearch /></i>
				<input placeholder="Search" type="text" />
				<div className="plus"></div>
			</div>
			<div
				className="users"
				ref={usersRef}
				onClick={(e) => { (e.target === usersRef.current) && setActiveChat(null) }}
			>
				{chats && chats.map((chat) => {
					if (chat.name) {
						const lastMessage = chat.messages[chat.messages.length - 1];
						const user = chat.users.find(({ name }) => name !== user.name) || { name: 'Community' };
						const classNames = (activeChat && activeChat.id === chat.id) ? 'active' : '';
						return (
							<div
								key={chat.id}
								className={`user ${classNames}`}
								onClick={() => { setActiveChat(chat) }}
							>
								<div className="user-photo">{user.name[0].toUpperCase()}</div>
								<div className="user-info">
									<div className="name">{user.name}</div>
									{lastMessage && <div className="last-message">{lastMessage.message}</div>}
								</div>
							</div>
						);
					}
					return null;
				})}
			</div>
			<div className="current-user">
				<span>{user.name}</span>
				<div onClick={() => { logout() }} title="Logout" className="logout">
					<MdEject />
				</div>
			</div>
		</div>
	);
}

export default SideBar;
