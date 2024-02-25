import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { StyleSheetManager } from "styled-components";
import rtlPlugin from "stylis-plugin-rtl";
import Auth from "./Pages/Auth/Auth";
import ToDo from "./Pages/Chat/Auth";
import Home from "./Pages/Home/Home";
import Layout from "./components/Layout/Layout";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import Page404 from "./components/UI/Page404/Page404";
import AuthContext from "./store/auth-context";
import ThemeContext from "./store/theme-context";

function App() {

    const themeCtx = useContext(ThemeContext);
    const { direction } = themeCtx;
    const authCtx = useContext(AuthContext)
    const { isLoggedIn } = authCtx;


    const routes = (
        <Routes>
            <Route path="/login" element={!isLoggedIn ? <Auth /> : <Navigate replace to="/" />} />
            <Route path="/" element={
                <RequireAuth>
                    <ToDo />
                </RequireAuth>
            } />
            {/* <Route path="/" element={
                <RequireAuth>

                    <TodoApp />
                </RequireAuth>

            } /> */}
            {/* <Route path="/login-2" element={!isLoggedIn ? <Login /> : <Navigate replace to="/" />} /> */}
            <Route
                path="/"
                element={
                    <RequireAuth>
                        <Home />
                    </RequireAuth>
                }
            />
            <Route path="*" element={<Page404 />} />
        </Routes>
    );

    return (
        <StyleSheetManager stylisPlugins={direction === "rtl" && [rtlPlugin]}>
            <Layout dir={direction}>{routes}</Layout>
        </StyleSheetManager>
    );
}

export default App;
