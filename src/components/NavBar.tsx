import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { Nav, Navbar, Button } from 'react-bootstrap';
import { axiosAPI } from '../api';
import { AppDispatch, RootState } from "../store";
import { reset as resetUser } from "../store/userSlice";
import { reset as resetSearch } from "../store/searchSlice";

function NavigationBar() {
    const userLogin = useSelector((state: RootState) => state.user.login);
    const dispatch = useDispatch<AppDispatch>();

    const logout = () => {
        let accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return
        }
        axiosAPI.get('/user/logout', { headers: { 'Authorization': `Bearer ${accessToken}` } })
            .then(_ => {
                dispatch(resetUser())
                dispatch(resetSearch())
                localStorage.clear()
            })
    }
    return (
        <Navbar expand="sm" bg="dark" data-bs-theme="dark">
            <div className='container-xl px-2 px-sm-4'>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto flex-grow-1">
                        <Link to="/components" className="nav-link ps-0">Компоненты</Link>
                        <Link to="/medicines" className="nav-link">Лекарства</Link>
                        <Navbar.Collapse className="justify-content-end">
                            {userLogin ? (
                                <>
                                    <Navbar.Text className="px-sm-2">
                                        {userLogin}
                                    </Navbar.Text>
                                    <Navbar.Text className="d-none d-sm-block">|</Navbar.Text>
                                    <Button
                                        variant="link"
                                        className="nav-link"
                                        onClick={logout}>
                                        Выйти
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link to='/authorization' className="nav-link">Войти</Link>
                                    <Navbar.Text className="d-none d-sm-block">|</Navbar.Text>
                                    <Link to='/registration' className="nav-link">Регистрация</Link>
                                </>
                            )}
                        </Navbar.Collapse>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
}

export default NavigationBar;
