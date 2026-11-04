import Link from "next/link";
import type { Category } from "@/type/menu";

type CategorySidebarProps = {
    categories: Category[];
    activeSlug: string;
    getName: (category: Category) => string;
};

export default function CategorySidebar({
    categories,
    activeSlug,
    getName,
}: CategorySidebarProps) {
    return (
        <section className="side-category">
            {categories.map((category) => (
                <Link
                    key={category.id}
                    href={`/menu/${category.slug}`}
                    className={
                        activeSlug === category.slug
                            ? "side-card side-card-active"
                            : "side-card"
                    }
                >
                    <h2>{getName(category)}</h2>
                    <svg viewBox="0 0 24 24" className="side-arrow" aria-hidden="true">
                        <path d="M9 6l6 6-6 6" />
                    </svg>
                    {category.image_url && (
                        <img src={category.image_url} alt={getName(category)} />
                    )}
                </Link>
            ))}
        </section>
    );
}