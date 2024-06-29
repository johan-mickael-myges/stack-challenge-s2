import {RouteLocationRaw} from "vue-router";

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    number: string;
    password: string;
    confirmPassword: string;
}

export interface User {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    number: string;
}

export interface ExpressError {
    "type": string,
    "value": string,
    "msg": string,
    "path": string,
    "location": string
}

export interface AdminSidebarItem {
    title: string;
    props: {
        to?: RouteLocationRaw;
        prependIcon: string;
        color: string;
        onClick?: () => void;
    };
}