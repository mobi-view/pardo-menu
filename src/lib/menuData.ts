import { cacheLife, cacheTag } from "next/cache";
import { supabase } from "./supabase";
import type { Category, Item } from "@/type/menu";

const categoryColumns = "id, slug, name_ar, name_en, image_url, sort_order";

const itemListColumns =
    "id, category_id, name_ar, name_en, description_ar, description_en, price, sort_order, item_images(id, image_url, sort_order)";

const itemDetailColumns = `${itemListColumns}, item_addons(id, name_ar, name_en, price, sort_order)`;

export async function getCategories(): Promise<Category[]> {
    "use cache";
    cacheTag("menu");
    cacheLife({ stale: 30, revalidate: 60, expire: 3600 });

    const { data, error } = await supabase
        .from("categories")
        .select(categoryColumns)
        .eq("is_active", true)
        .order("sort_order");

    if (error) throw error;
    return (data as Category[]) ?? [];
}

export async function getItemsByCategorySlug(slug: string): Promise<Item[]> {
    "use cache";
    cacheTag("menu");
    cacheLife({ stale: 30, revalidate: 60, expire: 3600 });

    const { data, error } = await supabase
        .from("items")
        .select(`${itemListColumns}, categories!inner(slug)`)
        .eq("is_active", true)
        .eq("categories.slug", slug)
        .order("sort_order");

        if (error) throw error;
    return (data as unknown as Item[]) ?? [];
}

export async function getItemById(id: string): Promise<Item | null> {
    "use cache";
    cacheTag("menu");
    cacheLife({ stale: 30, revalidate: 60, expire: 3600 });

    const { data, error } = await supabase
        .from("items")
        .select(itemDetailColumns)
        .eq("id", id)
        .eq("is_active", true)
        .maybeSingle();

    if (error) {
        if (error.code === "22P02") return null;
        throw error;
    }

        return (data as unknown as Item | null) ?? null;
}