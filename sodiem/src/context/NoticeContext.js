import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const NoticeContext = createContext(null);

export const NoticeProvider = ({ children }) => {
  const [noticeText, setNoticeText] = useState("");
  const [noticeSeq, setNoticeSeq] = useState(0);

  const showNotice = useCallback((text) => {
    setNoticeText(text);
    setNoticeSeq((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!noticeText) return undefined;
    const timer = setTimeout(() => {
      setNoticeText("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [noticeText, noticeSeq]);

  return (
    <NoticeContext.Provider value={showNotice}>
      {noticeText && (
        <div role="status" className="notice-bar">
          {noticeText}
        </div>
      )}
      {children}
    </NoticeContext.Provider>
  );
};

export const useNotice = () => {
  const context = useContext(NoticeContext);
  if (!context) {
    throw new Error("useNotice phải dùng bên trong NoticeProvider");
  }
  return context;
};
