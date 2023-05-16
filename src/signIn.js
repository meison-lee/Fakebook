import { Input, Button, Typography, Form } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useState } from 'react';
import { SIGN_IN_MUTATION, SIGN_UP_MUTATION } from './graphql';
import { useMutation } from "@apollo/react-hooks";
import displayStatus from './displayStatus';
import "./App.css";
import sponge from "./img/sponge.png";

const { Title } = Typography;

const Top = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
margin: auto;
width: 100%;
height: 10vh;
background: #4d669c;

`;

const Down = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-around;
margin: auto;
width: 100%;
height: 90vh;
background: linear-gradient(#f9f9fd, #d9ddeb);

`;

const SignInButton = styled(Button)`
    width:100px;
    margin-bottom: 5px;
    background: #096dd9;
    border-color: #096dd9;
    font-weight: bolder;
    &:hover {
        background: #1890ff;
        border-color: #1890ff;
    }
    &: focus {
        background: #1890ff;
        border-color: #1890ff;
    }
`;

const SignUpSubmitButton = styled(Button)`
    background: #096dd9;
    border-color: #096dd9;
    &:hover {
        background: #1890ff;
        border-color: #1890ff;
    }
    &: focus {
        background: #1890ff;
        border-color: #1890ff;
    }
`;

const SignIn = ({ me, setMe, setOnline }) => {
    const [password, setPassword] = useState("");
    // signIn and signUp send data via graphQL to Database
    const [signIn] = useMutation(SIGN_IN_MUTATION);
    const [signUp] = useMutation(SIGN_UP_MUTATION);

    const handleSignIn = () => {
        if(!me){
            displayStatus({ type: "error", msg: "Missing username." });
        }else if(!password){
            displayStatus({ type: "error", msg: "Missing password." });
        }else{
            signIn({
                variables: {
                    userName: me,
                    password,
                },
                // return true if complete, else return false
                onCompleted: ({ signIn }) => {
                    setOnline(signIn);
                    if(signIn){
                        displayStatus({ type: 'success', msg: `${me}, Welcome to Fakebook!` });
                    }else{
                        displayStatus({ type: 'error', msg: "Incorrect username or password." });
                    };
                },
            });
        };
    };

    const handleSignUp = ({ userName, password, email, phone}) => {
        if(!userName || !password || !email) return;
        if(userName.indexOf(' ')!==-1){
            displayStatus({ type: "error", msg: "Invaild username." });
            return;
        };

        console.log("in sign up function\n");
        signUp({
            variables: {
                userName,
                password,
                email,
                phone,
            },
            onCompleted: ({ createUser }) => {
                if(createUser){
                    setMe(userName);
                    displayStatus({ type: 'success', msg: "Your registration is successful!" });
                }else{
                    displayStatus({ type: 'error', msg: `Username ${userName} is existed.` });
                };
            },
        });
    };

    return(
        <>
          <Top>
            <div style={{width: "300px", textAlign:"center"}}>
              <Title style={{ marginBottom: 15, color: 'white' }} className="logo"> Fakebook</Title>
            </div>
            <div>
              <div className='test'>
                  <div className='RWD-div'>

                    <Input
                      value={me}
                      onChange={(e) => setMe(e.target.value)}
                      size="small"
                      placeholder="Enter your name"
                      prefix={<UserOutlined />}
                      style={{ marginBottom: 5 }}
                      maxLength={50}
                      className='RWD'
                    />
                  </div>
                  <div className='RWD-div'>

                    <Input.Password
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown= {(e) => {if(e.code==='Enter') handleSignIn()}}
                      size="small"
                      placeholder="Input password"
                      style={{ marginBottom: 5 }}
                      maxLength={50}
                      className='RWD'
                    />
                    <Button type="link" size='small' className='forget'>忘記密碼</Button>
                  </div>
                  <div className='signedIn'>
                    <SignInButton type="primary" onClick={handleSignIn} >Sign in</SignInButton>
                  </div>
              </div>
            </div>
          </Top>
          <Down>
            <div className='down'>
                <h1>Fakebook help you connect with your friends</h1>
                <img src={sponge}/>
            </div>
            <div className='down'>
              <div>
                <br/>
                <h1>Create a account</h1>
                <br/>
              </div>
              <Form
                    onFinish={handleSignUp}
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 8,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="username"
                        name="userName"
                        rules={[
                        {
                            required: true,
                            message: "Please input your username!",
                        },
                        ]}
                    >
                        <Input   maxLength={50} placeholder="username"/>
                    </Form.Item>
                    <Form.Item
                        label="password"
                        name="password"
                        rules={[
                        {
                            required: true,
                            message: "Please input your password!",
                        },
                        ]}
                    >
                      <Input.Password   maxLength={50} placeholder="password"/>
                    </Form.Item>
                    <Form.Item
                        label="email"
                        name="email"
                        rules={[
                        {
                            required: true,
                            message: "Please input your email!",
                        },
                        ]}
                    >
                      <Input   maxLength={50} placeholder="email"/>
                    </Form.Item>
                    <Form.Item
                        label="phone"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: "Please input your phone!",
                            },
                            ]}
                        >
                      <Input   maxLength={50} placeholder="phone"/>
                      </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <SignUpSubmitButton type="primary" htmlType="submit">
                            Create
                        </SignUpSubmitButton>
                    </Form.Item>
                </Form>
            </div>
          </Down>
      </>
    );
};

export default SignIn;