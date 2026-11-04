"use client";

import "../style/Home.css";
import Link from "next/link";
import { Poppins, Sacramento, Tajawal } from "next/font/google";
import { FaFacebookF, FaInstagram, FaListUl, FaTiktok, FaWhatsapp } from "react-icons/fa6";
import { useLanguage } from "../lib/LanguageContext";

const titleFont = Poppins({
    subsets: ["latin"],
    weight: ["800"],
    variable: "--font-landing-title",
});

const scriptFont = Sacramento({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-landing-script",
});

const arabicFont = Tajawal({
    subsets: ["arabic"],
    weight: ["400", "500"],
    variable: "--font-landing-arabic",
});

const socialLinks = [
    {
        label: "Facebook",
        href: "https://www.facebook.com/PardoCafePs?mibextid=wwXIfr",
        icon: FaFacebookF,
    },
    {
        label: "Instagram",
        href: "https://www.instagram.com/pardocafe.ps?igsh=ajU2dG1jbHgxMHU4",
        icon: FaInstagram,
    },
    {
        label: "WhatsApp",
        href: "https://wa.me/qr/YTDHEJCDPCMJG1",
        icon: FaWhatsapp,
    },
    {
        label: "TikTok",
        href: "https://www.tiktok.com/@pardocafe.ps?_r=1&_t=ZS-9B65mhceMYq",
        icon: FaTiktok,
    },
];

export default function Landing() {
    const { t } = useLanguage();

    return (
        <main className={`landing ${titleFont.variable} ${scriptFont.variable} ${arabicFont.variable}`}>
            <div className="landing-background">
                <img src="/photos/gate.jpg" alt="" />
            </div>
            <div className="landing-overlay"></div>

            <section className="landing-content">
                <img
                    className="landing-logo"
                    src="/photos/pardoapp copy.png"
                    alt="Pardo Café & Restaurant"
                />

                <div className="landing-text">
                    <h1 className="landing-heading">
                        <span className="landing-title">A TASTE TO REMEMBER,</span>
                        <span className="landing-script">Aplace to belong</span>
                    </h1>

                    <p className="landing-arabic" lang="ar" dir="rtl">
                        طعم بيحكي عنا, ومكان بيشبهك
                    </p>
                </div>

                <Link href="/menu" className="landing-menu-button">
                    <FaListUl aria-hidden="true" />
                    <span>{t.title}</span>
                </Link>

                <div className="landing-socials">
                    {socialLinks.map((social) => (
                        <a
                            key={social.label}
                            href={social.href}
                            className="landing-social-link"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.label}
                        >
                            <social.icon aria-hidden="true" />
                        </a>
                    ))}
                </div>
            </section>
        </main>
    );
}