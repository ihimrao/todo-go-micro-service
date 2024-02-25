import { create } from 'zustand'

const useTodoStore = create((set) => ({
    todo: [],
    addTodos: (todo) => set((state) => ([...state.todo, todo]))
}))

export default useTodoStore