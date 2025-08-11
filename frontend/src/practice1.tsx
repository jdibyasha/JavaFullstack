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

import {
	Box,
	TextField,
	Button,
	Typography,
	Paper,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Checkbox,
	FormControlLabel,
	RadioGroup,
	Radio,
} from "@mui/material";

import { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "react-i18next";
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
	const { t, i18n } = useTranslation();
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
				console.log(res);
				// localStorage.setItem("token", res.data.token);
				login(res.data.token, res.data.role);
				navigate("/dashboard");
			})
			.catch((e) => console.log(e));
	};

	const handleLanguageSelector = (lang: string) => {
		i18n.changeLanguage(lang);
	};
	return (
		<>
			<Box
				sx={{
					height: "50vh",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Paper elevation={3} sx={{ padding: 4, borderRadius: 2, width: 350 }}>
					<Box display="flex" justifyContent="flex-end" mb={2}>
						<Button variant="text" onClick={() => handleLanguageSelector("en")}>
							English
						</Button>
						<Button variant="text" onClick={() => handleLanguageSelector("fr")}>
							French
						</Button>
					</Box>
					<Typography align="center">LogIn</Typography>
					<form onSubmit={handleSubmit}>
						<TextField
							label="User Name"
							name="name"
							value={user?.name || ""}
							onChange={handleChange}
							fullWidth
							margin="normal"
						/>
						<br />
						<TextField
							label="Password"
							type="password"
							name="password"
							value={user?.password || ""}
							onChange={handleChange}
							fullWidth
							margin="normal"
						/>
						<br />
						<Button
							type="submit"
							variant="contained"
							color="primary"
							fullWidth
							sx={{ marginTop: 2 }}
						>
							{t("login")}
						</Button>
						<Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
							Don't have an account?{" "}
							<Button
								variant="text"
								size="small"
								onClick={() => navigate("/signup")}
							>
								Sign Up
							</Button>
						</Typography>
					</form>
				</Paper>
			</Box>
		</>
	);
};

//SignUP
const UserSignup = () => {
	const [formData, setFormData] = useState<{ [key: string]: any }>({});
	const [formDataErrors, setFormDataErrors] = useState<{
		[key: string]: string;
	}>({});
	const handleChange = (
		e:
			| React.ChangeEvent<
					HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
			  >
			| SelectChangeEvent
	) => {
		const { name, value, type, checked } = e.target as HTMLInputElement;
		if (type === "checkbox") {
			setFormData({ ...formData, [name]: checked });
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};
	const validateForm = () => {
		const errors: { [key: string]: string } = {};
		if (formData.confirmPassword !== formData.password) {
			errors.confirmPassword = "Passwords do not match";
		}
		return errors;
	};
	const handleSubmit = (e: React.FormEvent<any>) => {
		e.preventDefault();
		const errors = validateForm();
		if (Object.keys(errors).length) {
			setFormDataErrors(errors);
		} else {
			setFormData(formData);
			axios
				.post("http://localhost:8080/api/signup", formData)
				.then((res) => console.log(res))
				.catch((err) => console.log(err));
		}
	};
	return (
		<Box
			sx={{
				height: "100vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Paper elevation={2} sx={{ padding: 4, borderradius: 2, width: 400 }}>
				<Typography variant="h5" gutterBottom align="center">
					Sign Up
				</Typography>
				<form onSubmit={handleSubmit}>
					<TextField
						label="Full Name"
						name="name"
						value={formData?.name || ""}
						onChange={handleChange}
						fullWidth
						margin="normal"
						required
					/>
					<TextField
						label="Email"
						name="email"
						type="email"
						value={formData?.email || ""}
						onChange={handleChange}
						fullWidth
						margin="normal"
						required
					/>
					<TextField
						label="Mobile"
						name="phone"
						type="tel"
						value={formData?.phone || ""}
						onChange={handleChange}
						fullWidth
						margin="normal"
						required
					/>
					<TextField
						label="Password"
						name="password"
						value={formData?.password || ""}
						onChange={handleChange}
						fullWidth
						required
						margin="normal"
					/>
					<TextField
						label="Confirm Password"
						type="password"
						name="confirmPassword"
						value={formData?.confirmPassword}
						fullWidth
						margin="normal"
						required
						error={!!formDataErrors.confirmPassword}
						helperText={formDataErrors.confirmPassword}
					/>
					<FormControl component="fieldset" margin="normal">
						<Typography variant="subtitle1" gutterBottom>
							Gender
						</Typography>
						<RadioGroup
							name="gender"
							value={formData?.gender || ""}
							onChange={handleChange}
							row
						>
							<FormControlLabel value="male" control={<Radio />} label="Male" />
							<FormControlLabel
								value="female"
								control={<Radio />}
								label="female"
							/>
							<FormControlLabel
								value="other"
								control={<Radio />}
								label="Other"
							/>
						</RadioGroup>
						<FormControl fullWidth margin="normal">
							<InputLabel>Country</InputLabel>
							<Select
								name="country"
								value={formData?.country || ""}
								onChange={handleChange}
								required
							>
								<MenuItem value="india">India</MenuItem>
								<MenuItem value="usa">USA</MenuItem>
								<MenuItem value="uk">UK</MenuItem>
								<MenuItem value="other">Other</MenuItem>
							</Select>
						</FormControl>
						<FormControlLabel
							control={
								<Checkbox
									checked={formData?.termsAccepted || false}
									onChange={handleChange}
									name="termsAccepted"
									required
								/>
							}
							label="I accept the terms and condtions"
							sx={{ marginTop: 1 }}
						/>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							fullWidth
							sx={{ marginTop: 2 }}
						>
							Sign Up
						</Button>
					</FormControl>
				</form>
			</Paper>
		</Box>
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
					<Route path="/signup" element={<UserSignup />} />
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
