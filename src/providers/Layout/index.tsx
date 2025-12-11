import React from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import { Outlet, Link, useLocation } from "react-router-dom";
import type { MenuProps } from "antd";
import type { AppRoute } from "@/routes";
import { useBreadcrumbs } from "@/hooks";

const { Header, Sider, Content } = Layout;

type LayoutProviderProps = {
	routes: AppRoute[];
};

const joinPath = (base: string, path?: string) => {
	const b = base.endsWith("/") ? base.slice(0, -1) : base;
	const p = path ? (path.startsWith("/") ? path : `/${path}`) : "";
	const res = `${b}${p}`;
	return res === "" ? "/" : res || "/";
};

const buildMenuItems = (
	routes: AppRoute[],
	base: string = "/"
): MenuProps["items"] => {
	return routes
		.filter((r) => r.handle?.showInMenu)
		.map((r) => {
			const full = r.index ? base : joinPath(base, r.path);
			const hasChildren = Array.isArray(r.children) && r.children.length > 0;
			return {
				key: full,
				label: <Link to={full}>{r.handle?.title || full}</Link>,
				children: hasChildren ? buildMenuItems(r.children!, full) : undefined,
			} as any;
		});
};

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ routes }) => {
	const location = useLocation();
	const breadcrumbs = useBreadcrumbs();

	const items = React.useMemo(() => buildMenuItems(routes), [routes]);

	return (
		<Layout hasSider>
			<Sider
				width={240}
				theme="light"
				style={{
					position: "sticky",
					top: 0,
					height: "100vh",
				}}
			>
				<Menu
					theme="light"
					mode="inline"
					selectedKeys={[location.pathname]}
					items={items}
					style={{ height: "100%", overflow: "auto" }}
				/>
			</Sider>
			<Layout style={{ height: "100vh" }}>
				<Header
					style={{
						position: "sticky",
						top: 0,
						zIndex: 10,
					}}
				>
					<Breadcrumb
						items={breadcrumbs.map((b) => ({
							title: (
								<Link to={b.path} style={{ color: "#fff" }}>
									{b.title}
								</Link>
							),
						}))}
					/>
				</Header>
				<Content
					style={{
						padding: 16,
						height: "calc(100vh - 64px)",
						overflow: "auto",
					}}
				>
					<div style={{ width: "100%", minHeight: "100%" }}>
						<Outlet />
					</div>
				</Content>
			</Layout>
		</Layout>
	);
};
