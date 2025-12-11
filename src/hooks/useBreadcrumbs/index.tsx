import { useMatches } from "react-router-dom";

export type BreadcrumbItem = {
  title: string;
  path: string;
};

export const useBreadcrumbs = () => {
  const matches = useMatches();
  return matches
    .filter((m) => {
      const h: any = m.handle || {};
      const title = h.title;
      const bc = h.breadcrumb;
      return title && bc !== false;
    })
    .map((m) => {
      const h: any = m.handle || {};
      return {
        title: String(h.title),
        path: m.pathname || "/",
      } as BreadcrumbItem;
    });
};

