import React, { useState, useEffect } from "react";
import axios from "axios";

interface User {
	id: number;
	name: string;
	email: string;
}

export const UserList = () => {
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		axios.get("http://localhost:8080/users").then((res) => setUsers(res.data));
	}, []);

	return (
		<ul>
			{users.map((val, idx) => (
				<li key={idx}>{val.name}</li>
			))}
		</ul>
	);
};
