import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogTitle, IconButton, InputAdornment, TextField } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from 'styled-components';
import AuthContext from '../../store/auth-context';
import axios from "../../utility/axios-instance";
import './auth.css';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 80vh;
`;

const ImageContainer = styled(Box)`
  width: 90%;
  height: 45vh;
  border-radius: 20px;
  margin-top: 5vh;
  background-image: url('https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
`;

const BlurredMask = styled(Box)`
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0;
  font-weight: 900;
  background-color: rgba(173, 64, 255, 0.5);
  border-radius: 20px;
`;
const InputContainer = styled(Box)`
  position: absolute;
  top: 50vh;
  left: 50%;
  width: 70%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;
const TodoList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 20px;
  width: 100%;
  background: white;
  border-radius: 20px;
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);
`;

const TodoItem = styled.li`
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
`;
const ToDo = () => {
  const [todo, setTodo] = useState("");
  const [open, setOpen] = useState(false);
  const [todos, setTodos] = useState([]);
  const authCtx = useContext(AuthContext);
  const { logout } = authCtx;
  const [selectedId, setSelectedId] = useState("")
  const handleYes = () => {
    axios
      .delete(`/todo/${selectedId._id}`)
      .then((res) => {
        if (res.status === 200) {
          toast.warn(todo + " deleted Successfully!");
          setOpen(false);
          axios
            .get("/todo")
            .then((res) => {
              setTodos(res.data.data)
            })
        }
      })

  }

  useEffect(() => {
    axios
      .get("/todo")
      .then((res) => {
        setTodos(res.data.data)
      })
  }, [])

  const addTodo = () => {
    if (todo.trim() !== '') {
      const d = todos || []
      setTodos([...d, { _id: "temp", title: todo, completed: false, description: "", incremental: true }]);
      setTodo('');
      axios
        .post("/todo", { title: todo, completed: false, description: "", })
        .then((res) => {
          if (res.status === 200) {
            toast.success(todo + " added Successfully!");
            axios
              .get("/todo")
              .then((res) => {
                setTodos(res.data.data)
                if (containerRef.current) {
                  containerRef.current.scrollTo({
                    top: containerRef.current.scrollHeight,
                    behavior: 'smooth'
                  });
                }
              })
          } else {
            toast.error(todo + " added Successfully!");
            setTodos([...todos.filter(it => it._id !== "temp")])
          }
        })
    }
  };
  const toggleTodo = (id, statee) => {
    axios
      .put(`/todo/${id}`, { completed: !statee })
      .then((res) => {
        if (res.status === 200) {
          axios
            .get("/todo")
            .then((res) => {
              setTodos(res.data.data)
            })
        }
      })
    // setTodos((prevTodos) =>
    //     prevTodos.map((todo) =>
    //         todo.id === id ? { ...todo, completed: !todo.completed } : todo
    //     )
    // );
  };
  const footerStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    background: '#f0f0f0',
    padding: '20px',
    borderTop: '1px solid #ccc',
    display: 'flex',
    justifyContent: 'center',
  };

  const linkStyle = {
    margin: '0 10px',
    textDecoration: 'none',
    color: '#333',
  };
  const containerRef = useRef(null);

  return (
    <>
      <header style={{ backgroundColor: 'rgb(240, 240, 240)', padding: '15px', color: 'white', borderBottom: "1px solid rgb(204, 204, 204)" }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0' }}>Todo App</h1>
            {/* <p style={{ fontSize: '14px', margin: '0' }}>Welcome, {user}!</p> */}
          </div>
          <button
            onClick={logout}
            style={{
              backgroundColor: '#f44336',
              color: 'white',
              padding: '10px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </header>
      <PageWrapper>
        <ToastContainer
          position='bottom-right'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          limit={1}
          draggable
          pauseOnHover
          theme='light'
        />
        <ImageContainer>
          <BlurredMask />
        </ImageContainer>
        <InputContainer>
          <p style={{ width: "100%", fontWeight: "900", fontSize: "30px", color: "white" }}>TODOS</p>
          <TextField
            variant="outlined"
            placeholder="Type here..."
            fullWidth
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            style={{ background: "white", borderRadius: "20px" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <button
                    style={{ color: "white", background: "#87CEEB", border: "none", borderRadius: "5px", height: "30px", width: "80px" }}
                    onClick={() => {
                      addTodo()
                    }}
                    edge="end"
                  >Create
                  </button>
                </InputAdornment>
              ),
            }}
          />
          <TodoList className='container' ref={containerRef} >
            {todos?.map((todo, index) => (
              <TodoItem key={index}>
                <div style={{ display: "flex", flexDirection: "row", width: "100%", borderBottom: "1px dashed" }}>
                  <IconButton>
                    <Checkbox
                      icon={<IndeterminateCheckBoxIcon />}
                      checkedIcon={<CheckBoxIcon />}
                      checked={todo.completed}
                      onClick={() => toggleTodo(todo._id, todo.completed)}
                    />
                  </IconButton>
                  <p style={{ width: "90%", marginTop: "15px" }}>
                    {todo.title}
                  </p>
                  <IconButton
                    onClick={() => {
                      setSelectedId(todo)
                      setOpen(true)
                    }}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </div>
              </TodoItem>
            ))}
          </TodoList>
        </InputContainer>
      </PageWrapper>
      <Dialog open={open}>
        <DialogTitle>{`Do you want to delete ${selectedId.title}?`}</DialogTitle>
        <DialogActions>
          <Button color="primary" onClick={() => setOpen(false)}>
            No
          </Button>
          <Button color="primary" autoFocus onClick={handleYes}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <div style={footerStyle}>
        <a href="https://github.com/ihimrao" style={linkStyle}>Github</a>
        <a href="https://ihimrao.github.io" style={linkStyle}>Portfolio</a>
        <a href="https://github.com/ihimrao/todo-go-micro-service/tree/main" style={linkStyle}>Repo</a>
      </div>
    </>
  );
};

export default ToDo;
