"use client";

import "../style/Menu.css";
import { useEffect, useState } from "react";
import { useLanguage } from "../lib/LanguageContext";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/type/menu";
import Header from "./Header";
import CategoryCard from "./CategoryCard";
import PatternFooter from "./PatternFooter";

export default function Menu() {
    const { lang, t } = useLanguage();
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        supabase
            .from("categories")
            .select("*")
            .order("sort_order")
            .then(({ data }) => setCategories((data as Category[]) ?? []));
    }, []);

    return (
        <div className="page" lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
            <Header />

            <section className="intro">
                <h1>{t.title}</h1>
                <p>{t.fetsh}</p>
            </section>

            <main className="categories">
                {categories.map((category) => (
                    <CategoryCard
                        key={category.id}
                        href={`/menu/${category.slug}`}
                        name={lang === "en" ? category.name_en || category.name_ar : category.name_ar}
                        imageUrl={category.image_url}
                    />
                ))}
            </main>

            <PatternFooter />
        </div>
    );
}