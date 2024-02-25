import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../store/auth-context';
import useTodoStore from '../../utility/TodoData';
import axios from "../../utility/axios-instance";

const TodoApp = () => {
    const [todos, setTodos] = useState([]);
    const [todoInput, setTodoInput] = useState('');
    const authCtx = useContext(AuthContext);
    const { logout } = authCtx;


    useEffect(() => {
        axios
            .get("/todo")
            .then((res) => {
                setTodos(res.data.data)
            })
    }, [])

    const addTodo = () => {
        if (todoInput.trim() !== '') {
            const d = todos || []
            setTodos([...d, { _id: "temp", title: todoInput, completed: false, description: "", incremental: true }]);
            setTodoInput('');
            axios
                .post("/todo", { title: todoInput, completed: false, description: "", })
                .then((res) => {
                    if (res.status === 200) {
                        axios
                            .get("/todo")
                            .then((res) => {
                                setTodos(res.data.data)
                            })
                    } else {
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

    const removeTodo = (id) => {
        axios
            .delete(`/todo/${id}`)
            .then((res) => {
                if (res.status === 200) {
                    axios
                        .get("/todo")
                        .then((res) => {
                            setTodos(res.data.data)
                        })
                }
            })
        // setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    };
    const { todo, addTodos } = useTodoStore()
    const handleLogout = () => {
        logout()
    };
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <header style={{ backgroundColor: '#4CAF50', padding: '15px', borderRadius: '8px', color: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ margin: '0' }}>Todo App</h1>
                        {/* <p style={{ fontSize: '14px', margin: '0' }}>Welcome, {user}!</p> */}
                    </div>
                    <button
                        onClick={handleLogout}
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
            <div style={{ flex: '1', maxWidth: '800px', margin: 'auto', padding: '20px' }}>
                <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <input
                        type="text"
                        value={todoInput}
                        onChange={(e) => setTodoInput(e.target.value)}
                        placeholder="Add a new todo"
                        style={{ flex: '1', padding: '8px', marginRight: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <button
                        onClick={addTodo}
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '8px',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Add Todo
                    </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: "center", justifyContent: "center" }}>
                    {todos?.map((todo) => (
                        <div
                            key={todo.id}
                            style={{
                                flex: '1',
                                minWidth: '250px',
                                maxWidth: '300px',
                                marginBottom: '20px',
                                padding: '15px',
                                backgroundColor: '#f9f9f9',
                                borderRadius: '12px',
                                boxSizing: 'border-box',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => toggleTodo(todo._id, !!todo?.completed)}
                                    style={{ marginRight: '12px' }}
                                />
                                <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', flex: '1' }}>
                                    {todo.title}
                                </span>
                            </div>
                            <button
                                onClick={() => removeTodo(todo._id)}
                                style={{
                                    backgroundColor: '#f44336',
                                    color: 'white',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <footer style={{ marginTop: 'auto', textAlign: 'center', color: '#666', padding: '15px', backgroundColor: '#f0f0f0' }}>
                <p>&copy; 2024 Todo App.</p>
            </footer>
        </div>
    );
};

export default TodoApp;
