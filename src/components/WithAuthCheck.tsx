import React, { ReactNode } from 'react';
import { useSelector } from "react-redux";

import { RootState } from "../store";

interface AuthCheckProps {
    children: ReactNode;
    allowedRoles: number[];
}

const AuthCheck: React.FC<AuthCheckProps> = ({ children, allowedRoles }) => {
    const userRole = useSelector((state: RootState) => state.user.role);

    return allowedRoles.includes(userRole) ? (
        <>{children}</>
    ) : (
        <h2 className="text-center">Для доступа к данной странице нужно авторизоваться</h2>
    );
};

export default AuthCheck;
