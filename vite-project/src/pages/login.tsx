import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { api } from "../services/api";
import { toast } from "react-toastify";
import Loading from "../components/loading";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../services/types";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../features/auth/authSlice";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home");
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!email) return toast.error("Enter valid email");
    const timer = setTimeout(() => {
      toast.info("Server may take 30 seconds to respond");
    }, 3000);
    setLoading(true);
    api
      .post("/user/login", { email, password })
      .then((response) => {
        toast.success(response.data.message);
        if(response.data.error === false){
          let userObj = response.data.data.user;
          let token = response.data.token;
          dispatch(loginSuccess({ userObj, token }));
        }
        console.log(response.data)
      })
      .catch((err) => {
        if (Array.isArray(err.response.data) && err.response.data.length > 0) {
          err.response.data.map((e: any) => {
            toast.error(e.message);
          });
          console.log(err.response.data[0]?.messge);
        } else {
          console.log(err);
          toast.error(err.response.data.message);
        }
      })
      .finally(() => {
        setLoading(false);
        clearTimeout(timer);
      });
  };

  return (
    <LoginContainer>
      <Header>Facebook</Header>
      <LoginForm>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        <Button onClick={handleLogin} disabled={loading} $loading={loading}>
          {loading ? <Loading /> : "Login"}
        </Button>
      </LoginForm>
      <Already onClick={() => navigate("/register")}>
        not a meamber? then Reigster
      </Already>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* height: 100vh; */
  border: solid 2px gray;
  padding: 6rem 2rem;
`;

const Header = styled.h1`
  margin-bottom: 2rem;
  color: #ffffff;
`;
const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Already = styled.div`
  padding-top: 2rem;
  cursor: pointer;
  font-size: 16px;
  color: #245eca;
`;
const Input = styled.input`
  padding: 10px;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  width: 300px;
  font-size: 16px;
  &:disabled {
    cursor: not-allowed;
    background-color: grey;
  }
`;

const Button = styled.button<{ $loading: boolean }>`
  position: relative;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  position: relative;
  transition: 0.5s ease-in-out;
  padding: 10px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: ${({ $loading }) => ($loading ? "not-allowed" : "pointer")};
  font-size: 16px;
  font-weight: bold;
  &:disabled {
    background-color: #71a8e2;
  }
  &:hover:not([disabled]) {
    background-color: #020202;
    border: 2px solid white;
  }
`;

export default Login;
