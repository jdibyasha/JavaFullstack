import React, {
	useState,
	useEffect,
	createContext,
	useContext,
	ReactNode,
} from "react";
import {
	BrowserRouter,
	Routes,
	Route,
	useNavigate,
	Navigate,
} from "react-router-dom";

import axios from "axios";

interface Users {
	id: number;
	name: string;
	email: string;
}

export const UserList = () => {
	const [users, setUsers] = useState<Users[]>([]);

	useEffect(() => {
		axios
			.get("http://localhost:8080/api/users")
			.then((res) => setUsers(res.data));
	}, []);

	return (
		<ul>
			{users.map((val, idx) => (
				<li key={idx}>{val.name}</li>
			))}
		</ul>
	);
};

//Authentication with Authorization(Role based access permission)
const UserLogin = () => {
	const { login } = useAuth();
	const [user, setUser] = useState<{ [key: string]: any }>({});
	const navigate = useNavigate();
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value });
	};
	const handleSubmit = (e: React.FormEvent<any>) => {
		e.preventDefault();
		axios
			.post("http://localhost:8080/api/login", user)
			.then((res) => {
				// localStorage.setItem("token", res.data.token);
				login(res.data.token, res.data.role);
				navigate("/dashboard");
			})
			.catch((e) => console.log(e));
	};

	return (
		<form onSubmit={handleSubmit}>
			<label>User Name</label>
			<input
				type="text"
				name="name"
				value={user?.name || ""}
				onChange={handleChange}
			/>
			<br />
			<label>Password</label>
			<input
				type="password"
				name="password"
				value={user?.password || ""}
				onChange={handleChange}
			/>
			<br />
			<button type="submit">Login</button>
		</form>
	);
};

//Create an AuthContext
type AuthContextType = {
	token: string | null;
	role: string | null;
	login: (token: string, role: string) => void;
	logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [token, setToken] = useState<string | null>(
		localStorage.getItem("token")
	);
	const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
	const login = (token: string, role: string) => {
		localStorage.setItem("token", token);
		localStorage.setItem("role", role);
		setToken(token);
		setRole(role);
	};
	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("role");
		setToken("");
		setRole("");
	};
	return (
		<AuthContext.Provider value={{ token, role, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("userAuth must be used within an AuthProvider");
	}
	return context;
};

const Dashboard = () => {
	const { role, logout } = useAuth();
	return (
		<>
			Welcome to {role} Dashboard
			<br />
			<button onClick={logout}>Logout</button>
		</>
	);
};

const ProtectedRoute = ({
	children,
	allowedRoles,
}: {
	children: ReactNode;
	allowedRoles: string[];
}) => {
	const { token, role } = useAuth();
	if (!token || !allowedRoles.includes(role || ""))
		return <Navigate to="/login" />;
	return <>{children}</>;
};
export const PathSetup = () => {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/login" element={<UserLogin />} />
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute allowedRoles={["ADMIN", "USER"]}>
								<Dashboard />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
};
