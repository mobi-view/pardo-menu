"use client";

import { useLanguage } from "../lib/LanguageContext";


export default function Header() {
    const { lang, setLang } = useLanguage();

    return (
        <section className="head">
            <div className="head-side head-start">
                <div className="language">
                    <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
                    </svg>
                    <ul>
                        <li>
                            <button
                                className={lang === "en" ? "active" : ""}
                                onClick={() => setLang("en")}
                            >
                                English
                            </button>
                        </li>
                        <li>
                            <button
                                className={lang === "ar" ? "active" : ""}
                                onClick={() => setLang("ar")}
                            >
                                العربية
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
               
            <img className="logo" src="/photos/pardoColor.png" alt="Pardo" />
        </section>
    );
}