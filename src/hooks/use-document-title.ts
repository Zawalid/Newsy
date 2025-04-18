import { useEffect } from "react";

type TitleConfig = {
  defaultTitle?: string;
  errorTitle?: string;
  notFoundTitle?: string;
  loadingTitle?: string;
};

export function useDocumentTitle(
  title: string | undefined,
  isLoading: boolean,
  error?: { code?: number } | null,
  config: TitleConfig = {}
) {
  const {
    defaultTitle = "Newsy",
    errorTitle = "Something Went Wrong",
    notFoundTitle = "Not Found",
    loadingTitle = "Newsy is Loading...",
  } = config;

  useEffect(() => {
    if (isLoading) {
      document.title = loadingTitle;
    } else if (error) {
      document.title = error.code === 404 ? notFoundTitle : errorTitle;
    } else if (title) {
      document.title = title;
    } else {
      document.title = defaultTitle;
    }

    return () => {
      document.title = defaultTitle;
    };
  }, [title, isLoading, error, defaultTitle, errorTitle, notFoundTitle, loadingTitle]);
}
