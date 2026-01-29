import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function useDocumentTitle(title) {
    const { t, i18n } = useTranslation();
    useEffect(() => {
        if (title) {
            title == 'BOMBYX' ? document.title = title : document.title = `${t(title)} | BOMBYX`
        };
    }, [title, i18n.language]);
}