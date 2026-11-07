"use client";

import "../style/Menu.css";
import "../style/order.css";
import "../style/item.css";
import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../lib/LanguageContext";
import type { Item } from "@/type/menu";
import Header from "./Header";
import ItemGallery from "./ItemGallery";
import AddonsList from "./AddonsList";
import PatternFooter from "./PatternFooter";

type ItemViewProps = {
    slug: string;
    item: Item;
};

export default function ItemView({ slug, item }: ItemViewProps) {
    const { lang, t } = useLanguage();
    const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);

    const localize = (arabic: string | null, english: string | null) =>
        lang === "en" ? english || arabic || "" : arabic || "";

    const toggleAddon = (addonId: string) => {
        setSelectedAddonIds((previous) =>
            previous.includes(addonId)
                ? previous.filter((current) => current !== addonId)
                : [...previous, addonId]
        );
    };

   const addonsTotal = (item.item_addons ?? [])
    .filter((addon) => selectedAddonIds.includes(addon.id))
    .reduce((sum, addon) => sum + Number(addon.price), 0);
    const totalPrice = Number(item.price) + addonsTotal;

    return (
        <div className="page" lang={lang}>
            <Header />

            <main className="item-detail">
                <div className="item-gallery-column">
                    <ItemGallery
                        images={item.item_images}
                        alt={localize(item.name_ar, item.name_en)}
                    />
                </div>

                <section className="item-detail-info">
                    <Link href={`/menu/${slug}`} className="back-link">
                        <svg viewBox="0 0 24 24" className="back-arrow" aria-hidden="true">
                            <path d="M19 12H5M11 6l-6 6 6 6" />
                        </svg>
                        {t.back}
                    </Link>

                    <div className="item-detail-heading">
                        <h1 className="item-detail-title">
                            {localize(item.name_ar, item.name_en)}
                        </h1>
                        <span className="item-detail-price">
                            {totalPrice.toFixed(2)} <small>{t.currency}</small>
                        </span>
                    </div>

                    <span className="item-detail-line"></span>

                    <p className="item-detail-description">
                        {localize(item.description_ar, item.description_en)}
                    </p>

                    <AddonsList
                    title={t.addons}
                    addons={item.item_addons ?? []}
                    selectedIds={selectedAddonIds}
                    onToggle={toggleAddon}
                    getName={(addon) => localize(addon.name_ar, addon.name_en)}
                    currency={t.currency}
                />
                </section>
            </main>

            <PatternFooter />
        </div>
    );
}