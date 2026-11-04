"use client";

import "../../../style/Menu.css";
import "../../../style/order.css";
import "../../../style/item.css";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "../../../lib/LanguageContext";
import { supabase } from "@/lib/supabase";
import type { Item } from "@/type/menu";
import Header from "../../../components/Header";
import ItemGallery from "../../../components/ItemGallery";
import AddonsList from "../../../components/AddonsList";
import PatternFooter from "../../../components/PatternFooter";

export default function ItemPage() {
    const { slug, id } = useParams<{ slug: string; id: string }>();
    const { lang, t } = useLanguage();
    const [item, setItem] = useState<Item | null>(null);
    const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);

    const localize = (arabic: string | null, english: string | null) =>
        lang === "en" ? english || arabic || "" : arabic || "";

    useEffect(() => {
        setSelectedAddonIds([]);

        supabase
            .from("items")
            .select("*, item_images(*), item_addons(*)")
            .eq("id", id)
            .single()
            .then(({ data }) => setItem(data as Item | null));
    }, [id]);

    const currentItem = item && item.id === id ? item : null;

    const toggleAddon = (addonId: string) => {
        setSelectedAddonIds((previous) =>
            previous.includes(addonId)
                ? previous.filter((current) => current !== addonId)
                : [...previous, addonId]
        );
    };

    const addonsTotal = currentItem
        ? currentItem.item_addons
              .filter((addon) => selectedAddonIds.includes(addon.id))
              .reduce((sum, addon) => sum + Number(addon.price), 0)
        : 0;

    const totalPrice = currentItem ? Number(currentItem.price) + addonsTotal : 0;

    return (
        <div className="page" lang={lang}>
            <Header />

            <main className="item-detail">
                <div className="item-gallery-column">
                    {currentItem && (
                        <ItemGallery
                            images={currentItem.item_images}
                            alt={localize(currentItem.name_ar, currentItem.name_en)}
                        />
                    )}
                </div>

                <section className="item-detail-info">
                    <Link href={`/menu/${slug}`} className="back-link">
                        <svg viewBox="0 0 24 24" className="back-arrow" aria-hidden="true">
                            <path d="M19 12H5M11 6l-6 6 6 6" />
                        </svg>
                        {t.back}
                    </Link>

                    {currentItem && (
                        <>
                            <div className="item-detail-heading">
                                <h1 className="item-detail-title">
                                    {localize(currentItem.name_ar, currentItem.name_en)}
                                </h1>
                                <span className="item-detail-price">
                                    {totalPrice.toFixed(2)} <small>{t.currency}</small>
                                </span>
                            </div>

                            <span className="item-detail-line"></span>

                            <p className="item-detail-description">
                                {localize(currentItem.description_ar, currentItem.description_en)}
                            </p>

                            <AddonsList
                                title={t.addons}
                                addons={currentItem.item_addons}
                                selectedIds={selectedAddonIds}
                                onToggle={toggleAddon}
                                getName={(addon) => localize(addon.name_ar, addon.name_en)}
                                currency={t.currency}
                            />
                        </>
                    )}
                </section>
            </main>

            <PatternFooter />
        </div>
    );
}