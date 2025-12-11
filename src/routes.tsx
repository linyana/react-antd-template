import React from "react";
import { createBrowserRouter, redirect, Outlet } from "react-router-dom";
import { Home, Login, ProductList, ProductDetails } from "@/pages";
import { LayoutProvider } from "@/providers";

export type AppHandle = {
	title?: string;
	showInMenu?: boolean;
	icon?: React.ReactNode;
	breadcrumb?: boolean;
	requiresAuth?: boolean;
};

export type AppRoute = {
	path?: string;
	index?: boolean;
	element?: React.ReactNode;
	children?: AppRoute[];
	handle?: AppHandle;
	loader?: any;
};

const authLoader =
	(requiresAuth: boolean = true) =>
	async () => {
		if (!requiresAuth) return null;
		const token = window.localStorage.getItem("project-name-token");
		if (!token) throw redirect("/login");
		return null;
	};

export const layoutRoutes: AppRoute[] = [
	{
		index: true,
		element: <Home />,
		handle: {
			title: "Home",
			showInMenu: true,
			breadcrumb: true,
			requiresAuth: true,
		},
		loader: authLoader(true),
	},
	{
		path: "products",
		element: <Outlet />,
		handle: {
			title: "Products",
			showInMenu: true,
			breadcrumb: true,
			requiresAuth: true,
		},
		children: [
			{
				path: "list",
				element: <ProductList />,
				handle: {
					title: "List",
					showInMenu: true,
					breadcrumb: true,
					requiresAuth: true,
				},
				loader: authLoader(true),
			},
			{
				path: "details/:id",
				element: <ProductDetails />,
				handle: {
					title: "Details",
					showInMenu: false,
					breadcrumb: true,
					requiresAuth: true,
				},
				loader: authLoader(true),
			},
		],
	},
];

export const router = createBrowserRouter([
	{
		path: "/",
		element: <LayoutProvider routes={layoutRoutes} />,
		children: layoutRoutes as any,
	},
	{
		path: "/login",
		element: <Login />,
		handle: {
			title: "Login",
			showInMenu: false,
			breadcrumb: false,
			requiresAuth: false,
		},
	},
]);
