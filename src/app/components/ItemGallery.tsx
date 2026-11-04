import type { ItemImage } from "@/type/menu";

type ItemGalleryProps = {
    images: ItemImage[];
    alt: string;
};

export default function ItemGallery({ images, alt }: ItemGalleryProps) {
    const mainImage = [...images].sort(
        (first, second) => first.sort_order - second.sort_order
    )[0];

    if (!mainImage) return null;

    return (
        <div className="item-gallery">
            <img className="item-gallery-main" src={mainImage.image_url} alt={alt} />
        </div>
    );
}