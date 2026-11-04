"use client";

import "../../style/Menu.css";
import "../../style/order.css";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "../../lib/LanguageContext";
import { supabase } from "@/lib/supabase";
import type { Category, Item } from "@/type/menu";
import Header from "../../components/Header";
import CategorySidebar from "../../components/CategorySidebar";
import ItemCard from "../../components/ItemCard";
import PatternFooter from "../../components/PatternFooter";

export default function Order() {
    const { slug } = useParams<{ slug: string }>();
    const { lang, t } = useLanguage();
    const [categories, setCategories] = useState<Category[]>([]);
    const [items, setItems] = useState<Item[]>([]);

    const activeCategory = categories.find((category) => category.slug === slug);
    const activeCategoryId = activeCategory?.id;

    const localize = (arabic: string | null, english: string | null) =>
        lang === "en" ? english || arabic || "" : arabic || "";

    useEffect(() => {
        supabase
            .from("categories")
            .select("*")
            .order("sort_order")
            .then(({ data }) => setCategories((data as Category[]) ?? []));
    }, []);

    useEffect(() => {
        if (!activeCategoryId) return;

        supabase
            .from("items")
            .select("*, item_images(*)")
            .eq("category_id", activeCategoryId)
            .order("sort_order")
            .then(({ data }) => setItems((data as Item[]) ?? []));
    }, [activeCategoryId]);

    return (
       <div className="page" lang={lang}>
            <Header />

            <main className="order-layout">
                <CategorySidebar
                    categories={categories}
                    activeSlug={slug}
                    getName={(category) => localize(category.name_ar, category.name_en)}
                />

                <section className="items">
                   <Link href="/menu" className="back-link">
                        <svg viewBox="0 0 24 24" className="back-arrow" aria-hidden="true">
                            <path d="M19 12H5M11 6l-6 6 6 6" />
                        </svg>
                        {t.title}
                    </Link>

                    <h1 className="items-title">
                        {activeCategory
                            ? localize(activeCategory.name_ar, activeCategory.name_en)
                            : ""}
                    </h1>
                    <p className="items-subtitle">{t.fetsh}</p>

                    <div className="items-grid">
                        {items.map((item) => {
                            const coverImage = [...item.item_images].sort(
                                (first, second) => first.sort_order - second.sort_order
                            )[0];

                            return (
                                <ItemCard
                                    key={item.id}
                                    href={`/menu/${slug}/${item.id}`}
                                    name={localize(item.name_ar, item.name_en)}
                                    description={localize(item.description_ar, item.description_en)}
                                    price={item.price}
                                    currency={t.currency}
                                    detailsLabel={t.details}
                                    imageUrl={coverImage?.image_url ?? null}
                                />
                            );
                        })}
                    </div>
                </section>
            </main>

            <PatternFooter />
        </div>
    );
}