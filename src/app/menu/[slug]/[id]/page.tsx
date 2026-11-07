import { notFound } from "next/navigation";
import { getItemById } from "@/lib/menuData";
import ItemView from "../../../components/ItemView";

export default async function ItemPage({
    params,
}: {
    params: Promise<{ slug: string; id: string }>;
}) {
    const { slug, id } = await params;
    const item = await getItemById(id);

    if (!item) notFound();

    return <ItemView key={item.id} slug={slug} item={item} />;
}